import React, { PureComponent } from 'react';
import availableCities from '../cities.js';
import { NavLink } from 'react-router-dom';

class Page extends PureComponent {
  constructor(props) {
    super(props);
    this.canvasCtx = React.createRef();
  }

  current = () =>
    availableCities.find(item => {
      if (item.url === this.props.match.path) {
        return true;
      }
    });

  componentDidMount = () => {
    const { current } = this.canvasCtx;
    this.props.meteoRequest(this.current().xmlUrl, current);
  };

  render() {
    const { temperature } = this.props;
    console.log(temperature);

    return (
      <div>
        <h1>{`Прогноз погоды в городе ${this.current().city}`}</h1>
        <NavLink to="/">Выбрать другой город</NavLink>
        <section>
          {`мапируем здесь дивы по количеству точек прогноза (4 периода времени) ${temperature}`}
        </section>
        <div>
          <canvas
            ref={this.canvasCtx}
            id="out"
            height="250"
            width="600"
            role="img"
            aria-label="Линейный график с погодой"
          />
        </div>
      </div>
    );
  }
}

export default Page;
