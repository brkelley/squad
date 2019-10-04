import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from './app.route';

import rootReducer from './store/reducers.js';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// eslint-disable-next-line no-unused-vars
import style from './style/app.scss';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
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
