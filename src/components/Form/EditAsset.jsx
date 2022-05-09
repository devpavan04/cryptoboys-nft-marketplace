import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Typography,
  Input,
  Button,
  Select,
  Image,
  Upload,
  Modal,
  Switch,
  Spin,
} from "antd";
import { toast } from "react-toastify";
import {
  PictureFilled,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAsset } from "../../state/action/assetAction";
import { useForm, Controller } from "react-hook-form";

const { Title } = Typography;
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
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const asset = useSelector((state) => state.asset);
  const [newCollection, setNewCollection] = useState();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  useEffect(() => {
    if (asset == "" || asset == undefined) {
      dispatch(fetchAsset(id))
        .then((res) => {
          setNewCollection(res.currentCollection._id);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Cannot found the asset");
        });
    } else {
      setLoading(false);
      setNewCollection(asset.currentCollection._id);
    }
  }, [asset]);

  //will comeback to this later
  const onUpdateSubmit = (data) => {
    console.log(data);
    console.log(newCollection);
  };

  const onCollectionChange = (value) => {
    setNewCollection(value);
  };

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
            <StyledImage
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
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
