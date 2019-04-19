import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import availableCities from '../cities.js';

class HomePage extends PureComponent {
  render() {
    return (
      <div>
        {availableCities.map(item => (
          <NavLink to={item.url} key={item.url}>
            {item.city}
          </NavLink>
        ))}
      </div>
    );
  }
}

export default HomePage;
