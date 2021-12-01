import { all, fork } from 'redux-saga/effects'

import dashboard from './dashboard.saga'
export default function* root () {
  yield all([ fork(dashboard) ])
}
