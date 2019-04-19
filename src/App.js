import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Page from './components/Page';
import availableCities from './cities.js';
import { meteoRequest } from './actions/meteo';

class App extends PureComponent {
  render() {
    const { meteoRequest } = this.props;

    const { isFetching, isFetched, error, temperature } = this.props.meteo;

    return (
      <BrowserRouter>
        <div className="wrapper">
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            {availableCities.map(item => (
              <Route
                exact
                path={item.url}
                key={item.url}
                render={props => (
                  <Page
                    {...props}
                    meteoRequest={meteoRequest}
                    isFetching={isFetching}
                    temperature={temperature}
                  />
                )}
              />
            ))}
            <Redirect to="/" />
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  meteo: state.meteo
});

const mapDispatchToProps = {
  meteoRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
