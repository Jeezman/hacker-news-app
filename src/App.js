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
const DEFAULT_PAGE = 0;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

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
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  };

  setSearchTopstories(result) {
    //get hits and page from result
    const { hits, page } = result;

    //check if there are old hits
    //new search request when page is 0;
    const oldHits = page !== 0
     ? this.state.result.hits
     : [];

    //merge old and new hits from recent API request
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    //set the merged hits and page in the state
    this.setState({ 
      result: { hits: updatedHits, page }
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
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

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
    event.preventDefault();
  }

  render() {
    //using destructuring to access the state
    const { searchTerm, result } = this.state;
    const page = ( result && result.page ) || 0;

    if (!result) { return null; }

    return (
      <div className="page">
          <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
              onSearchSubmit = {this.onSearchSubmit}
            >
              Search
            </Search>
          </div>
          { result 
            ? 
            <Table 
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
            :
            null
          }
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopstories(searchTerm, page + 1)}>
              More
            </Button>
          </div>
          
      </div>
    );
  }
}

//search component
const Search = ({ value, onChange, children, onSubmit }) =>
    <form onSubmit={onSubmit} >
      <input
        type='text'
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
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
      { list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.points}</span>
          <span style={smallColumn}>
            <Button className="button-inline" onClick={() => onDismiss()}>
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
