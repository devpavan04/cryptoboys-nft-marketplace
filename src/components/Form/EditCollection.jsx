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
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  fetchCollection,
  setCollection,
} from "../../state/action/collectionAction";
import { useParams } from "react-router-dom";
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

const EditCollection = () => {
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const collection = useSelector((state) => state.collection);
  const user = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [fetchCategory, setFetchCategory] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [notOwner, setNotOwner] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  //will comeback to this later
  const onUpdateSubmit = async (data) => {
    const newCollection = {
      id,
      ...data,
      categoryId: category,
    };

    try {
      await axios
        .patch(
          `${process.env.REACT_APP_API_URL}/collections/update`,
          newCollection
        )
        .then((res) => {
          toast.success("Collection updated successfully");
          dispatch(setCollection(newCollection));
        });
    } catch (err) {
      toast.error("Error updating collection");
      console.log(err);
    }
  };

  const fetchCategoryData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/categories/list`)
      .then((res) => {
        setFetchCategory(res.data);
      })
      .catch(() => {
        toast.error("Can't fetch category data");
      });
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (user) {
      if (collection == "") {
        dispatch(fetchCollection(id))
          .then((res) => {
            if (res.owner._id !== user._id) {
              setNotOwner(true);
            }
            setImage(res.collectionBanner);
            setCategory(res.category);
            setLoading(false);
          })
          .catch(() => {
            setNotFound(true);
            toast.error("Cannot found the collection");
          });
      } else {
        setLoading(false);
        if (collection.owner._id !== user._id) {
          setNotOwner(true);
        }
        setCategory(collection.category);
      }
    }
  }, [collection, user]);

  const onCategoryChange = (value) => {
    setCategory(value);
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
            <Title>Edit Collection</Title>
            <StyledLabel>Banner Image</StyledLabel>
            <StyledImage width={400} src={image} />
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
                  value: 30,
                  message: "Name cannot be more than 30 characters *",
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
