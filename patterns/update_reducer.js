import * as types from './types'
import { metaTypes } from './types'

...

[types.firebase.FIREBASE_UPDATE_REQUESTED](state, action) {
  const property = action.meta.type
  let newState = { ...state, [property]: { inProgress: true, error: '' } }
  return newState
},
[types.firebase.FIREBASE_UPDATE_FULFILLED](state, action) {
  const property = action.meta.type
  let newState = { ...state, [property]: { inProgress: false, error: '' } }
  return newState
},
[types.firebase.FIREBASE_UPDATE_REJECTED](state, action) {
  const property = action.meta.type
  const error = action.payload.error
  let newState = { ...state, [property]: { inProgress: false, error } }
  return newState
}
