import React, { Component } from 'react';
import { List, fromJS } from 'immutable';
import { connect } from 'react-redux';

class Users extends Component {
  state = { users: List() };

  async componentDidMount() {
    const res = await fetch('/api/users', {
      headers: {
        authorization: this.props.token,
      },
    });
    const json = await res.json();
    this.setState({ users: fromJS(json.data) });
  }
  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <div>Users page</div>
        {this.state.users.map(user => (
          <div key={user.get('id')}>{user.get('username')}</div>
        ))}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  id: state.get('id'),
  token: state.get('token'),
});

export default connect(mapStateToProps)(Users);
