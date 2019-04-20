import { put, call, take, delay } from 'redux-saga/effects';
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
  const phenomena = meteoXml.querySelectorAll('PHENOMENA');

  const result = {};

  const addData = (nodes, data, attr) => {
    [...nodes].forEach(item => {
      const value = item.getAttribute(attr);
      const hour = `${item.parentNode.getAttribute('hour')}:00`;
      result[hour] = {
        ...result[hour],
        [data]: value
      };
    });
  };

  addData(real, 'realTemperature', 'max');
  addData(perceived, 'perceivedTemperature', 'max');
  addData(phenomena, 'cloudiness', 'cloudiness');

  return result;
};

const buildChart = tempData => {
  const timeKeys = Object.keys(tempData);
  const realTemp = timeKeys.map(key => tempData[key].realTemperature);
  const perceivedTemp = timeKeys.map(key => tempData[key].perceivedTemperature);

  const chartConfig = {
    type: 'line',
    data: {
      labels: timeKeys,
      datasets: [
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
        },
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
        }
      ]
    },
    options: {
      legend: {
        position: 'top',
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

  const canvasNode = document.querySelector('#out');
  new Chart(canvasNode, chartConfig);
};

export default function* meteoFlow() {
  while (true)
    try {
      const { payload } = yield take(METEO_REQUEST);
      yield delay(1500);
      const xml = yield call(getXml, payload);
      const temp = yield call(loadTemperature, xml.response);
      yield put(meteoSuccess(temp));
      yield call(buildChart, temp);
    } catch (error) {
      yield put(meteoError(error));
    }
}
