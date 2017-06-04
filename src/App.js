import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },

//   {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   }
// ]

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

console.log(url);


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
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  };

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  //removes the clicked item
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ result: {...this.state.result, hits: updatedHits} }); //updates the list in the state
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    }); 
  }

  render() {
    //using destructuring to access the state
    const { searchTerm, result } = this.state;

    if (!result) { return null; }

    return (
      <div className="page">
          <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
            >
              Search
            </Search>
          </div>
          <Table 
            list={result.hits}
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
        <div className="table-row">
          <span style={largeColumn}>
            <a href>{}</a>
          </span>
          <span style={midColumn}>{}</span>
          <span style={smallColumn}>{}</span>
          <span style={smallColumn}>{}</span>
          <span style={smallColumn}>
            <Button className="button-inline" onClick={() => onDismiss()}>
              Dismiss
            </Button>
          </span>
        </div>
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
