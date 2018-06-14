import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';

import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playlistName: 'My Playlist',
      searchResults: [],
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(newTrack) {
    const tracks = this.state.playlistTracks;
    const trackCheck = tracks.find(t => t.id === newTrack.id);

    if(!trackCheck) {
      tracks.push(newTrack);
      this.setState({ playlistTracks: tracks });
    }
  }

  removeTrack(leavingTrack) {
    const tracks = this.state.playlistTracks;
    const filteredTracks = tracks.filter(t => t.id !== leavingTrack.id);

    this.setState({playlistTracks: filteredTracks});
  }

  savePlaylist() {
    const playlistTracks = this.state.playlistTracks;
    const trackURIs = playlistTracks.map(t => t.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then(() => this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
    }));
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
    .then(tracks => {
      console.log(tracks);
      this.setState({searchResults: tracks});
    });
  }

  updatePlaylistName(newName) {
    this.setState({playlistName: newName});
  }

  render () {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing Too</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              addTrack={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              tracks={this.state.playlistTracks}
              removeTrack={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
