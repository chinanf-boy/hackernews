import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*const list = [
{
  title: 'React',
  url: 'https://facebook.github.io/react/',
  author: 'yobrave',
  num_comments: 3,
  points: 4,
  objectID: 0,
},
{
  title: 'Redux',
  url: 'https://github.io/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
},
{
  title: 'Redux',
  url: 'https://github.io/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 2,
},
{
  title: 'Redux',
  url: 'https://github.io/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 3,
},
{
  title: 'Redux',
  url: 'https://github.io/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 4,
},
];*/


const largeColumn = {
  width:'40%',
};

const midColumn = {
  width:'30%',
};

const smallColumn ={
  width:'10%',
};

const DEFAULT_QUERY = 'react redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '10';

const PATH_BASE ='https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

var url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY +'&' +PARAM_PAGE;


function isSearched(searchTerm) {
  return function(item) {
return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase())}
}

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchKey:'',
      searchTerm: DEFAULT_QUERY,
    };

    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  needsToSearchTopstories(searchTerm){
    return !this.state.results[searchTerm];
  }

  setSearchTopstories(result){
    const {hits, page} = result;
    const {searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

    const updatedHits = [...oldHits, ...hits];


    this.setState({
      results:{ ...results,
        [searchKey]: { hits:updatedHits , page} }
    });
  }

  fetchSearchTopstories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount(){
    const {searchTerm } = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id){
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;

    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopstories(searchTerm))
    {
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault();
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
    console.log(this.state.searchTerm);

  }

  render() {
    const {
      searchTerm,
      results,
      searchKey
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
      ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    const img_s = smallColumn;
    img_s.float = "left";
    img_s.width = "9%";
    img_s.minWidth = "68px";

    return (
      <div className="page">
        <div className='interactions'>
          <img style={ img_s } src={logo} alt="pictuce"></img>
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        { results &&
          <Table
            list={list}
            onDismiss={this.onDismiss}
            />

        }
        <div className="interactions">
          {  results ?
            <Button onClick={()=> this.fetchSearchTopstories(searchKey, page+1)}>
              More
            </Button>
            :
            <Loading></Loading>
          }
        </div>

      </div>
    );
  }
}

const Loading = () =>
  <h2>Loading...</h2>

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">{children}</button>
</form>


const Table = ({ list, onDismiss }) =>
      <div className='table'>
      {
        list.map(item =>
            <div key={item.objectID} className='table-row'>
            <span style={largeColumn}>
            <a href={item.url}>
            {item.title}
            </a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button  onClick={()=> onDismiss(item.objectID)} className='button-inline'>Dismiss</Button>
            </span>
            </div>
        )}

       </div>

const Button = ({ onClick, className='', children}) =>
      <button
      onClick={onClick} className={className} type="button"
      >
      {children}
      </button>

export default App;

export {
  Button,
  Search,
  Table,
};
