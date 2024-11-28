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

////////// RULES

export const checkIfSongsComplyWithRules = (songs, existingSongs = [], rules) => {
  // SONGS PER TURN RULE
  if (songs.length !== rules.songsPerTurn) {
    return {
      complies: false,
      reason: "songs-per-turn",
      message: `You have only selected ${songs.length} songs, and you need to select ${rules.songsPerTurn}`,
    };
  }

  // DUPLICATE ARTIST RULE

  if (!rules.repeatedArtist) {
    let artists = [...songs, ...existingSongs]
      .map((song) => {
        if (song.artist.length === 1) {
          return song.artist[0].name;
        } else {
          return song.artist.map((artist) => artist.name);
        }
      })
      .flat();

    let duplicates = findDuplicates(artists);

    let songsWithDuplicates = checkIfSongsHaveDuplicateArtist(songs, duplicates);
    if (songsWithDuplicates.length) {
      return {
        complies: false,
        songWithDuplicates: songsWithDuplicates,
        reason: "duplicate",
        message: `Duplicate artist ${songsWithDuplicates[0].double} for songs: ${songsWithDuplicates.reduce((acc, song, index) => {
          if (index === 0) {
            return acc + song.name;
          }
          return acc + " , " + song.name;
        }, "")}`,
      };
    }
  }

  // POPULARITY RULE

  let songsThatDontComplyWithPopularity = checkIfSongsComplyWithPopularityRules(songs, rules);
  if (songsThatDontComplyWithPopularity.length) {
    return {
      complies: false,
      songsWithPopularity: songsThatDontComplyWithPopularity,
      reason: "popularity",
      message: `Following Songs don't have stream number ${rules.streamsMore ? "more" : "less"} then ${rules.streamsLimit}: 
      ${songsThatDontComplyWithPopularity.reduce((acc, song, index) => {
        if (index === 0) {
          return acc + song.name + " " + "(" + song.streams + ")";
        }
        return acc + " , " + song.name;
      }, "")}`,
    };
  }

  return {
    complies: true,
    message: "Everithing OK",
  };
};

const findDuplicates = (array) => {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
};

const haveCommonElements = (array1, array2) => {
  const set1 = new Set(array1);

  for (const item of array2) {
    if (set1.has(item)) {
      return { isDuplicate: true, artist: item };
    }
  }

  return false;
};

const checkIfSongsHaveDuplicateArtist = (songs, duplicates) => {
  return songs.reduce((acc, song) => {
    const artists = song.artist.map((artist) => artist.name);
    const duplicateArtists = haveCommonElements(artists, duplicates);
    if (duplicateArtists.isDuplicate) {
      acc.push({ ...song, double: duplicateArtists.artist });
    }
    return acc;
  }, []);
};

export const checkPopularityRuleForSingleSong = (song, rules) => {
  let popularityCheckPassed = rules.streamsMore ? song.streams >= rules.streamsLimit : song.streams <= rules.streamsLimit;

  return popularityCheckPassed;
};

const checkIfSongsComplyWithPopularityRules = (songs, rules) => {
  let songsThatDontComplyWithPopularityRules = songs
    .map((song) => {
      if (!checkPopularityRuleForSingleSong(song, rules)) {
        return song;
      } else {
        return null;
      }
    })
    .filter((song) => song !== null);

  return songsThatDontComplyWithPopularityRules;
};
