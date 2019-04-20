import React, { PureComponent } from 'react';
import './Preloader.css';

class Preloader extends PureComponent {
  render() {
    return (
      <div className="preloader-container">
        <div className="dash uno" />
        <div className="dash dos" />
        <div className="dash tres" />
        <div className="dash cuatro" />
      </div>
    );
  }
}

export default Preloader;
