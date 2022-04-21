const initialState = "";

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SUCCESS":
      return (state = action.payload);
    case "UPDATE":
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
