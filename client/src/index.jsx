import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';

import rootReducer from './store/reducers.js';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
module.hot.accept();
