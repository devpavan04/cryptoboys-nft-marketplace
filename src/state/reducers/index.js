import { combineReducers } from "redux";
import userReducer from "./userReducer";
import ownedAssetsReducer from "./ownedAssetsReducer";
import ownedCollectionReducer from "./ownedCollectionReducer";
import favoriteAssetsReducer from "./favoriteAssetsReducer";
import collectionReducer from "./collectionReducer";
import assetReducer from "./assetReducer";

const reducers = combineReducers({
  user : userReducer,
  ownedAssets : ownedAssetsReducer,
  ownedCollections: ownedCollectionReducer,
  favoriteAssets: favoriteAssetsReducer,
  collection: collectionReducer,
  asset: assetReducer
});

export default reducers;
