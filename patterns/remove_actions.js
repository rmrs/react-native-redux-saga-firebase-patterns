export function firebaseRemoveRequested(payload, metaType) {
  return {
    type: types.firebase.FIREBASE_REMOVE_REQUESTED,
    payload,
    meta: { type: metaType },
  }
}

export function firebaseRemoveRejected(error, metaType) {
  return {
    type: types.firebase.FIREBASE_REMOVE_REJECTED,
    payload: { error },
    meta: { type: metaType },
  }
}

export function firebaseRemoveFulfilled(metaType) {
  return {
    type: types.firebase.FIREBASE_REMOVE_FULFILLED,
    payload: {},
    meta: { type: metaType },
  }
}
