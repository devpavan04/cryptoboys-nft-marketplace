import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Card, Statistic, Modal, Row, Col, Input, Spin } from "antd";
import Icon, {
  FieldTimeOutlined,
  WalletOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import AssetPriceChart from "./AssetPriceChart.jsx";
import AssetBidder from "./AssetBidder";
import { useSelector } from "react-redux";
import { BigNumber, ethers } from "ethers";
import { toast } from "react-toastify";
import {
  getNFTContract,
  getMarketplaceContract,
  getAuctionContract,
} from "../../contractInstances";
import { io } from "socket.io-client";
import moment from "moment";

const { Countdown } = Statistic;
const { confirm } = Modal;

// #region Styled Components
const StyledCard = styled(Card)`
  width: 100% !important;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const StyledLayout = styled.div`
  margin-left: 15px;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 15px;
  }
`;

const StyledHeader = styled.div`
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const StyledButton = styled(Button)`
  border-radius: 10px;
  width: 30%;
  font-weight: bold;
  font-size: 1.25rem;
  height: 50px;

  @media (max-width: 900px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledButtonModal = styled(Button)`
  border-radius: 10px;
  width: 30%;
  height: 40px;
  font-weight: bold;
  font-size: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }
  .ant-modal-header {
    text-align: center;
    border-radius: 10px 10px 0 0;

    .ant-modal-title {
      font-weight: bold;
    }
  }
`;

const StyledRow = styled(Row)`
  min-height: 30px;
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-content {
    font-size: 15px;
    color: gray;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  .ant-input-group-addon {
    border-radius: 5px 0 0 5px;
    height: 40px;
  }

  .ant-input {
    border-radius: 0 5px 5px 0;
    height: 40px;
  }
`;

const StyledSpinningLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;
const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

// #endregion

const AssetDetails = () => {
  const [onAuction, setOnAuction] = useState(false);
  const [currentUSDPrice, setCurrentUSDPrice] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [concludeModalVisible, setConcludeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [cardLoading, setCardLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [bidders, setBidders] = useState([]);
  const asset = useSelector((state) => state.asset);
  const user = useSelector((state) => state.user);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const nft = getNFTContract();
  const marketplace = getMarketplaceContract();
  const auction = getAuctionContract();
  const ENDPOINT = process.env.REACT_APP_API_URL;
  let socket = io(ENDPOINT);

  useEffect(() => {
    if (asset && user) {
      convertETHtoUSD();
      getAuctionDetail();
    }
  }, [asset, user]);

  // const listener = (nft, tokenId, bidder, bid, timestamp) => {
  //   if (parseInt(asset.tokenId) === BigNumber.from(tokenId).toNumber()) {
  //     var currentTime = moment().unix();
  //     if (
  //       BigNumber.from(timestamp).toNumber() >= currentTime - 10 &&
  //       BigNumber.from(timestamp).toNumber() <= currentTime
  //     ) {
  //       getAuctionDetail();
  //     }
  //   }
  // };

  // useEffect(() => {
  //   auction.on("BidMade", listener);
  //   return () => {
  //     auction.removeListener("BidMade", listener);
  //   };
  // }, [auction]);

  useEffect(() => {
    if (asset && user) {
      const name = user.walletAddress;
      const room = asset._id;

      console.log("joined");

      socket.emit("join", { name, room }, (error) => {
        if (error) {
          alert(error);
        }
      });

      socket.on("bidNotif", ({ user, amount }) => {
        if (name !== user) {
          toast.info(`A user just bid ${amount} ETH`);
        }

        setTimeout(() => {
          getAuctionDetail();
        }, 10000);
      });

      return function cleanup() {
        socket.disconnect();
        //shut down connnection instance
      };
    }
  }, [asset, user]);

  // useEffect(() => {
  //   if (auctionDetails) {
  //      auctionContract.once("BidMade", (nft, tokenId, bidder, bid) => {
  //        toast.success(`A user has bid ${bid} ETH`);
  //      });

  //      //use for updating current bidder
  //      auctionContract.on("BidMade", (nft, tokenId, bidder, bid) => {
  //        const id = BigNumber.from(tokenId).toNumber();
  //        const bidAmount = bigNumberToFloat(bid);
  //        if (id === parseInt(asset.tokenId)) {
  //          setBidders([...bidders, { bidder, bidAmount: bidAmount }]);

  //          if (bidAmount > maxBid) {
  //            setMaxBid(bidAmount);
  //          }
  //        }
  //      });
  //   }
  // }, [process.env.REACT_APP_NFT_CONTRACT_ADDRESS]);

  const CardTitleLayout = () => {
    const deadline =
      auctionDetails && auctionDetails.duration !== undefined
        ? BigNumber.from(auctionDetails.duration).toNumber() * 1000
        : null;

    const onFinish = async () => {
      toast.success("Auction is now closed");
      setButtonDisabled(true);
      setIsModalVisible(false);
      setLoading(true);
      setConcludeModalVisible(true);
      const orginalSeller = auctionDetails.seller;

      try {
        if (auctionDetails.seller == user.walletAddress) {
          await auction.executeSale(nft.address, asset.tokenId);

          const newOwner = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/get-user?walletAddress=${auctionDetails.maxBidUser}`
          );
          const price = bigNumberToFloat(auctionDetails.maxBid);

          await axios
            .post(`${process.env.REACT_APP_API_URL}/assets/transaction`, {
              currentOwnerId: asset.currentOwner._id,
              id: asset._id,
              price: price,
              newOwnerId: newOwner.data._id,
              status: "Auction",
            })
            .then(() => {
              setLoading(false);
            });
        } else {
          setTimeout(async () => {
            try {
              const tx = await auction.getTokenAuctionDetails(
                nft.address,
                asset.tokenId
              );

              if (orginalSeller == tx.seller) {
                throw new Error("Transaction failed");
              }

              setLoading(false);
            } catch (e) {
              toast.error("Transaction failed");
              setLoading(false);
              setConcludeModalVisible(false);
            }
          }, 20000);
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        setConcludeModalVisible(false);
      }
    };

    return (
      <div>
        <h5>
          Currently on auction{" "}
          <FieldTimeOutlined
            style={{
              fontSize: "20px",
              position: "relative",
              top: "-3px",
            }}
          />
        </h5>
        <Countdown
          title="Auction ends in"
          value={deadline}
          onFinish={onFinish}
          format="m [minutes] ss [seconds]"
          valueStyle={{
            fontSize: "25px",
          }}
        />
      </div>
    );
  };

  const bigNumberToFloat = (number) => {
    return parseFloat(
      ethers.utils.formatEther(BigNumber.from(number).toBigInt())
    );
  };

  const convertETHtoUSD = async () => {
    if (asset.currentPrice !== undefined) {
      await axios
        .get(
          `https://api.coinconvert.net/convert/eth/usd?amount=${asset.currentPrice}`
        )
        .then((res) => {
          setCurrentUSDPrice(res.data.USD);
        });
    }
  };

  const isAuctionOver = () => {
    return (
      BigNumber.from(auctionDetails.duration).toNumber() <= moment().unix()
    );
  };

  const getAuctionDetail = async () => {
    setCardLoading(true);
    if (asset.status == "On Auction" && auction) {
      const auctionInfo = await auction.getTokenAuctionDetails(
        nft.address,
        asset.tokenId
      );
      setAuctionDetails(auctionInfo);
      setOnAuction(true);

      const bidAmounts = auctionInfo.bidAmounts.map((bid) => {
        return bigNumberToFloat(bid);
      });

      const bidderList = [];

      for (let i = 0; i < auctionInfo.users.length; i++) {
        bidderList.push({
          bidders: auctionInfo.users[i],
          bidAmounts: bidAmounts[i],
        });
      }

      setBidders(bidderList);
    } else {
      setOnAuction(false);
    }
    setCardLoading(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setConcludeModalVisible(false);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    if (!loading) {
      setIsModalVisible(false);
    }
  };

  const onSubmitBid = async (data) => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const bid = ethers.utils.parseEther(data.bid);

      try {
        await auction.bid(nft.address, asset.tokenId, {
          value: bid,
        });

        setIsModalVisible(false);
        toast.success("Bid successful");
        socket.emit("bid", {
          amount: data.bid,
          name: user.walletAddress,
        });

        setTimeout(() => {
          getAuctionDetail();
        }, 5000);
      } catch (error) {
        console.log(error);
        return toast.error("Bid failed");
      }
    }
  };

  const onSubmitUpdatedPrice = async (data) => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const marketplace = getMarketplaceContract();
      const price = ethers.utils.parseEther(data.updatedPrice);

      try {
        await marketplace.updateMarketplaceItemPrice(asset.tokenId, price);

        await axios.patch(
          `${process.env.REACT_APP_API_URL}/assets/update-price`,
          {
            id: asset._id,
            price,
          }
        );

        toast.success("Update price successful!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.log(error);
        toast.error("Update price failed");
      }
    }
  };

  const onSubmitBuy = async (data) => {
    setLoading(true);
    if (window.ethereum) {
      await window.ethereum.enable();
      const marketplace = getMarketplaceContract();
      const price = ethers.utils.parseEther(`${asset.currentPrice}`);

      try {
        await marketplace.createMarketplaceSale(
          process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
          asset.tokenId,
          {
            value: price,
          }
        );
        await axios
          .post(`${process.env.REACT_APP_API_URL}/assets/transaction`, {
            currentOwnerId: asset.currentOwner._id,
            id: asset._id,
            price: asset.currentPrice,
            newOwnerId: user._id,
            status: "Sale",
          })
          .then((res) => {
            toast.success("Asset sold successfully!");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          });
        const owner = await marketplace.getOwner(asset.tokenId);
        console.log(owner);
      } catch (error) {
        console.log(error);
        toast.error("Transaction failed");
      }
    }
    setLoading(false);
  };

  const renderConcludeModal = () => {
    return (
      <StyledModal
        title="Auction's Result"
        visible={concludeModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <StyledButtonModal
            type="primary"
            key="enter"
            onClick={() => {
              handleOk();

              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }}
            disabled={loading}
          >
            Okay
          </StyledButtonModal>,
        ]}
      >
        <>
          <div style={{ textAlign: "center" }}>
            {loading ? (
              auctionDetails.seller == user.walletAddress ? (
                <h6>Please confirm the transaction in the next 10 seconds</h6>
              ) : (
                <h4>Calculating winner...</h4>
              )
            ) : auctionDetails.maxBidUser == user.walletAddress ? (
              <>
                <h5>Congratulation! You are the winner!!!</h5>
              </>
            ) : (
              <>
                <h5>Auction's winner:</h5>
                <h4>{auctionDetails.maxBidUser}</h4>
              </>
            )}
          </div>
        </>
      </StyledModal>
    );
  };

  const renderBidButton = () => {
    const minimumBid =
      bigNumberToFloat(auctionDetails.maxBid) > 0 ||
      bigNumberToFloat(auctionDetails.price);
    return (
      <>
        <StyledButton
          type="primary"
          onClick={showModal}
          disabled={
            buttonDisabled || !auctionDetails.isActive || isAuctionOver()
          }
        >
          <WalletOutlined style={{ position: "relative", top: "-5px" }} />
          Place Bid
        </StyledButton>
        <form>
          <StyledModal
            title="Place a bid"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <StyledButtonModal
                type="primary"
                key="enter"
                onClick={handleSubmit(onSubmitBid)}
                disabled={errors.bid}
              >
                Bid
              </StyledButtonModal>,
            ]}
          >
            <Spin spinning={loading} indicator={loadingIcon}>
              <h6>Bid Amount: </h6>
              <Controller
                name="bid"
                control={control}
                rules={{
                  required: "Please enter your bid *",
                  min: {
                    value: minimumBid,
                    message: "Bid must be greater current highest bid",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    type="number"
                    addonBefore={
                      <EthereumIcon
                        style={{
                          fontSize: "15px",
                          position: "relative",
                          top: "-3px",
                        }}
                      />
                    }
                  />
                )}
              />
              <p style={{ color: "red" }}>{errors.bid && errors.bid.message}</p>
            </Spin>
          </StyledModal>
        </form>
      </>
    );
  };

  const renderBuyButton = () => {
    return (
      <>
        <StyledButton type="primary" onClick={showModal}>
          <WalletOutlined style={{ position: "relative", top: "-5px" }} />
          Buy now
        </StyledButton>
        <form>
          <StyledModal
            title="Confirm purchase"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <StyledButtonModal
                type="primary"
                key="enter"
                onClick={handleSubmit(onSubmitBuy)}
                disabled={loading}
              >
                Confirm
              </StyledButtonModal>,
            ]}
          >
            <Spin spinning={loading} indicator={loadingIcon}>
              <StyledRow style={{ fontWeight: "bold" }}>
                <Col span={12}>
                  <p>Item</p>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <p>Subtotal</p>
                </Col>
              </StyledRow>
              <hr style={{ margin: "0px" }} />
              <StyledRow style={{ marginTop: "5px" }}>
                <Col span={12}>
                  <p>{asset.name}</p>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <EthereumIcon
                    style={{
                      fontSize: "15px",
                      position: "relative",
                      top: "-3px",
                      marginRight: "5px",
                    }}
                  />
                  <span>{asset.currentPrice}</span>
                  <StyledStatistic
                    value={currentUSDPrice}
                    precision={2}
                    prefix="$"
                  />
                </Col>
              </StyledRow>
              <hr style={{ margin: "0px" }} />
              <StyledRow style={{ marginTop: "5px", fontWeight: "bold" }}>
                <Col span={12}>
                  <p>Total</p>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <EthereumIcon
                    style={{
                      fontSize: "15px",
                      position: "relative",
                      top: "-3px",
                      marginRight: "5px",
                    }}
                  />
                  <span>{asset.currentPrice}</span>
                  <StyledStatistic
                    value={currentUSDPrice}
                    precision={2}
                    prefix="$"
                  />
                </Col>
              </StyledRow>
            </Spin>
          </StyledModal>
        </form>
      </>
    );
  };

  const renderUpdatePriceButton = () => {
    return (
      <>
        <StyledButton type="primary" onClick={showModal}>
          <WalletOutlined style={{ position: "relative", top: "-5px" }} />
          Update Price
        </StyledButton>
        <form>
          <StyledModal
            title="Update asset price"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <StyledButtonModal
                type="primary"
                key="enter"
                onClick={handleSubmit(onSubmitUpdatedPrice)}
                disabled={errors.updatedPrice || loading}
              >
                Update
              </StyledButtonModal>,
            ]}
          >
            <Spin spinning={loading} indicator={loadingIcon}>
              <h6>New Price: </h6>

              <Controller
                name="updatedPrice"
                control={control}
                rules={{
                  required: "Please enter your new price *",
                  min: {
                    value: 0.1,
                    message: "Bid must be greater than 0.1 ETH *",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    type="number"
                    status="error"
                    addonBefore={
                      <EthereumIcon
                        style={{
                          fontSize: "15px",
                          position: "relative",
                          top: "-3px",
                        }}
                      />
                    }
                  />
                )}
              />
              <p style={{ color: "red" }}>
                {errors.updatedPrice && errors.updatedPrice.message}
              </p>
            </Spin>
          </StyledModal>
        </form>
      </>
    );
  };

  const renderConfirmSale = () => {
    const confirmSale = async () => {
      try {
        await auction.executeSale(nft.address, asset.tokenId);

        const newOwner = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/get-user?walletAddress=${auctionDetails.maxBidUser}`
        );
        const price = bigNumberToFloat(auctionDetails.maxBid);

        await axios
          .post(`${process.env.REACT_APP_API_URL}/assets/transaction`, {
            currentOwnerId: asset.currentOwner._id,
            id: asset._id,
            price: price,
            newOwnerId: newOwner.data._id,
            status: "Auction",
          })
          .then(() => {
            window.location.reload();
          });
      } catch {
        toast.error("Error confirming sale");
      }
    };
    return (
      isAuctionOver() && (
        <>
          <StyledButton type="primary" onClick={() => confirmSale()}>
            <WalletOutlined style={{ position: "relative", top: "-5px" }} />
            Confirm Sale
          </StyledButton>
        </>
      )
    );
  };

  const renderButtons = () => {
    if (user && user._id == asset.currentOwner._id) {
      return onAuction
        ? auctionDetails.isActive && renderConfirmSale()
        : renderUpdatePriceButton();
    } else {
      return onAuction ? renderBidButton() : renderBuyButton();
    }
  };

  const renderStatusText = () => {
    if (Object.keys(auctionDetails).length !== 0) {
      return auctionDetails.bidAmounts.length == 0
        ? "Starting bid"
        : `Current highest bid`;
    }

    return "Current Price";
  };

  const renderPrice = () => {
    if (Object.keys(auctionDetails).length !== 0) {
      return auctionDetails.bidAmounts.length == 0
        ? bigNumberToFloat(auctionDetails.price)
        : bigNumberToFloat(auctionDetails.maxBid);
    }

    return asset.currentPrice;
  };

  return (
    <>
      {!asset ? (
        <StyledSpinningLayout>
          <Spin spinning indicator={loadingIcon} />
        </StyledSpinningLayout>
      ) : (
        <StyledLayout>
          <p>{asset.currentCollection.name}</p>
          <StyledHeader>{asset.name}</StyledHeader>
          <p>Currently owned by: {asset.currentOwner.name}</p>
          {asset.status !== "Not Listing" && (
            <Spin spinning={cardLoading} indicator={loadingIcon}>
              <StyledCard title={onAuction ? <CardTitleLayout /> : null}>
                <p>{renderStatusText()}</p>
                <h3>
                  <EthereumIcon
                    style={{
                      fontSize: "30px",
                      position: "relative",
                      top: "-7px",
                      marginRight: "5px",
                    }}
                  />
                  <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                    {renderPrice()}
                  </span>
                  <StyledStatistic
                    style={{ display: "inline-block" }}
                    value={currentUSDPrice !== undefined ? currentUSDPrice : 0}
                    precision={2}
                    prefix="$"
                  />
                </h3>
                {renderButtons()}
                {renderConcludeModal()}
              </StyledCard>
            </Spin>
          )}
          {asset.status === "On Auction" && <AssetBidder bidders={bidders} />}
          <AssetPriceChart />
        </StyledLayout>
      )}
    </>
  );
};

export default AssetDetails;
