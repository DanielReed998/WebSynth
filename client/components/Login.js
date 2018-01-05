import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { fetchUser } from '../reducers/currentUser';
import { connect } from 'react-redux';


class Login extends Component {
  
    constructor(props) {
        super(props)
        this.onLoginSubmit = this.onLoginSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Welcome</h1>
                <form onSubmit={this.onLoginSubmit}>
                    <h2>Login!</h2>
                    <input placeholder="email" name="email"/>
                    <input placeholder="password" name="password"/>
                    <button type="submit" className="btn btn-block btn-primary" id="login-btn">Login</button>
                </form>
                <h4>If you are new, sign up <NavLink to="/signup">here!</NavLink></h4>
            </div>
        )
    }
    onLoginSubmit(event) {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        this.props.dispatchLogin(email, password);
        setTimeout(() => {
            if (Object.keys(this.props.currentUser).length > 0) {
                window.location.assign('/functionality');
            } else {
                alert('email or password incorrect');
            }
        }, 100);
    }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = ({currentUser}) => ({currentUser});
const mapDispatch = () => dispatch => {
  return {
    dispatchLogin: (email, password) => {
      dispatch(fetchUser({email, password}));
    }
  }
};

export default connect(mapState, mapDispatch)(Login);