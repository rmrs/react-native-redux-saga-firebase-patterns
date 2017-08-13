//@flow

import createReducer from './createReducer'
import * as types from './types'
import { metaTypes } from './types'

type SubState = {
  inProgress: boolean,
  error: string,
  items: Object,
}

export function getInitialState() {
  let state = {}
  Object.keys(metaTypes).forEach(key => {
    const subState = { inProgress: false, error: '', items: {} }
    state[key] = subState
  })
  return state
}

const initialState = getInitialState()

export const firebaseReducer = createReducer(initialState, {
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
  },
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
  [types.firebase.FIREBASE_LISTEN_CHILD_CHANGED](state, action) {
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
  [types.firebase.FIREBASE_LISTEN_CHILD_REMOVED](state, action) {
    const property = action.meta.type
    const propertyState = state[property]
    const items = { ...propertyState.items }
    delete items[action.payload.id]

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
})
