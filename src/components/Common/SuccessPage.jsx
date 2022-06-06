import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled(Button)`
  border-radius: 5px;
  font-size: 15px;
  width: 150px;
  font-weight: bold;
`;

const SuccessPage = (props) => {
  const history = useHistory();
  return (
    <Result
      status="success"
      title={props.title}
      subTitle={props.subTitle}
      extra={[
        <StyledButton
          type="primary"
          onClick={() => history.push("/my-account")}
        >
          Back to Profile
        </StyledButton>,
      ]}
    />
  );
};

export default SuccessPage;
