import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  search() {
    this.props.onSearch(this.state.searchTerm);
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter a song, album, or artist"
          onChange={this.handleTermChange} />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
