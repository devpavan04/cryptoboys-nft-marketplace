import React, { useState } from "react";
import styled from "styled-components";
import { Collapse } from "antd";
import { useSelector } from "react-redux";

const { Panel } = Collapse;

const StyledLayout = styled.div`
  margin-top: 15px;
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

const SellerDesc = () => {
  const asset = useSelector((state) => state.asset);
  return (
    <StyledLayout>
      <StyledCollaped defaultActiveKey={["1"]} expandIconPosition="right">
        <Panel header="About me" key="1">
          <p>
            {asset && asset.currentOwner.bio !== ""
              ? asset.currentOwner.bio
              : "Not provided by seller."}
          </p>
        </Panel>
      </StyledCollaped>
    </StyledLayout>
  );
};

export default SellerDesc;
