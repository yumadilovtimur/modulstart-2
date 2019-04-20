import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import availableCities from '../cities.js';
import './HomePage.css';

class HomePage extends PureComponent {
  render() {
    return (
      <div className="container">
        <nav className="city-nav">
          <div className="city-nav__box">
            <h2 className="title">Выберите город:</h2>
            <ul>
              {availableCities.map(item => (
                <li className="city-nav__list-item" key={item.url}>
                  <NavLink to={item.url} className="city-nav__link">
                    {item.city}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default HomePage;
