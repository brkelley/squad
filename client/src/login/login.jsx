import React from 'react';

class Login extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.onLoginClick = this.onLoginClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange (e, inputType) {
        this.setState({
            [inputType]: e.target.value
        });
    }

    onLoginClick () {
        this.props.login(this.state.username, this.state.password);
    }

    render () {
        return (
            <div className="login-wrapper">
                <input
                    type="text"
                    onChange={e => this.onInputChange(e, 'username')} />
                <input
                    type="password"
                    onChange={e => this.onInputChange(e, 'password')} />
                <button onClick={this.onLoginClick}>Login</button>
            </div>
        );
    }
}

export default Login;
