import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from './app.route';

import rootReducer from './store/reducers.js';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import Cookies from 'js-cookie';
import firebase from 'firebase/app';
import './style/app.scss';

const token = Cookies.get('userToken');
if (token) {
    axios.defaults.headers.common['squadToken'] = token;
}

axios.interceptors.request.use(config => {
    config.url = `${SERVER_URL}/api/v1${config.url}`;
    return config;
});

const composeParams = [
    applyMiddleware(thunk)
];

firebase.initializeApp(JSON.parse(atob(process.env.FIREBASE_CONFIG)));

if (ENVIRONMENT === 'dev' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    composeParams.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const store = createStore(
    rootReducer,
    compose(
        ...composeParams
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
// module.hot.accept();
