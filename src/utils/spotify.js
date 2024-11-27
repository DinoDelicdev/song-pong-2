export const getUserData = async (session) => {
  let user = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token.access_token}`,
    },
  });

  let userData = await user.json();

  return userData;
};

export const checkIfUsersTurn = (userEmail, players) => {
  if (userEmail === players[0]) {
    return true;
  }
  return false;
};

export const getSongsFromSpotifyPlaylist = async (session, playlistId) => {
  console.log("Session", session);
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token.access_token}`,
    },
  });

  const data = await response.json();
  return data;
};

export const searchSpotifyTracks = async (session, query) => {
  const url = `https://api.spotify.com/v1/search?q=${query}&type=track`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token.access_token}`,
    },
  });

  const data = await response.json();
  return data;
};

export const formatSongData = (song) => {
  return {
    id: song.id,
    name: song.name,
    duration: song.duration_ms,
    popularity: song.popularity,
    uri: song.uri,
    link: song.external_urls.spotify,
    artist: song.artists.map((artist) => {
      return {
        id: artist.id,
        name: artist.name,
      };
    }),
    album: song.album.name,
  };
};

export const getUserPlaylists = async (session, userId) => {
  console.log("Session", session);
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token.access_token}`,
    },
  });

  const data = await response.json();
  return data.items.filter((playlist) => playlist.description !== "Song Pong playlist");
};
