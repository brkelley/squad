import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from './app.route';

import rootReducer from './store/reducers.js';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import Cookies from 'js-cookie';
import './style/app.scss';

const token = Cookies.get('userToken');
if (token) {
    axios.defaults.headers.common['squadToken'] = token;
}

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

ReactDOM.render(
    <Provider store={store}>
        <div className="app-wrapper">
            <AppRoute store={store} />
        </div>
    </Provider>,
    document.getElementById('app')
);
module.hot.accept();
