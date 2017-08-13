import * as actions from '../actions'
import * as types from '../types'
import { metaTypes } from '../types'
import RNFirebase from 'react-native-firebase'
import configureMockStore from 'redux-mock-store'
import { getInitialState } from '../reducer'

const mockStore = configureMockStore()

describe('firebase actions', () => {
  beforeEach(() => {
    RNFirebase.reset()
  })

  test(types.firebase.FIREBASE_LISTEN_REQUESTED, () => {
    const ref = firebase.database().ref('someRef')
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_REQUESTED,
      payload: ref,
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseListenRequested(ref, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test(types.firebase.FIREBASE_LISTEN_REJECTED, () => {
    const error = new Error('Error!')
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_REJECTED,
      payload: { error },
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseListenRejected(error, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test(types.firebase.FIREBASE_LISTEN_FULFILLED, () => {
    const items = { item1: 1, item2: 2 }
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_FULFILLED,
      payload: { items },
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseListenFulfilled(items, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test(types.firebase.FIREBASE_LISTEN_CHILD_ADDED, () => {
    const id = '1'
    const value = 'a'
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_CHILD_ADDED,
      payload: { id, value },
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseListenChildAdded(id, value, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test(types.firebase.FIREBASE_LISTEN_CHILD_CHANGED, () => {
    const id = '1'
    const value = 'a'
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_CHILD_CHANGED,
      payload: { id, value },
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseListenChildChanged(id, value, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test(types.firebase.FIREBASE_LISTEN_CHILD_REMOVED, () => {
    const id = '1'
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_CHILD_REMOVED,
      payload: { id },
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseListenChildRemoved(id, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test('FIREBASE_UPDATE_REQUESTED', () => {
    const uid = '1'
    const expectedAction = {
      type: types.firebase.FIREBASE_UPDATE_REQUESTED,
      payload: uid,
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseUpdateRequested(uid, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test('FIREBASE_UPDATE_FULFILLED', () => {
    const error = 'error'
    const expectedAction = {
      type: types.firebase.FIREBASE_UPDATE_FULFILLED,
      payload: {},
      meta: { type: metaTypes.userContacts },
    }

    expect(actions.firebaseUpdateFulfilled(metaTypes.userContacts)).toEqual(
      expectedAction
    )
  })

  test('FIREBASE_UPDATE_REJECTED', () => {
    const error = new Error('Error!')
    const expectedAction = {
      type: types.firebase.FIREBASE_UPDATE_REJECTED,
      payload: { error },
      meta: { type: metaTypes.userContacts },
    }

    expect(
      actions.firebaseUpdateRejected(error, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test('FIREBASE_REMOVE_REQUESTED', () => {
    const uid = '1'
    const expectedAction = {
      type: types.firebase.FIREBASE_REMOVE_REQUESTED,
      payload: uid,
      meta: { type: metaTypes.userContacts },
    }
    expect(
      actions.firebaseRemoveRequested(uid, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test('FIREBASE_REMOVE_FULFILLED', () => {
    const error = 'error'
    const expectedAction = {
      type: types.firebase.FIREBASE_REMOVE_FULFILLED,
      payload: {},
      meta: { type: metaTypes.userContacts },
    }

    expect(actions.firebaseRemoveFulfilled(metaTypes.userContacts)).toEqual(
      expectedAction
    )
  })

  test('FIREBASE_REMOVE_REJECTED', () => {
    const error = new Error('Error!')
    const expectedAction = {
      type: types.firebase.FIREBASE_REMOVE_REJECTED,
      payload: { error },
      meta: { type: metaTypes.userContacts },
    }

    expect(
      actions.firebaseRemoveRejected(error, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test('FIREBASE_LISTEN_REMOVED', () => {
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_REMOVED,
      payload: { clearItems: true },
      meta: { type: metaTypes.userContacts },
    }

    expect(actions.firebaseListenRemoved(true, metaTypes.userContacts)).toEqual(
      expectedAction
    )
  })

  test('FIREBASE_REMOVE_LISTENER_REQUESTED', () => {
    const expectedAction = {
      type: types.firebase.FIREBASE_REMOVE_LISTENER_REQUESTED,
      payload: { clearItems: true },
      meta: { type: metaTypes.userContacts },
    }

    expect(
      actions.firebaseRemoveListenerRequested(true, metaTypes.userContacts)
    ).toEqual(expectedAction)
  })

  test('FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED', () => {
    const expectedAction = {
      type: types.firebase.FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED,
      payload: { clearItems: true },
    }

    expect(actions.firebaseRemoveAllListenersRequested()).toEqual(
      expectedAction
    )
  })

  test('listenToMessages', () => {
    const ref = firebase.database().ref('messages')
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_REQUESTED,
      payload: ref,
      meta: { type: metaTypes.messages },
    }
    expect(actions.listenToMessages()).toEqual(expectedAction)
  })

  test('listenToUserContacts', () => {
    const uid = '123'
    const ref = firebase.database().ref(`users/${uid}/contacts`)
    const expectedAction = {
      type: types.firebase.FIREBASE_LISTEN_REQUESTED,
      payload: ref,
      meta: { type: metaTypes.userContacts },
    }
    expect(actions.listenToUserContacts(uid)).toEqual(expectedAction)
  })
})
