import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { Row, Col, Form } from "antd";
import MainSettings from "./MainSettings";
import ImageSetting from "./ImageSetting";

const StyledMainLayout = styled.div`
  text-align: center;
  padding: 0.5rem 1rem;
  width: 60%;
  margin: 0 auto;
`;

const AccountSettings = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  useEffect(() => {
    // checkLogin();
  }, []);

  // const getAccount = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   setWalletAddress(await signer.getAddress());
  // };

  // const checkLogin = async () => {
  //   const provider = await new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   if (!signer.getAddress()) {
  //     history.push('/login');
  //   }
  //   return getAccount();
  // };

  // window.ethereum.on("accountsChanged", () => {
  //   getAccount();
  // });

  return (
    <StyledMainLayout>
      <Form>
        <Row>
          <Col xs={24} xl={16}>
            <MainSettings />
          </Col>
          <Col xs={24} xl={8}>
            <ImageSetting />
          </Col>
        </Row>
      </Form>
    </StyledMainLayout>
  );
};

export default AccountSettings;
