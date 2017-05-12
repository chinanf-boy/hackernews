import React, { Component } from 'react';
import logo from './logo.svg'
import './App.css';

const DEFAULT_QUERY = 'redux'; const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '10';
const PATH_BASE = 'https://hn.algolia.com/api/v1'; const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const More = 'More';
//const Web_Site = 'http://llever.com/example/build'

class App extends Component {
  constructor(props) { super(props);
    this.state = {
      results: null,
      searchKey: '', searchTerm: DEFAULT_QUERY,
    };
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this); this.setSearchTopstories = this.setSearchTopstories.bind(this); this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this); this.onSearchChange = this.onSearchChange.bind(this); this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this); this.ScrollEvent = this.ScrollEvent.bind(this); }
    componentDidMount() {
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm }); this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
      window.addEventListener("scroll", this.ScrollEvent, false);
    }
    setSearchTopstories(result) {
      const { hits, page } = result;
      const { searchKey, results } = this.state;
      const oldHits = results && results[searchKey] ? results[searchKey].hits
      : [];
      const updatedHits = [ ...oldHits, ...hits
      ];
      this.fetchtime = 0;
      this.setState({ results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    }); }
    ScrollEvent() {
      const {
      searchTerm,
      results,
      searchKey
    } = this.state;
    const page = (
      results && results[searchKey] && results[searchKey].page
    ) || 0;
        var wScrollY = window.scrollY; // 当前滚动条位置
        var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）
        var bScrollH = document.body.scrollHeight; // 滚动条总高度
        let isfetch = 0;
        if (wScrollY + wInnerH >= bScrollH - 200) {
            //你需要做的动作
            if(!this.fetchtime){
            this.fetchSearchTopstories(searchKey, page + 1);
            this.fetchtime = 1;
            }
      }}
    fetchSearchTopstories(searchTerm, page) { fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
    }
    needsToSearchTopstories(searchTerm) { return !this.state.results[searchTerm];
    }
    onSearchChange(event) {
      this.setState({ searchTerm: event.target.value });
    }
    onSearchSubmit(event) {
      const { searchTerm } = this.state; this.setState({ searchKey: searchTerm });
      if (this.needsToSearchTopstories(searchTerm)) { this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
      }
      event.preventDefault();
    }
    onDismiss(id) {
      const { searchKey, results } = this.state; const { hits, page } = results[searchKey];
      const isNotId = item => item.objectID !== id; const updatedHits = hits.filter(isNotId);
      this.setState({ results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    }); }
    render() { const {
      searchTerm,
      results,
      searchKey
    } = this.state;
    const page = (
      results && results[searchKey] && results[searchKey].page
    ) || 0;
    const list = (
      results && results[searchKey] && results[searchKey].hits
    ) || [];
    return (
      <div className="page">
        <div className="App">
          <div className="App-header">
            <img src={logo} alt="logo" className="App-logo"/>
          <h2>welcome to React hacknews</h2>
          <div className="interactions">
            <Search
              value={searchTerm} onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit} >
              Search
            </Search>
          </div>
          </div>

        </div>

        <Table
          list={list} onDismiss={this.onDismiss}
        />
        <div className="interactions">
        { (results && results[searchKey] && results[searchKey])?
          <Loading></Loading>
          : <Loading></Loading>
        }
        </div>
      </div>
    )
  } }
  const Loading = () => <h1>Loading...</h1>;
  
    const Search = ({ value,
      onChange,
      onSubmit,
      children
    }) =>
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>;
const Table = ({ list, onDismiss }) => <div className="table">
      { list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}></a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div> )}
</div>;
      const Button = ({ onClick, className = '', children }) => <button
        onClick={onClick}
        className={className}
        type="button"
        > {children} </button>;

      export default App;
