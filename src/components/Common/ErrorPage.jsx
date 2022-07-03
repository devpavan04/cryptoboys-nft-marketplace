import React from 'react'
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const ErrorPage = () => {
    const history = useHistory();
  return (
    <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={()=>history.push('/')}>Back Home</Button>}
    />
  )
}

export default ErrorPage