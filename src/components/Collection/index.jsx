import React, { useEffect, useState, useRef } from "react";
import {
  Layout,
  Menu,
  Image,
  Input,
  Divider,
  Space,
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
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const { Header, Sider, Content } = Layout;
const { Search } = Input;
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

const StyledBannerImage = styled(Image)`
  width: 100vw;
  height: 30vh;
`;

const StyledFallback = styled.div`
  background-color: #e8e6e6;
  width: 100%;
  height: 30vh;
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
  const [collection, setCollection] = useState(null);
  const [collectionAssets, setCollectionAssets] = useState([]);
  const user = useSelector((state) => state.user);
  const assets = useRef([]);

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/collections/get-collection?id=${id}`
      )
      .then(({ data }) => {
        setCollectionAssets(data.assets);
        setCollection(data);
        setBannerImage(data.collectionBanner);
        assets.current = [...data.assets];
      })
      .catch(() => {
        setNotFound(true);
        toast.error("Error fetching collections");
      });
    setLoading(false);
  };

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  const onEditClick = () => {
    history.push(`/collection/edit/${id}`);
  };

  const handleFilterStatus = (status) => {
    if (status === null) {
      setCollectionAssets(assets.current);
    } else {
      const filteredAssets = assets.current.filter((asset) => {
        return asset.status === status;
      });

      setCollectionAssets(filteredAssets);
    }
  };

  const handleFilterPriceRange = (priceRange) => {
    if (priceRange === null) {
      setCollectionAssets(assets.current);
    } else {
      const filteredAssets = assets.current.filter((asset) => {
        return (
          asset.currentPrice >= priceRange.minPrice &&
          asset.currentPrice <= priceRange.maxPrice
        );
      });

      setCollectionAssets(filteredAssets);
    }
  };

  const onSearch = (value) => {
    if (value === "") {
      setCollectionAssets(assets.current);
    } else {
      setCollectionAssets((collectionAssets) =>
        collectionAssets.filter((asset) =>
          asset.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  if (notFound) {
    return (
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
    );
  }

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin indicator={loadingIcon} spinning />
        </div>
      ) : (
        <>
          {user._id == collection.owner._id && (
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
                <FilterSider
                  filterStatus={handleFilterStatus}
                  filterPriceRange={handleFilterPriceRange}
                />
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
                    onSearch={onSearch}
                    style={{ width: "300px" }}
                  />
                </Space>
              </StyledHeader>
              <StyledContent>
                {collectionAssets.length > 0 ? (
                  collectionAssets.map((asset) => (
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
    </>
  );
};

export default Collection;
