export function updateUserContactsRequested(uid, contactId, name, phone) {
  return firebaseUpdateRequested(
    { uid, contactId, name, phone },
    metaTypes.userContacts
  )
}
