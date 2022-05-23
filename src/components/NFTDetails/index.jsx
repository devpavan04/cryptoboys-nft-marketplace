import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AssetImage from "./AssetImage.jsx";
import AssetDetails from "./AssetDetails.jsx";
import AssetActivity from "./AssetActivity.jsx";
import { Row, Col, Affix, Button, Empty, Typography, Spin } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsset } from "../../state/action/assetAction.js";
import { toast } from "react-toastify";

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

const { Paragraph } = Typography;

const NFTDetails = () => {
  const history = useHistory();
  const { id } = useParams();
  const asset = useSelector((state) => state.asset);
  const user = useSelector((state) => state.user);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const colProps = {
    xs: 24,
    sm: 24,
  };

  const onSellClick = () => {
    history.push(`/listing/${asset._id}`);
  };

  const onEditClick = () => {
    history.push(`/assets/edit/${asset._id}`);
  };

  useEffect(() => {
    dispatch(fetchAsset(id)).catch(() => {
      toast.error("Cannot found the asset");
      setNotFound(true);
    });
    setLoading(false);
  }, []);

  return (
    <>
      {notFound ? (
        <Empty
          description={
            <span>
              <Paragraph>
                Sorry, we couldn't find the asset you are looking for.
              </Paragraph>
              <Paragraph>Please check the URL and try again.</Paragraph>
            </span>
          }
        />
      ) : (
        <Spin spinning={loading}>
          {asset && user && user._id == asset.currentOwner._id && (
            <Affix>
              <OptionLayout>
                {asset.status ==  "Not Listing" && (
                  <StyledButton type="primary" onClick={() => onSellClick()}>
                    Sell
                  </StyledButton>)
                }
                <StyledButton
                  type="primary"
                  style={{
                    marginRight: asset.status ==  "Not Listing" ? "10px" : "8rem",
                    backgroundColor: "white",
                    color: "#038cfc",
                  }}
                  onClick={() => onEditClick()}
                >
                  Edit
                </StyledButton>
              </OptionLayout>
            </Affix>
          )}
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
        </Spin>
      )}
    </>
  );
};

export default NFTDetails;
