import React, { Component } from "react";
import { Accordion, Card } from "react-bootstrap";

class CryptoBoyNFTDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCryptoBoyPrice: "",
    };
  }

  callChangeTokenPriceFromApp = (tokenId, newPrice) => {
    this.props.changeTokenPrice(tokenId, newPrice);
  };

  render() {

    let {cryptoboy} = this.props
    if(this.props.toggleForSale || this.props.accountAddress == this.props.cryptoboy.currentOwner)
    {
    return (
     
      <div key={this.props.cryptoboy.tokenId.toNumber()} className="mt-4 vertical">
        <Accordion>
            <Card>
                <Accordion.Toggle  eventKey="0" className="toogle-button">
                    Token Details
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body className="vertical">
                      <span className="font-weight-bold">ID: #{this.props.cryptoboy.tokenId.toNumber()}</span>
                      <span className="font-weight-bold">Name: {this.props.cryptoboy.tokenName}</span>
                      <span className="font-weight-bold">Minted By 
                        {this.props.cryptoboy.mintedBy.substr(0, 5) +
                          "..." +
                          this.props.cryptoboy.mintedBy.slice(
                            this.props.cryptoboy.mintedBy.length - 5
                          )}
                        </span>
                        <span className="font-weight-bold">Owned By: {this.props.cryptoboy.currentOwner.substr(0, 5) +
                          "..." +
                          this.props.cryptoboy.currentOwner.slice(
                            this.props.cryptoboy.currentOwner.length - 5
                          )}
                        </span>
                        <span className="font-weight-bold">Previous Owner: 
                          {this.props.cryptoboy.previousOwner.substr(0, 5) +
                            "..." +
                            this.props.cryptoboy.previousOwner.slice(
                              this.props.cryptoboy.previousOwner.length - 5
                          )}
                        </span>
                        <span className="font-weight-bold">Price:
                          {window.web3.utils.fromWei(
                            this.props.cryptoboy.price.toString(),
                            "Ether"
                          )}{" "}Ξ
                        </span>
                        <span className="font-weight-bold">
                          Transfers: {this.props.cryptoboy.numberOfTransfers.toNumber()}
                        </span>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle  eventKey="1" className="toogle-button">
                    Traits Properties
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body className="vertical">
                    { cryptoboy.metaData ? 
                          cryptoboy.metaData.attributes.map( attribute => {
                            return (
                              <span className="font-weight-bold">{attribute.trait_type}: 
                                 {attribute.value}
                              </span>
                            )
                          })
                        : ''}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <div>
          {this.props.accountAddress === this.props.cryptoboy.currentOwner ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.callChangeTokenPriceFromApp(
                  this.props.cryptoboy.tokenId.toNumber(),
                  this.state.newCryptoBoyPrice
                );
              }}
            >
              <div className="form-group mt-4 ">
                <label htmlFor="newCryptoBoyPrice">
                  <span className="font-weight-bold">Change Token Price</span> :
                </label>{" "}
                <input
                  required
                  type="number"
                  name="newCryptoBoyPrice"
                  id="newCryptoBoyPrice"
                  value={this.state.newCryptoBoyPrice}
                  className="form-control w-100"
                  placeholder="Enter new price"
                  onChange={(e) =>
                    this.setState({
                      newCryptoBoyPrice: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                className="btn btn-outline-info mt-0 w-100"
              >
                change price
              </button>
            </form>
          ) : null}
        </div>
        <div>
          {this.props.accountAddress === this.props.cryptoboy.currentOwner ? (
            this.props.cryptoboy.forSale ? (
              <button
                className="btn btn-outline-danger mt-4 w-100"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.toggleForSale(
                    this.props.cryptoboy.tokenId.toNumber()
                  )
                }
              >
                Remove from sale
              </button>
            ) : (
              <button
                className="btn btn-outline-success mt-4 w-100"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.toggleForSale(
                    this.props.cryptoboy.tokenId.toNumber()
                  )
                }
              >
                Keep for sale
              </button>
            )
          ) : null}
        </div>
        <div>
          {this.props.accountAddress !== this.props.cryptoboy.currentOwner ? (
            this.props.cryptoboy.forSale ? (
              <button
                className="btn btn-outline-primary mt-3 w-100"
                value={this.props.cryptoboy.price}
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={(e) =>
                  this.props.buyCryptoBoy(
                    this.props.cryptoboy.tokenId.toNumber(),
                    e.target.value
                  )
                }
              >
                Buy For{" "}
                {window.web3.utils.fromWei(
                  this.props.cryptoboy.price.toString(),
                  "Ether"
                )}{" "}
                Ξ
              </button>
            ) : (
              <>
                <button
                  disabled
                  style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                  className="btn btn-outline-primary mt-3 w-100"
                >
                  Buy For{" "}
                  {window.web3.utils.fromWei(
                    this.props.cryptoboy.price.toString(),
                    "Ether"
                  )}{" "}
                  Ξ
                </button>
                <p className="mt-2">Currently not for sale!</p>
              </>
            )
          ) : null}
        </div>
      </div>
    );}
    else{
      return null;
    }

  }
}

export default CryptoBoyNFTDetails;
