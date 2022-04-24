import { combineReducers } from "redux";
import userReducer from "./userReducer";
import ownedAssetsReducer from "./ownedAssetsReducer";
import ownedCollectionReducer from "./ownedCollectionReducer";
import favoriteAssetsReducer from "./favoriteAssetsReducer";

const reducers = combineReducers({
  user : userReducer,
  ownedAssets : ownedAssetsReducer,
  ownedCollections: ownedCollectionReducer,
  favoriteAssets: favoriteAssetsReducer
});

export default reducers;
