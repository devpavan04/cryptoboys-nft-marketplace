import React, { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import {
  Checkbox,
  Collapse,
  Empty,
  List,
  Menu,
  Pagination,
  Slider,
} from "antd";
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
  // display: flex;
  gap: 2rem;
  // flex-wrap: wrap;

  @media (min-width: 600px) {
    padding: 0px 20px;
  }
`;

const SideBar = styled.div`
  border: #f0f0f0 solid 1px;
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
  const [categories, setCategories] = useState([]);
  const [filterParams, setFilterParams] = useState({
    price: { startPrice: 0, endPrice: 0 },
  });
  const listNFTType = [
    {
      value: 0,
      label: "Image",
    },
    {
      value: 1,
      label: "Video",
    },
    {
      value: 2,
      label: "GIF",
    },
  ];
  const [isLoading, setIsLoading] = useState(false);

  const getListAsset = async (params) => {
    setIsLoading(true);
    const result = await axios
      .get(`${process.env.REACT_APP_API_URL}/assets/assets-nft`, {
        params: {
          // thumb_type: currentTab,
          status: "Sale",
          ...params,
        },
      })
      .then((res) => {
        setIsLoading(false);
        return res;
      });
    if (result.data) {
      setResultList(result.data);
    }
  };
  useEffect(() => {
    getListAsset();
  }, [currentTab]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/categories/list")
      .then((res) => {
        setCategories(res.data);
      });
  }, []);

  const changeTab = (e) => {
    setCurrentTab(e.key);
  };

  return (
    <StyledLayout>
      <StyledHeader>Explore Collections</StyledHeader>
      {/* <StyledMenu
        className={"mb-5"}
        onClick={changeTab}
        selectedKeys={[currentTab]}
        mode="horizontal"
      >
        {optionItems.map((item) => (
          <Menu.Item key={item.key}>{item.title}</Menu.Item>
        ))}
      </StyledMenu> */}
      <StyledContainer className="row">
        <SideBar className="col-2 p-3 pt-5">
          <div className="border-bottom mb-4">
            <span className="h2">Filter</span>
          </div>
          <div className="filter-body">
            <Collapse ghost className="">
              <Collapse.Panel header="Price">
                <div className="mb-2">
                  <span className="h5">
                    {`${filterParams.price.startPrice} - ${filterParams.price.endPrice}`}{" "}
                    ETH
                  </span>
                </div>
                <Slider
                  range
                  value={[
                    filterParams.price.startPrice,
                    filterParams.price.endPrice,
                  ]}
                  onChange={(value) => {
                    setFilterParams({
                      ...filterParams,
                      price: { startPrice: value[0], endPrice: value[1] },
                    });
                  }}
                  onAfterChange={(value) => {
                    getListAsset({
                      ...filterParams,
                      startPrice: value[0],
                      endPrice: value[1],
                    });
                  }}
                />
              </Collapse.Panel>
            </Collapse>
            <Collapse ghost>
              <Collapse.Panel header="Categories">
                {/* {categories.length > 0 ? (
                  <Checkbox.Group>
                    {categories.map((category) => (
                      <div key={category._id}>
                        <Checkbox value={category._id}>
                          {category.name || ""}
                        </Checkbox>
                        <br />
                      </div>
                    ))}
                  </Checkbox.Group>
                ) : (
                  <Empty />
                )} */}
                <Checkbox.Group onChange={value => getListAsset({
                  ...filterParams,
                  thumb_type: value
                })}>
                  {listNFTType.map((item) => (
                    <div key={item.value}>
                      <Checkbox value={item.value}>{item.label}</Checkbox>
                      <br />
                    </div>
                  ))}
                </Checkbox.Group>
              </Collapse.Panel>
            </Collapse>
          </div>
        </SideBar>
        <div className="col-9">
          <div className="mb-5">{resultList.total} item</div>
          <List
            loading={isLoading}
            dataSource={resultList.result}
            renderItem={(item) => <AssetCard className="mb-5" asset={item} />}
            grid={{ column: 3, gutter: 0 }}
            itemLayout="horizontal"
          />
        </div>
        {/* <div>
          {resultList.result.length > 0 &&
            resultList.result.map((item) => <AssetCard asset={item} />)}
        </div> */}
        <div className="col-3 h-100"></div>
        <Pagination
          className="col-8"
          current={parseInt(resultList.page_index)}
          total={Math.ceil(resultList.total / resultList.page_size) * 10}
          onChange={(value) => {
            getListAsset({ page_index: parseInt(value) });
          }}
        />
      </StyledContainer>
    </StyledLayout>
  );
};

export default Explore;
