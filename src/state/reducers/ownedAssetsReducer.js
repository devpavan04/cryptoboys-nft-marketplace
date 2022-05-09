const initialState = [];

const ownedAssetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_OWNED_ASSETS":
      return (state = action.payload);
    default:
      return state;
  }
};

export default ownedAssetsReducer;
