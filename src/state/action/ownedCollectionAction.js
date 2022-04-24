import axios from "axios";

export const getOwnedCollection = (id) => {
  return async (dispatch) => {
    return await axios
      .get(`${process.env.REACT_APP_API_URL}/users/owned-collections?id=${id}`)
      .then((res) => {
        dispatch({
          type: "FETCH_OWNED_COLLECTION",
          payload: res.data.ownedCollections,
        });
      })
      .catch((e) => {
        throw e.response.data.message;
      });
  };
};
