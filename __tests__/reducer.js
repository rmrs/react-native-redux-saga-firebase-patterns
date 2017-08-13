import * as actions from '../actions'
import * as types from '../types'
import { getInitialState, firebaseReducer } from '../reducer'

describe('firebaseReducer reducer', () => {
  test(types.firebase.FIREBASE_UPDATE_REQUESTED, () => {
    const initialState = {
      [types.metaTypes.updateMessage]: { inProgress: false, error: '' },
    }
    const action = actions.firebaseUpdateRequested(
      types.metaTypes.updateMessage
    )
    const expectedState = {
      [types.metaTypes.updateMessage]: { inProgress: true, error: '' },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_UPDATE_REJECTED, () => {
    const initialState = {
      [types.metaTypes.updateMessage]: { inProgress: true, error: '' },
    }
    const error = 'error'
    const action = actions.firebaseUpdateRejected(
      error,
      types.metaTypes.updateMessage
    )
    const expectedState = {
      [types.metaTypes.updateMessage]: { inProgress: false, error },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_UPDATE_FULFILLED, () => {
    const initialState = {
      [types.metaTypes.updateMessage]: { inProgress: true, error: '' },
    }
    const action = actions.firebaseUpdateFulfilled(
      types.metaTypes.updateMessage
    )
    const expectedState = {
      [types.metaTypes.updateMessage]: { inProgress: false, error: '' },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_REMOVE_REQUESTED, () => {
    const initialState = {
      [types.metaTypes.removeMessage]: { inProgress: false, error: '' },
    }
    const action = actions.firebaseRemoveRequested(
      types.metaTypes.removeMessage
    )
    const expectedState = {
      [types.metaTypes.removeMessage]: { inProgress: true, error: '' },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_REMOVE_REJECTED, () => {
    const initialState = {
      [types.metaTypes.removeMessage]: { inProgress: true, error: '' },
    }
    const error = 'error'
    const action = actions.firebaseRemoveRejected(
      error,
      types.metaTypes.removeMessage
    )
    const expectedState = {
      [types.metaTypes.removeMessage]: { inProgress: false, error },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_REMOVE_FULFILLED, () => {
    const initialState = {
      [types.metaTypes.removeMessage]: { inProgress: true, error: '' },
    }
    const action = actions.firebaseRemoveFulfilled(
      types.metaTypes.removeMessage
    )
    const expectedState = {
      [types.metaTypes.removeMessage]: { inProgress: false, error: '' },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_REQUESTED, () => {
    const initialState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: {},
      },
    }
    const ref = new Object()
    const action = actions.firebaseListenRequested(
      ref,
      types.metaTypes.messages
    )
    const expectedState = {
      [types.metaTypes.messages]: {
        inProgress: true,
        error: '',
        items: {},
      },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_REJECTED, () => {
    const initialState = {
      [types.metaTypes.messages]: { inProgress: true, error: '', items: {} },
    }
    const error = 'error'
    const action = actions.firebaseListenRejected(
      error,
      types.metaTypes.messages
    )
    const expectedState = {
      [types.metaTypes.messages]: { inProgress: false, error, items: {} },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_FULFILLED, () => {
    const initialState = {
      [types.metaTypes.messages]: { inProgress: true, error: '', items: {} },
    }
    const items = { '1': { text: 'hello' }, '2': { text: 'world' } }
    const action = actions.firebaseListenFulfilled(
      items,
      types.metaTypes.messages
    )
    const expectedState = {
      [types.metaTypes.messages]: { inProgress: false, error: '', items },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_CHILD_ADDED, () => {
    const initialState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: { '1': { text: 'hello' }, '2': { text: 'world' } },
      },
    }
    const child_id = '3'
    const child = { text: 'goodbye' }
    const action = actions.firebaseListenChildAdded(
      child_id,
      child,
      types.metaTypes.messages
    )
    const expectedState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: {
          '1': { text: 'hello' },
          '2': { text: 'world' },
          '3': { text: 'goodbye' },
        },
      },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_CHILD_CHANGED, () => {
    const initialState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: {
          '1': { text: 'hello' },
          '2': { text: 'world' },
          '3': { text: 'goodbye' },
        },
      },
    }
    const child_id = '3'
    const child = { text: 'ciao' }
    const action = actions.firebaseListenChildChanged(
      child_id,
      child,
      types.metaTypes.messages
    )
    const expectedState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: {
          '1': { text: 'hello' },
          '2': { text: 'world' },
          '3': { text: 'ciao' },
        },
      },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_CHILD_REMOVED, () => {
    const initialState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: { '1': { text: 'hello' }, '2': { text: 'world' } },
      },
    }
    const child_id = '2'
    const action = actions.firebaseListenChildRemoved(
      child_id,
      types.metaTypes.messages
    )
    const expectedState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: { '1': { text: 'hello' } },
      },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_REMOVED + ' clear items false', () => {
    const initialState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: { '1': { text: 'hello' }, '2': { text: 'world' } },
      },
    }
    const action = actions.firebaseListenRemoved(
      false,
      types.metaTypes.messages
    )
    const expectedState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: { '1': { text: 'hello' }, '2': { text: 'world' } },
      },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test(types.firebase.FIREBASE_LISTEN_REMOVED + ' clear items true', () => {
    const initialState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: { '1': { text: 'hello' }, '2': { text: 'world' } },
      },
    }
    const action = actions.firebaseListenRemoved(true, types.metaTypes.messages)
    const expectedState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: {},
      },
    }
    expect(firebaseReducer(initialState, action)).toEqual(expectedState)
  })

  test('bogus action does nothing', () => {
    const initialState = {
      [types.metaTypes.messages]: {
        inProgress: false,
        error: '',
        items: { '1': { text: 'hello' }, '2': { text: 'world' } },
      },
    }
    const action = {
      type: 'DO_NOT_TOUCH_STATE_ACTION',
    }
    expect(firebaseReducer(initialState, action)).toBe(initialState)
  })

  test('no initial state', () => {
    const action = {
      type: 'DO_NOT_TOUCH_STATE_ACTION',
    }
    expect(firebaseReducer(undefined, action)).toEqual(getInitialState())
  })
})
