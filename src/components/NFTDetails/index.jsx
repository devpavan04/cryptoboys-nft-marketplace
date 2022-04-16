import React from "react";
import styled from "styled-components";
import AssetImage from "./AssetImage.jsx";
import AssetDetails from "./AssetDetails.jsx";
import AssetActivity from "./AssetActivity.jsx";
import { Row, Col, Affix, Button } from "antd";
import { useHistory } from "react-router-dom";

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

const OptionLayout = styled.div`
  width: 100%;
  height: 65px;
  background-color: rgba(251, 253, 255);
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  flex-direction: row-reverse;
`;

const StyledButton = styled(Button)`
  border-radius: 10px;
  font-size: 20px;
  width: 150px;
  height: fit-content;
  font-weight: bold;
  margin-right: 8rem;
  margin-top: 10px;
`;

const NFTDetails = () => {
  const history = useHistory();
  const colProps = {
    xs: 24,
    sm: 24,
  };

  const onSellClick = () => {
    history.push("/listing");
  };
  return (
    <>
      <Affix>
        <OptionLayout>
          <StyledButton type="primary" onClick={() => onSellClick()}>
            Sell
          </StyledButton>
          <StyledButton
            type="primary"
            style={{
              marginRight: "10px",
              backgroundColor: "white",
              color: "#038cfc",
            }}
          >
            Edit
          </StyledButton>
        </OptionLayout>
      </Affix>
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
    </>
  );
};

export default NFTDetails;
