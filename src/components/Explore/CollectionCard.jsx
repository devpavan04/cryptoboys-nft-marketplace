import React from "react";
import { Card, Image } from "antd";
import styled from "styled-components";

const StyledCard = styled(Card)`
  width: 400px;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  border: 1px solid #e8e8e8;

  .ant-card-body {
    padding: 0px !important;
  }

  &:hover {
    box-shadow: 0px 0px 8px 0px rgba(4, 17, 29, 0.25);
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const StyledBannerImage = styled(Image)`
  width: 100%;
  height: 150px;
  border-radius: 10px 10px 0px 0px;
`;

const StyledBanner = styled.div`
  width: 100%;
  height: 150px;
  margin: 0 auto !important;
  text-align: center;
  background-color: #fafafa;
  border-radius: 10px 10px 0px 0px;
`;

const StyledHeader = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 25px;
  color: black;
`;

const StyledSubHeader = styled.div`
  text-align: center;
  font-size: 15px;
`;

const StyledDesc = styled.div`
  text-align: center;
  font-size: 15px;
  margin-top: 1rem;
  padding: 2rem;
  padding-top: 0px;
`;

const CollectionCard = () => {
  return (
    <StyledCard>
      <StyledBanner>
        <StyledBannerImage
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          preview={false}
        />
      </StyledBanner>

      <StyledHeader>Collection's name</StyledHeader>
      <StyledSubHeader>By Owner</StyledSubHeader>
      <StyledDesc>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        euismod, urna eu tincidunt consectetur, nisi nisl tincidunt nisi, eget
        consectetur nisl nisl euismod nisi.
      </StyledDesc>
    </StyledCard>
  );
};

export default CollectionCard;
