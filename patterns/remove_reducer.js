[types.firebase.FIREBASE_REMOVE_REQUESTED](state, action) {
  const property = action.meta.type
  let newState = { ...state, [property]: { inProgress: true, error: '' } }
  return newState
},
[types.firebase.FIREBASE_REMOVE_FULFILLED](state, action) {
  const property = action.meta.type
  let newState = { ...state, [property]: { inProgress: false, error: '' } }
  return newState
},
[types.firebase.FIREBASE_REMOVE_REJECTED](state, action) {
  const property = action.meta.type
  const error = action.payload.error
  let newState = { ...state, [property]: { inProgress: false, error } }
  return newState
},
