import { atom, selector, selectorFamily, atomFamily } from "recoil";

export const gamesState = atom({
  key: "GamesState",
  default: [],
});

export const foundTracksState = atom({
  key: "FoundTracksState",
  default: [],
});

export const gameByIdState = selectorFamily({
  key: "GameByIdState",
  get:
    (gameId) =>
    ({ get }) => {
      const games = get(gamesState);
      return games.find((game) => game.id === gameId) || null;
    },
});

// export const userEmailState = atom({
//   key: "UserEmailState",
//   default: "",
// });

export const userSpotifyAccountState = atom({
  key: "userSpotifyAccountState",
  default: null,
});

export const screenDisplayedState = atom({
  key: "ScreenDisplayedState",
  default: "start",
});

export const rulesState = atom({
  key: "RulesState",
  default: {
    playlistName: "",
    songsPerTurn: 2,
    streamsMore: false,
    streamsLimit: 1,
    repeatedArtist: false,
    monthleyListenersMore: false,
    monthleyListenersLimit: 1,
  },
});

export const songsPerTurnState = selector({
  key: "SongsPerTurnState",
  get: ({ get }) => {
    const rules = get(rulesState);
    return rules.songsPerTurn;
  },
});

export const selectedSongsState = atom({
  key: "SelectedSongsState",
  default: [],
});

export const categorizedGamesState = atomFamily({
  key: "categorizedGamesState",
  default: selectorFamily({
    key: "categorizedGamesState/Default",
    get:
      (category) =>
      ({ get }) => {
        const games = get(gamesState);
        console.log("RECOIL", games);
        const userEmail = get(userEmailState);
        console.log("recoil", userEmail);

        if (category === "suggested") {
          return games.filter((game) => game.reciever_email === userEmail && game.status === "pending");
        } else if (category === "pending") {
          return games.filter((game) => game.sender_email === userEmail && game.status === "pending");
        } else if (category === "active") {
          return games.filter((game) => game.status === "active");
        }
        return [];
      },
  }),
});

export const songsWithDuplicateArtistsState = atom({
  key: "SongsWithDuplicateArtistsState",
  default: [],
});

export const songsWithNonCompliantPopularityState = atom({
  key: "SongsWithNonCompliantPopularityState",
  default: [],
});

export const selectedGameState = atom({
  key: "SelectedGameState",
  default: null,
});

export const userPlaylistsState = atom({
  key: "UserPlaylistsState",
  default: [],
});

export const userQueryState = atom({
  key: "UserQueryState",
  default: "",
});

export const alreadySelectedSongsState = atom({
  key: "AlreadySelectedSongsState",
  default: [],
});

export const isUsersReplyState = atom({
  key: "IsUsersReplyState",
  default: false,
});
