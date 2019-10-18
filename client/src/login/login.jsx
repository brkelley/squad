import React from 'react';
import Cookies from 'js-cookie';

class Login extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.redirectToRegister = this.redirectToRegister.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
    }

    onInputChange (e, inputType) {
        this.setState({
            [inputType]: e.target.value
        });
    }

    onLoginClick () {
        this.props.login(this.state.username, this.state.password)
            .then(() => {
                this.props.history.push('/');
            })
    }

    redirectToRegister () {
        this.props.history.push('/register');
    }

    renderLogin () {
        return (
            <div className="login-action-wrapper">
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        onChange={e => this.onInputChange(e, 'username')} />
                    <i className="fa fa-user input-icon"></i>
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        onChange={e => this.onInputChange(e, 'password')} />
                    <i className="fa fa-lock input-icon"></i>
                </div>
                <button
                    className="login-button"
                    onClick={this.onLoginClick}>
                    LOG IN
                </button>
            </div>
        );
    }

    render () {
        return (
            <div className="login-wrapper">
                <div className="login-title">
                    squad
                </div>
                <div className="login-actions-wrapper">
                    <div className="action-label">
                        log in
                    </div>
                    {this.renderLogin()}
                    <div className="register-prompt">
                        New user? <span className="register-link" onClick={this.redirectToRegister}>Create an account here</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
