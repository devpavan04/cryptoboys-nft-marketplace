import axios from "axios";

export const getOwnedAsset = (id) => {
  return async (dispatch) => {
    return await axios
      .get(`${process.env.REACT_APP_API_URL}/users/owned-assets?id=${id}`)
      .then((res) => {
        dispatch({
          type: "FETCH_OWNED_ASSETS",
          payload: res.data.ownedAssets,
        });
      })
      .catch((e) => {
        throw e.response.data.message;
      });
  };
};
