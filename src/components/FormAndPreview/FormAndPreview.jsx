import React, { Component } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";

class FormAndPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedColors: [
        {
          cardBorderColor: "",
          cardBackgroundColor: "",
          headBorderColor: "",
          headBackgroundColor: "",
          leftEyeBorderColor: "",
          rightEyeBorderColor: "",
          leftEyeBackgroundColor: "",
          rightEyeBackgroundColor: "",
          leftPupilBackgroundColor: "",
          rightPupilBackgroundColor: "",
          mouthColor: "",
          neckBackgroundColor: "",
          neckBorderColor: "",
          bodyBackgroundColor: "",
          bodyBorderColor: "",
        },
      ],
      cryptoBoyName: "",
      cryptoBoyPrice: "",
    };
  }

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(
      this.state.userSelectedColors[0],
      this.state.cryptoBoyName,
      this.state.cryptoBoyPrice
    );
  };

  render() {
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>Color Your Crypto Boy As You Want It To be!</h5>
          </div>
        </div>
        <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="cardBorderColor">Card Border Color</label>
                <input
                  required
                  type="color"
                  name="cardBorderColor"
                  id="cardBorderColor"
                  value={this.state.userSelectedColors[0].cardBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          cardBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardBackgroundColor">
                  Card Background Color
                </label>
                <input
                  required
                  type="color"
                  name="cardBackgroundColor"
                  id="cardBackgroundColor"
                  value={this.state.userSelectedColors[0].cardBackgroundColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          cardBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="headBorderColor">Head Border Color</label>
                <input
                  required
                  type="color"
                  name="headBorderColor"
                  id="headBorderColor"
                  value={this.state.userSelectedColors[0].headBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          headBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="headBackgroundColor">
                  Head Background Color
                </label>
                <input
                  required
                  type="color"
                  name="headBackgroundColor"
                  id="headBackgroundColor"
                  value={this.state.userSelectedColors[0].headBackgroundColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          headBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="leftEyeBorderColor">
                  Left Eye Border Color
                </label>
                <input
                  required
                  type="color"
                  name="leftEyeBorderColor"
                  id="leftEyeBorderColor"
                  value={this.state.userSelectedColors[0].leftEyeBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          leftEyeBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="rightEyeBorderColor">
                  Right Eye Border Color
                </label>
                <input
                  required
                  type="color"
                  name="rightEyeBorderColor"
                  id="rightEyeBorderColor"
                  value={this.state.userSelectedColors[0].rightEyeBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          rightEyeBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="leftEyeBackgroundColor">
                  Left Eye Background Color
                </label>
                <input
                  required
                  type="color"
                  name="leftEyeBackgroundColor"
                  id="leftEyeBackgroundColor"
                  value={
                    this.state.userSelectedColors[0].leftEyeBackgroundColor
                  }
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          leftEyeBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="rightEyeBackgroundColor">
                  Right Eye Background Color
                </label>
                <input
                  required
                  type="color"
                  name="rightEyeBackgroundColor"
                  id="rightEyeBackgroundColor"
                  value={
                    this.state.userSelectedColors[0].rightEyeBackgroundColor
                  }
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          rightEyeBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <CryptoBoyNFTImage colors={this.state.userSelectedColors[0]} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="leftPupilBackgroundColor">
                  Left Pupil Background Color
                </label>
                <input
                  required
                  type="color"
                  name="leftPupilBackgroundColor"
                  id="leftPupilBackgroundColor"
                  value={
                    this.state.userSelectedColors[0].leftPupilBackgroundColor
                  }
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          leftPupilBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="rightPupilBackgroundColor">
                  Right Pupil Background Color
                </label>
                <input
                  required
                  type="color"
                  name="rightPupilBackgroundColor"
                  id="rightPupilBackgroundColor"
                  value={
                    this.state.userSelectedColors[0].rightPupilBackgroundColor
                  }
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          rightPupilBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="mouthColor">Mouth Color</label>
                <input
                  required
                  type="color"
                  name="mouthColor"
                  id="mouthColor"
                  value={this.state.userSelectedColors[0].mouthColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          mouthColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="neckBackgroundColor">
                  Neck Background Color
                </label>
                <input
                  required
                  type="color"
                  name="neckBackgroundColor"
                  id="neckBackgroundColor"
                  value={this.state.userSelectedColors[0].neckBackgroundColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          neckBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="neckBorderColor">Neck Border Color</label>
                <input
                  required
                  type="color"
                  name="neckBorderColor"
                  id="neckBorderColor"
                  value={this.state.userSelectedColors[0].neckBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          neckBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="bodyBackgroundColor">
                  Body Background Color
                </label>
                <input
                  required
                  type="color"
                  name="bodyBackgroundColor"
                  id="bodyBackgroundColor"
                  value={this.state.userSelectedColors[0].bodyBackgroundColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          bodyBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="bodyBorderColor">Body Border Color</label>
                <input
                  required
                  type="color"
                  name="bodyBorderColor"
                  id="bodyBorderColor"
                  value={this.state.userSelectedColors[0].bodyBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          bodyBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="cryptoBoyName">Name</label>
                <input
                  required
                  type="text"
                  value={this.state.cryptoBoyName}
                  className="form-control"
                  placeholder="Enter Your Crypto Boy's Name"
                  onChange={(e) =>
                    this.setState({ cryptoBoyName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="price">Price</label>
                <input
                  required
                  type="number"
                  name="price"
                  id="cryptoBoyPrice"
                  value={this.state.cryptoBoyPrice}
                  className="form-control"
                  placeholder="Enter Price In Ξ"
                  onChange={(e) =>
                    this.setState({ cryptoBoyPrice: e.target.value })
                  }
                />
              </div>
              <button
                id="mintBtn"
                style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                type="submit"
                className="btn mt-4 btn-block btn-outline-primary"
              >
                Mint My Crypto Boy
              </button>
              <div className="mt-4">
                {this.props.nameIsUsed ? (
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
