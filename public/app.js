import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import thunk from 'redux-thunk'

import Sitters from './containers/sitters';

require('es6-object-assign').polyfill();
require('es6-promise').polyfill();

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path='/' component={Sitters} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('content')
);
