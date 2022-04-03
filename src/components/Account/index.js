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
} from "antd";
import {
  HeartOutlined,
  FormatPainterOutlined,
  CopyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const StyledProfileLayout = styled.div`
  display: flex;
  margin: 0 auto;
  width: 80%;
  height: 100px;
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

const Account = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

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
          <StyledAvatar size={150} icon={<HeartOutlined />} />
          <Space direction="vertical" size={0} style={{ marginLeft: "10px" }}>
            <Title level={3}>Default</Title>
            <Title level={5}>Wallet Address</Title>
          </Space>
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
          style={{ backgroundColor: "#fff" }}
        >
          <Menu mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<CopyOutlined />}>
              Collected
            </Menu.Item>
            <Menu.Item key="2" icon={<FormatPainterOutlined />}>
              Created
            </Menu.Item>
            <Menu.Item key="3" icon={<HeartOutlined />}>
              Favorited
            </Menu.Item>
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
              <StyledSelect
                showSearch
                placeholder="Select category"
                optionFilterProp="children"
                onChange={handleCategoriesChange}
                onSearch={handleCategoriesSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </StyledSelect>
              <Search
                placeholder="Search"
                allowClear
                enterButton
                style={{ width: "300px" }}
              />
            </Space>
          </StyledHeader>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, textAlign: "center" }}
            >
              ...
              <br />
              Really
              <br />
              ...
              <br />
              ...
              <br />
              ...
              <br />
              long
              <br />
              ...
              <br />
              content
            </div>
          </Content>
        </Layout>
      </StyledLayout>
    </>
  );
};

export default Account;
