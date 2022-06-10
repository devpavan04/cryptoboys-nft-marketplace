import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Typography,
  Input,
  Button,
  Select,
  Image,
  Upload,
  Spin,
  Empty,
  Result,
} from "antd";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAsset } from "../../state/action/assetAction";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StyledLayout = styled.div`
  padding: 0.5rem 1rem;
  margin-top: 3rem;
  margin: 0 auto;
  width: 50%;
`;

const StyledLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-top: 2rem;
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 5px;
`;

const StyledButton = styled(Button)`
  font-weight: bold;
  border-radius: 5px;
  height: 35px;
  margin-top: 2rem;
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 5px !important;
  }
`;

const StyledImageLayout = styled.div`
  display: flex;
  width: 300px;
  height: 300px;
  border: 5px solid #d9d9d9;
  border-radius: 5px;
  border-style: dashed;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(Image)`
  width: 300px;
  border-radius: 5px;
`;

const StyledFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 285px;
  height: 285px;
  border-radius: 5px;

  &:hover {
    background-color: #d9d9d9;
  }
`;

const loadingIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;

const EditAsset = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const asset = useSelector((state) => state.asset);
  const [newCollection, setNewCollection] = useState();
  const [notFound, setNotFound] = useState(false);
  const [notOwner, setNotOwner] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  useEffect(() => {
    if (user) {
      if (asset == "") {
        dispatch(fetchAsset(id))
          .then((res) => {
            setNewCollection(res.currentCollection._id);
            if (res.currentOwner._id !== user._id) {
              setNotOwner(true);
            }
            setLoading(false);
          })
          .catch(() => {
            setNotFound(true);
            toast.error("Cannot found the asset");
          });
      } else {
        setLoading(false);
        setNewCollection(asset.currentCollection._id);
        if (asset.currentOwner._id !== user._id) {
          setNotOwner(true);
        }
      }
    }
  }, [asset, user]);

  const onUpdateSubmit = (data) => {
    const url = process.env.REACT_APP_API_URL;
    const { name, description } = data;
    if (asset.currentCollection._id != newCollection) {
      axios
        .patch(`${url}/assets/change-collection`, {
          id,
          collectionId: newCollection,
        })
        .then(toast.success("Successfully update collection"))
        .catch(() => {
          toast.error("Cannot update collection");
        });
    }

    axios
      .patch(`${url}/assets/update`, { id, name, description })
      .then(() => toast.success("Successfully update asset"))
      .catch(() => {
        toast.error("Cannot update asset");
      });
  };

  const onCollectionChange = (value) => {
    setNewCollection(value);
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

  if (notOwner) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => history.push("/")}>
            Back Home
          </Button>
        }
      />
    );
  }

  return (
    <>
      {loading ? (
        <StyledLayout style={{ textAlign: "center" }}>
          <Spin indicator={loadingIcon} />
        </StyledLayout>
      ) : (
        <StyledLayout>
          <form>
            <Title>Edit Your Asset</Title>
            <StyledLabel>Images, GIFs, Videos</StyledLabel>
            <StyledImage width={200} src={asset.uriID} />
            <StyledLabel>Name</StyledLabel>
            <Controller
              name="name"
              control={control}
              defaultValue={asset.name}
              rules={{
                required: {
                  value: true,
                  message: "Name is required *",
                },
                minLength: {
                  value: 3,
                  message: "Name must be at least 5 characters *",
                },
                maxLength: {
                  value: 20,
                  message: "Name cannot be more than 20 characters *",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder={asset.name}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  style={{ borderRadius: "5px" }}
                  size="large"
                />
              )}
            />
            <p style={{ color: "red" }}>{errors.name && errors.name.message}</p>
            <StyledLabel>Description</StyledLabel>
            <Controller
              name="description"
              control={control}
              defaultValue={asset.description}
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextArea
                  rows={5}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            <StyledLabel>Collection</StyledLabel>
            <StyledSelect
              showSearch
              placeholder="Select a collection"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{
                width: "100%",
                borderRadius: "5px",
              }}
              defaultValue={asset.currentCollection._id}
              onChange={onCollectionChange}
            >
              {user &&
                user.ownedCollections.map((collection) => (
                  <Option key={collection._id} value={collection._id}>
                    {collection.name}
                  </Option>
                ))}
            </StyledSelect>
            <br />
            <StyledButton type="primary" onClick={handleSubmit(onUpdateSubmit)}>
              Update
            </StyledButton>
          </form>
        </StyledLayout>
      )}
    </>
  );
};

export default EditAsset;
