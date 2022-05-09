import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, Spin } from "antd";
import Icon, {
  UserOutlined,
  MailOutlined,
  WalletOutlined,
  PaperClipOutlined,
  LoadingOutlined,
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

const loadingIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;

const MainSettings = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
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

    setSubmitLoading(true);
    dispatch(update(updatedUser))
      .then(() => {
        toast.success("Updated successfully");
        setSubmitLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setSubmitLoading(false);
      });
  };

  useEffect(() => {
    if (user != "") {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Spin indicator={loadingIcon} />
      ) : (
        <Spin indicator={loadingIcon} spinning={submitLoading}>
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
                defaultValue={user.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    defaultValue={user.name}
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
                defaultValue={user.email}
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
                defaultValue={user.bio}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextArea
                    placeholder={user.bio}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    rows={5}
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
        </Spin>
      )}
    </>
  );
};

export default MainSettings;
