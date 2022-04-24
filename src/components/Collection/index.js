import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Select,
  Layout,
  Menu,
  Image,
  Input,
  Divider,
  Space,
  Avatar,
  Typography,
  Affix,
  Row, 
  Col
} from "antd";
import {
  HeartOutlined,
  FormatPainterOutlined,
  CopyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import AssetCard from "../Common/AssetCard";
import FilterSider from "../Common/FilterSider";
const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title,Paragraph } = Typography;

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const StyledProfileLayout = styled.div`
  display: flex;
  margin: 0 auto;
  width: 80%;
  height: 200px;
`;

const StyledAvatar = styled(Avatar)`
  position: relative;
  border: 2px solid #fff;
  top: -70px;
`;

const StyledBannerImage = styled(Image)`
  width: 100vw;
  height: 30vh;
`;

const StyledFallback = styled.div`
  background-color: #e8e6e6;
  width: 100vw;
  height: 30vh;
`;

const StyledSelect = styled(Select)`
  width: 300px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;

  .ant-select-selector {
    border: none !important;
  }
`;

const StyledHeader = styled(Header)`
  background-color: #fff;
  height: 45px;
  line-height: 0px;
  padding-left: 10px;
`;

const StyledHR = styled.hr`
  width: 80%;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const StyledContent = styled(Content)`
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
  padding-left: 20px;
  gap: 20px;
  height: 10000px;
  align-content: flex-start;
  background-color: #fff;

  @media (max-width: 912px) {
    padding-left: 50px;
  }
`;

const StyledContainer = styled.div`
width: 95%;
margin: 0 auto;
`;

const Collection = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [ellipsis, setEllipsis] = useState(true);

  // useEffect(() => {
  //   setBannerImage("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png")
  // });

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  const handleCategoriesChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleCategoriesSearch = (value) => {
    console.log(`search ${value}`);
  };

  return (
    <>
      <div>
        {bannerImage ? (
          <StyledBannerImage src={bannerImage} />
        ) : (
          <StyledFallback />
        )}
        <StyledProfileLayout>
          <div style={{width:"50%",wordBreak:"break-all"}}> 
            <Space direction="vertical" size={0} style={{ marginLeft: "10px" }}>
              <Title level={3}>Default</Title>
              <Paragraph ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false}>
                Description
              </Paragraph>
            </Space>
          </div>
        </StyledProfileLayout>
      </div>
      <StyledHR />
      <StyledLayout hasSider>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleSider}
          trigger={null}
          breakpoint="lg"
          collapsedWidth="40"
          theme="light"
          width="300px"
        >
          <Menu mode="inline" >
            <FilterSider />
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <StyledHeader className="site-layout-background">
            <Space
              align="center"
              split={<Divider type="vertical" />}
              size="small"
              style={{ marginTop: "5px" }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined
                  onClick={toggleSider}
                  style={{ fontSize: "25px" }}
                />
              ) : (
                <MenuFoldOutlined
                  onClick={toggleSider}
                  style={{ fontSize: "25px" }}
                />
              )}
              <Search
                placeholder="Search"
                allowClear
                enterButton
                style={{ width: "300px" }}
              />
            </Space>
          </StyledHeader>
            <StyledContent>
              <AssetCard collapsed={collapsed} />
              <AssetCard collapsed={collapsed} />
              <AssetCard collapsed={collapsed} />
              <AssetCard collapsed={collapsed} />
              <AssetCard collapsed={collapsed} />
              <AssetCard collapsed={collapsed} />
              <AssetCard collapsed={collapsed} />     
            </StyledContent>
          
        </Layout>
      </StyledLayout>
    </>
  );
};

export default Collection;
