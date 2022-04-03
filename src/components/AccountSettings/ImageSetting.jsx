import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import Icon, { PictureOutlined } from "@ant-design/icons";
import generateGrad from "../../utils/gradientGenerator.js";

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

  useEffect(() => {
    setRandomGrad(generateGrad());
  }, []);

  return (
    <StyledProfileLayout>
      <div className="label">Profile Image</div>
      <Avatar
        size={120}
        style={{ backgroundImage: `${randomGrad}`, cursor: "pointer" }}
      />
      <div className="label">Profile Banner</div>
      <Avatar
        size={120}
        shape="square"
        style={{
          backgroundImage: `${randomGrad}`,
          width: "200px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      />
    </StyledProfileLayout>
  );
};

export default ImageSetting;
