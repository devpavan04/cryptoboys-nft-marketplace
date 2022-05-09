import React, { useState } from "react";
import { Menu, Button, Space, Radio } from "antd";
import styled from "styled-components";
import {
  FilterOutlined,
  MoneyCollectOutlined,
  FieldTimeOutlined,
  CloseOutlined,
} from "@ant-design/icons";



const StyledButtonContainer = styled.div`
  margin-left: 30px;
`;

const StyledButton = styled(Button)`
  background-color: #fff;
  color: black;
  border-radius: 5px;
  font-weight: bold;
  border: 1px solid #d9d9d9;
  box-shadow: 0px 0px 5px #d9d9d9;
  width: 110px;
`;

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    width: 120px;
  }
`;

const StyledSubMenu = styled(Menu.SubMenu)`
  .ant-menu-submenu-title {
    color: black !important;
    font-size: 16px !important;
    font-weight: bold !important;
  }
`;

const { Item, SubMenu } = Menu;
const FilterSider = (props) => {
  
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const statusOptions = [
    { label: "Sale", value: "Sale" },
    { label: "On Auction", value: "On Auction" },
  ];

  const sortOptions = [
    { label: "Low to High", value: "lth" },
    { label: "High to Low", value: "htl" },
    { label: "Most Favorited", value: "favorite" },
    { label: "Newest to Oldest", value: "nto" },
    { label: "Oldest to Newest", value: "otn" },
  ];

  const handleReset = () => {
    setStatus("");
    setSort("");
  };

  return (
    <StyledSubMenu key="filter" title="Filter" icon={<FilterOutlined />}>
      <SubMenu title="Status">
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
      <SubMenu title="Sort By">
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
      </SubMenu>
      <Button icon={<CloseOutlined />} onClick={() => handleReset()} block />
    </StyledSubMenu>
  );
};

export default FilterSider;
