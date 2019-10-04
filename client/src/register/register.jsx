import React from 'react';

class Register extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            validating: false,
            usernameDirty: false,
            username: '',
            summonerId: '',
            password: ''
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.validateSummonerName = this.validateSummonerName.bind(this);
        this.redirectToLogin = this.redirectToLogin.bind(this);
        this.registerNewUser = this.registerNewUser.bind(this);
        this.renderUsernameIcon = this.renderUsernameIcon.bind(this);
        this.renderRegister = this.renderRegister.bind(this);
    }

    onInputChange (e, inputType) {
        this.setState({
            [inputType]: e.target.value
        });
    }

    validateSummonerName (summonerName) {
        this.setState({ validating: true, usernameDirty: true });
        this.props.verifySummonerName(summonerName).then(({ status, data: summoner }) => {
            if (status === 200) {
                this.setState({
                    summonerId: summoner.id,
                    validating: false
                });
            }
        });
    }

    redirectToLogin () {
        this.props.history.push('/login');
    }

    registerNewUser () {
        const { username, summonerId, password } = this.state;
        this.props.registerNewUser({ username, summonerId, password });
    }

    renderUsernameIcon () {
        if (!this.state.usernameDirty) {
            return <i className="fa fa-user input-icon"></i>;
        } else if (this.state.validating) {
            return <i className="fa fa-ellipsis-h input-icon"></i>;
        } else {
            return <i className="fa fa-check input-icon"></i>;
        }
    }

    renderRegister () {
        return (
            <div className="register-action-wrapper">
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        className="login-input"
                        placeholder="League username"
                        onBlur={e => this.validateSummonerName(e.target.value)}
                        onChange={e => this.onInputChange(e, 'username')} />
                    {this.renderUsernameIcon()}
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        onChange={e => this.onInputChange(e, 'password')} />
                    <i className="fa fa-lock input-icon"></i>
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Verify password"
                        onChange={e => this.onInputChange(e, 'password')} />
                    <i className="fa fa-lock input-icon"></i>
                </div>
                <button
                    className="login-button"
                    onClick={this.registerNewUser}>
                    REGISTER
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
                        register
                    </div>
                    {this.renderRegister()}
                    <div className="register-prompt">
                        Have an account? <span className="register-link" onClick={this.redirectToLogin}>Sign in here</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
