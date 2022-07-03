import { message } from "antd"
import axios from "axios"
import ENV_CONFIG from "../environment"
import Urls from "../utils/curls"

export const getUserDetailService = id => {
    return axios.get(ENV_CONFIG.API_URL + Urls.getDetail.replace(":id", id))
        .then(res => {
            console.log(res)
            return res.data
        })
        .catch(e => {
            console.log(e)
            message.error("Server error")
        })
}

export const loginService = address => {
    return axios.post(ENV_CONFIG.API_URL + Urls.login, { id: address })
        .then(res => res.data)
        .catch(e => {
            console.log(e)
            message.error("Server error")
        })
}

const UserService = {
    getUserDetailService,
    loginService
}

export default UserService;