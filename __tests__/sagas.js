import * as sagas from '../sagas'
import * as types from '../types'
import firebase from '../firebase'
import {
  all,
  put,
  takeEvery,
  take,
  call,
  fork,
  cancel,
  flush,
  cancelled,
} from 'redux-saga/effects'
import { cloneableGenerator, createMockTask } from 'redux-saga/utils'
import * as actions from '../actions'
import { metaTypes, eventTypes } from '../types'

describe('database saga', () => {
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

  test(`watchRemoveRequested ${metaTypes.userContacts}`, () => {
    const generator = sagas.watchRemoveRequested()
    const path = 'a/b/c'

    const action = actions.removeUserContactsRequested()
    const selector = sagas.getUserContactsPath

    expect(generator.next().value).toEqual(
      take(types.firebase.FIREBASE_REMOVE_REQUESTED)
    )
    expect(generator.next(action).value).toEqual(call(selector, action.payload))
    expect(generator.next(path).value).toEqual(
      fork(sagas.removeItem, path, action.meta.type)
    )
    expect(generator.next({ meta: { type: 'unknownType' } }).value).toEqual(
      take(types.firebase.FIREBASE_REMOVE_REQUESTED)
    )
  })

  test('watchRemoveRequested unknownType', () => {
    const generator = sagas.watchRemoveRequested()

    //test non function case
    expect(generator.next().value).toEqual(
      take(types.firebase.FIREBASE_REMOVE_REQUESTED)
    )
    expect(generator.next({ meta: { type: 'unknownType' } }).value).toEqual(
      take(types.firebase.FIREBASE_REMOVE_REQUESTED)
    )
  })

  test('watchListener', () => {
    const checkedMetaType = metaTypes.messages
    const unwantedMetaType = metaTypes.userContacts

    const generator = cloneableGenerator(sagas.watchListener)(checkedMetaType)

    expect(generator.next().value).toEqual(
      take(types.firebase.FIREBASE_LISTEN_REQUESTED)
    )

    const regularGenerator = generator.clone()
    const checkedListenRequestAction = actions.listenToMessages()
    const checkedListenRemoveAction = actions.removeMessagesListenerRequested()
    const unwantedListenRequestAction = actions.listenToUserContacts()
    const unwantedListenRemoveAction = actions.removeUserContactsListenerRequested()
    const ref = checkedListenRequestAction.payload.ref
    const mockTask = createMockTask()

    //regular flow
    expect(regularGenerator.next(checkedListenRequestAction).value).toEqual(
      fork(
        sagas.getDataAndListenToChannel,
        ref,
        checkedListenRequestAction.meta.type
      )
    )

    expect(regularGenerator.next(mockTask).value).toEqual(
      take([
        types.firebase.FIREBASE_REMOVE_LISTENER_REQUESTED,
        types.firebase.FIREBASE_LISTEN_REQUESTED,
        types.firebase.FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED,
      ])
    )

    const regularWithUnwantedRemoveMetaType = regularGenerator.clone()
    const regularWithListenActionGenerator = regularGenerator.clone()

    expect(regularGenerator.next(checkedListenRemoveAction).value).toEqual(
      cancel(mockTask)
    )

    expect(regularGenerator.next().value).toEqual(
      put(
        actions.firebaseListenRemoved(
          checkedListenRemoveAction.payload.clearItems,
          checkedMetaType
        )
      )
    )

    expect(regularGenerator.next().value).toEqual(
      take(types.firebase.FIREBASE_LISTEN_REQUESTED)
    ) //back to start

    //unwanted listen request flow
    const unwantedListenRequestActionGenerator = generator.clone()
    expect(
      unwantedListenRequestActionGenerator.next(unwantedListenRequestAction)
        .value
    ).toEqual(take(types.firebase.FIREBASE_LISTEN_REQUESTED)) // unwatned action - go to start

    //unwanted remove request while waiting to specifig cancel request
    expect(
      regularWithUnwantedRemoveMetaType.next(unwantedListenRemoveAction).value
    ).toEqual(
      take([
        types.firebase.FIREBASE_REMOVE_LISTENER_REQUESTED,
        types.firebase.FIREBASE_LISTEN_REQUESTED,
        types.firebase.FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED,
      ])
    ) //contintue to wait

    //regualr with listen aciton
    expect(
      regularWithListenActionGenerator.next(checkedListenRequestAction).value
    ).toEqual(cancel(mockTask))
    expect(regularWithListenActionGenerator.next().value).toEqual(
      put(actions.firebaseListenRemoved(false, checkedMetaType))
    )
    expect(regularWithListenActionGenerator.next().value).toEqual(
      fork(
        sagas.getDataAndListenToChannel,
        checkedListenRemoveAction.payload.ref,
        checkedMetaType
      )
    )

    expect(regularWithListenActionGenerator.next().value).toEqual(
      take([
        types.firebase.FIREBASE_REMOVE_LISTENER_REQUESTED,
        types.firebase.FIREBASE_LISTEN_REQUESTED,
        types.firebase.FIREBASE_REMOVE_ALL_LISTENERS_REQUESTED,
      ])
    ) //contintue to wait
  })

  test('getDataAndListenToChannel', () => {
    const ref = firebase.database().ref()
    const chan = sagas.createEventChannel(ref)
    const metaType = metaTypes.offeringsCategories
    const value = 'Data from database'
    const snap = { val: () => value }

    const generator = cloneableGenerator(sagas.getDataAndListenToChannel)(
      ref,
      metaType
    )
    expect(generator.next().value).toEqual(call(sagas.createEventChannel, ref))
    expect(generator.next(chan).value).toEqual(call([ref, ref.once], 'value'))

    const failureGenerator = generator.clone()

    //regular flow
    expect(generator.next(snap).value).toEqual(flush(chan))
    expect(generator.next().value).toEqual(
      put(actions.firebaseListenFulfilled(value, metaType))
    )
    expect(generator.next().value).toEqual(take(chan))
    const data = {
      eventType: eventTypes.CHILD_ADDED,
      key: '1',
      value: 'Data from channel',
    }
    expect(generator.next(data).value).toEqual(
      put(sagas.getUpdateAction(data, metaType))
    )
    expect(generator.next().value).toEqual(take(chan)) //return to listen to the channel
    generator.return().value //simulate cancellation

    //failure flow
    const error = new Error('An error occured')
    expect(failureGenerator.throw(error).value).toEqual(
      put(actions.firebaseListenRejected(error, metaType))
    )
    expect(failureGenerator.next().value).toEqual(take(chan)) //listen to the channel
  })

  test('getDataAndListenToChannel null value', () => {
    const ref = firebase.database().ref()
    const chan = sagas.createEventChannel(ref)
    const metaType = metaTypes.offeringsCategories
    const snap = { val: () => null }

    const generator = cloneableGenerator(sagas.getDataAndListenToChannel)(
      ref,
      metaType
    )
    expect(generator.next().value).toEqual(call(sagas.createEventChannel, ref))
    expect(generator.next(chan).value).toEqual(call([ref, ref.once], 'value'))

    //regular flow
    expect(generator.next(snap).value).toEqual(flush(chan))
    expect(generator.next().value).toEqual(
      put(actions.firebaseListenFulfilled({}, metaType))
    )
    expect(generator.next().value).toEqual(take(chan))
    const data = {
      eventType: eventTypes.CHILD_ADDED,
      key: '1',
      value: 'Data from channel',
    }
    expect(generator.next(data).value).toEqual(
      put(sagas.getUpdateAction(data, metaType))
    )
    expect(generator.next().value).toEqual(take(chan)) //return to listen to the channel
    generator.return().value //simulate cancellation
  })

  test('getUpdateAction CHILD_ADDED', () => {
    const metaType = metaTypes.offeringsCategories
    const childAddedData = {
      eventType: eventTypes.CHILD_ADDED,
      key: '1',
      value: 'Data from channel',
    }

    expect(sagas.getUpdateAction(childAddedData, metaType)).toEqual(
      actions.firebaseListenChildAdded(
        childAddedData.key,
        childAddedData.value,
        metaType
      )
    )
  })

  test('getUpdateAction CHILD_CHANGED', () => {
    const metaType = metaTypes.offeringsCategories
    const childChangedData = {
      eventType: eventTypes.CHILD_CHANGED,
      key: '1',
      value: 'Data from channel',
    }

    expect(sagas.getUpdateAction(childChangedData, metaType)).toEqual(
      actions.firebaseListenChildChanged(
        childChangedData.key,
        childChangedData.value,
        metaType
      )
    )
  })

  test('getUpdateAction CHILD_REMOVED', () => {
    const metaType = metaTypes.offeringsCategories
    const childRemovedData = {
      eventType: eventTypes.CHILD_REMOVED,
      key: '1',
    }

    expect(sagas.getUpdateAction(childRemovedData, metaType)).toEqual(
      actions.firebaseListenChildRemoved(childRemovedData.key, metaType)
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

  test('removeItem - regular stream - success and failure', () => {
    const path = 'a/b/c'
    const metaType = 'someType'
    const ref = firebase.database().ref(path)
    const generator = cloneableGenerator(sagas.removeItem)(path, metaType)
    expect(generator.next().value).toEqual(call([ref, ref.remove]))

    const successGenerator = generator.clone()
    expect(successGenerator.next().value).toEqual(
      put(actions.firebaseRemoveFulfilled(metaType))
    )
    expect(successGenerator.next().done).toEqual(true)

    const failGenerator = generator.clone()
    const error = new Error('An error occured')
    expect(failGenerator.throw(error).value).toEqual(
      put(actions.firebaseRemoveRejected(error, metaType))
    )
    expect(failGenerator.next().done).toEqual(true)
  })

  test('getUpdateOfferingUpdates', () => {
    const uid = '1'
    const contactId = '123'
    const name = 'John Due'
    const phone = '123456789'

    const updates = {
      [`users/${uid}/contacts/${contactId}/name`]: name,
      [`users/${uid}/contacts/${contactId}/phone`]: phone,
    }

    expect(
      sagas.getUserContactsUpdates({ uid, contactId, name, phone })
    ).toEqual(updates)
  })

  test('getUserContactsPath', () => {
    const uid = '1'
    const contactId = '123'
    const path = `users/${uid}/contacts/${contactId}`
    expect(sagas.getUserContactsPath({ uid, contactId })).toEqual(path)
  })
})
