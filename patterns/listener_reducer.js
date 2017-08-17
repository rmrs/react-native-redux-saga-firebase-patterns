import * as types from './types'
import { metaTypes } from './types'
...

[types.firebase.FIREBASE_LISTEN_REQUESTED](state, action) {
  const property = action.meta.type
  const propertyState = state[property]

  let newState = {
    ...state,
    [property]: { ...propertyState, inProgress: true, error: '' },
  }
  return newState
},
[types.firebase.FIREBASE_LISTEN_FULFILLED](state, action) {
  const items = action.payload.items
  const property = action.meta.type
  const propertyState = state[property]

  let newState = {
    ...state,
    [property]: { ...propertyState, inProgress: false, error: '', items },
  }
  return newState
},
[types.firebase.FIREBASE_LISTEN_REJECTED](state, action) {
  const property = action.meta.type
  const propertyState = state[property]
  const error = action.payload.error

  let newState = {
    ...state,
    [property]: { ...propertyState, inProgress: false, error },
  }
  return newState
},
//notice child added and changed are the same at the moment
[types.firebase.FIREBASE_LISTEN_CHILD_ADDED](state, action) {
  const property = action.meta.type
  const propertyState = state[property]
  const items = {
    ...propertyState.items,
    [action.payload.id]: action.payload.value,
  }

  let newState = {
    ...state,
    [property]: { ...propertyState, inProgress: false, error: '', items },
  }
  return newState
},
[types.firebase.FIREBASE_LISTEN_REMOVED](state, action) {
  const property = action.meta.type
  const propertyState = state[property]
  const items = action.payload.clearItems ? {} : propertyState.items

  let newState = {
    ...state,
    [property]: { ...propertyState, inProgress: false, error: '', items },
  }
  return newState
},
