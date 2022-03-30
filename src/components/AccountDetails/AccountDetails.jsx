import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { Layout,Row, Col  } from "antd";
import ProfileSettings from "./ProfileSettings";
import RightsideProfileSetting from "./RightsideProfileSettings";

const { Header, Footer, Sider, Content } = Layout;
const StyledMainLayout = styled.div`
  text-align: center;
  padding: 0.5rem 1rem;
  width: 60%;
  margin: 0 auto;
`;

const AccountDetails = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  useEffect(() => {
    getAccount();
  }, []);

  const getAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setWalletAddress(await signer.getAddress());
    toast.success("Connected to Metamask");
    toast.clearWaitingQueue();
  };

  window.ethereum.on("accountsChanged", () => {
    getAccount();
  });

  return (
    <StyledMainLayout>
      <ToastContainer limit={1} autoClose={3000} />
      <Row >
        <Col xs={24} xl={16} >
           <ProfileSettings walletAddress={walletAddress} />
        </Col>
        <Col xs={24} xl={8}>
          <RightsideProfileSetting />
        </Col>
      </Row>
    </StyledMainLayout>
  );
};

export default AccountDetails;
