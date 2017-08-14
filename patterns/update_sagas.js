export function* watchUpdateRequested() {
  while (true) {
    const action = yield take(types.firebase.FIREBASE_UPDATE_REQUESTED)
    let getUpdates = null
    switch (action.meta.type) {
      case metaTypes.userContacts:
        getUpdates = getUserContactsUpdates
        break
    }
    if (typeof getUpdates === 'function') {
      const updates = yield call(getUpdates, action.payload)
      yield fork(updateItems, updates, action.meta.type)
    }
  }
}

export function* updateItems(updates, metaType) {
  try {
    const ref = firebase.database().ref()
    yield call([ref, ref.update], updates)
    yield put(FirebaseActions.firebaseUpdateFulfilled(metaType))
  } catch (error) {
    yield put(FirebaseActions.firebaseUpdateRejected(error, metaType))
  }
}

export function getUserContactsUpdates({ uid, contactId, name, phone }) {
  return {
    [`users/${uid}/contacts/${contactId}/name`]: name,
    [`users/${uid}/contacts/${contactId}/phone`]: phone,
  }
}
