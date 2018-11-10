import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS, List, Map, OrderedMap } from 'immutable';

class Home extends Component {
  state = {
    users: List(),
    tasks: Map(),
    title: '',
    description: '',
    userId: this.props.id,
  };
  async componentDidMount() {
    this.fetchTasks();
    this.fetchUsers();
  }

  fetchUsers = async () => {
    let users = await fetch('/api/users', {
      headers: {
        authorization: this.props.token,
      },
    });
    users = await users.json();
    this.setState({ users: fromJS(users.data) });
  };

  fetchTasks = async () => {
    let tasks = await fetch(`/api/users/${this.props.id}/tasks`, {
      headers: {
        authorization: this.props.token,
      },
    });
    tasks = await tasks.json();
    tasks = fromJS(tasks.data).reduce(
      (acc, task) => acc.set(task.get('id'), task),
      OrderedMap(),
    );
    this.setState({ tasks });
  };

  onLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.props.dispatch({ type: 'LOG_OUT' });
  };

  onNewTask = async () => {
    const tasksPromise = fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.props.token,
      },
      body: JSON.stringify({
        task: {
          user_id: this.state.userId,
          title: this.state.title,
          description: this.state.description,
        },
      }),
    });
    this.setState({ title: '', description: '' });
    await tasksPromise;
    this.fetchTasks();
  };

  handleInc = taskId => {
    fetch(`/api/tasks/${taskId}/increment`, {
      headers: {
        authorization: this.props.token,
      },
    });
    this.setState(prevState => ({
      tasks: prevState.tasks.updateIn([taskId, 'time'], time => time + 15),
    }));
  };

  handleDec = taskId => {
    fetch(`/api/tasks/${taskId}/decrement`, {
      headers: {
        authorization: this.props.token,
      },
    });
    this.setState(prevState => ({
      tasks: prevState.tasks.updateIn([taskId, 'time'], time =>
        Math.max(0, time - 15),
      ),
    }));
  };

  handleDelete = taskId => {
    fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        authorization: this.props.token,
      },
    });
    this.setState(prevState => ({ tasks: prevState.tasks.delete(taskId) }));
  };

  handleComplete = taskId => {
    fetch(`/api/tasks/${taskId}/complete`, {
      headers: {
        authorization: this.props.token,
      },
    });
    this.setState(prevState => ({
      tasks: prevState.tasks.updateIn(
        [taskId, 'complete'],
        complete => !complete,
      ),
    }));
  };

  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <button
          onClick={this.onLogOut}
          className="bg-blue rounded text-white p-3 mr-2"
        >
          log out
        </button>
        <button
          onClick={() => this.props.history.push('/tasks')}
          className="bg-blue rounded text-white p-3"
        >
          View all tasks
        </button>
        <div className="text-xl text-center mb-2">Your tasks:</div>
        <div className="mb-5">
          {this.state.tasks.toList().map(task => (
            <div
              key={task.get('id')}
              className="rounded shadow border mb-3 overflow-hidden"
            >
              <div className="p-3">
                <div className="text-lg mb-1">{task.get('title')}</div>
                <div className="mb-2 text-grey-dark">
                  {task.get('description')}
                </div>
                <div className="text-sm">
                  <div className="mr-1 inline-block">
                    Minutes: {task.get('time')}
                  </div>
                  <button
                    className="inline-block bg-green mr-1 text-white rounded-full h-4 w-4"
                    onClick={() => this.handleInc(task.get('id'))}
                  >
                    +
                  </button>
                  <button
                    className="inline-block bg-red mr-1 text-white rounded-full h-4 w-4"
                    onClick={() => this.handleDec(task.get('id'))}
                  >
                    -
                  </button>
                </div>
              </div>
              <div className="flex">
                {task.get('complete') && (
                  <button
                    className="flex-1 text-green border border-green bg-green-lightest p-3"
                    onClick={() => this.handleComplete(task.get('id'))}
                  >
                    Mark task as uncomplete
                  </button>
                )}
                {!task.get('complete') && (
                  <button
                    className="flex-1 text-grey border border-grey p-3"
                    onClick={() => this.handleComplete(task.get('id'))}
                  >
                    Mark task as complete
                  </button>
                )}
                <button
                  className="flex-1 text-red p-3 border border-red"
                  onClick={() => this.handleDelete(task.get('id'))}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-grey-lightest shadow rounded p-3 mb-4">
          <div>
            <input
              type="text"
              placeholder="title"
              value={this.state.title}
              onChange={e => this.setState({ title: e.target.value })}
              className="rounded border p-2 mb-2 w-full"
            />
          </div>
          <div>
            <textarea
              placeholder="description"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
              className="rounded border p-2 mb-2 w-full"
            />
          </div>
          <div className="border rounded flex mb-2">
            <div className="bg-purple text-white inline-block p-2">
              Assign to:{' '}
            </div>
            <select
              onChange={e => this.setState({ userId: e.target.value })}
              value={this.state.userId}
              className="flex-grow"
            >
              {this.state.users.map(user => (
                <option key={user.get('id')} value={user.get('id')}>
                  {user.get('username')}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-green p-3 text-white rounded w-full hover:bg-green-dark"
            onClick={this.onNewTask}
          >
            Create new Task
          </button>
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
