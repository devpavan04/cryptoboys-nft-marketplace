import React, { useState } from "react";
import styled from "styled-components";
import {
  Typography,
  Input,
  Button,
  Select,
  Image,
  Upload,
  Modal,
  Switch,
} from "antd";
import { toast } from "react-toastify";

import { PictureFilled, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StyledLayout = styled.div`
  padding: 0.5rem 1rem;
  margin-top: 3rem;
  margin: 0 auto;
  width: 50%;
`;

const StyledLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-top: 2rem;
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 5px;
`;

const StyledButton = styled(Button)`
  font-weight: bold;
  border-radius: 5px;
  height: 35px;
  margin-top: 2rem;
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 5px !important;
  }
`;

const StyledImageLayout = styled.div`
  display: flex;
  width: 300px;
  height: 300px;
  border: 5px solid #d9d9d9;
  border-radius: 5px;
  border-style: dashed;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(Image)``;

const StyledFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 285px;
  height: 285px;
  border-radius: 5px;

  &:hover {
    background-color: #d9d9d9;
  }
`;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const MintNFTForm = () => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadDirectory, setUploadDirectory] = useState(false);

  //#region Handle Image
  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewVisible(true);
  };
  const handleChange = ({ fileList }) => setFileList(fileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>UPLOAD</div>
    </div>
  );
  //#endregion

  const switchChange = (checked) => {
    setUploadDirectory(checked);
  };

  //will comeback to this later
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", previewTitle);
    formData.append("description", previewImage);
    formData.append("image", fileList[0].originFileObj);

    fileList.forEach((file) => {
      formData.append("files[]", file);
    });

    try {
      const response = await fetch("/api/mint", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Successfully minted NFT");
      } else {
        toast.error("Failed to mint NFT");
      }
    } catch (error) {
      toast.error("Failed to mint NFT");
    }
  };

  return (
    <StyledLayout>
      <Title>Create New NFT</Title>
      <StyledLabel>Images, Videos, Gifs</StyledLabel>
      <div style={{ marginBottom: "10px" }}>
        Upload directory <Switch onChange={switchChange} size="small" />
      </div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={(file) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList);
        }}
        beforeUpload={(file) => {
          const isJPG = file.type === "image/jpeg";
          const isPNG = file.type === "image/png";
          const isGIF = file.type === "image/gif";
          const isMP3 = file.type === "audio/mp3";
          const isMP4 = file.type === "video/mp4";

          if (!isJPG && !isPNG && !isGIF && !isMP3 && !isMP4) {
            toast.error("You can only upload JPG/PNG/GIF/MP3/MP4 files!");
            return false;
          }
          setFileList([...fileList, file]);
          return false;
        }}
        directory={uploadDirectory}
      >
        {uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <StyledLabel>Name</StyledLabel>
      <Input
        style={{ borderRadius: "5px" }}
        size="large"
        placeholder="NFT's name"
        disabled={fileList.length > 1 ? true : false}
      />
      <StyledLabel>Description</StyledLabel>
      <StyledTextArea
        placeholder="Provide a detailed description of your NFT"
        rows={5}
      />
      <StyledLabel>Collection</StyledLabel>
      <StyledSelect
        showSearch
        placeholder="Select a collection"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        style={{
          width: "100%",
          borderRadius: "5px",
        }}
      >
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="tom">Tom</Option>
      </StyledSelect>
      <br />
      <StyledButton type="primary">Create</StyledButton>
    </StyledLayout>
  );
};

export default MintNFTForm;
