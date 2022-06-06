import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import {
  Row,
  Col,
  Button,
  Space,
  Input,
  Collapse,
  DatePicker,
  Select,
  Result,
  Empty,
  Spin,
} from "antd";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";
import Icon from "@ant-design/icons";
import moment from "moment";
import { CalendarOutlined } from "@ant-design/icons";
import PreviewAssetCard from "../Common/PreviewAssetCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useParams, useHistory } from "react-router-dom";
import { fetchAsset } from "../../state/action/assetAction";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getNFTContract,
  getMarketplaceContract,
  getAuctionContract,
} from "../../contractInstances";

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

//#region Styled Components
const StyledLayout = styled.div`
  padding: 1rem 1rem;
  margin-top: 3rem;
  margin: 0 auto;
  width: 85%;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 500px) {
     width: 100%;
`;

const StyledLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: gray;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const StyledButton = styled(Button)`
  font-size: 20px;
  width: 250px;
  height: 50px;
  font-weight: bold;
  &:hover {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
  }
`;

const CompleteButton = styled(Button)`
  border-radius: 10px;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 15px;
  height: 40px;
`;

const StyledContainer = styled.div`
  width: 95%;
  margin: 0 auto;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCollaped = styled(Collapse)`
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  .ant-collapse-item {
    .ant-collapse-header {
      font-weight: bold;
      font-size: 1rem;
    }

    .ant-collapse-content {
      border-radius: 0 0 10px 10px;
    }
  }
`;

const StyledRangePicker = styled(RangePicker)`
  width: 100%;
  border-radius: 10px;
  height: 50px;

  .ant-picker-input > input {
    font-weight: bold !important;
  }
`;

const StyledHeader = styled.div`
margin-left:10px
  color: black;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 2rem;
`;

const StyledSelect = styled(Select)`
  width: 50%;
  margin-left: 20px;

  .ant-select-selector {
    border-radius: 5px !important;
  }
`;

//#endregion

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const Listing = () => {
  const [isFixedPrice, setIsFixedPrice] = useState(true);
  const [dateRangeValue, setDateRangeValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const [hackValue, setHackValue] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [value, setValue] = useState();
  const [priceState, setPriceState] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const asset = useSelector((state) => state.asset);
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm();
  const auction = getAuctionContract();
  const nft = getNFTContract();
  const marketplace = getMarketplaceContract();

  useEffect(() => {
    if (asset == "" || asset == undefined) {
      dispatch(fetchAsset(id)).catch(() => {
        toast.error("Cannot found the asset");
        setNotFound(true);
      });
    }
  }, [asset]);

  const handleTimeSelect = (value) => {
    setValue(value);
  };

  const onButtonClick = () => {
    setIsFixedPrice(!isFixedPrice);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    await window.ethereum.enable();

    try {
      const price = ethers.utils.parseEther(data.amount);

      if (isFixedPrice) {
        let listingPrice = await marketplace.getListingPrice();
        listingPrice = listingPrice.toString();

        if (asset.currentPrice == 0 || asset.currentPrice == undefined) {
          await marketplace.createMarketplaceItem(
            `${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}`,
            asset.tokenId,
            price,
            {
              value: listingPrice,
            }
          );
        } else {
          await nft.giveResaleApproval(asset.tokenId);
          await marketplace.resellToken(
            `${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}`,
            asset.tokenId,
            price,
            {
              value: listingPrice,
            }
          );
        }
      } else {
        const duration = moment().unix() + value * 60;
        if (asset.currentPrice == 0 || asset.currentPrice == undefined) {
          await auction.createTokenAuction(
            `${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}`,
            asset.tokenId,
            price,
            duration
          );
        } else {
          await nft.giveResaleApproval(asset.tokenId);
          await auction.recreateTokenAuction(
            `${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}`,
            asset.tokenId,
            price,
            duration
          );
        }
      }

      const res = await updateToServer(asset._id, data.amount);
      if (res) {
        toast.success(res.data);
      } else {
        toast.error("Listing Failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Lisiting failed");
      setLoading(false);
    }

    setLoading(false);
  };

  const updateToServer = async (id, price) => {
    const status = isFixedPrice ? "Sale" : "On Auction";

    const res = await axios.patch(
      `${process.env.REACT_APP_API_URL}/assets/listing`,
      {
        id,
        status: status,
        price,
      }
    );
    return res;
  };

  const onInputChange = (e) => {
    setPriceState(e.target.value);
  };

  return (
    <>
      {!notFound ? (
        asset && user && asset.currentOwner._id == user._id ? (
          <Spin spinning={loading} tip="Listing your asset">
            <StyledLayout>
              <h3 style={{ fontWeight: "bold", marginBottom: "15px" }}>
                List item for sale
              </h3>
              <Row gutter={[30, 0]}>
                <Col xs={24} sm={24} md={24} xl={12}>
                  <form>
                    <StyledLabel>Type</StyledLabel>
                    <StyledContainer>
                      <Space size={0}>
                        <StyledButton
                          type="primary"
                          disabled={isFixedPrice}
                          onClick={() => onButtonClick()}
                          style={{ borderRadius: "10px 0px 0px 10px" }}
                        >
                          Fixed Price
                        </StyledButton>
                        <StyledButton
                          type="primary"
                          disabled={!isFixedPrice}
                          onClick={() => onButtonClick()}
                          style={{ borderRadius: "0px 10px 10px 0px" }}
                        >
                          Flash Auction
                        </StyledButton>
                      </Space>
                    </StyledContainer>
                    <StyledLabel>
                      {isFixedPrice ? "Price" : "Starting price"}
                    </StyledLabel>
                    <Controller
                      name="amount"
                      control={control}
                      rules={{
                        required: "Please enter your Amount *",
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="Amount"
                          style={{
                            width: "100%",
                            borderRadius: "10px",
                            height: "50px",
                          }}
                          onChange={(e) => {
                            onInputChange(e);
                            onChange(e);
                          }}
                          value={value}
                          onBlur={onBlur}
                          type="number"
                          status="error"
                          prefix={
                            <EthereumIcon
                              style={{
                                color: "rgba(0,0,0,.25)",
                                fontSize: "25px",
                              }}
                            />
                          }
                        />
                      )}
                    />
                    <p style={{ color: "red" }}>
                      {errors.amount && "Please enter amount *"}
                    </p>

                    {!isFixedPrice && (
                      <>
                        <StyledLabel>Auction Duration</StyledLabel>
                        <StyledCollaped
                          defaultActiveKey={["1"]}
                          expandIconPosition="right"
                          collapsible="disabled"
                        >
                          <Panel header="Select Duration" key="1">
                            <StyledHeader>
                              Time
                              <StyledSelect
                                placeholder="Select Time"
                                onChange={handleTimeSelect}
                              >
                                <Option value={5}>5 minutes</Option>
                                <Option value={10}>10 minutes</Option>
                                <Option value={15}>15 minutes</Option>
                              </StyledSelect>
                            </StyledHeader>
                          </Panel>
                        </StyledCollaped>
                      </>
                    )}
                    <CompleteButton
                      type="primary"
                      onClick={handleSubmit(onSubmit)}
                      disabled={
                        isFixedPrice
                          ? errors.amount
                          : errors.amount
                          ? true
                          : value == undefined
                      }
                    >
                      Complete Listing
                    </CompleteButton>
                  </form>
                </Col>
                <Col xs={0} sm={0} md={0} xl={12}>
                  <StyledLabel>Preview</StyledLabel>
                  <PreviewAssetCard
                    price={priceState}
                    isFixedPrice={isFixedPrice}
                    asset={asset}
                    listingMode={true}
                  />
                </Col>
              </Row>
            </StyledLayout>
          </Spin>
        ) : (
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
              <Button type="primary" onClick={() => history.push("/")}>
                Back Home
              </Button>
            }
          />
        )
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Listing;
