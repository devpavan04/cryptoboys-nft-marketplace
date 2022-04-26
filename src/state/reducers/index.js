import { combineReducers } from "redux";
import userReducer from "./userReducer";
import ownedAssetsReducer from "./ownedAssetsReducer";
import ownedCollectionReducer from "./ownedCollectionReducer";
import favoriteAssetsReducer from "./favoriteAssetsReducer";
import collectionReducer from "./collectionReducer";

const reducers = combineReducers({
  user : userReducer,
  ownedAssets : ownedAssetsReducer,
  ownedCollections: ownedCollectionReducer,
  favoriteAssets: favoriteAssetsReducer,
  collection: collectionReducer
});

export default reducers;
