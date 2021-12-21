import React, { Component, useState, useEffect } from "react";
import CryptoBoyList from "../CryptoBoyList/CryptoBoyList";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import CryptoBoyNFTDetails from "../CryptoBoyNFTDetails/CryptoBoyNFTDetails";
import Loading from "../Loading/Loading";
import FilterBar from "../FilterBar/FilterBar";
import Select from "react-select";


class AllCryptoBoys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: this.props.accountAddress,
      totalTokensMinted: this.props.totalTokensMinted,
      changeTokenPrice: this.props.changeTokenPrice,
      toggleForSale: this.props.toggleForSale,
      buyCryptoBoy: this.props.buyCryptoBoy,
      loading: this.props.loading,
      floorPrice: this.props.floorPrice,
      highPrice: this.props.highPrice,
      traits: this.props.traits,
      traitsTypes: this.props.traitsTypes,
      order: this.props.order
    };
    this.handleOrderChange = this.props.handleOrderChange;
    this.handleFilterBar = this.props.handleFilterBar;
    this.resetFilter = this.props.resetFilter;
    this.priceOptions = [
      { value: 'ASC', label: 'Price ASC' },
      { value: 'DESC' , label: 'Price DESC' }
    ];
  }

  componentDidMount( ) {
    /*if( this.props.cryptoBoys[0].metaData !== 0)
    this.setState( {marketPlaceView: this.props.cryptoBoys })*/
  }

  

  handleMarketplaceFilters = ( ev ) => {
    //marketplaceView
  }

  /**/

  render() {
    //const [loading, setLoading] = useState(false);
    let {
      accountAddress,
      totalTokensMinted,
      changeTokenPrice,
      toggleForSale,
      buyCryptoBoy,
      floorPrice,
      loading,
      prices,
      order,
      traits,
      highPrice,
      traitsTypes
    } = this.state;
    console.log( this.props.marketplaceView )
    return (
        <div className="container">
          <div className="card mt-1">
            <div className="card-body align-items-left d-flex justify-content-space-between">
            <div className="align-items-left d-flex justify-content-left spaced">
                <span className="floorPrice">
                  Floor Price: 
                  <b>{ ` ${floorPrice} Ξ`}</b>
                </span>
                <span className="floorPrice">
                  Higher Price: 
                  <b>{ ` ${highPrice} Ξ`}</b>
                </span>
                <span className="floorPrice">
                  Minted CRSkull: 
                  <b>{ ` #${totalTokensMinted}/${this.props.cryptoBoysMaxSupply}`}</b>
                </span>
              </div>
            </div>
          </div>
          <div className="card mt-1">
            <div className="card-body align-items-left d-flex justify-content-space-between">
              <FilterBar
                traits={this.props.traits}
                traitsTypes={this.props.traitsTypes}
                handleFilterBar={this.handleFilterBar}
              />
              <span onClick={this.resetFilter} className="filterBar">&times; Reset</span>
              <div className="align-items-right d-flex justify-content-right spaced">
                <div>
                  <span>Price Order</span>
                  <Select 
                    options={this.priceOptions}
                    onChange={this.handleOrderChange}
                    value={order}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap mb-2">
            <CryptoBoyList
              cryptoBoys={this.props.marketplaceView}
              accountAddress={accountAddress}
              totalTokensMinted={totalTokensMinted}
              changeTokenPrice={changeTokenPrice}
              toggleForSale={toggleForSale}
              buyCryptoBoy={buyCryptoBoy}
            />
            </div>
      </div>
    )
  }
};

export default AllCryptoBoys;
