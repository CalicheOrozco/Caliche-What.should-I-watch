export const GENRE_IDS = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Horror: 27,
  Romance: 10749,
  "Sci-Fi": 878,
  Animation: 16,
  Thriller: 53,
};

// TV genre IDs differ for Action and Sci-Fi
export const TV_GENRE_IDS = {
  Action: 10759,    // Action & Adventure
  Comedy: 35,
  Drama: 18,
  Horror: 27,
  Romance: 10749,
  "Sci-Fi": 10765,  // Sci-Fi & Fantasy
  Animation: 16,
  Thriller: 53,
};

export const MOOD_TO_GENRES = {
  "Fun/Relaxed": [35, 16],
  "Intense/Thrilling": [28, 53, 27],
  Emotional: [18, 10749],
  "Surprise Me": [],
};

export const TV_MOOD_TO_GENRES = {
  "Fun/Relaxed": [35, 16],
  "Intense/Thrilling": [10759, 53, 27],
  Emotional: [18, 10749],
  "Surprise Me": [],
};

export const WHO_WITH_TO_GENRES = {
  Solo: [],
  "With partner": [10749, 18],
  "With friends": [28, 35],
  "With family": [10751, 16],
};

export const TV_WHO_WITH_TO_GENRES = {
  Solo: [],
  "With partner": [10749, 18],
  "With friends": [10759, 35],
  "With family": [10751, 16],
};
