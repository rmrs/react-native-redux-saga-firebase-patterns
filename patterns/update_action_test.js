test('updateUserContactsRequested', () => {
  const uid = '1'
  const contactId = '123'
  const name = 'John Doe'
  const phone = '123456789'
  const expectedAction = {
    type: types.firebase.FIREBASE_UPDATE_REQUESTED,
    payload: { uid, contactId, name, phone },
    meta: { type: metaTypes.userContacts },
  }
  expect(
    actions.updateUserContactsRequested(uid, contactId, name, phone)
  ).toEqual(expectedAction)
})
