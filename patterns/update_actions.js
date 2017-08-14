export function firebaseUpdateRequested(payload, metaType) {
  return {
    type: types.firebase.FIREBASE_UPDATE_REQUESTED,
    payload,
    meta: { type: metaType },
  }
}

export function firebaseUpdateRejected(error, metaType) {
  return {
    type: types.firebase.FIREBASE_UPDATE_REJECTED,
    payload: { error },
    meta: { type: metaType },
  }
}

export function firebaseUpdateFulfilled(metaType) {
  return {
    type: types.firebase.FIREBASE_UPDATE_FULFILLED,
    payload: {},
    meta: { type: metaType },
  }
}
