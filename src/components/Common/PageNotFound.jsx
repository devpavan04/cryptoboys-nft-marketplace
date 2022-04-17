import React from 'react'
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const PageNotFound = () => {
    const history = useHistory();
  return (
    <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={()=>history.push('/')}>Back Home</Button>}
  />
  )
}

export default PageNotFound