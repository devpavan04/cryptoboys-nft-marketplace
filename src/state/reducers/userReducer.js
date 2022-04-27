const initialState = '';

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_USER':
      return (state = action.payload);
    case 'UPDATE_USER':
      const { name, email, bio } = action.payload;
      state.name = name;
      state.email = email;
      state.bio = bio;
      return state;
    default:
      return state;
  }
};

export default userReducer;
