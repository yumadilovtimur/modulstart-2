import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

class Header extends PureComponent {
  render() {
    return (
      <div className="container container--header">
        <header className="header">
          <NavLink to="/" className="header__logo">
            WeatherLogo
          </NavLink>
        </header>
      </div>
    );
  }
}

export default Header;
