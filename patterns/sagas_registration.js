import metaTypes from './types'
import sagas from './sagas'
import { all } from 'redux-saga/effects'

export default function* rootSaga() {
  yield all([
    sagas.watchListener(metaTypes.userContacts),
    sagas.watchUpdateRequested(),
  ])
}
