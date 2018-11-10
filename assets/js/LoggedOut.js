import React, { Component } from 'react';
import { connect } from 'react-redux';

class LoggedOut extends Component {
  state = { username: '', password: '', currentState: 'INITIAL' };

  componentDidMount() {
    if (this.props.token) {
      this.props.history.replace('/');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.token && !prevProps.token) {
      this.props.history.replace('/');
    }
  }

  onSignUp = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: { username: this.state.username, password: this.state.password },
      }),
    });
    const json = await res.json();
    if (!json.errors) {
      this.setState({ currentState: 'SIGN_UP_SUCCESS' });
    }
  };

  onLogIn = async () => {
    const res = await fetch('/api/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: { username: this.state.username, password: this.state.password },
      }),
    });
    const json = await res.json();
    if (json.error) {
      this.setState({ currentState: 'LOG_IN_FAILURE' });
    } else {
      localStorage.setItem('token', json.token);
      localStorage.setItem('id', json.id);
      this.props.dispatch({
        type: 'LOG_IN_SUCCESS',
        payload: { token: json.token, id: json.id },
      });
    }
  };

  render() {
    return (
      <div className="text-center p-4 h-screen flex justify-center flex-col items-center">
        <div className="shadow-lg p-4 w-64 rounded bg-grey-lightest border border-blue">
          <div className="text-xl mb-2">Tasks</div>
          {this.state.currentState === 'SIGN_UP_SUCCESS' && (
            <div className="my-2 text-grey-dark">
              Sign up successful! Please log in.
            </div>
          )}
          {this.state.currentState === 'LOG_IN_FAILURE' && (
            <div className="my-2 text-red">
              There was a problem, please try again.
            </div>
          )}
          <div>
            <form>
              <div>
                <input
                  type="text"
                  placeholder="username"
                  autoComplete="username"
                  onChange={e => this.setState({ username: e.target.value })}
                  className="rounded border mb-2 p-2"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="password"
                  autoComplete="current-password"
                  onChange={e => this.setState({ password: e.target.value })}
                  className="rounded border mb-2 p-2"
                />
              </div>
            </form>
            <div>
              <button
                className="border border-blue rounded p-3 text-blue hover:bg-blue hover:text-white mr-2"
                onClick={this.onLogIn}
              >
                Log in
              </button>
              <button
                onClick={this.onSignUp}
                className="border border-blue rounded p-3 text-blue hover:bg-blue hover:text-white"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.get('token'),
});

export default connect(mapStateToProps)(LoggedOut);
