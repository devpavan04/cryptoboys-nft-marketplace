import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
// import CryptoBoys from "./abis/CryptoBoys.json";
import FormAndPreview from "./components/FormAndPreview/FormAndPreview";
import AllCryptoBoys from "./components/AllCryptoBoys/AllCryptoBoys";
import AccountDetails from "./components/AccountSettings";
import ContractNotDeployed from "./components/ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./components/ConnectMetamask/ConnectToMetamask";
import Loading from "./components/Loading/Loading";
import Navbar from "./components/Navbar/Navbar";
import MyCryptoBoys from "./components/MyCryptoBoys/MyCryptoBoys";
import Queries from "./components/Queries/Queries";
import LayoutIndex from "./page";
import "./style/index.css";
import Login from "./components/Login/index";
import AccountSettings from "./components/AccountSettings/index";
import Account from "./components/Account";
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
import Collection from "./components/Collection";
import CreateCollection from "./components/Form/CreateCollection";
import EditCollection from "./components/Form/EditCollection";
import UsersAccount from "./components/Account/UsersAccount";
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
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     accountAddress: "",
  //     accountBalance: "",
  //     cryptoBoysContract: null,
  //     cryptoBoysCount: 0,
  //     cryptoBoys: [],
  //     loading: true,
  //     metamaskConnected: false,
  //     contractDetected: false,
  //     totalTokensMinted: 0,
  //     totalTokensOwnedByAccount: 0,
  //     nameIsUsed: false,
  //     colorIsUsed: false,
  //     colorsUsed: [],
  //     lastMintTime: null,
  //     logIn: false,
  //   };
  // }

  // componentWillMount = async () => {
  //   this.setState({logIn:checkLoggedIn})
  //   // await this.loadWeb3();
  //   // await this.loadBlockchainData();
  //   // await this.setMetaData();
  //   // await this.setMintBtnTimer();
  // };

  //#region Web3
  // setMintBtnTimer = () => {
  //   const mintBtn = document.getElementById("mintBtn");
  //   if (mintBtn !== undefined && mintBtn !== null) {
  //     this.setState({
  //       lastMintTime: localStorage.getItem(this.state.accountAddress),
  //     });
  //     this.state.lastMintTime === undefined || this.state.lastMintTime === null
  //       ? (mintBtn.innerHTML = "Mint My Crypto Boy")
  //       : this.checkIfCanMint(parseInt(this.state.lastMintTime));
  //   }
  // };

  // checkIfCanMint = (lastMintTime) => {
  //   const mintBtn = document.getElementById("mintBtn");
  //   const timeGap = 300000; //5min in milliseconds
  //   const countDownTime = lastMintTime + timeGap;
  //   const interval = setInterval(() => {
  //     const now = new Date().getTime();
  //     const diff = countDownTime - now;
  //     if (diff < 0) {
  //       mintBtn.removeAttribute("disabled");
  //       mintBtn.innerHTML = "Mint My Crypto Boy";
  //       localStorage.removeItem(this.state.accountAddress);
  //       clearInterval(interval);
  //     } else {
  //       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //       const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  //       mintBtn.setAttribute("disabled", true);
  //       mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
  //     }
  //   }, 1000);
  // };

  // loadWeb3 = async () => {
  //   if (window.ethereum) {
  //     window.web3 = new Web3(window.ethereum);
  //   } else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider);
  //   } else {
  //     window.alert(
  //       "Non-Ethereum browser detected. You should consider trying MetaMask!"
  //     );
  //   }
  // };

  // loadBlockchainData = async () => {
  //   // const web3 = window.web3;
  //   // const accounts = await web3.eth.getAccounts();
  //   // if (accounts.length === 0) {
  //   //   this.setState({ metamaskConnected: false });
  //   // } else {
  //   //   this.setState({ metamaskConnected: true });
  //   //   this.setState({ loading: true });
  //   //   this.setState({ accountAddress: accounts[0] });
  //   //   let accountBalance = await web3.eth.getBalance(accounts[0]);
  //   //   accountBalance = web3.utils.fromWei(accountBalance, "Ether");
  //   //   this.setState({ accountBalance });
  //   //   this.setState({ loading: false });
  //   //   const networkId = await web3.eth.net.getId();
  //   //   const networkData = CryptoBoys.networks[networkId];
  //   //   if (networkData) {
  //   //     this.setState({ loading: true });
  //   //     const cryptoBoysContract = web3.eth.Contract(
  //   //       CryptoBoys.abi,
  //   //       networkData.address
  //   //     );
  //   //     this.setState({ cryptoBoysContract });
  //   //     this.setState({ contractDetected: true });
  //   //     const cryptoBoysCount = await cryptoBoysContract.methods
  //   //       .cryptoBoyCounter()
  //   //       .call();
  //   //     this.setState({ cryptoBoysCount });
  //   //     for (var i = 1; i <= cryptoBoysCount; i++) {
  //   //       const cryptoBoy = await cryptoBoysContract.methods
  //   //         .allCryptoBoys(i)
  //   //         .call();
  //   //       this.setState({
  //   //         cryptoBoys: [...this.state.cryptoBoys, cryptoBoy],
  //   //       });
  //   //     }
  //   //     let totalTokensMinted = await cryptoBoysContract.methods
  //   //       .getNumberOfTokensMinted()
  //   //       .call();
  //   //     totalTokensMinted = totalTokensMinted && totalTokensMinted.toNumber();
  //   //     this.setState({ totalTokensMinted });
  //   //     let totalTokensOwnedByAccount = await cryptoBoysContract.methods
  //   //       .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
  //   //       .call();
  //   //     totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
  //   //     this.setState({ totalTokensOwnedByAccount });
  //   //     this.setState({ loading: false });
  //   //   } else {
  //   //     this.setState({ contractDetected: false });
  //   //   }
  //   // }
  // };

  // connectToMetamask = async () => {
  //   await window.ethereum.enable();
  //   this.setState({ metamaskConnected: true });
  //   window.location.reload();
  // };

  // setMetaData = async () => {
  //   if (this.state.cryptoBoys.length !== 0) {
  //     this.state.cryptoBoys.map(async (cryptoboy) => {
  //       const result = await fetch(cryptoboy.tokenURI);
  //       const metaData = await result.json();
  //       this.setState({
  //         cryptoBoys: this.state.cryptoBoys.map((cryptoboy) =>
  //           cryptoboy.tokenId.toNumber() === Number(metaData.tokenId)
  //             ? {
  //                 ...cryptoboy,
  //                 metaData,
  //               }
  //             : cryptoboy
  //         ),
  //       });
  //     });
  //   }
  // };

  // mintMyNFT = async (colors, name, tokenPrice) => {
  //   this.setState({ loading: true });
  //   const colorsArray = Object.values(colors);
  //   let colorsUsed = [];
  //   for (let i = 0; i < colorsArray.length; i++) {
  //     if (colorsArray[i] !== "") {
  //       let colorIsUsed = await this.state.cryptoBoysContract.methods
  //         .colorExists(colorsArray[i])
  //         .call();
  //       if (colorIsUsed) {
  //         colorsUsed = [...colorsUsed, colorsArray[i]];
  //       } else {
  //         continue;
  //       }
  //     }
  //   }
  //   const nameIsUsed = await this.state.cryptoBoysContract.methods
  //     .tokenNameExists(name)
  //     .call();
  //   if (colorsUsed.length === 0 && !nameIsUsed) {
  //     const {
  //       cardBorderColor,
  //       cardBackgroundColor,
  //       headBorderColor,
  //       headBackgroundColor,
  //       leftEyeBorderColor,
  //       rightEyeBorderColor,
  //       leftEyeBackgroundColor,
  //       rightEyeBackgroundColor,
  //       leftPupilBackgroundColor,
  //       rightPupilBackgroundColor,
  //       mouthColor,
  //       neckBackgroundColor,
  //       neckBorderColor,
  //       bodyBackgroundColor,
  //       bodyBorderColor,
  //     } = colors;
  //     let previousTokenId;
  //     previousTokenId = await this.state.cryptoBoysContract.methods
  //       .cryptoBoyCounter()
  //       .call();
  //     previousTokenId = previousTokenId.toNumber();
  //     const tokenId = previousTokenId + 1;
  //     const tokenObject = {
  //       tokenName: "Crypto Boy",
  //       tokenSymbol: "CB",
  //       tokenId: `${tokenId}`,
  //       name: name,
  //       metaData: {
  //         type: "color",
  //         colors: {
  //           cardBorderColor,
  //           cardBackgroundColor,
  //           headBorderColor,
  //           headBackgroundColor,
  //           leftEyeBorderColor,
  //           rightEyeBorderColor,
  //           leftEyeBackgroundColor,
  //           rightEyeBackgroundColor,
  //           leftPupilBackgroundColor,
  //           rightPupilBackgroundColor,
  //           mouthColor,
  //           neckBackgroundColor,
  //           neckBorderColor,
  //           bodyBackgroundColor,
  //           bodyBorderColor,
  //         },
  //       },
  //     };
  //     const cid = await ipfs.add(JSON.stringify(tokenObject));
  //     let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
  //     const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
  //     this.state.cryptoBoysContract.methods
  //       .mintCryptoBoy(name, tokenURI, price, colorsArray)
  //       .send({ from: this.state.accountAddress })
  //       .on("confirmation", () => {
  //         localStorage.setItem(this.state.accountAddress, new Date().getTime());
  //         this.setState({ loading: false });
  //         window.location.reload();
  //       });
  //   } else {
  //     if (nameIsUsed) {
  //       this.setState({ nameIsUsed: true });
  //       this.setState({ loading: false });
  //     } else if (colorsUsed.length !== 0) {
  //       this.setState({ colorIsUsed: true });
  //       this.setState({ colorsUsed });
  //       this.setState({ loading: false });
  //     }
  //   }
  // };

  // toggleForSale = (tokenId) => {
  //   this.setState({ loading: true });
  //   this.state.cryptoBoysContract.methods
  //     .toggleForSale(tokenId)
  //     .send({ from: this.state.accountAddress })
  //     .on("confirmation", () => {
  //       this.setState({ loading: false });
  //       window.location.reload();
  //     });
  // };

  // changeTokenPrice = (tokenId, newPrice) => {
  //   this.setState({ loading: true });
  //   const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
  //   this.state.cryptoBoysContract.methods
  //     .changeTokenPrice(tokenId, newTokenPrice)
  //     .send({ from: this.state.accountAddress })
  //     .on("confirmation", () => {
  //       this.setState({ loading: false });
  //       window.location.reload();
  //     });
  // };

  // buyCryptoBoy = (tokenId, price) => {
  //   this.setState({ loading: true });
  //   this.state.cryptoBoysContract.methods
  //     .buyToken(tokenId)
  //     .send({ from: this.state.accountAddress, value: price })
  //     .on("confirmation", () => {
  //       this.setState({ loading: false });
  //       window.location.reload();
  //     });
  // };

  //#endregion

  return (
    // <div>
    //   {!this.state.metamaskConnected ? (
    //     <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
    //   ) : !this.state.contractDetected ? (
    //     <ContractNotDeployed />
    //   ) : this.state.loading ? (
    //     <Loading />
    //   ) : (
    //     <>
    //       <HashRouter basename="/">
    //         <Navbar />
    //         <div>
    //         <Route
    //           path="/"
    //           exact
    //           render={() => (
    //             <LayoutIndex.Homepage/>
    //           )}
    //         />
    //         <Route
    //           path="/mint"
    //           render={() => (
    //             <FormAndPreview
    //               mintMyNFT={this.mintMyNFT}
    //               nameIsUsed={this.state.nameIsUsed}
    //               colorIsUsed={this.state.colorIsUsed}
    //               colorsUsed={this.state.colorsUsed}
    //               setMintBtnTimer={this.setMintBtnTimer}
    //             />
    //           )}
    //         />
    //         <Route
    //           path="/marketplace"
    //           render={() => (
    //             <AllCryptoBoys
    //               accountAddress={this.state.accountAddress}
    //               cryptoBoys={this.state.cryptoBoys}
    //               totalTokensMinted={this.state.totalTokensMinted}
    //               changeTokenPrice={this.changeTokenPrice}
    //               toggleForSale={this.toggleForSale}
    //               buyCryptoBoy={this.buyCryptoBoy}
    //             />
    //           )}
    //         />
    //         <Route
    //           path="/my-tokens"
    //           render={() => (
    //             <MyCryptoBoys
    //               accountAddress={this.state.accountAddress}
    //               cryptoBoys={this.state.cryptoBoys}
    //               totalTokensOwnedByAccount={
    //                 this.state.totalTokensOwnedByAccount
    //               }
    //             />
    //           )}
    //         />
    //         <Route
    //           path="/queries"
    //           render={() => (
    //             <Queries cryptoBoysContract={this.state.cryptoBoysContract} />
    //           )}
    //         />
    //         </div>
    //       </HashRouter>
    //     </>
    //   )}
    // </div>
    // <ProvideAuth>
    <BrowserRouter basename="/">
      <Container auth={loggedIn}>
        <ToastContainer limit={1} autoClose={3000} />
        <Switch>
          <Route path="/" exact render={() => <LayoutIndex.Homepage />} />
          {/* <Route
              path="/mint"
              render={() => (
                <FormAndPreview
                  mintMyNFT={this.mintMyNFT}
                  nameIsUsed={this.state.nameIsUsed}
                  colorIsUsed={this.state.colorIsUsed}
                  colorsUsed={this.state.colorsUsed}
                  setMintBtnTimer={this.setMintBtnTimer}
                />
              )}
            />
            <Route
              path="/marketplace"
              render={() => (
                <AllCryptoBoys
                  accountAddress={this.state.accountAddress}
                  cryptoBoys={this.state.cryptoBoys}
                  totalTokensMinted={this.state.totalTokensMinted}
                  changeTokenPrice={this.changeTokenPrice}
                  toggleForSale={this.toggleForSale}
                  buyCryptoBoy={this.buyCryptoBoy}
                />
              )}
            />
            <Route
              path="/my-tokens"
              render={() => (
                <MyCryptoBoys
                  accountAddress={this.state.accountAddress}
                  cryptoBoys={this.state.cryptoBoys}
                  totalTokensOwnedByAccount={
                    this.state.totalTokensOwnedByAccount
                  }
                />
              )}
            />
            <Route
              path="/queries"
              render={() => (
                <Queries cryptoBoysContract={this.state.cryptoBoysContract} />
              )}
            /> */}
          <Route path="/login" render={() => <Login />} />
          <Route path="/my-account" exact render={() => <Account />} />
          <Route path="/account/:id" exact render={() => <UsersAccount />} />
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
