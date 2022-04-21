import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import Icon, {
  UserOutlined,
  MailOutlined,
  WalletOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { update } from "../../state/action/userAction";

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

const StyledErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-bottom: 0.5rem;
`;

const InputStyle = {
  borderRadius: "7px",
  height: "40px",
  marginBottom: "20px",
};

const MainSettings = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useForm();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.walletAddress);
    toast.success("Copied to clipboard");
  };

  const onSubmitForm = (data) => {
    if (data.name == undefined || user.name == "") {
      data.name = "default";
    }

    const updatedUser = {
      _id: user._id,
      ...data,
    };

    dispatch(update(updatedUser))
      .then(() => {
        toast.success("Updated successfully");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <StyledProfile>
      <form>
        <div className="header">Profile Settings</div>
        <div className="label">Username</div>
        <Controller
          name="name"
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters *",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={user.name}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              prefix={<UserOutlined />}
              style={InputStyle}
            />
          )}
        />
        {errors.name && (
          <StyledErrorText>{errors.name.message}</StyledErrorText>
        )}
        <div className="label">Email Address</div>
        <Controller
          name="email"
          control={control}
          rules={{
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={user.email}
              prefix={<MailOutlined />}
              style={InputStyle}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.email && (
          <StyledErrorText>Invalid email address*</StyledErrorText>
        )}
        <div className="label">Bio</div>
        <Controller
          name="bio"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextArea
              style={InputStyle}
              placeholder={user.bio}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <div className="label">Wallet Address</div>
        <Input
          value={user.walletAddress}
          prefix={<WalletOutlined />}
          style={InputStyle}
          disabled
          addonAfter={
            <Icon
              component={PaperClipOutlined}
              style={{ fontSize: "15px" }}
              onClick={() => copyToClipboard()}
            />
          }
        />
        <Button
          onClick={handleSubmit(onSubmitForm)}
          type="primary"
          size="large"
          style={{ borderRadius: "6px" }}
        >
          Save
        </Button>
      </form>
    </StyledProfile>
  );
};

export default MainSettings;
