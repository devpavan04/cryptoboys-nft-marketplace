const initialState = '';

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ASSET':
      return (state = action.payload);
    case 'FETCH_ASSET':
      return (state = action.payload);
    default:
      return state;
  }
};

export default assetReducer;
