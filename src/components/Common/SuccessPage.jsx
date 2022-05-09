import React from 'react'
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const SuccessPage = (props) => {
    const history = useHistory();
  return (
    <Result
    status="success"
    title="Successfully Mint Token"
    subTitle="Your token has been successfully minted. Please return to profile to view your token."
    extra={[
      <Button type="primary" onClick={()=>history.push("/account")} >
        Back to Profile
      </Button>,
    ]}
  />
  )
}

export default SuccessPage