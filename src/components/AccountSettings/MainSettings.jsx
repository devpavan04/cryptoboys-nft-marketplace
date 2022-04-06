import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import Icon,{ UserOutlined, MailOutlined, WalletOutlined,PaperClipOutlined  } from "@ant-design/icons";
import { Button } from "antd";
import { toast } from "react-toastify";

const { TextArea } = Input;
const StyledProfile = styled.div`
  text-align: left;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  .header {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: black;
  }

  .label {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 0.2rem;
  }
`;

const InputStyle = {
  borderRadius: "7px",
  height: "40px",
  marginBottom: "20px",
};



const MainSettings = (props) => {
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.walletAddress);
    toast.success("Copied to clipboard");
  }

  return (
    <StyledProfile>
      <div className="header">Profile Settings</div>
      <div className="label">Username</div>
      <Input
        placeholder="Your username"
        prefix={<UserOutlined />}
        style={InputStyle}
      />
      <div className="label">Email Address</div>
      <Input
         placeholder="Your email"
        prefix={<MailOutlined />}
        style={InputStyle}
      />
      <div className="label">Bio</div>
      <TextArea style={InputStyle} />
      <div className="label">Wallet Address</div>
      <Input
        value={props.walletAddress}
        prefix={<WalletOutlined />}
        style={InputStyle}
        disabled
        addonAfter={<Icon component={PaperClipOutlined} style={{fontSize:"15px"}} onClick={()=>copyToClipboard()}/>}
      />
      <Button type="primary" size="large" style={{ borderRadius: "6px" }}>
        Save
      </Button>
    </StyledProfile>
  );
};

export default MainSettings;
