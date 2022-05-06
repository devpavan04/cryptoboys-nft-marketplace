import axios from 'axios';

export const login = (walletAddress) => {
  return async (dispatch) => {
    return await axios
      .post(`${process.env.REACT_APP_API_URL}/users/login`, {
        walletAddress: walletAddress,
      })
      .then((res) => {
        dispatch({
          type: 'FETCH_USER',
          payload: res.data,
        });
      })
      .catch((e) => {
        throw e;
      });
  };
};

export const update = (user) => {
  return async (dispatch) => {
    return await axios
      .put(`${process.env.REACT_APP_API_URL}/users/update`, {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
      })
      .then((res) => {
        dispatch({
          type: 'UPDATE_USER',
          payload: user,
        });
      })
      .catch((e) => {
        throw e.response.data.message;
      });
  };
};
