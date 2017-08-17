import * as types from './types'
import { metaTypes, eventTypes } from './types'
import * as actions from './actions'
import firebase from './firebase'
import { eventChannel, buffers } from 'redux-saga'
import { put, take, call, fork, cancel, flush } from 'redux-saga/effects'

export function* watchListener(metaType) {
  while (true) {
    const listenRequestAction = yield take(
      types.firebase.FIREBASE_LISTEN_REQUESTED
    )
    if (listenRequestAction.meta.type === metaType) {
      let task = yield fork(
        getDataAndListenToChannel,
        listenRequestAction.payload.ref,
        metaType
      )
      while (true) {
        const action = yield take([
          types.firebase.FIREBASE_REMOVE_LISTENER_REQUESTED,
          types.firebase.FIREBASE_LISTEN_REQUESTED,
        ])

        if (action.meta.type === metaType) {
          yield cancel(task)
          yield put(
            actions.firebaseListenRemoved(!!action.payload.clearItems, metaType)
          )

          if (action.type === types.firebase.FIREBASE_LISTEN_REQUESTED) {
            task = yield fork(
              getDataAndListenToChannel,
              action.payload.ref,
              metaType
            )
          } else {
            break
          }
        }
      }
    }
  }
}

export function createEventChannel(ref) {
  const listener = eventChannel(emit => {
    ref.on('child_added', snap => {
      emit({
        eventType: eventTypes.CHILD_ADDED,
        key: snap.key,
        value: snap.val(),
      })
    })
    return () => {
      ref.off()
    }
  }, buffers.expanding(1))
  return listener
}

export function* getDataAndListenToChannel(ref, metaType) {
  const chan = yield call(createEventChannel, ref)
  try {
    try {
      const snap = yield call([ref, ref.once], 'value')
      yield flush(chan)
      const val = snap.val()
      const value = val ? val : {}
      yield put(actions.firebaseListenFulfilled(value, metaType))
    } catch (error) {
      yield put(actions.firebaseListenRejected(error, metaType))
    }
    while (true) {
      const data = yield take(chan)
      yield put(
        actions.firebaseListenChildAdded(data.key, data.value, metaType)
      )
    }
  } finally {
    chan.close()
  }
}
