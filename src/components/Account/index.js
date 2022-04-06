import React,{useEffect} from 'react'
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import UserService from '../../service/user.service';
// const { Header, Footer, Sider, Content } = Layout;

const Account = (props) => {
  const params = useParams();

  useEffect(async () => {
    if(params.id) {
      UserService.getUserDetailService(params.id).then(res => console.log(res))
    }
  }, [params])

  return (
    <div>This is my account ne</div>
  )
}

export default Account