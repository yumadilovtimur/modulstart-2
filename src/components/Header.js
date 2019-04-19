import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';

class Header extends PureComponent {
  render() {
    return (
      <div>
        <header>
          <nav>
            <NavLink to="/">
              <span>Logotype</span>
            </NavLink>
          </nav>
        </header>
      </div>
    );
  }
}

export default Header;
