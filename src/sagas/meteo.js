import { put, call, take } from 'redux-saga/effects';
import { meteoSuccess, meteoError, METEO_REQUEST } from '../actions/meteo';
import Chart from 'chart.js';

const parser = new DOMParser();

const getXml = url => {
  return fetch(url, {
    method: 'GET',
    Accept: 'application/xml',
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT',
      'Access-Control-Allow-Headers': 'Content-Type'
    }),
    mode: 'no-cors'
  })
    .then(response => response.text())
    .then(response => parser.parseFromString(response, 'text/xml'))
    .then(response => ({ response }))
    .catch(error => ({ error }));
};

const loadTemperature = meteoXml => {
  const real = meteoXml.querySelectorAll('TEMPERATURE');
  const perceived = meteoXml.querySelectorAll('HEAT');

  const result = {
    realTemperature: {},
    perceivedTemperature: {}
  };

  const addData = (nodes, data) => {
    [...nodes].forEach(item => {
      const temp = item.getAttribute('max');
      const hour = `${item.parentNode.getAttribute('hour')}:00`;
      data[hour] = temp;
    });
  };

  addData(real, result.realTemperature);
  addData(perceived, result.perceivedTemperature);

  return result;
};

const buildChart = (tempData, canvasCtx) => {
  const timeKeys = Object.keys(tempData.realTemperature);
  const realTemp = timeKeys.map(key => tempData.realTemperature[key]);
  const perceivedTemp = timeKeys.map(key => tempData.perceivedTemperature[key]);

  const chartConfig = {
    type: 'line',
    data: {
      labels: timeKeys,
      datasets: [
        {
          label: 'Температура',
          backgroundColor: 'rgb(173, 243, 19)',
          borderColor: 'rgb(62, 90, 0)',
          pointBackgroundColor: 'rgb(241, 253, 215)',
          data: realTemp,
          borderJoinStyle: 'round',
          borderWidth: 2,
          pointHoverBorderWidth: 4,
          lineTension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 7,
          pointStyle: 'rectRounded'
        },
        {
          label: 'Температура по ощущениям',
          backgroundColor: 'rgb(14, 176, 176)',
          borderColor: 'rgb(0, 57, 57)',
          pointBackgroundColor: 'rgb(205, 241, 241',
          data: perceivedTemp,
          borderDash: [10, 5],
          borderJoinStyle: 'round',
          borderWidth: 2,
          pointHoverBorderWidth: 4,
          lineTension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 7,
          pointStyle: 'rectRounded'
        }
      ]
    },
    options: {
      legend: {
        position: 'right',
        labels: {
          fontSize: 14,
          fontColor: 'black',
          boxWidth: 30,
          padding: 30
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeInOutElastic'
      },
      title: {
        display: true,
        text: 'График погоды в Уфе',
        fontSize: 16
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Температура, °C',
              fontColor: 'black',
              fontSize: 14
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Местное время',
              fontColor: 'black',
              fontSize: 14
            }
          }
        ]
      }
    }
  };

  new Chart(canvasCtx, chartConfig);
};

export default function* meteoFlow() {
  try {
    const {
      payload: { xmlUrl, canvasCtx }
    } = yield take(METEO_REQUEST);
    const xml = yield call(getXml, xmlUrl);
    const temp = yield call(loadTemperature, xml.response);
    yield call(buildChart, temp, canvasCtx);
    yield put(meteoSuccess(temp));
  } catch (error) {
    yield put(meteoError(error));
  }
}
