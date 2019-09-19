import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

class AppRoute extends Component {
    constructor (props) {
        super(props);

        history.listen(({ pathname }) => {
            this.setState({ isOnHomepage: pathname === '/' })
        })

        this.state = {
            isOnHomepage: window.location.pathname === '/'
        }
    }

    render () {
        return (
            <h1>it works!</h1>
            // <Router history={history}>
                
            // </Router>
        );
    }
}

export default AppRoute;