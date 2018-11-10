import css from '../css/app.css';
//import 'phoenix_html';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import LoggedOut from './LoggedOut';
import { Map } from 'immutable';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Home from './Home';
import Users from './Users';
import Tasks from './Tasks';

const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

const token = localStorage.getItem('token');
const id = localStorage.getItem('id');

const rootReducer = (state, { type, payload }) => {
  switch (type) {
    case 'LOG_IN_SUCCESS':
      return state.merge(payload);
    case 'LOG_OUT':
      return state.set('token', null);
    default:
      return state;
  }
};
const store = createStore(
  rootReducer,
  Map({ token, id }),
  // applyMiddleware(logger),
);

class AuthRedirector extends Component {
  componentDidMount() {
    if (!this.props.token) {
      this.props.history.replace('/unauthorized');
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.token && prevProps.token) {
      this.props.history.replace('/unauthorized');
    }
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  token: state.get('token'),
});

AuthRedirector = withRouter(connect(mapStateToProps)(AuthRedirector));

class NoMatch extends Component {
  componentDidMount() {
    this.props.history.replace('/home');
  }

  render() {
    return null;
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <AuthRedirector>
            <div className="container mx-auto font-sans py-2 px-1">
              <Switch>
                <Route
                  path="/unauthorized"
                  exact={true}
                  component={LoggedOut}
                />
                <Route path="/home" component={Home} />
                <Route path="/users" component={Users} />
                <Route path="/tasks" component={Tasks} />
                <Route component={NoMatch} />
              </Switch>
            </div>
          </AuthRedirector>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
