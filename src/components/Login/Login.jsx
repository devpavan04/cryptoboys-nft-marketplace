import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { ReactComponent as Metamask } from "../../assets/icons/metamask.svg";
import Icon from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

const StyledLayout = styled.div`
  text-align: center;
  padding: 0.5rem 1rem;

  p {
    font-size: 20px;
    font-weight: bold;
  }
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  height: 100%;
  background-color: #001529;
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: #001529;
  }

  span {
    font-size: 18px;
  }
`;

const MetamaskIcon = (props) => <Icon component={Metamask} {...props} />;

const Login = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  let history = useHistory();
  useEffect(() => {
    checkMetamaskInstalled();
  }, []);

  const checkMetamaskInstalled = async () => {
    if (window.ethereum) return setIsMetamaskInstalled(true);
    return setIsMetamaskInstalled(false);
  };

  const connectToMetamask = async () => {
    try {
      await window.ethereum.enable();
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      history.push("/account");
    } catch (e) {
      toast.error("Cannot connect to Metamask");
    }
  };

  return (
    <StyledLayout>
      <p>
        You need a <u>Metamask wallet</u> to use the Marketplace
      </p>
      {isMetamaskInstalled ? (
        <StyledButton
          type="primary"
          size="large"
          onClick={() => connectToMetamask()}
        >
          <MetamaskIcon style={{ fontSize: "32px" }} />
          Connect to Metamask
        </StyledButton>
      ) : (
        <h5>Please download Chrome to install Metamask</h5>
      )}
      <ToastContainer />
    </StyledLayout>
  );
};

export default Login;
