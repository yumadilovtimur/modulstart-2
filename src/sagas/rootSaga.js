import meteoFlow from './meteo';
import { call, takeEvery, all } from 'redux-saga/effects';

function* rootSaga() {
  yield all([call(meteoFlow)]);
}

export default rootSaga;
