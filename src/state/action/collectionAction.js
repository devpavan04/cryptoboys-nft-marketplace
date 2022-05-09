import axios from "axios";

export const setCollection = (collection) => {
  return {
    type: "SET_COLLECTION",
    payload: collection,
  };
};

export const fetchCollection = (id) => {
  return async (dispatch) => {
    return await axios
      .get(
        `${process.env.REACT_APP_API_URL}/collections/get-collection?id=${id}`
      )
      .then((res) => {
        dispatch({
          type: "FETCH_COLLECTION",
          payload: res.data,
        });
        console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        throw e;
      });
  };
};
