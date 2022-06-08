import React, { useState, useEffect } from "react";
import { Menu, Button, Space, Radio, Select, Input, Divider } from "antd";
import styled from "styled-components";
import Icon, { FilterOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";

const { Item, SubMenu } = Menu;
const { Option } = Select;

const StyledButtonContainer = styled.div`
  margin-left: 30px;
`;

const StyledButton = styled(Button)`
  background-color: #fff;
  border-radius: 5px;
  font-weight: bold;
  border: 1px solid #d9d9d9;
  width: 120px;
  margin-top: 10px;
  margin-left: 25px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  border-radius: 5px;
`;

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    width: 120px;
  }
`;

const StyledSelect = styled(Select)`
  width: 85% !important;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 7px;
  .ant-select-selector {
    border-radius: 5px !important;
  }
`;

const StyledSubMenu = styled(Menu.SubMenu)`
  .ant-menu-submenu-title {
    color: black !important;
    font-size: 16px !important;
    font-weight: bold !important;
  }
`;

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const FilterSider = (props) => {
  const [status, setStatus] = useState(null);
  const [sort, setSort] = useState("");
  const [fetchCategory, setFetchCategory] = useState([]);
  const [category, setCategory] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [apply, setApply] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

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

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    props.filterStatus(e.target.value);
  };

  const onCategoryChange = (value) => {
    setCategory(value);
    props.filterCategory(value);
  };

  const statusOptions = [
    { label: "Sale", value: "Sale" },
    { label: "On Auction", value: "On Auction" },
  ];

  const handleReset = () => {
    setStatus(null);
    setApply(false);
    props.filterStatus(null);
  };

  const handleConfirm = () => {
    props.filter({ status: status, category: category });
    setConfirm(true);
  };

  const onSubmitPriceRange = (data) => {
    if (data.minPrice > data.maxPrice) {
      toast.error("Min price can't be greater than max price");
    } else {
      setApply(true);
      props.filterPriceRange(data);
    }
  };

  return (
    <StyledSubMenu key="filter" title="Filter" icon={<FilterOutlined />}>
      <SubMenu title="Status" disabled={props.disabledTab}>
        <StyledButtonContainer>
          {statusOptions.map((option) => (
            <Radio.Button
              key={option.value}
              value={option.value}
              onChange={handleStatusChange}
              checked={status === option.value}
              style={{ width: "120px", fontWeight: "bold" }}
            >
              {option.label}
            </Radio.Button>
          ))}
        </StyledButtonContainer>
      </SubMenu>
      {/* <SubMenu title="Sort By">
        <StyledButtonContainer>
         {sortOptions.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              onChange={handleSortChange}
              checked={sort === option.value}
              style={{ fontSize:"15px" }}
            >
              {option.label}
            </Radio>
          ))}
        </StyledButtonContainer>
      </SubMenu> */}
      <SubMenu title="Price" disabled={props.disabledTab}>
        <form>
          <Space style={{ marginRight: "5px" }}>
            <Icon
              component={EthereumIcon}
              style={{ fontSize: "20px", marginLeft: "5px" }}
            />

            <Controller
              name="minPrice"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Min price must be greater than 0",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledInput
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  type="number"
                />
              )}
            />
            <span>to</span>
            <Controller
              name="maxPrice"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Max price must be greater than 0",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledInput
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  type="number"
                />
              )}
            />
          </Space>
          <Button
            type="primary"
            block
            style={{
              margin: "15px",
              width: "90%",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={handleSubmit(onSubmitPriceRange)}
            disabled={errors.minPrice || errors.maxPrice}
          >
            Apply
          </Button>
          <Space direction="vertical" style={{ marginLeft: "10px" }}>
            {errors.minPrice && (
              <div
                style={{ color: "red", fontSize: "15px", marginBottom: "10px" }}
              >
                {errors.minPrice.message}
              </div>
            )}
            {errors.maxPrice && (
              <div style={{ color: "red", fontSize: "15px" }}>
                {errors.maxPrice.message}
              </div>
            )}
          </Space>
        </form>
      </SubMenu>
      <StyledButton disabled={status == null && !apply} onClick={handleReset}>
        Reset
      </StyledButton>
      <Divider />
      <SubMenu title="Category">
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
          value={category}
          onChange={onCategoryChange}
        >
          {fetchCategory.length > 0 &&
            fetchCategory.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
        </StyledSelect>
        <span>
          <Icon
            disabled={category === null}
            component={CloseCircleOutlined}
            style={{ fontSize: "18px", position: "relative", top: "-2px" }}
            onClick={() => {
              setCategory(null);
              props.filterCategory(null);
            }}
          />
        </span>
        <Space></Space>
      </SubMenu>
    </StyledSubMenu>
  );
};

export default FilterSider;
