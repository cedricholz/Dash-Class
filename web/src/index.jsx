import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';

import App from './components/app.jsx';
import Dashboard from './components/src/Dashboard.jsx';
import Login from './components/src/Login.jsx';

import colorsMiddleware from './middleware/colors.js';
import colorsReducer from './reducers/colors.js';

import dashboardMiddleware from './middleware/dashboard.js';
import dashboardReducer from './reducers/dashboard.js';

const rootMiddleware = [
  colorsMiddleware,
  dashboardMiddleware,
];

const rootReducer = combineReducers({
  colors: colorsReducer,
  dashboard: dashboardReducer,
  routing: routerReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(
    ...rootMiddleware,
  ),
);

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/:404" component={null} />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('#root'),
);
