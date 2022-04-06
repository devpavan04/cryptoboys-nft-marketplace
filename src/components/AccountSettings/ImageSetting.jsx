import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, message, Upload } from 'antd';
import Icon, { LoadingOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';
import generateGrad from "../../utils/gradientGenerator.js"
import Urls from "../../utils/curls.js";
import * as Func from "../../utils/functions";
import UploadService from "../../service/upload.service";
import ENV_CONFIG from "../../environment/index.js";
import axios from "axios";

const ThumbnailStyled = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%
`

const StyledProfileLayout = styled.div`
  padding: 0.5rem 1rem;
  .label {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    margin-top: 35px;
  }
`;

const ImageSetting = () => {
  const [randomGrad, setRandomGrad] = useState(null);
  const [isShownHoverContent, setIsShownHoverContent] = useState(false);
  const [imageUrl, setImageUrl] = useState(""),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    setRandomGrad(generateGrad());
  }, []);

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      message.loading({ content: 'Loading...', key: "upload" });
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      Func.getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl);
        setLoading(false);
        message.success({
          content: "Upload success",
          key: "upload"
        })
      });
    }
    if (info.file.status === "error") {
      message.error({
        content: "Upload failed",
        key: "upload"
      })
    }
  };

  const customRequest = async options => {
    const { onSuccess, onError, file, onProgress } = options;
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: event => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        // setProgress(percent);
        console.log(percent)
        // if (percent === 100) {
        //   setTimeout(() => setProgress(0), 1000);
        // }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      }
    }
    try {
      UploadService.UploadImageService({ file })
        .then(res => {
          onSuccess("Ok");
          console.log("server res: ", res);
        })
    } catch (err) {
      const error = new Error("Some error");
      onError({ err });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <StyledProfileLayout>
      <div className="label">Profile Image</div>
      <div onMouseEnter={() => setIsShownHoverContent(true)}
        onMouseLeave={() => setIsShownHoverContent(false)}>
        {/* <Avatar size={120} style={{backgroundImage:`${randomGrad}`}}>
        {isShownHoverContent && (
        <div>
           <Icon component={PictureOutlined} style={{fontSize:"35px",color:"primary"}} />
        </div>
        )}
      </Avatar> */}
        <Upload
          name="image"
          listType="picture-card"
          className="avatar-uploader"
          beforeUpload={Func.beforeUploadImageFile}
          // action={ENV_CONFIG.API_URL + Urls.firebase_upload}
          customRequest={customRequest}
          onChange={handleChange}
          showUploadList={false}
        >
          {
            imageUrl ? <ThumbnailStyled src={imageUrl} /> : uploadButton
          }
        </Upload>
      </div>
    </StyledProfileLayout>
  );
};

export default ImageSetting;
