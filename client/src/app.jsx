import React from 'react';
import AppRoute from './app.route';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import style from './style/app.scss';

export default function App () {
    axios.interceptors.response.use(
        response => response,
        error => {
            const { status } = error.response;
            if (status === 401) {
                // redirect to login IF LOGIN ISN'T THE PAGE YOU'RE ALREADY ON
            }
            return Promise.reject(error);
        }
    )
    return (
        <div className="app-wrapper">
            <AppRoute />
        </div>
    );
}
