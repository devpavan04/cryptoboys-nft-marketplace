const initialState = "";

const collectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_COLLECTION":
      return (state = action.payload);
    case "FETCH_COLLECTION":
      console.log(action.payload);
      return (state = action.payload);
    default:
      return state;
  }
};

export default collectionReducer;
