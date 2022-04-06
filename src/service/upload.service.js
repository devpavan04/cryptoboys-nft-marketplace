import { message } from "antd";
import axios from "axios";
import Urls from "../utils/curls";
import ENV_CONFIG from "../environment";

const UploadImageService = fileObj => {
    const formData = new FormData();
    if (fileObj.file) {
        formData.append("image", fileObj.file);
    }
    return axios.post(ENV_CONFIG.API_URL + Urls.firebase_upload, formData)
    // .then(res => {
    //     return res.data.upload
    // })
    // .catch(e => {
    //     console.log(e)
    //     message.error("Upload failed")
    // })
}

const UploadImageAndSaveService = data => {
    const formData = new FormData();
    if (data.file) {
        formData.append("image", data.file)
    }
    formData.append("field_name", data.field_name);
    formData.append("collection_name", data.collection_name);
    return axios.post(ENV_CONFIG.API_URL + Urls.firebase_upload_save, formData)
}

const UploadService = {
    UploadImageService
}

export default UploadService;