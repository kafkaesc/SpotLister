let userAccessToken = '';
const clientID = 'b7517ae8fc8b4e79bb0889785197bc4e';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if(userAccessToken)
      return userAccessToken;

    const url = window.location.href;
    const access_token = url.match(/access_token=([^&]*)/);
    const expires_in = url.match(/expires_in=([^&]*)/);

    if(access_token && expires_in) {
      userAccessToken = access_token[1];
      const expirationTime = Number(expires_in[1]) * 1000;
      window.setTimeout(() => userAccessToken = '', expirationTime);
      window.history.pushState('access token', '', '/');
      return userAccessToken;
    }
    else {
      window.location.href =
        "https://accounts.spotify.com/authorize?client_id=" + clientID +
        "&response_type=token&scope=playlist-modify-public&redirect_uri=" +
        redirectURI;
    }
  },

  savePlaylist(name, trackURIs) {
    if(!name || !trackURIs)
      return;

    const accessToken = this.getAccessToken();

    return fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.id)
    .then(userID => {
      return fetch('https://api.spotify.com/v1/users/' + userID + '/playlists', {
        headers: { Authorization: 'Bearer ' + accessToken },
        body: JSON.stringify({name: name}),
        method: 'POST'
      })
      .then(response => response.json())
      .then(jsonResponse => {
        const playlistID = jsonResponse.id;
        const addSongURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
        fetch(addSongURL, {
          headers: { Authorization: 'Bearer ' + accessToken },
          body: JSON.stringify({uris: trackURIs}),
          method: 'POST'
        });
      })
    });
  },

  search(term) {
    const accessToken = this.getAccessToken();
    const endpoint = 'https://api.spotify.com/v1/search?type=track&q=' + term;
    return fetch(endpoint, {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);
      if(!jsonResponse.tracks)
        return [];

      return jsonResponse.tracks.items.map(t => {
        return {
          id: t.id,
          name: t.name,
          artist: t.artists[0].name,
          album: t.album.name,
          uri: t.uri
        };
      });
    });
  }
};

export default Spotify;
