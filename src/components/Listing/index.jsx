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
import { useParams } from "react-router-dom";
import { fetchAsset } from "../../state/action/assetAction";
import { toast } from "react-toastify";
import NFTMarketplace from "../../build/abis/NFTMarketplace.json";
import NFT from "../../build/abis/NFT.json";
import axios from "axios";

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
  const [value, setValue] = useState();
  const [priceState, setPriceState] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const asset = useSelector((state) => state.asset);
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm();

  useEffect(() => {
    if (asset == "" || asset == undefined) {
      dispatch(fetchAsset(id)).catch(() => {
        toast.error("Cannot found the asset");
        setNotFound(true);
      });
    }
  }, [asset]);

  //#region handle date picker
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return current.isBefore(moment() - 1, "day");
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > dateRangeValue;
    const tooEarly =
      dates[1] && dates[1].diff(current, "days") > dateRangeValue;
    return tooEarly || tooLate;
  };

  const handleDateRangeSelect = (value) => {
    setHackValue([]);
    setDates([]);
    setValue(null);
    setDateRangeValue(value);
  };

  const onOpenChange = (open) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };
  //#endregion

  const onButtonClick = () => {
    setIsFixedPrice(!isFixedPrice);
  };

  const getNFTContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
    const nftContract = new ethers.Contract(contractAddress, NFT.abi, signer);

    return nftContract;
  };

  const getMarketplaceContract = () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress =
        process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS;
      const marketplaceContract = new ethers.Contract(
        contractAddress,
        NFTMarketplace.abi,
        signer
      );

      return marketplaceContract;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    await window.ethereum.enable();
    const marketplace = getMarketplaceContract();
    const price = ethers.utils.parseEther(data.amount);

    if (isFixedPrice) {
      let listingPrice = await marketplace.getListingPrice();
      listingPrice = listingPrice.toString();

      try {
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
          const nft = getNFTContract();

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

        const res = await updateToServer(id, data.amount);
        if (res) {
          toast.success(res.data);
        } else {
          toast.error("Listing Failed");
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Lisiting failed");
        setLoading(false);
      }
    }
  };

  const updateToServer = async (id, price) => {
    const res = await axios.patch(
      `${process.env.REACT_APP_API_URL}/assets/listing`,
      {
        id,
        status: "Sale",
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
        asset && (
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
                          Auction
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
                        <StyledLabel>Duration</StyledLabel>
                        <StyledCollaped
                          defaultActiveKey={["1"]}
                          expandIconPosition="right"
                          collapsible="disabled"
                        >
                          <Panel
                            header="Select Date Range"
                            key="1"
                            style={{ height: "430px" }}
                          >
                            <StyledHeader>
                              Date Range
                              <StyledSelect
                                defaultValue={1}
                                onChange={handleDateRangeSelect}
                                value={
                                  value
                                    ? `${value[1].diff(value[0], "days")} days`
                                    : `${dateRangeValue} days`
                                }
                              >
                                <Option value={1}>1 day</Option>
                                <Option value={3}>3 days</Option>
                                <Option value={7}>7 days</Option>
                                <Option value={30}>1 month</Option>
                                <Option value={90}>3 months</Option>
                              </StyledSelect>
                            </StyledHeader>

                            <StyledRangePicker
                              value={hackValue || value}
                              disabledDate={disabledDate}
                              onCalendarChange={(val) => setDates(val)}
                              onChange={(val) => setValue(val)}
                              onOpenChange={onOpenChange}
                              placement="bottomRight"
                              showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [
                                  moment("00:00:00", "HH:mm"),
                                  moment("11:59:59", "HH:mm"),
                                ],
                              }}
                              format="dddd DD-MM-YYYY HH:mm a"
                            />
                            <Result
                              icon={<CalendarOutlined />}
                              title={
                                value
                                  ? `Thank you for your selection.`
                                  : "Please choose date range above!"
                              }
                            />
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
        )
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Listing;
