import React, { PureComponent, Fragment } from 'react';
import availableCities from '../cities.js';
import { NavLink } from 'react-router-dom';
import './Page.css';
import Preloader from './Preloader.js';

class Page extends PureComponent {
  current = () =>
    availableCities.find(item => {
      if (item.url === this.props.match.path) {
        return true;
      } else {
        return false;
      }
    });

  componentDidMount = () => {
    this.props.meteoRequest(this.current().xmlUrl);
  };

  getImage = code => {
    const cloudiness = {
      '-1': 'Туман',
      '0': 'Ясно',
      '1': 'Малооблачно',
      '2': 'Облачно',
      '3': 'Пасмурно'
    };

    return (
      <Fragment>
        <div
          className={`weather-page__icon weather-page__icon--${+code + 2}`}
        />
        <span>{cloudiness[code]}</span>
      </Fragment>
    );
  };

  render() {
    const { temperature, isFetching } = this.props;

    if (isFetching) {
      return (
        <div className="container">
          <div className="weather-page">
            <h1 className="title">{`Прогноз погоды для города ${
              this.current().city
            }`}</h1>
            <NavLink to="/" className="weather-page__link">
              Выбрать другой город
            </NavLink>
            <Preloader />
          </div>
        </div>
      );
    } else if (temperature) {
      const timeKeys = Object.keys(temperature);
      return (
        <div className="container">
          <div className="weather-page">
            <h1 className="title">{`Прогноз погоды для города ${
              this.current().city
            }`}</h1>
            <NavLink to="/" className="weather-page__link">
              Выбрать другой город
            </NavLink>
            <section className="weather-page__list">
              {timeKeys.map(item => {
                return (
                  <div className="weather-page__item" key={item}>
                    <div className="weather-page__time">{item}</div>
                    {this.getImage(temperature[item].cloudiness)}
                    <div className="weather-page__temp">{`${
                      temperature[item].realTemperature
                    } °C`}</div>
                  </div>
                );
              })}
            </section>
            <div>
              <canvas
                id="out"
                height="250"
                width="600"
                role="img"
                aria-label="Линейный график с погодой"
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="weather-page">
            <h1 className="title">{`Прогноз погоды для города ${
              this.current().city
            }`}</h1>
            <NavLink to="/" className="weather-page__link">
              Выбрать другой город
            </NavLink>
            <Preloader />
          </div>
        </div>
      );
    }
  }
}

export default Page;
