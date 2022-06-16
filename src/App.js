import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import LayoutIndex from "./page";
import "./style/index.css";
import Login from "./components/Login/index";
import AccountSettings from "./components/AccountSettings/index";
import Account from "./components/Account/index";
import MyAccount from "./components/Account/MyAccount";
import PrivateRoute from "./PrivateRoute";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import Container from "./page/Container";
import MintAsset from "./components/Form/MintAsset";
import EditAsset from "./components/Form/EditAsset";
import NFTDetails from "./components/NFTDetails";
import Explore from "./components/Explore";
import Listing from "./components/Listing";
import PageNotFound from "./components/Common/PageNotFound";
import ErrorPage from "./components/Common/ErrorPage";
import SuccessPage from "./components/Common/SuccessPage";
import Collection from "./components/Collection/index";
import CreateCollection from "./components/Form/CreateCollection";
import EditCollection from "./components/Form/EditCollection";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./state/action/userAction";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const checkLoggedIn = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const address = await signer.getAddress();
      if (address == null) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
};

const customToastID = "mainToast";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
      changedAccount();
    });
  }

  const changedAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    if (address != null) {
      dispatch(login(address)).catch((err) => {
        toast.error(err);
      });
      toast.success("Account changed successfully", { toastId: customToastID });
      window.location.reload();
    }
  };

  const getUser = async () => {
    if (!user && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      if (address != null) {
        dispatch(login(address));
      }
    }
  };

  useEffect(() => {
    checkLoggedIn().then((res) => {
      setLoggedIn(res);
    });

    getUser();
  }, []);

  return (
    <BrowserRouter basename="/">
      <Container auth={loggedIn}>
        <ToastContainer
          limit={1}
          autoClose={2000}
          position="bottom-right"
          theme="dark"
        />
        <Switch>
          <Route path="/" exact render={() => <LayoutIndex.Homepage />} />
          <Route path="/login" render={() => <Login />} />
          <Route path="/account/:id" exact render={() => <Account />} />
          <Route path="/my-account" exact render={() => <MyAccount />} />
          <Route path="/settings" render={() => <AccountSettings />} />
          <Route path="/mint" render={() => <MintAsset />} />
          <Route path="/assets/:id" exact render={() => <NFTDetails />} />
          <Route path="/assets/edit/:id" exact render={() => <EditAsset />} />
          <Route path="/explore" render={() => <Explore />} />
          <Route
            path="/collection/create"
            exact
            render={() => <CreateCollection />}
          />
          <Route
            path="/collection/edit/:id"
            exact
            render={() => <EditCollection />}
          />
          <Route path="/collection/:id" exact render={() => <Collection />} />
          <Route path="/listing/:id" exact render={() => <Listing />} />
          <Route path="/error" render={() => <ErrorPage />} />
          <Route path="/success" render={() => <SuccessPage />} />
          <Route render={() => <PageNotFound />} />
          {/* <PrivateRoute path="/account" component={Account} auth={loggedIn} />
        <PrivateRoute
          path="/settings"
          component={AccountSettings}
          auth={loggedIn}
        /> */}
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
