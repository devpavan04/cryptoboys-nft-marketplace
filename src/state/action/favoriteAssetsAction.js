import axios from "axios";

export const getFavoriteAsset = (id) => {
  return async (dispatch) => {
    return await axios
      .get(`${process.env.REACT_APP_API_URL}/users/favorite-assets?id=${id}`)
      .then((res) => {
        dispatch({
          type: "FETCH_FAVORITE_ASSETS",
          payload: res.data.favoriteAssets,
        });
      })
      .catch((e) => {
        throw e.response.data.message;
      });
  };
};
