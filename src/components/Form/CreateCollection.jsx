import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, Input, Button, Select, Image, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
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

const CreateCollection = () => {
  const user = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);

  const [fetchCategory, setFetchCategory] = useState([]);
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

  const onCategoryChange = (value) => {
    setCategory(value);
  };

  return (
    <StyledLayout>
      <form>
        <Title>Create New Collection</Title>
        <StyledLabel>Banner Image</StyledLabel>

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
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextArea
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
        >
          {fetchCategory.length > 0 &&
            fetchCategory.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </StyledSelect>
        <br />
        <StyledButton type="primary" onClick={handleSubmit(onUpdateSubmit)}>
          Create
        </StyledButton>
      </form>
    </StyledLayout>
  );
};

export default CreateCollection;
