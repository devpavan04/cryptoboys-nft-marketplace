const initialState = [];

const favoriteAssetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_FAVORITE_ASSETS":
      return (state = action.payload);
    default:
      return state;
  }
};

export default favoriteAssetsReducer;
