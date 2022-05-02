import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, Input, Button, Select, Image, Upload, Spin } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { fetchCollection } from "../../state/action/collectionAction";
import { useParams } from "react-router-dom";
import axios from "axios";

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

const EditCollection = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const collection = useSelector((state) => state.collection);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [fetchCategory, setFetchCategory] = useState([]);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  //will comeback to this later
  const onUpdateSubmit = (data) => {
    console.log(data);
    console.log(category);
  };

  const fetchCategoryData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/categories/list`)
      .then((res) => {
        setFetchCategory(res.data);
      })
      .catch((err) => {
        toast.error("Can't fetch category data");
      });
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (collection == "" || collection == undefined) {
      dispatch(fetchCollection(id))
        .then((res) => {
          // setCategory(res.category);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Cannot found the collection");
        });
    } else {
      setLoading(false);
      setCategory(collection.category);
    }
  }, [collection]);

  const onCategoryChange = (value) => {
    setCategory(value);
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
            <Title>Edit Collection</Title>
            <StyledLabel>Banner Image</StyledLabel>
            <StyledImage
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            <StyledLabel>Collection's Name</StyledLabel>
            <Controller
              name="name"
              control={control}
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
              defaultValue={collection.name}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder={collection.name}
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
              defaultValue={collection.description}
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextArea
                  placeholder={collection.description}
                  rows={5}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            <StyledLabel>Category</StyledLabel>
            <StyledSelect
              showSearch
              placeholder="Select a category"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{
                width: "100%",
                borderRadius: "5px",
              }}
              onChange={onCategoryChange}
              defaultValue={collection.category ? collection.category : null}
            >
              {fetchCategory.length > 0 &&
                fetchCategory.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.name}
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

export default EditCollection;
