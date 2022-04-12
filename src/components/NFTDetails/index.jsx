import React from "react";
import styled from "styled-components";
import AssetImage from "./AssetImage.jsx";
import AssetDetails from "./AssetDetails.jsx";
import AssetActivity from "./AssetActivity.jsx";
import { Row, Col } from "antd";

const StyledLayout = styled.div`
  padding: 0.5rem 1rem;
  margin-top: 3rem;
  margin: 0 auto;
  width: 85%;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 500px) {
     width: 100%;
`;

const NFTDetails = () => {
  const colProps = {
    xs: 24,
    sm: 24,
  };
  return (
    <StyledLayout>
      <Row>
        <Col {...colProps} md={10}>
          <AssetImage />
        </Col>
        <Col {...colProps} md={14}>
          <AssetDetails />
        </Col>
      </Row>
      <Row md={24}>
        <AssetActivity />
      </Row>
    </StyledLayout>
  );
};

export default NFTDetails;
