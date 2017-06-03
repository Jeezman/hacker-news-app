import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },

  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
]

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {

  constructor (props) {
    super(props);

    //app component's state
    this.state = {
      list,
      searchTerm: '',
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  };

  //removes the clicked item
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList }); //updates the list in the state
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    }); 
  }

  render() {
    var helloWorld = 'Welcome to React, bigtobz!';
    var user = {
      firstname: 'Olutobi Adeyemi',
      age: 26
    };
    //using destructuring to access the state
    const { searchTerm, list } = this.state;
    return (
      <div className="page">
          <div className="interactions">
            <h2>{helloWorld}</h2>
            <p> {`Hey ${user.firstname}, I hear you are ${user.age} years old, right?`} </p>
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
            >
              Search
            </Search>
          </div>
          <Table 
            list={list}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
          
      </div>
    );
  }
}

//search component
const Search = ({ value, onChange, children }) =>
    <form>
      {children} <input
        type='text'
        value={value}
        onChange={onChange}
      />
    </form>
const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};
//table component
const Table = ({ list, pattern, onDismiss }) =>
    <div className="table">
      { list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.points}</span>
          <span style={smallColumn}>
            <Button className="button-inline" onClick={() => onDismiss(item.objectID)}>
              Dismiss
            </Button>
          </span>
        </div>
      )}
    </div>


//button component
const Button = ({ onClick, className='', children }) =>
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>

export default App;
