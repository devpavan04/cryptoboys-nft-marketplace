import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Menu } from "antd";
import CollectionCard from "../Common/CollectionCard";
import axios from "axios";
import AssetCard from "../Common/AssetCard";

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

const optionItems = [
  { title: "Art", key: 0 },
  { title: "Video", key: 1 },
  { title: "Gif", key: 2 },
];

const Explore = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [resultList, setResultList] = useState({
    page_index: 1,
    page_size: 10,
    result: [],
    total: 0,
    totalAll: 0,
  });

  const getListAsset = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_API_URL}/assets/assets-nft`,
      {
        params: {
          thumb_type: currentTab,
        },
      }
    );
    if (result.data) {
      setResultList(result.data);
    }
  };
  useEffect(() => {
    getListAsset();
  }, [currentTab]);
  
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
        {optionItems.map((item) => (
          <Menu.Item key={item.key}>{item.title}</Menu.Item>
        ))}
      </StyledMenu>
      <StyledContainer>
        {resultList.result.length > 0 &&
          resultList.result.map((item) => <AssetCard asset={item} />)}
      </StyledContainer>
    </StyledLayout>
  );
};

export default Explore;
