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

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const CardComponent = (props) => {
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
        width: collapsed ? "310px" : "335px",
        height: collapsed ? "400px" : "420px",
      }}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{
            width: collapsed ? "310px" : "335px",
            height: collapsed ? "290px" : "310px",
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
          <p style={{ margin: "2px" }}>Collection Name</p>
          <h4>NFT name</h4>
        </StyledSpace>

        <StyledSpace
          direction="vertical"
          size={0}
          style={{ marginRight: "5px", textAlign: "right" }}
        >
          <p style={{ margin: "2px" }}>Price</p>
          <Space direction="horizontal" size={0}>
            <EthereumIcon
              style={{ fontSize: "18px", position: "relative", top: "-7px" }}
            />
            <h4>0.05</h4>
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
    </StyledCard>
  );
};

export default CardComponent;
