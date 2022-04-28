import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { ReactComponent as Metamask } from "../../assets/icons/metamask.svg";
import Icon from "@ant-design/icons";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";
import UserService from "../../service/user.service";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../state/action/userAction";

const StyledLayout = styled.div`
  text-align: center;
  padding: 0.5rem 1rem;
  margin-top: 3rem;

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
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let history = useHistory();
  useEffect(() => {
    checkMetamaskInstalled();
    checkLoggedIn();
  }, []);

  const checkMetamaskInstalled = async () => {
    if (window.ethereum) return setIsMetamaskInstalled(true);
  };

  const checkLoggedIn = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const address = await signer.getAddress();
        if (address != null) {
          dispatch(login(address)).catch((err) => {
            return toast.error(err);
          });
          history.push(`/my-account`);
        }
        // UserService.loginService(address).then(res => {
        //   history.push("/account/" + res._id || "")
        // })
        // history.push("/account");
      } catch {
        return false;
      }
    }
  };

  const connectToMetamask = async () => {
    try {
      await window.ethereum.enable();
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      window.location.reload();
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
    </StyledLayout>
  );
};

export default Login;
