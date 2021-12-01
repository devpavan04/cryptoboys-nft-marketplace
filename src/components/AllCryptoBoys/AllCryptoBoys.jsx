import React, { Component, useState, useEffect } from "react";
import CryptoBoyList from "../CryptoBoyList/CryptoBoyList";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import CryptoBoyNFTDetails from "../CryptoBoyNFTDetails/CryptoBoyNFTDetails";
import Loading from "../Loading/Loading";

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
      highPrice: this.props.highPrice
    };
    this.handleOrderChange = this.props.handleOrderChange
  }
  componentDidMount() {
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
      cryptoBoys,
      prices,
      order,
      highPrice
    } = this.state;

    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>
              Total No. of CRSkulls Minted On The Platform :{" "}
              {totalTokensMinted}
            </h5>
          </div>
        </div>
        <div className="card mt-1">
          <div className="card-body align-items-left d-flex justify-content-space-between">
            <div className="align-items-left d-flex justify-content-left spaced">
              <span className="floorPrice">
                Floor Price: 
                <b>{ ` ${floorPrice} $CRO`}</b>
              </span>
              <span className="floorPrice">
                High Price: 
                <b>{ ` ${highPrice} $CRO`}</b>
              </span>
            </div>
            <div className="align-items-right d-flex justify-content-right spaced">
              <span>Filter NFT</span>
              <select onChange={this.handleOrderChange} value={this.props.order}>
                <option value="none">None</option>
                <option value="ASC">Price ASC</option>
                <option value="DESC">Price DESC</option>
              </select>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap mb-2">
                <CryptoBoyList
                  cryptoBoys={this.props.cryptoBoys}
                  accountAddress={accountAddress}
                  totalTokensMinted={totalTokensMinted}
                  changeTokenPrice={changeTokenPrice}
                  toggleForSale={toggleForSale}
                  buyCryptoBoy={buyCryptoBoy}
                />
          </div>
      </div>
    );
  }
};

export default AllCryptoBoys;
