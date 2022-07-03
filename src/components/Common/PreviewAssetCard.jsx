import React, { useState } from "react";
import { Card, Space } from "antd";
import styled from "styled-components";
import Icon from "@ant-design/icons";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const StyledCard = styled(Card)`
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  .ant-card-body {
    padding: 0;
  }
`;

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledSpace = styled(Space)`
  margin-top: 10px;
`;

const StyledCardInfo = styled.span`
  margin-left: 10px;
  font-size: 12px;
  font-weight: bold;
  color: gray;
`;

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const AssetCard = (props) => {
  const { asset, price, isFixedPrice } = props;
  const collapsed = props.collapsed;
  const [favorited, setFavorited] = useState(false);

  const addToFavorite = () => {
    setFavorited(!favorited);
  };

  return (
    <StyledCard
      hoverable={true}
      style={{
        width: "300px",
        height: "420px",
      }}
      cover={
        <img
          alt="example"
          src={asset.uriID}
          style={{
            width: "300px",
            height: "310px",
            borderRadius: "10px 10px 0px 0px",
          }}
        />
      }
    >
      <StyledCardContent>
        <StyledSpace
          direction="vertical"
          size={0}
          style={{ marginLeft: "10px" }}
        >
          <p style={{ marginBottom: "0px", color: "gray" }}>
            {asset.currentCollection.name}
          </p>
          <p style={{ fontWeight: "bold" }}>{asset.name}</p>
        </StyledSpace>

        <StyledSpace
          direction="vertical"
          size={0}
          style={{ marginRight: "5px", textAlign: "right" }}
        >
          <p style={{ marginBottom: "0px", color: "gray" }}>
            {isFixedPrice ? "Price" : "Starting Bid"}
          </p>
          <Space direction="horizontal" size={0}>
            <EthereumIcon
              style={{
                fontSize: "15px",
                position: "relative",
                top: "-12px",
                left: "-5px",
              }}
            />
            <p style={{ fontWeight: "bold" }}>{price ? price : 0}</p>
          </Space>
        </StyledSpace>
      </StyledCardContent>
      <hr style={{ marginTop: "5px", marginBottom: "2px" }} />
      <StyledCardInfo>{isFixedPrice ? "Sale" : "On Auction"}</StyledCardInfo>
    </StyledCard>
  );
};

export default AssetCard;
