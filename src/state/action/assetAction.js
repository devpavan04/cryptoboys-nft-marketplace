import axios from "axios";

export const setAsset = (asset) => {
  return {
    type: "SET_ASSET",
    payload: asset,
  };
};

export const fetchAsset = (id) => {
  return async (dispatch) => {
    return await axios
      .get(`${process.env.REACT_APP_API_URL}/assets/get-asset?id=${id}`)
      .then((res) => {
        dispatch({
          type: "FETCH_ASSET",
          payload: res.data,
        });
        return res.data;
      })
      .catch((e) => {
        throw e;
      });
  };
};
