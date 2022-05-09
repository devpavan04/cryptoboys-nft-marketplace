import React, { useState } from "react";
import styled from "styled-components";
import { Menu } from "antd";
import CollectionCard from "../Common/CollectionCard";

const StyledLayout = styled.div`
  padding: 0.5rem 1rem;
  margin-top: 3rem;
  margin: 0 auto;
  width: 95%;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 500px) {
     width: 100%;
`;

const StyledHeader = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 2.5rem;
  color: black;
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

const StyledMenu = styled(Menu)`
  font-weight: bold;
  justify-content: center;

  .ant-menu-item {
    text-align: center;
    padding: 0rem !important;
    width: 150px;

    .ant-menu-title-content {
      font-size: 1.25rem !important;
    }

    ::after {
      width: 80% !important;
      left: 15px !important;
    }
    &:hover {
      color: black !important;
    }
  }
`;

const StyledContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (min-width: 600px) {
    padding: 0px 20px;
  }
`;

const Explore = () => {
  const [currentTab, setCurrentTab] = useState("art");

  const changeTab = (e) => {
    setCurrentTab(e.key);
  };
  return (
    <StyledLayout>
      <StyledHeader>Explore Collections</StyledHeader>
      <StyledMenu
        onClick={changeTab}
        selectedKeys={[currentTab]}
        mode="horizontal"
      >
        <Menu.Item key="art">Art</Menu.Item>
        <Menu.Item key="video">Video</Menu.Item>
        <Menu.Item key="gif">GIF</Menu.Item>
      </StyledMenu>
      <StyledContainer></StyledContainer>
    </StyledLayout>
  );
};

export default Explore;
