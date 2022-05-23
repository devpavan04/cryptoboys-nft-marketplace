import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Card, Statistic, Modal, Row, Col, Input } from "antd";
import Icon, { FieldTimeOutlined, WalletOutlined } from "@ant-design/icons";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import AssetPriceChart from "./AssetPriceChart.jsx";
import { useSelector } from "react-redux";
import NFTMarketplace from "../../build/abis/NFTMarketplace.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const { Countdown } = Statistic;
const { confirm } = Modal;

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

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const AssetDetails = () => {
  const [onAuction, setOnAuction] = useState(true);
  const [currentUSDPrice, setCurrentUSDPrice] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const asset = useSelector((state) => state.asset);
  const user = useSelector((state) => state.user);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const CardTitleLayout = () => {
    const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK
    const onFinish = () => {
      console.log("finished!");
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
        />
      </div>
    );
  };

  const convertETHtoUSD = () => {
    if (asset.currentPrice !== undefined) {
      axios.get(
        `https://api.coinconvert.net/convert/eth/usd?amount=${asset.currentPrice}`
      ).then((res) => {
        setCurrentUSDPrice(res.data.USD);
      })
    } 
  };

  useEffect(() => {
    convertETHtoUSD(); 
  }, [asset]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getMarketplaceContract = () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress =
        process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESSS;
      const marketplaceContract = new ethers.Contract(
        contractAddress,
        NFTMarketplace.abi,
        signer
      );

      return marketplaceContract;
    }
  };

  const updateToServer = async (id, price) => {
    const res = await axios.patch(
      `${process.env.REACT_APP_API_URL}/assets/update-price`,
      {
        id,
        price,
      }
    );
    return res;
  };

  const onSubmitBid = (data) => {
    console.log(data);
  };

  const onSubmitUpdatedPrice = async (data) => {
    await window.ethereum.enable();
    const marketplace = getMarketplaceContract();
    const price = ethers.utils.parseEther(data.updatedPrice);

    try {
      await marketplace.updateMarketplaceItem(asset.tokenId, price);

      const res = await updateToServer(asset._id, data.updatedPrice);
      if (res) {
        toast.success("Update price successful!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } 
    } catch (error) {
      console.log(error);
      toast.error("Update price failed");
    }
  };

  const renderBidButton = () => {
    return (
      <>
        <StyledButton type="primary" onClick={showModal}>
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
            <h6>Bid Amount: </h6>

            <Controller
              name="bid"
              control={control}
              rules={{
                required: "Please enter your bid *",
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
            <p style={{ color: "red" }}>{errors.bid && errors.bid.message}</p>
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
        <StyledModal
          title="Confirm purchase"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <StyledButtonModal type="primary" key="enter" onClick={handleOk}>
              Confirm
            </StyledButtonModal>,
          ]}
        >
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
              <p>ItemName</p>
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
              <span>0.05</span>
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
              <span>0.05</span>
              <StyledStatistic
                value={currentUSDPrice}
                precision={2}
                prefix="$"
              />
            </Col>
          </StyledRow>
        </StyledModal>
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
                disabled={errors.updatedPrice}
              >
                Update
              </StyledButtonModal>,
            ]}
          >
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
            <p style={{ color: "red" }}>{errors.updatedPrice && errors.updatedPrice.message}</p>
          </StyledModal>
        </form>
      </>
    );
  };

  return (
    <StyledLayout>
      <p>{asset && asset.currentCollection.name}</p>
      <StyledHeader>{asset && asset.name}</StyledHeader>
      <p>Currently owned by: {asset && asset.currentOwner.name}</p>
      {asset.status !== "Not Listing" && (
        <StyledCard
          title={asset.status == "On Auction" ? <CardTitleLayout /> : null}
        >
          <p>
            {asset.status == "On Auction" ? "Current Bid:" : "Current Price: "}
          </p>
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
              {asset.currentPrice}
            </span>
            <StyledStatistic
              style={{ display: "inline-block" }}
              value={currentUSDPrice}
              precision={2}
              prefix="$"
            />
          </h3>
          {asset.status == "On Auction" ? renderBidButton() : (
            user && user._id == asset.currentOwner._id ? renderUpdatePriceButton() : renderBuyButton()
          )}
        </StyledCard>
      )}
      <AssetPriceChart />
    </StyledLayout>
  );
};

export default AssetDetails;
