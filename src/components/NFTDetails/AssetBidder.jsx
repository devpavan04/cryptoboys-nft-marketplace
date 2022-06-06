import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Collapse, Table, Button } from "antd";
import Icon, { FireOutlined, DollarOutlined } from "@ant-design/icons";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

const { Panel } = Collapse;

const StyledLayout = styled.div`
  margin-top: 15px;
  width: 100%;
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

const StyledIcon = styled(Icon)`
  position: relative;
  top: -3px;
`;

const StyledLink = styled.a`
  color: #00a8ff;
  text-decoration: none;
`;

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const columns = [
  {
    title: "Bidder",
    dataIndex: "bidders",
    key: "bidders",
    render: (text) => {
      return <span>{text}</span>;
    },
  },
  {
    title: "Bid amount",
    dataIndex: "bidAmounts",
    key: "bidAmounts",
    render: (bid) => {
      return (
        <div>
          {bid !== 0 && (
            <span>
              <EthereumIcon
                style={{
                  fontSize: "18px",
                  position: "relative",
                  top: "-3px",
                  marginRight: "1px",
                }}
              />
              {bid}
            </span>
          )}
        </div>
      );
    },
  },
];

const AssetBidder = (props) => {
  const asset = useSelector((state) => state.asset);
  const [bidderList, setBidderList] = useState([]);

  useEffect(() => {
    setBidderList(props.bidders.reverse());
  }, [props.bidders]);

  return (
    <StyledLayout>
      <StyledCollaped defaultActiveKey={["1"]} expandIconPosition="right">
        <Panel header="Auction Bidders" key="1">
          <Table
            columns={columns}
            dataSource={bidderList}
            pagination={{ position: ["none", "none"] }}
            scroll={{ y: 300 }}
          />
        </Panel>
      </StyledCollaped>
    </StyledLayout>
  );
};

export default AssetBidder;
