import React from "react";

const CryptoBoyNFTImage = ({ colors }) => {
  const {
    cardBorderColor,
    cardBackgroundColor,
    headBorderColor,
    headBackgroundColor,
    leftEyeBorderColor,
    rightEyeBorderColor,
    leftEyeBackgroundColor,
    rightEyeBackgroundColor,
    leftPupilBackgroundColor,
    rightPupilBackgroundColor,
    mouthColor,
    neckBackgroundColor,
    neckBorderColor,
    bodyBackgroundColor,
    bodyBorderColor,
  } = colors;

  const cryptoboy_card = {
    width: "280px",
    height: "260px",
    margin: "auto",
    backgroundColor: `${cardBackgroundColor}`,
    border: `10px solid ${cardBorderColor}`,
  };

  const head = {
    zIndex: "1",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "2rem auto 0",
    border: `8px solid ${headBorderColor}`,
    backgroundColor: `${headBackgroundColor}`,
    position: "relative",
  };

  const eyeLeft = {
    zIndex: "1",
    width: "60px",
    height: "60px",
    backgroundColor: `${leftEyeBackgroundColor}`,
    borderRadius: "50%",
    position: "absolute",
    top: "0rem",
    left: "-1.5rem",
    border: `6px solid ${leftEyeBorderColor}`,
  };

  const eyeRight = {
    zIndex: "1",
    width: "70px",
    height: "70px",
    backgroundColor: `${rightEyeBackgroundColor}`,
    borderRadius: "50%",
    position: "absolute",
    top: "-1.2rem",
    left: "2.8rem",
    border: `6px solid ${rightEyeBorderColor}`,
  };

  const pupilLeft = {
    width: "20px",
    height: "20px",
    backgroundColor: `${leftPupilBackgroundColor}`,
    borderRadius: "50%",
    position: "absolute",
    left: "1rem",
    top: "1rem",
  };

  const pupilRight = {
    width: "30px",
    height: "30px",
    backgroundColor: `${rightPupilBackgroundColor}`,
    borderRadius: "50%",
    position: "absolute",
    left: "1rem",
    top: "1rem",
  };

  const mouth = {
    position: "absolute",
    top: "12px",
    left: "0",
    right: "0",
    height: "60px",
    width: "60px",
    margin: "3px auto",
    borderRadius: "100%",
    borderBottom: `8px solid ${mouthColor}`,
  };

  const neck = {
    position: "relative",
    left: "7.7rem",
    top: "-0.1rem",
    width: "15px",
    height: "30px",
    backgroundColor: `${neckBackgroundColor}`,
    border: `4px solid ${neckBorderColor}`,
  };

  const body = {
    height: "50px",
    width: "90px",
    margin: "-0.4rem auto",
    border: `5px solid ${bodyBorderColor}`,
    borderRadius: "100% 100% 100% 100% / 100% 100% 0% 0%",
    backgroundColor: `${bodyBackgroundColor}`,
    position: "relative",
    left: "0.1rem",
  };

  const leftHand = {
    position: "absolute",
    top: "20px",
    width: "15px",
    height: "20px",
    borderRight: `5px solid ${bodyBorderColor}`,
  };

  const rightHand = {
    position: "absolute",
    top: "20px",
    width: "15px",
    height: "20px",
    borderRight: `5px solid ${bodyBorderColor}`,
    right: "1rem",
  };

  return (
    <div style={cryptoboy_card}>
      <div style={head}>
        <div style={eyeLeft}>
          <div style={pupilLeft}></div>
        </div>
        <div style={eyeRight}>
          <div style={pupilRight}></div>
        </div>
        <div style={mouth}></div>
      </div>
      <div style={neck}></div>
      <div style={body}>
        <div style={leftHand}></div>
        <div style={rightHand}></div>
      </div>
    </div>
  );
};

export default CryptoBoyNFTImage;
