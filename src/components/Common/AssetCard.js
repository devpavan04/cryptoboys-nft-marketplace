import React, { useState } from "react";
import { Card, Space, Tooltip } from "antd";
import styled from "styled-components";
import Icon, { HeartOutlined, HeartTwoTone } from "@ant-design/icons";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";

const StyledCard = styled(Card)`
  border-radius: 10px;
  transition: all 0.3s ease;

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

const HeartStyle = {
  marginLeft: "10px",
  fontSize: "20px",
};

const StyledCardInfo = styled.span`
  position: relative;
  left: 180px;
  font-size: 12px;
  font-weight: bold;
  color: gray;
`;

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const AssetCard = (props) => {
  // const title = props.title;
  // const desc = props.desc;
  // const image = props.image;
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
        height:  "420px",
      }}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{
            width: "300px",
            height:  "310px",
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
          <p style={{ marginBottom: "0px", color: "gray" }}>Collection Name</p>
          <p style={{ fontWeight: "bold" }}>NFT name</p>
        </StyledSpace>

        <StyledSpace
          direction="vertical"
          size={0}
          style={{ marginRight: "5px", textAlign: "right" }}
        >
          <p style={{ marginBottom: "0px", color: "gray" }}>
            {props.isFixedPrice ? "Price" : "Bid"}
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
            <p style={{ fontWeight: "bold" }}>
              {props.price ? props.price : 0}
            </p>
          </Space>
        </StyledSpace>
      </StyledCardContent>
      <hr style={{ marginTop: "5px", marginBottom: "2px" }} />
      <Tooltip placement="right" title="Favorite">
        {favorited ? (
          <HeartTwoTone style={HeartStyle} onClick={() => addToFavorite()} />
        ) : (
          <HeartOutlined style={HeartStyle} onClick={() => addToFavorite()} />
        )}
      </Tooltip>
      <StyledCardInfo style={{ left: props.isFixedPrice ? "230px" : "180px" }}>
        {props.isFixedPrice ? "Sale" : "On Auction"}
      </StyledCardInfo>
    </StyledCard>
  );
};

export default AssetCard;
