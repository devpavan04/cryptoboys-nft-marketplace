import React, { useState } from 'react';
import { Card, Image } from 'antd';
import styled from 'styled-components';
import { HeartTwoTone } from '@ant-design/icons';
import AssetDesc from './AssetDesc.jsx';
import SellerDesc from './SellerDesc.jsx';
import { useSelector } from 'react-redux';

const StyledCard = styled(Card)`
  width: 100% !important;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  .ant-card-head {
    min-height: 0;
    height: 30px !important;
    padding: 0 10px !important;
  }
  .ant-card-extra {
    padding: 0 !important;
  }
  .ant-card-body {
    padding: 0 !important;
  }
`;

const StyledImage = styled(Image)`
  width: 100% !important;
  height: 100% !important;
  max-height: 1000px !important;
  border-radius: 0px 0px 10px 10px;
`;

const AssetImage = () => {
  const [favorite, setFavorite] = useState(false);
  const asset = useSelector((state) => state.asset);

  //#region Favorite

  const handleFavorite = () => {
    setFavorite(!favorite);
  };
  const FavoriteLayout = () => {
    const heartProps = {
      marginRight: '12px',
      fontSize: '20px',
    };
    return (
      <>
        {favorite ? (
          <HeartTwoTone twoToneColor="#eb2f96" onClick={handleFavorite} style={heartProps} />
        ) : (
          <HeartTwoTone twoToneColor="#bdbcb9" onClick={handleFavorite} style={heartProps} />
        )}
        <span style={{ position: 'relative', top: '3px' }}>{asset && asset.favoriteCount}</span>
      </>
    );
  };

  //#endregion
  return (
    <>
      <StyledCard extra={<FavoriteLayout />}>
        <StyledImage
          width={'100%'}
          src={asset.uriID}
        />
      </StyledCard>
      <AssetDesc />
      <SellerDesc />
    </>
  );
};

export default AssetImage;
