export const METEO_REQUEST = 'METEO_REQUEST';
export const METEO_SUCCESS = 'METEO_SUCCESS';
export const METEO_ERROR = 'METEO_ERROR';

export const meteoRequest = (xmlUrl, canvasCtx) => ({
  type: METEO_REQUEST,
  payload: {
    xmlUrl,
    canvasCtx
  }
});

export const meteoSuccess = payload => ({
  type: METEO_SUCCESS,
  payload
});

export const meteoError = payload => ({
  type: METEO_ERROR,
  payload
});
