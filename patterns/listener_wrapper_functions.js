export function listenToUserContacts(uid) {
  const ref = firebase.database().ref(`users/${uid}/contacts`)
  return firebaseListenRequested(ref, metaTypes.userContacts)
}

export function removeUserContactsListenerRequested() {
  return firebaseRemoveListenerRequested(false, metaTypes.userContacts)
}
