import React, { useState, useEffect } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import MyCryptoBoyNFTDetails from "../MyCryptoBoyNFTDetails/MyCryptoBoyNFTDetails";
import Loading from "../Loading/Loading";
import { fetch } from "ipfs-utils/src/http/fetch.node";
import './MyCryptoBoys.css'

const MyCryptoBoys = ({
  accountAddress,
  cryptoBoys,
  totalTokensOwnedByAccount,
  baseURI
}) => {
  const [loading, setLoading] = useState(false);
  const [myCryptoBoys, setMyCryptoBoys] = useState([]);

  useEffect(() => {
    if (cryptoBoys.length !== 0) {
      if (cryptoBoys[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
    const my_crypto_boys = cryptoBoys.filter(
      (cryptoboy) => cryptoboy.currentOwner === accountAddress
    );
    setMyCryptoBoys(my_crypto_boys);
  }, [cryptoBoys]);

  return (
    <div className="container">
          <h5 className="mcb-title">
            Total No. of CroSkulls's You Own : {totalTokensOwnedByAccount}
          </h5>
      <div className="d-flex flex-wrap mb-2">
        {myCryptoBoys.map(  (cryptoboy) => {
          console.log( cryptoboy )
          return (
            <div
              key={cryptoboy.tokenId.toNumber()}
              className="w-50 p-4 mt-1 border"
            >
              <div className="row">
                <div className="col-md-6">
                  {!loading && cryptoboy.metaData ? (
                    <CryptoBoyNFTImage imageURI={cryptoboy.metaData.image} />
                  ) : (
                    <Loading />
                  )}
                </div>
                <div className="col-md-6 text-center">
                  <MyCryptoBoyNFTDetails
                    cryptoboy={cryptoboy}
                    accountAddress={accountAddress}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCryptoBoys;
