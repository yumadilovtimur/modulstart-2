import { METEO_REQUEST, METEO_SUCCESS, METEO_ERROR } from '../actions/meteo';

const initialState = {
  isFetching: false,
  isFetched: false,
  error: null,
  temperature: null
};

const meteo = (state = initialState, action) => {
  switch (action.type) {
    case METEO_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFetched: false,
        error: null,
        temperature: null
      };
    case METEO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        error: null,
        temperature: action.payload
      };
    case METEO_ERROR:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        error: action.payload,
        temperature: null
      };
    default:
      return state;
  }
};

export default meteo;
