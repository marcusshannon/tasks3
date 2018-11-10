import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS, List, Map, OrderedMap } from 'immutable';

class Home extends Component {
  state = {
    tasks: Map(),
  };
  async componentDidMount() {
    this.fetchTasks();
  }

  async fetchTasks() {
    let tasks = await fetch('/api/tasks', {
      headers: {
        authorization: this.props.token,
      },
    });
    tasks = await tasks.json();
    tasks = fromJS(tasks.data).reduce(
      (acc, task) => acc.set(task.get('id'), task),
      Map(),
    );
    this.setState({ tasks });
  }

  render() {
    console.log(this.state);
    if (this.state.loading) {
      return <div>loading...</div>;
    }
    return (
      <React.Fragment>
        <button
          onClick={() => this.props.history.push('/home')}
          className="bg-blue rounded text-white p-3"
        >
          Return home
        </button>
        <div className="text-xl text-center mb-2">All Tasks</div>
        <div>
          {this.state.tasks.toList().map(task => (
            <div
              key={task.get('id')}
              className="rounded shadow border mb-3 overflow-hidden p-3"
            >
              <div className="text-lg mb-1">{task.get('title')}</div>
              <div className="mb-2 text-grey-dark">
                {task.get('description')}
              </div>
              <div className="text-sm mb-1">Minutes: {task.get('time')}</div>
              <div className="text-sm mb-1">
                Assigned to: {task.getIn(['user', 'username'])}
              </div>
              {task.get('complete') && (
                <div className="text-sm text-green mb-1">Completed!</div>
              )}
              {!task.get('complete') && (
                <div className="text-sm text-red mb-1">Uncomplete</div>
              )}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  id: state.get('id'),
  token: state.get('token'),
});

export default connect(mapStateToProps)(Home);
