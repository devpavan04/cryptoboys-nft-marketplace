import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";
import {
  Typography,
  Input,
  Button,
  Select,
  Image,
  Upload,
  Modal,
  Switch,
  Spin,
} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import NFT from "../../build/abis/NFT.json";
import { ipfs } from "../../utils/functions";

//#region IPFS
//#endregion

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

const loadingIcon = <LoadingOutlined spin />;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const MintAsset = () => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadDirectory, setUploadDirectory] = useState(false);
  const user = useSelector((state) => state.user);
  const [newCollection, setNewCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState(0);
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  useEffect(() => {
    if (user) setNewCollection(user.ownedCollections[0]._id);
  }, [user]);

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

  const onCollectionChange = (value) => {
    setNewCollection(value);
  };

  const getNFTContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
    const nftContract = new ethers.Contract(contractAddress, NFT.abi, signer);

    return nftContract;
  };

  const onCreateSubmit = async (data) => {
    if (fileList.length === 0) {
      toast.error("No Image Found");
      return;
    }

    if (fileList.length === 1) {
      setLoading(true);
      const assetPath = await uploadToIPFS(fileList[0].originFileObj);
      const url = `${process.env.REACT_APP_IPFS_URL}/${assetPath}`;

      //create token by smart contract
      const nft = getNFTContract();
      let transaction = await nft.createToken(`${url}`).catch((err) => {
        toast.error("Transaction Failed");
      });
      const tokenId = await getEventAndReturnId(transaction);

      console.log(tokenId);
      console.log(url);

      //upload token to backend
      if (tokenId && url) {
        await uploadToServer(data, tokenId, url).then((res) => {
          if (res.status !== 200) {
            toast.error("Error Uploading Asset");
          }
          toast.success("Minted Asset Successfully");
        });
        setLoading(false);
      }
      setLoading(false);
    } else {
      fileList.map(async (file) => {
        const assetPath = await uploadToIPFS(file.originFileObj);
        const url = `${process.env.REACT_APP_IPFS_URL}/${assetPath}`;

        //create token by smart contract
        const nft = getNFTContract();
        let transaction = await nft.createToken(`${url}`).catch((err) => {
          toast.error("Transaction Failed");
          setLoading(false);
        });
        const tokenId = await getEventAndReturnId(transaction);

        //upload token to backend
        if (tokenId && url) {
          await uploadMultipleToServer(
            file.originFileObj.name,
            tokenId,
            url
          ).then((res) => {
            if (res.status !== 200) {
              toast.error("Error Uploading Asset");
            }
            toast.success("Minted Asset Successfully");
          });
          setLoading(false);
        }
      });
      setLoading(false);
    }
  };

  const uploadToServer = async (data, tokenId, url) => {
    const newAsset = {
      tokenId: tokenId,
      name: data.name,
      description: data.description,
      uriID: url,
      currentOwnerID: user._id,
      currentCollectionID: newCollection,
      thumb_type: fileType,
    };

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/assets/mint`,
      newAsset
    );

    return res;
  };

  const uploadMultipleToServer = async (name, tokenId, url) => {
    const newAsset = {
      tokenId: tokenId,
      name: name,
      description: "",
      uriID: url,
      currentOwnerID: user._id,
      currentCollectionID: newCollection,
    };

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/assets/mint`,
      newAsset
    );

    return res;
  };

  const uploadToIPFS = async (file) => {
    const result = await ipfs.add(file);
    return result.path;
  };

  const getEventAndReturnId = async (transaction) => {
    try {
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();

      return tokenId;
    } catch {
      toast.error("Transaction Failed");
      return null;
    }
  };

  return (
    <>
      {user ? (
        <Spin
          spinning={loading}
          indicator={loadingIcon}
          tip="Minting your asset(s)"
        >
          <StyledLayout>
            <form>
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
                  let typeNumber = 0;
                  switch (true) {
                    case isGIF: {
                      typeNumber = 2;
                      break;
                    }
                    case isMP3: {
                      typeNumber = 1;
                      break;
                    }
                    case isMP4: {
                      typeNumber = 1;
                      break;
                    }
                    default:
                      typeNumber = 0;
                  }

                  if (!isJPG && !isPNG && !isGIF && !isMP3 && !isMP4) {
                    toast.error(
                      "You can only upload JPG/PNG/GIF/MP3/MP4 files!"
                    );
                    return false;
                  }
                  setFileList([...fileList, file]);
                  setFileType(typeNumber);
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
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
              <StyledLabel>Name</StyledLabel>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: {
                    value: !uploadDirectory && fileList.length == 1,
                    message: "Name is required *",
                  },
                  minLength: {
                    value: 3,
                    message: "Name must be at least 5 characters *",
                  },
                  maxLength: {
                    value: 20,
                    message: "Name cannot be more than 20 characters *",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    disabled={uploadDirectory || fileList.length > 1}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    style={{ borderRadius: "5px" }}
                    size="large"
                  />
                )}
              />
              <p style={{ color: "red" }}>
                {errors.name && errors.name.message}
              </p>
              <StyledLabel>Description</StyledLabel>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledTextArea
                    rows={5}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
              <StyledLabel>Collection</StyledLabel>
              <StyledSelect
                showSearch
                placeholder="Select a collection"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                style={{
                  width: "100%",
                  borderRadius: "5px",
                }}
                onChange={onCollectionChange}
                defaultValue={user.ownedCollections[0]._id}
              >
                {user &&
                  user.ownedCollections.map((collection) => (
                    <Option key={collection._id} value={collection._id}>
                      {collection.name}
                    </Option>
                  ))}
              </StyledSelect>
              <br />
              <StyledButton
                type="primary"
                onClick={handleSubmit(onCreateSubmit)}
              >
                Create
              </StyledButton>
            </form>
          </StyledLayout>
        </Spin>
      ) : (
        <Spin>Loading...</Spin>
      )}
    </>
  );
};

export default MintAsset;
