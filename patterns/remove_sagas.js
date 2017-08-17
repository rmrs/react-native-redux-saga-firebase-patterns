import * as types from './types'
import { metaTypes } from './types'
import * as actions from './actions'
import firebase from './firebase'
import { put, take, call, fork } from 'redux-saga/effects'

export function* watchRemoveRequested() {
  while (true) {
    const action = yield take(types.firebase.FIREBASE_REMOVE_REQUESTED)
    let getPath = null
    switch (action.meta.type) {
      case metaTypes.userContacts:
        getPath = getUserContactsPath
        break
    }

    if (typeof getPath === 'function') {
      const path = yield call(getPath, action.payload)
      yield fork(removeItem, path, action.meta.type)
    }
  }
}

export function getUserContactsPath({ uid, contactId }) {
  return `users/${uid}/contacts/${contactId}`
}

export function* removeItem(path, metaType) {
  try {
    const ref = firebase.database().ref(path)
    yield call([ref, ref.remove])
    yield put(actions.firebaseRemoveFulfilled(metaType))
  } catch (error) {
    yield put(actions.firebaseRemoveRejected(error, metaType))
  }
}
