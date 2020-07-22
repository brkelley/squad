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
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './style/theme';
import get from 'lodash/get';

axios.interceptors.request.use((config) => {
    config.url = `${SERVER_URL}/api/v2${config.url}`;

    return config;
});

const token = Cookies.get('squadtoken');
if (token) {
    axios.defaults.headers.common['squadtoken'] = token;
}

axios.interceptors.response.use(
    (response) => response,
    (reject) => {
        if (reject.response.headers === 404 && get(reject.response.body, 'Invalid Discord access code')) {
            window.location.href = '/login'
        }
    }
);

const composeParams = [
    applyMiddleware(thunk)
];

firebase.initializeApp(JSON.parse(atob(process.env.FIREBASE_CONFIG_CLIENT)));

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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app-wrapper">
                <AppRoute store={store} />
            </div>
        </ThemeProvider>
    </Provider>,
    document.getElementById('app')
);
