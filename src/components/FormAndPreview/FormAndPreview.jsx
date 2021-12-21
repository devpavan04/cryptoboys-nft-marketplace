import React, { Component } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import baseImage from "./1.png"
import './FormAndPreview.css';

class FormAndPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mintAmount: 1,
      mintCost: 1,
      cryptoBoysCount: this.props.cryptoBoysCount,
      cryptoBoysMaxSupply: this.props.cryptoBoysMaxSupply,
      cryptoBoysCost: this.props.cryptoBoysCost
    };
  }


  totalCost = (_mintAmount) => { 
    return this.state.cryptoBoysCost * _mintAmount
  };

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(
      this.state.mintAmount
    );
  };

  render() {
    return (
      <div className="container">
            <p className="fp-title">Mint your CroSkull NFT</p>
        <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
          <div className="row">
            <div className="col-md-6">
              <img src={baseImage} />
            </div>
            <div className="mint-wrapper col-md-6">
              <div className="fp-text">
                <p>Get now your <b>blockchain-unique CroSkull NFT</b> out of 6666 possibile Skulls with unique traits and dna.</p>
                <p>Collet at least <b>3 CroSkulls</b> to be eligibility for the free-AirDrop of a <b>1/1 Potion Mystery Box</b>. <b>Mystery Box</b> will return you a <b>Potion</b>, you can use Potions to Mint CroSkull+ and revieve $SkullLP Token Rewards.</p>
                </div>
                <div className="mint-action">
                  <div>
                    <label htmlFor="amount" className="fp-text-m">Mint amount</label>
                    <input
                      required
                      type="number"
                      name="amount"
                      id="mintAmount"
                      max="20"
                      value={this.state.mintAmount || 1 }
                      className="form-control"
                      placeholder="Enter Amount"
                      onChange={(e) =>
                        this.setState({ mintAmount: e.target.value })
                      }
                    />
                  </div>
                    <button
                      id="mintBt"
                      style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                      type="submit"
                      className="btn mt-4 btn-block btn-outline-secondary"
                    >
                      Mint CroSkull
                      { this.state.mintAmount > 1 ? 
                      `s (${this.state.mintAmount})` : 
                      ` (${this.state.mintAmount})`}
                    </button>
                </div>
                <div className="vertical">
                  <span className="cost-label" className="fp-text-m">Mint Cost (excluded network fees) </span>
                  <span className="cost-value" className="fp-text-m">
                    { this.state.mintAmount > 0 && this.state.cryptoBoysCost ? 
                      `${this.totalCost(this.state.mintAmount)} Ξ` 
                    : ``}
                  </span>
              </div>
              <div className="mt-4">
                <div className="alert alert-info ">
                    <strong>{ `${this.state.cryptoBoysCount} / ${this.state.cryptoBoysMaxSupply}` } CroSkull{ this.state.cryptoBoysCount > 1 ? 's' : '' } Minted</strong>
                  </div>
                { this.props.nameIsUsed ? (
                  <div className="alert alert-danger alert-dissmissible">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                    >
                      <span>&times;</span>
                    </button>
                    <strong>This name is taken!</strong>
                  </div>
                ) : this.props.colorIsUsed ? (
                  <>
                    <div className="alert alert-danger alert-dissmissible">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        <span>&times;</span>
                      </button>
                      {this.props.colorsUsed.length > 1 ? (
                        <strong>These colors are taken!</strong>
                      ) : (
                        <strong>This color is taken!</strong>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "1rem",
                        marginBottom: "3rem",
                      }}
                    >
                      {this.props.colorsUsed.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            background: `${color}`,
                            width: "50%",
                            height: "50px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormAndPreview;
