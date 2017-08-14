export function removeUserContactsRequested(uid, contactId) {
  return firebaseRemoveRequested({ uid, contactId }, metaTypes.userContacts)
}
