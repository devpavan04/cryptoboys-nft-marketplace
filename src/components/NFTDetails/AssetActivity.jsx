import React, { useState } from "react";
import styled from "styled-components";
import { Collapse, Table } from "antd";
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
    title: "Event",
    dataIndex: "type",
    key: "type",
    render: (text) => {
      return (
        <span>
          {text === "Sale" ? (
            <StyledIcon component={DollarOutlined} style={{ color: "green" }} />
          ) : (
            <StyledIcon component={FireOutlined} style={{ color: "red" }} />
          )}{" "}
          {text}
        </span>
      );
    },
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (price) => {
      return (
        <div>
          {price !== 0 && (
            <span>
              <EthereumIcon
                style={{
                  fontSize: "18px",
                  position: "relative",
                  top: "-3px",
                  marginRight: "1px",
                }}
              />
              {price}
            </span>
          )}
        </div>
      );
    },
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
    render: (text) => (
      <>
        {text == null ? (
          "Null Address"
        ) : (
          <StyledLink>{text.walletAddress}</StyledLink>
        )}
      </>
    ),
  },
  {
    title: "To",
    key: "to",
    dataIndex: "to",
    render: (text) => (
      <Link to={`/account/${text.walletAddress}`}>
        <StyledLink>{text.walletAddress}</StyledLink>
      </Link>
    ),
  },
  {
    title: "Date",
    key: "date",
    dataIndex: "date",
    render: (text) => <p>{moment(text).format("DD/MM/YYYY")}</p>,
  },
];

const AssetActivity = () => {
  const asset = useSelector((state) => state.asset);
  return (
    <StyledLayout>
      <StyledCollaped defaultActiveKey={["1"]} expandIconPosition="right">
        <Panel header="Asset Activities" key="1">
          <Table
            columns={columns}
            dataSource={asset.history}
            pagination={{ position: ["none", "none"] }}
            scroll={{ y: 200 }}
          />
        </Panel>
      </StyledCollaped>
    </StyledLayout>
  );
};

export default AssetActivity;
