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
  Empty,
  Spin,
  Affix,
  Button,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import AssetCard from "../Common/AssetCard.jsx";
import FilterSider from "../Common/FilterSider";
import { useSelector, useDispatch } from "react-redux";
import { fetchCollection } from "../../state/action/collectionAction";
import { toast } from "react-toastify";
const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

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
  width: 100%;
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

const loadingIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;

const Collection = () => {
  const { id } = useParams();
  const history = useHistory();
  const [bannerImage, setBannerImage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [ellipsis, setEllipsis] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const collection = useSelector((state) => state.collection);
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   setBannerImage("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png")
  // });

  useEffect(() => {
    if (collection == null || collection == "") {
      setLoading(true);
      dispatch(fetchCollection(id)).catch(() => {
        toast.error("Error getting collection");
        setNotFound(true);
      });
      setLoading(false);
    }
    setLoading(false);
  }, [collection]);

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  const handleCategoriesChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleCategoriesSearch = (value) => {
    console.log(`search ${value}`);
  };

  const onEditClick = () => {
    history.push(`/collection/edit/${id}`);
  };

  return (
    <Spin spinning={loading} indicator={loadingIcon}>
      {notFound ? (
        <Empty
          description={
            <span>
              <Paragraph>
                Sorry, we couldn't find the collection you are looking for.
              </Paragraph>
              <Paragraph>Please check the URL and try again.</Paragraph>
            </span>
          }
        />
      ) : (
        <>
          {collection && user && user._id == collection.owner._id && (
            <Affix>
              <OptionLayout>
                <StyledButton
                  type="primary"
                  style={{
                    marginRight: "10px",
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
          <div>
            {bannerImage ? (
              <StyledBannerImage src={bannerImage} />
            ) : (
              <StyledFallback />
            )}
            <StyledProfileLayout>
              <div style={{ width: "50%", wordBreak: "break-all" }}>
                <Space
                  direction="vertical"
                  size={0}
                  style={{ marginLeft: "10px" }}
                >
                  <Title level={3}>{collection.name}</Title>
                  <Paragraph
                    ellipsis={
                      ellipsis
                        ? { rows: 2, expandable: true, symbol: "more" }
                        : false
                    }
                  >
                    {collection.description}
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
              <Menu mode="inline">
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
                {collection && collection.assets.length > 0 ? (
                  collection.assets.map((asset) => (
                    <AssetCard asset={asset} key={asset._id} />
                  ))
                ) : (
                  <div style={{ width: "90%", margin: "0 auto" }}>
                    <Empty description={<span>No assets found.</span>} />
                  </div>
                )}
              </StyledContent>
            </Layout>
          </StyledLayout>
        </>
      )}
    </Spin>
  );
};

export default Collection;
