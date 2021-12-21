import React, { Component } from "react";
import CryptoBoyList from "../CryptoBoyList/CryptoBoyList";
import FilterBar from "../FilterBar/FilterBar";
import Select from "react-select";
import './AllCryptoBoys.css';


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

  componentDidMount  ( ) {
    /*if( this.props.cryptoBoys[0].metaData !== 0)
    this.setState( {marketPlaceView: this.props.cryptoBoys })*/
  }

  render() {
    let {
      accountAddress,
      changeTokenPrice,
      toggleForSale,
      buyCryptoBoy,
      order,
    } = this.state;

    let {
      floorPrice,
      highPrice,
      cryptoBoysMaxSupply,
      totalTokensMinted,
      handleStatusNFTFilter
    } = this.props;
    console.log( this.props.marketplaceView )
    return (
        <div className="container">
          <div className="card mt-1">
            <div className="card-body align-items-left d-flex justify-content-center">
              { highPrice ? 
            <div className="align-items-left d-flex justify-content-left spaced">
                <span className="contractInfo">
                  Floor Price
                  <b>{ ` ${floorPrice} Ξ`}</b>
                </span>
                <span className="contractInfo">
                  Higher Price
                  <b>{ ` ${highPrice} Ξ`}</b>
                </span>
                <span className="contractInfo">
                  Minted CRSkull
                  <b>{ ` #${totalTokensMinted}/${cryptoBoysMaxSupply}`}</b>
                </span>
              </div>
              : '' }
            </div>
          </div>
          <div className="card mt-1">
            <div className="card-body align-items-left d-flex justify-content-space-between">
              <FilterBar
                traits={this.props.traits}
                traitsTypes={this.props.traitsTypes}
                handleFilterBar={this.handleFilterBar}
                handleStatusNFTFilter={handleStatusNFTFilter}
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
