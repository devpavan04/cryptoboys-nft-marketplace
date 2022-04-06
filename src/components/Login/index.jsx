import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { ReactComponent as Metamask } from "../../assets/icons/metamask.svg";
import Icon from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";
import UserService from "../../service/user.service";

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
    checkLoggedIn();
  }, []);

  const checkMetamaskInstalled = async () => {
    if (window.ethereum) return setIsMetamaskInstalled(true);
    return setIsMetamaskInstalled(false);
  };

  const checkLoggedIn = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const address = await signer.getAddress();
      if (address == null) {
        return false;
      }
      UserService.loginService(address).then(res => {
        history.push("/account/" + res._id || "")
      })
      // history.push("/account");
    } catch {
      return false
    }
  }

  const connectToMetamask = async () => {
    try {
      await window.ethereum.enable();
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      window.location.reload();
    } catch (e) {
      console.log(e)
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
