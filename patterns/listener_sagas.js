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
          types.firebase.FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED,
        ])

        if (
          action.type ===
            types.firebase.FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED ||
          action.meta.type === metaType
        ) {
          yield cancel(task)
          yield put(
            FirebaseActions.firebaseListenRemoved(
              !!action.payload.clearItems,
              metaType
            )
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

    ref.on('child_changed', snap => {
      const val = snap.val()
      emit({
        eventType: eventTypes.CHILD_CHANGED,
        key: snap.key,
        value: snap.val(),
      })
    })

    ref.on('child_removed', snap => {
      emit({ eventType: eventTypes.CHILD_REMOVED, key: snap.key })
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
      yield put(FirebaseActions.firebaseListenFulfilled(value, metaType))
    } catch (error) {
      yield put(FirebaseActions.firebaseListenRejected(error, metaType))
    }
    while (true) {
      const data = yield take(chan)
      yield put(getUpdateAction(data, metaType))
    }
  } finally {
    chan.close()
  }
}

export function getUpdateAction(data, metaType) {
  switch (data.eventType) {
    case eventTypes.CHILD_ADDED:
      return FirebaseActions.firebaseListenChildAdded(
        data.key,
        data.value,
        metaType
      )
    case eventTypes.CHILD_CHANGED:
      return FirebaseActions.firebaseListenChildChanged(
        data.key,
        data.value,
        metaType
      )
    case eventTypes.CHILD_REMOVED:
      return FirebaseActions.firebaseListenChildRemoved(data.key, metaType)
  }
}
