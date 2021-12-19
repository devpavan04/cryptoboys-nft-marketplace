import "./config.json";
import React, { Component } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import FormAndPreview from "./components/FormAndPreview/FormAndPreview";
import AllCryptoBoys from "./components/AllCryptoBoys/AllCryptoBoys";
import AccountDetails from "./components/AccountDetails/AccountDetails";
import ContractNotDeployed from "./components/ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./components/ConnectMetamask/ConnectToMetamask";
import Loading from "./components/Loading/Loading";
import Navbar from "./components/Navbar/Navbar";
import MyCryptoBoys from "./components/MyCryptoBoys/MyCryptoBoys";
import Queries from "./components/Queries/Queries";
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import cloud  from './cloud.png';
import moon  from './moon.png';
import grass  from './grass.png';
import grave  from './grave2.png';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import store from "./redux/store";
import "./App.css";
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
      blockchain: store.getState().blockchain,
      croSkulls: [],//blockchain reducer
      loading: false,//blockchain reducer
      metamaskConnected: false,//
      contractDetected: false,//
      totalTokensMinted: 0,//
      totalTokensOwnedByAccount: 0,//
      lastMintTime: null,
      floorPrice: 0,
      highPrice: 0,
      traits: [],
      traitsTypes: [],
      order: 'ASC',
      marketplaceView: [],
      activeFilters: [],
      baseURI: '',
      onlyOwned: false
    };
    //this.handleWeb3AccountChange();
  }

  handleWeb3AccountChange = () => {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload()
    })
  }

  componentWillMount = async () => {
    let blockchain = store.getState().blockchain
    /*const dispatch = useDispatch()
    const blockchain = useSelector( (state) => state.blockchain)
    const data = useSelector( (state) => state.data)
    dispatch(connect())

    dispatch(fetchData(blockchain.account))*/
    /*await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMetaData();
    await this.setMintBtnTimer();
    await this.handleOrderChange();*/
  }

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
        ? (mintBtn.innerHTML = `Mint My ${this.state.projectName}`)
        : this.checkIfCanMint(parseInt(this.state.lastMintTime))
    }
  }

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

  

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  setMetaData = async () => {
    if (this.state.croSkulls.length !== 0) {
      this.state.croSkulls.map(async (cryptoboy) => {
        const result = await fetch(this.state.baseURI + '/' + cryptoboy.tokenId.toNumber() + '.json' );
        const metaData = await result.json();
        let croSkulls = this.state.croSkulls.map((cryptoboy) =>
          cryptoboy.tokenId.toNumber() === Number(metaData.edition)
            ? {
                ...cryptoboy,
                metaData,
              }
            : cryptoboy
          )

        this.setState({ croSkulls });
        this.setState({ marketplaceView: croSkulls });
        let traits = []
        let traitsTypes = []
        if( croSkulls.length.length !== 0 ){
          let boyLength = croSkulls.length
          croSkulls.map( (cryptoboy, iBoy) => { //loop cryptoboy
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
      }) 
    }
  };

  handleFilterBar = ( ev = null ) => {
    const { croSkulls, marketplaceView, activeFilters } = this.state;
    let newFilters = activeFilters
    if ( ev ){
      let value = ev.value.split('_')
      let trait = value[0].replace('-', ' ')
      value = value[1]
      if( ! newFilters.length > 0){
        newFilters.push({ trait_type: trait , value: value })
      }else{
        let exist = false
        newFilters.forEach( ( filter, i )=> { //controllo i filtri attivi
          if( exist ) return; //se esiste già esco
          if( filter.trait_type === trait  ){ // tipo tratto uguale 
            if( filter.value != value){ // valore tratto diverso 
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
    }
    
    let newView = [];
    croSkulls.map( ( cryptoBoy, i ) => { //crypto boy 1
      if( ! this.state.onlyOwned )
        if ( cryptoBoy.currentOwner != this.state.accountAddress )
          return 

      if( cryptoBoy.metaData ){
        let filterValid = true
        newFilters.forEach( filter => { //filtro 1
          if( ! filterValid ) return
          let traitValid = false
          cryptoBoy.metaData.attributes.forEach(forTrait => { // tratto 1
            if( traitValid ) return
            if( forTrait.trait_type === filter.trait_type && forTrait.value === filter.value ){ //tratto valido
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
    const { croSkulls, marketplaceView } = this.state;
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
    this.state.croSkullContract.methods
      .setBaseURI(_baseURI)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  }

  setNftPerAddressLimit = (_limit) => {
    this.state.croSkullContract.methods
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
      previousTokenId = await this.state.croSkullContract.methods
        .cryptoBoyCounter()
        .call();
      previousTokenId = previousTokenId.toNumber();
      const tokenId = previousTokenId + _mintAmount;
      const cost = this.state.cryptoBoysCost;
      const totalCost = window.web3.utils.toWei( ( cost * _mintAmount ).toString(), "Ether");
      this.state.croSkullContract.methods
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
    this.state.croSkullContract.methods
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
    this.state.croSkullContract.methods
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
    const { croSkulls } = this.state;
    this.setState( { marketplaceView: croSkulls } )
  }

  buyCryptoBoy = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.croSkullContract.methods
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

  handleOwnedFilter = ( ev ) => {
    let onlyOwned = ev.target.checked

    console.log( onlyOwned )
    this.setState( {  onlyOwned  } )
    this.handleFilterBar()
  }

  render() {
    let { blockchain } = this.state;
    return (
      <div className="container">
        <div className="hero-section">
          <img className="hero-image" src={cloud} />
          <img className="hero-image moon" src={moon} />
          <img className="hero-image" src={grass} />
          <img className="hero-image" src={grave} />
        </div>
        { blockchain.web3 === null ? (
          <ConnectToMetamask  state={this.state}/>
        ) : !blockchain.smartContract ? (
          <ContractNotDeployed />
        ) : blockchain.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/" >
              <Navbar 
                isAdmin={this.state.croSkullContractOwner === this.state.accountAddress}
                connectToMetamask={this.connectToMetamask} 
                state={this.state}
                floorPrice={this.state.floorPrice}
                highPrice={this.state.highPrice}
                totalTokensMinted={this.state.totalTokensMinted}
                cryptoBoysMaxSupply={this.state.cryptoBoysMaxSupply}
                />
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
              <div className="main-wrapper">
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
                      loading={this.state.loading}
                      floorPrice={this.state.floorPrice}
                      highPrice={this.state.highPrice}
                      order={this.state.order}
                      traits={this.state.traits}
                      traitsTypes={this.state.traitsTypes}
                      cryptoBoysMaxSupply={this.state.cryptoBoysMaxSupply}
                      onlyOwned={this.state.onlyOwned}
                      handleOwnedFilter={this.handleOwnedFilter}
                      changeTokenPrice={this.changeTokenPrice}
                      toggleForSale={this.toggleForSale}
                      buyCryptoBoy={this.buyCryptoBoy}
                      handleOrderChange={this.handleOrderChange}
                      handleFilterBar={this.handleFilterBar}
                      resetFilter={this.resetFilter}
                      />
                    )}
                  />
                <Route
                  path="/my-tokens"
                  render={() => (
                    <MyCryptoBoys
                      accountAddress={this.state.accountAddress}
                      croSkulls={this.state.croSkulls}
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
                      croSkullContract={this.state.croSkullContract} 
                      baseURI={this.state.baseURI}
                    />
                  )}
                />
                : '' }
                {
                  this.state.croSkullContractOwner === this.state.accountAddress ?
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
               </div>
            </HashRouter>
          </>
        ) }
        <span>v0.1.6</span>
      </div>
    );
  }
}

export default App;
