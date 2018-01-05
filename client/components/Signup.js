import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { addUser } from '../reducers/users';
import { setSessionId } from '../reducers/currentUser';

/* -----------------    COMPONENT     ------------------ */

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
  }

  render() {  
    const { message } = this.props;
    return (
      <div className="signin-container">
        <div className="buffer local">
          <form onSubmit={this.onSignupSubmit}>
          <div className="form-group">
            <label>name</label>
            <input
                name="name"
                type="name"
                className="form-control"
                required
            />
            </div>
            <div className="form-group">
              <label>email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-block btn-primary">{message}</button>
          </form>
        </div>
        <div className="or buffer">
          <div className="back-line">
            <span>OR</span>
          </div>
        </div>
        <div className="buffer oauth">
          <p>
            <a
              target="_self"
              href="/auth/google"
              className="btn btn-social btn-google">
              <i className="fa fa-google" />
              <span>{message} with Google</span>
            </a>
          </p>
        </div>
      </div>
    );
  }

  onSignupSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    this.props.dispatchNewUser(name, email, password);
    this.props.addCurrentUser(name, email, password);
    browserHistory.push('/functionality');
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = () => ({ message: 'Sign up' });
const mapDispatch = (dispatch) => {
  return {
    dispatchNewUser: (email, password) => {
      dispatch(addUser({email, password}));
    },
    addCurrentUser: (email, password) => {
      dispatch(setSessionId({email, password}));
    }
  }
};

export default connect(mapState, mapDispatch)(Signup);