import React, { Component, useEffect } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import "./App.css";
import Web3 from "web3";
import CryptoBoys from "../abis/CryptoBoys.json";
import FormAndPreview from "../components/FormAndPreview/FormAndPreview";
import AllCryptoBoys from "./AllCryptoBoys/AllCryptoBoys";
import DetailsPage from "./AllCryptoBoys/AllCryptoBoys";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";
import MyCryptoBoys from "./MyCryptoBoys/MyCryptoBoys";
import Queries from "./Queries/Queries";
import AdminDashboard from './AdminDashboard/AdminDashboard';
import Bottleneck from "bottleneck";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";



const ipfsClient = require("ipfs-http-client");
const WCProvider = new WalletConnectProvider({
  rpc: {
    339: "https://cassini.crypto.org",
  },
})

const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
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
      walletConnectConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      lastMintTime: null,
      floorPrice: 0,
      highPrice: 0,
      traits: [],
      traitsTypes: [],
      order: 'ASC',
      marketplaceView: [],
      activeFilters: [],
      activeNFTStatus: 'all',
      baseURI: '',
    };
    this.handleWeb3AccountChange();
  }

  handleWeb3AccountChange = () => {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload()
    })
  }

  componentWillMount = async () => {
    if( window.ethereum )
      await this.loadWeb3(window.ethereum);

    await this.setMintBtnTimer();
  };

  numToEth = (num) => {
    return parseFloat( window.web3.utils.fromWei( num.toString(), "ether" ), 6 )
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

  loadWeb3 = async (provider) => {
    if (window.ethereum) {
      window.web3 = new Web3(provider);
      await this.loadBlockchainData();
      await this.setMetaData();
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

        //get current token baseURI
        let baseURI = await cryptoBoysContract.methods
          .baseURI()
          .call();

        baseURI = 'https://gateway.pinata.cloud/ipfs/' + baseURI;
        this.setState({ baseURI }); 

        //get max total supply
        //count actual circulating supply
        const cryptoBoysCount = await cryptoBoysContract.methods
        .cryptoBoyCounter()
        .call();

        this.setState({ cryptoBoysCount });
        const cryptoBoysMaxSupply = await cryptoBoysContract.methods
          .getMaxSupply()
          .call();
        
        this.setState( { cryptoBoysMaxSupply } )

        const result = await fetch(this.state.baseURI + '/_metadata.json' )
        const metaDatas = await result.json();

        this.setState({ loading: false });
        for (var i = 1; i <= cryptoBoysCount; i++) {
          const cryptoBoy = await cryptoBoysContract.methods
          .allCryptoBoys(i)
          .call();
          metaDatas.map(async (metaData) => {
            if( cryptoBoy.tokenId.toNumber() === metaData.edition )
            this.setState({
              cryptoBoys: [
                ...this.state.cryptoBoys, {
                  ...cryptoBoy,
                  metaData,
                }
              ],
              marketplaceView: [
                ...this.state.cryptoBoys, {
                  ...cryptoBoy,
                  metaData,
                }
              ],
            });
          })
        }

        let floorPrice = 9999999999;
        let highPrice = 0;
        let cryptoBoys = this.state.cryptoBoys;
        cryptoBoys.forEach( cryptoboy => {
          let price = this.numToEth(cryptoboy.price)
          console.log(price)
          if( price < floorPrice )
            floorPrice = price
          
          if( price > highPrice)
            highPrice = price
        })
        this.setState({ floorPrice, highPrice })
        /*const cryptoBoysCost = await cryptoBoysContract.methods
          .getCost()
          .call();
        this.setState({ cryptoBoysCost });*/

        
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
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    await this.loadWeb3( window.ethereum )
    this.setState({ metamaskConnected: true });
    console.log(this.state.metamaskConnected)
    //window.location.reload();
  };

  connectToWalletConnect = async () => {
    await window.ethereum.enable();
    await WCProvider.enable();
    await this.loadWeb3( WCProvider )
    this.setState({ walletConnectConnected: true });
    //window.location.reload();
  }

  setMetaData = async () => {
    const { cryptoBoys } = this.state
    if (cryptoBoys.length !== 0) {
      let traits = []
      let traitsTypes = []
      if( cryptoBoys.length.length !== 0 ){
        let boyLength = cryptoBoys.length
        cryptoBoys.forEach( (cryptoboy, iBoy) => { //loop cryptoboy
          if( cryptoboy.metaData ){
            let traitsLength = cryptoboy.metaData.attributes.length
            cryptoboy.metaData.attributes.forEach( (trait, iTraits) => { // loop tratti
              
              let { trait_type, value } = trait
              let type = trait_type.replace(' ', '-')
              let uniqueType = true

              traitsTypes.forEach( ( existType, i) => {
                if( existType === type )
                  uniqueType = false
              } )

              if( uniqueType )
                traitsTypes.push( type )

              if( traits[type] === undefined )
                traits[type] = []

              let unique = true
              traits[type].forEach( existValue => {
                if (existValue === value )
                  unique = false
              })

              if( unique )
                traits[type].push( value )
              

                
                if( boyLength === ( iBoy + 1 ) && traitsLength === ( iTraits + 1 ) ){
                  this.setState({ traits });
                  this.setState( { traitsTypes });
                }
              })
            }
          })
        }
        console.log(this.state)
    }
  };

  handleStatusNFTFilter = (ev) => {
    let { cryptoBoys, accountAddress } = this.state;
    let value = ev.value
    console.log(value)
    let newMarketplaceView = [];
    switch (value){
      case 'all':
        newMarketplaceView = cryptoBoys
        break;
      case 'inSale':
        cryptoBoys.forEach( ( cryptoBoy, i ) => {
          if( cryptoBoy.forSale )
            newMarketplaceView.push(cryptoBoy)
        } )
        break;
      case 'notInSale':
        cryptoBoys.forEach( ( cryptoBoy, i ) => {
          if( ! cryptoBoy.forSale )
            newMarketplaceView.push(cryptoBoy)
        } )
        break;
      case 'owned':
        cryptoBoys.forEach( ( cryptoBoy, i ) => {
          if( cryptoBoy.currentOwner === accountAddress)
            newMarketplaceView.push(cryptoBoy)
        } )
        break;
      }
      this.setState( { marketplaceView: newMarketplaceView } )


  }

  handleFilterBar = (ev) => {
    const { cryptoBoys, marketplaceView, activeFilters } = this.state;
    let value = ev.value.split('_')

    let trait = value[0]

    value = value[1].replace('-', ' ')

    let newFilters = activeFilters
    if( ! newFilters.length > 0){
      newFilters.push({ trait_type: trait , value: value })
    }else{
      let exist = false
      newFilters.forEach( ( filter, i )=> { //controllo i filtri attivi
        if( exist ) return; //se esiste già esco
        if( filter.trait_type === trait  ){ // tipo tratto uguale 
          if( filter.value != value){ // valore tratto diverso 
            console.log(value)
              newFilters[i] = { trait_type: trait , value: value }
            exist = true
          }
          if( filter.value === value ){ // valoe tratto uguale
            exist = true
          }
        }
      })
        if( ! exist ) 
          newFilters.push( { trait_type: trait , value: value } )
    }

    console.log(newFilters)
    let newView = [];
    cryptoBoys.map( ( cryptoBoy, i ) => { //crypto boy 1
      if( cryptoBoy.metaData ){
        let filterValid = true
        newFilters.forEach( filter => { //filtro 1
          if( ! filterValid ) return
          let traitValid = false
          cryptoBoy.metaData.attributes.forEach(forTrait => { // tratto 1
            if( traitValid ) return

            if( forTrait.trait_type === filter.trait_type && forTrait.value === filter.value || filter.value === 'none' ){ //tratto valido
              traitValid = true
              return
            }
          })
          filterValid = traitValid
        })
        if(filterValid)
          newView.push(cryptoBoy) // aggiungo il tratto
      }
    })

    console.log( newView )
    this.setState( { marketplaceView: newView } )
    this.setState( { activeFilters: newFilters } )
  }

  handleOrderChange = (ev = null) => {
    console.log( ev )
    const { numToEth } = this
    let order = ev != null ? ev.value : this.state.order
    const { cryptoBoys, marketplaceView } = this.state;
    if( order === 'ASC' ){
      marketplaceView.sort( (a, b) => {
        a = parseInt( numToEth(a.price) )
        b = parseInt( numToEth(b.price) )
        return (  a - b  ) 
      })
    }else{
      marketplaceView.sort( (a, b) => {
        a = parseInt( numToEth(a.price) )
        b = parseInt( numToEth(b.price) )
        return (  a - b  ) 
      }).reverse()
    }
    this.setState({ order })
  }

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
          return <Redirect to="/my-tokens" push={true} />   
        })
        .on("error", (error) => {
          window.location.reload();
        });
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
      })
      .on("error", (error) => {
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
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  resetFilter = () => {
    const { cryptoBoys } = this.state;
    this.setState( { marketplaceView: cryptoBoys } )
  }

  buyCryptoBoy = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .buyToken(tokenId)
      .send({ from: this.state.accountAddress, value: price })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      })
      .on("error", (error) => {
        window.location.reload();
      });
  };

  render() {
    return (
      <div>
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask 
            connectToMetamask={this.connectToMetamask} 
            connectToWalletConnect={this.connectToWalletConnect}
          />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/" >
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
                    marketplaceView={this.state.marketplaceView}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyCryptoBoy={this.buyCryptoBoy}
                    loading={this.state.loading}
                    floorPrice={this.state.floorPrice}
                    highPrice={this.state.highPrice}
                    handleOrderChange={this.handleOrderChange}
                    handleFilterBar={this.handleFilterBar}
                    handleStatusNFTFilter={this.handleStatusNFTFilter}
                    order={this.state.order}
                    traits={this.state.traits}
                    traitsTypes={this.state.traitsTypes}
                    cryptoBoysMaxSupply={this.state.cryptoBoysMaxSupply}
                    resetFilter={this.resetFilter}
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
              { this.state.baseURI != '' ? 
              <Route
                path="/queries"
                render={() => (
                  <Queries 
                    cryptoBoysContract={this.state.cryptoBoysContract} 
                    baseURI={this.state.baseURI}
                  />
                )}
              />
               : '' }
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
        <span>v0.1.6</span>
      </div>
    );
  }
}

export default App;
