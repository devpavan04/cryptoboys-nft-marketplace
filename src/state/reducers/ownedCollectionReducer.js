const initialState = [];

const ownedCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_OWNED_COLLECTION":
      return (state = action.payload);
    default:
      return state;
  }
};

export default ownedCollectionReducer;
