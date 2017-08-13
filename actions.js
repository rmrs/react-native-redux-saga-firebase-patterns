import firebase from './firebase'
import * as types from './types'
import { metaTypes } from './types'

export function firebaseListenRequested(ref, metaType) {
  return {
    type: types.firebase.FIREBASE_LISTEN_REQUESTED,
    payload: ref,
    meta: { type: metaType },
  }
}

export function firebaseListenRejected(error, metaType) {
  return {
    type: types.firebase.FIREBASE_LISTEN_REJECTED,
    payload: { error },
    meta: { type: metaType },
  }
}

export function firebaseListenFulfilled(items, metaType) {
  return {
    type: types.firebase.FIREBASE_LISTEN_FULFILLED,
    payload: { items },
    meta: { type: metaType },
  }
}

export function firebaseListenChildAdded(id, value, metaType) {
  return {
    type: types.firebase.FIREBASE_LISTEN_CHILD_ADDED,
    payload: { id, value },
    meta: { type: metaType },
  }
}

export function firebaseListenChildChanged(id, value, metaType) {
  return {
    type: types.firebase.FIREBASE_LISTEN_CHILD_CHANGED,
    payload: { id, value },
    meta: { type: metaType },
  }
}

export function firebaseListenChildRemoved(id, metaType) {
  return {
    type: types.firebase.FIREBASE_LISTEN_CHILD_REMOVED,
    payload: { id },
    meta: { type: metaType },
  }
}

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

export function firebaseListenRemoved(clearItems, metaType) {
  return {
    type: types.firebase.FIREBASE_LISTEN_REMOVED,
    payload: { clearItems },
    meta: { type: metaType },
  }
}

export function firebaseRemoveListenerRequested(clearItems, metaType) {
  return {
    type: types.firebase.FIREBASE_REMOVE_LISTENER_REQUESTED,
    payload: { clearItems },
    meta: { type: metaType },
  }
}

export function firebaseRemoveAllListenersRequested() {
  return {
    type: types.firebase.FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED,
    payload: { clearItems: true },
  }
}

export function listenToMessages() {
  const ref = firebase.database().ref('messages')
  return firebaseListenRequested(ref, metaTypes.messages)
}

export function listenToUserContacts(uid) {
  const ref = firebase.database().ref(`users/${uid}/contacts`)
  return firebaseListenRequested(ref, metaTypes.userContacts)
}

export function removeMessagesListenerRequested() {
  return firebaseRemoveListenerRequested(false, metaTypes.messages)
}

export function removeUserContactsListenerRequested() {
  return firebaseRemoveListenerRequested(false, metaTypes.userContacts)
}

export function updateUserContactsRequested(uid, contactId, name, phone) {
  return firebaseUpdateRequested(
    { uid, contactId, name, phone },
    metaTypes.userContacts
  )
}

export function removeUserContactsRequested(uid, contactId) {
  return firebaseRemoveRequested({ uid, contactId }, metaTypes.userContacts)
}
