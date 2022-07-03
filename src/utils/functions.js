import { message } from "antd";

export function beforeUploadImageFile(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const ipfsClient = require("ipfs-http-client");
export const infuraAuth =
  "Basic " +
  window.btoa(
    `${process.env.REACT_APP_PROJECT_ID}:${process.env.REACT_APP_PROJECT_SECRET}`
  );
export const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: infuraAuth,
  },
});
