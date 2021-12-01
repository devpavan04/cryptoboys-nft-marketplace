import React, { Component, useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import Web3 from "web3";
import CryptoBoys from "../abis/CryptoBoys.json";
import FormAndPreview from "../components/FormAndPreview/FormAndPreview";
import AllCryptoBoys from "./AllCryptoBoys/AllCryptoBoys";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";
import MyCryptoBoys from "./MyCryptoBoys/MyCryptoBoys";
import Queries from "./Queries/Queries";
import AdminDashboard from './AdminDashboard/AdminDashboard';

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      cryptoBoysContract: null,
      cryptoBoysContractOwner: null,
      cryptoBoysCount: 0,
      cryptoBoysMaxSupply: 0,
      cryptoBoysCost: 1,
      nftPerAddressLimit: 0,
      cryptoBoys: [],
      loading: false,
      metamaskConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      lastMintTime: null,
      floorPrice: 0,
      highPrice: 0,
      order: 'none'
    };
    this.handleWeb3AccountChange();
  }

  handleWeb3AccountChange = () => {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload()
    })
  }

  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMetaData();
    await this.setMintBtnTimer();
  };

  numToEth = (num) => {
    return parseInt( window.web3.utils.fromWei( num.toString(), "ether" ) )
  }

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My CRSkull")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Crypto Boy";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });

      //get and set accountBalance
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      const networkData = CryptoBoys.networks[networkId];
      if (networkData) {
        //load contract data
        this.setState({ loading: true });
        const cryptoBoysContract = web3.eth.Contract(
          CryptoBoys.abi,
          networkData.address
        );
        this.setState({ cryptoBoysContract });
        this.setState({ contractDetected: true });
        //get max total supply
        const cryptoBoysMaxSupply = await cryptoBoysContract.methods
          .getMaxSupply()
          .call();
        
        this.setState( { cryptoBoysMaxSupply } )
        //count actual circulating supply
        const cryptoBoysCount = await cryptoBoysContract.methods
          .cryptoBoyCounter()
          .call();
        this.setState({ cryptoBoysCount });

        const cryptoBoysCost = await cryptoBoysContract.methods
          .getCost()
          .call();
        //this.setState({ cryptoBoysCost });

        //load all cryptoBoys
        for (var i = 1; i <= cryptoBoysCount; i++) {
          const cryptoBoy = await cryptoBoysContract.methods
            .allCryptoBoys(i)
            .call();
          this.setState({
            cryptoBoys: [...this.state.cryptoBoys, cryptoBoy],
          });
        }

        let floorPrice = 9999999999;
        let highPrice = 0;
        this.state.cryptoBoys.map( cryptoboy => {
          const price = web3.utils.fromWei( cryptoboy.price.toString(), "ether")
          if( price < floorPrice )
            floorPrice = price
          
          if( price > highPrice)
            highPrice = price
        })
        this.setState({ floorPrice })
        this.setState({ highPrice })
        //get contract owner
        const contractOwner = await cryptoBoysContract.methods
          .getOwner()
          .call();
        this.setState( {
          cryptoBoysContractOwner: contractOwner
        })
        //get total minted tokens ( include burned (?) )
        let totalTokensMinted = await cryptoBoysContract.methods
          .getNumberOfTokensMinted()
          .call();
        totalTokensMinted = totalTokensMinted.toNumber();
        this.setState({ totalTokensMinted });
        //get actual tokens owner by current address
        let totalTokensOwnedByAccount = await cryptoBoysContract.methods
          .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
          .call();
        totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
        this.setState({ totalTokensOwnedByAccount });

        //get current token baseURI
        let baseURI = await cryptoBoysContract.methods
          .baseURI()
          .call();
        this.setState({ baseURI }); 

        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  setMetaData = async () => {
    if (this.state.cryptoBoys.length !== 0) {
      this.state.cryptoBoys.map(async (cryptoboy) => {
        const result = await fetch(this.state.baseURI + '/' + cryptoboy.tokenId.toNumber() + '.json' );
        const metaData = await result.json();
        this.setState({
          cryptoBoys: this.state.cryptoBoys.map((cryptoboy) =>
            cryptoboy.tokenId.toNumber() === Number(metaData.edition)
              ? {
                  ...cryptoboy,
                  metaData,
                }
              : cryptoboy
          ),
        });
      });
    }
  };

  setBaseURI = async ( _baseURI ) => {
    this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .setBaseURI(_baseURI)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  }

  setNftPerAddressLimit = (_limit) => {
    this.state.cryptoBoysContract.methods
      .setNftPerAddressLimit(_limit)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        this.setState({ nftPerAddressLimit: _limit });
      });
  }

  handleOrderChange = (ev = null) => {
    const { numToEth } = this
    let order = ev != null ? ev.target.value : this.state.order
    const { cryptoBoys } = this.state;
    if( order === 'ASC' ){
      cryptoBoys.sort( (a, b) => {
        a = parseInt( numToEth(a.price) )
        b = parseInt( numToEth(b.price) )
        return (  a - b  ) 
      })
    }else{
      cryptoBoys.sort( (a, b) => {
        a = parseInt( numToEth(a.price) )
        b = parseInt( numToEth(b.price) )
        return (  a - b  ) 
      }).reverse()
    }
    this.setState({ order })
  }

  mintMyNFT = async (_mintAmount) => {
    this.setState({ loading: true });
    //sicuramente trovare la supply attuale
    _mintAmount = _mintAmount;
    if ( 1 ) {
      let previousTokenId;
      previousTokenId = await this.state.cryptoBoysContract.methods
        .cryptoBoyCounter()
        .call();
      previousTokenId = previousTokenId.toNumber();
      const tokenId = previousTokenId + _mintAmount;
      const cost = this.state.cryptoBoysCost;
      const totalCost = window.web3.utils.toWei( ( cost * _mintAmount ).toString(), "Ether");
      this.state.cryptoBoysContract.methods
        .mintCryptoBoy(_mintAmount)
        .send({ from: this.state.accountAddress, value: totalCost })
        .on("confirmation", () => {
          localStorage.setItem(this.state.accountAddress, new Date().getTime());
          this.setState({ loading: false });
          window.location.reload();
        });
    } else {
     /* if (nameIsUsed) {
        this.setState({ nameIsUsed: true });
        this.setState({ loading: false });
      } else if (colorsUsed.length !== 0) {
        this.setState({ colorIsUsed: true });
        this.setState({ colorsUsed });
        this.setState({ loading: false });
      }*/
    }
  };

  toggleForSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .toggleForSale(tokenId)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  changeTokenPrice = (tokenId, newPrice) => {
    this.setState({ loading: true });
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    this.state.cryptoBoysContract.methods
      .changeTokenPrice(tokenId, newTokenPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyCryptoBoy = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .buyToken(tokenId)
      .send({ from: this.state.accountAddress, value: price })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  render() {
    return (
      <div className="container">
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} state={this.state}/>
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar isAdmin={this.state.cryptoBoysContractOwner === this.state.accountAddress}/>
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                  />
                )}
              />
              <Route
                path="/mint"
                render={() => (
                  <FormAndPreview
                    mintMyNFT={this.mintMyNFT}
                    setMintBtnTimer={this.setMintBtnTimer}
                    cryptoBoysMaxSupply={this.state.cryptoBoysMaxSupply}
                    cryptoBoysCount={this.state.cryptoBoysCount}
                    cryptoBoysCost={this.state.cryptoBoysCost}
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
                    loading={this.state.loading}
                    floorPrice={this.state.floorPrice}
                    highPrice={this.state.highPrice}
                    handleOrderChange={this.handleOrderChange}
                    order={this.state.order}
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
                    baseURI={this.state.baseURI}
                  />
                )}
              />
              <Route
                path="/queries"
                render={() => (
                  <Queries cryptoBoysContract={this.state.cryptoBoysContract} />
                )}
              />
              {
                this.state.cryptoBoysContractOwner === this.state.accountAddress ?
              <Route
                path="/admin"
                render={() => (
                  <AdminDashboard 
                  setBaseURI={this.setBaseURI} 
                  baseURI={this.state.baseURI}
                  setNftPerAddressLimit={this.setNftPerAddressLimit} />
                )}
              />
               :
               '' }
            </HashRouter>
          </>
        )}
      </div>
    );
  }
}

export default App;
