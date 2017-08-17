import * as sagas from '../sagas'
import * as types from '../types'
import * as actions from '../actions'
import firebase from '../firebase'
import { put, take, call, fork, cancel, flush } from 'redux-saga/effects'

import { cloneableGenerator } from 'redux-saga/utils'
import { metaTypes } from '../types'

test(`watchUpdateRequested ${metaTypes.userContacts}`, () => {
  const generator = sagas.watchUpdateRequested()
  const updates = { updates: { a: '1', b: '2' } }
  const action = actions.updateUserContactsRequested()
  const selector = sagas.getUserContactsUpdates

  expect(generator.next().value).toEqual(
    take(types.firebase.FIREBASE_UPDATE_REQUESTED)
  )
  expect(generator.next(action).value).toEqual(call(selector, action.payload))
  expect(generator.next(updates).value).toEqual(
    fork(sagas.updateItems, updates, action.meta.type)
  )
})

test('watchUpdateRequested unknownType', () => {
  const generator = sagas.watchUpdateRequested()

  //test non function case
  expect(generator.next().value).toEqual(
    take(types.firebase.FIREBASE_UPDATE_REQUESTED)
  )
  expect(generator.next({ meta: { type: 'unknownType' } }).value).toEqual(
    take(types.firebase.FIREBASE_UPDATE_REQUESTED)
  )
})

test('updateItems - regular stream - success and failure', () => {
  const updates = { x: true }
  const metaType = 'someType'
  const ref = firebase.database().ref()
  const generator = cloneableGenerator(sagas.updateItems)(updates, metaType)
  expect(generator.next().value).toEqual(call([ref, ref.update], updates))

  const successGenerator = generator.clone()
  expect(successGenerator.next().value).toEqual(
    put(actions.firebaseUpdateFulfilled(metaType))
  )
  expect(successGenerator.next().done).toEqual(true)

  const failGenerator = generator.clone()
  const error = new Error('An error occured')
  expect(failGenerator.throw(error).value).toEqual(
    put(actions.firebaseUpdateRejected(error, metaType))
  )
  expect(failGenerator.next().done).toEqual(true)
})

test('getUpdateOfferingUpdates', () => {
  const uid = '1'
  const contactId = '123'
  const name = 'John Doe'
  const phone = '123456789'

  const updates = {
    [`users/${uid}/contacts/${contactId}/name`]: name,
    [`users/${uid}/contacts/${contactId}/phone`]: phone,
  }

  expect(sagas.getUserContactsUpdates({ uid, contactId, name, phone })).toEqual(
    updates
  )
})
