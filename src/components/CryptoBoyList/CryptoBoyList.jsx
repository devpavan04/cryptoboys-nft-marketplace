
import React, { useState, useEffect } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import CryptoBoyNFTDetails from "../CryptoBoyNFTDetails/CryptoBoyNFTDetails";
import Loading from "../Loading/Loading";
import { Redirect } from "react-router-dom";

const CryptoBoyList = ({
  cryptoBoys,
  prices,
  accountAddress,
  totalTokensMinted,
  changeTokenPrice,
  toggleForSale,
  buyCryptoBoy,
}) => {
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cryptoBoys.length !== 0) {
            if (cryptoBoys[0].metaData !== undefined) {
                setLoading(loading);
            } else {
                setLoading(false);
            }
        }
    }, [cryptoBoys]);
    return (
        !loading ? 
            cryptoBoys.map((cryptoboy) => {
                return (
                <div
                    key={cryptoboy.tokenId.toNumber()}
                    className="w-25 p-4 mt-1 border"
                    >
                        { ! loading && cryptoboy.metaData ? 
                            <CryptoBoyNFTImage 
                                imageURI={cryptoboy.metaData.image} 
                            />
                        : 
                        <Loading />
                        }       
                        <CryptoBoyNFTDetails
                            cryptoboy={cryptoboy}
                            accountAddress={accountAddress}
                            changeTokenPrice={changeTokenPrice}
                            toggleForSale={toggleForSale}
                            buyCryptoBoy={buyCryptoBoy}
                        />
                    </div>
                );
            })
        : ''
    );
}

export default CryptoBoyList;