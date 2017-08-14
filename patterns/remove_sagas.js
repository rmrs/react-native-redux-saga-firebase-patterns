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
    yield put(FirebaseActions.firebaseRemoveFulfilled(metaType))
  } catch (error) {
    yield put(FirebaseActions.firebaseRemoveRejected(error, metaType))
  }
}
