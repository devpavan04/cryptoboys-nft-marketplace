import React, { useState, useEffect } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import MyCryptoBoyNFTDetails from "../MyCryptoBoyNFTDetails/MyCryptoBoyNFTDetails";
import Loading from "../Loading/Loading";

const MyBscBoys = ({
  accountAddress,
  BscBoys,
  totalTokensOwnedByAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const [myBscBoys, setMyBscBoys] = useState([]);

  useEffect(() => {
    if (BscBoys.length !== 0) {
      if (BscBoys[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
    const my_crypto_boys = BscBoys.filter(
      (cryptoboy) => cryptoboy.currentOwner === accountAddress
    );
    setMyBscBoys(my_crypto_boys);
  }, [BscBoys]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of CryptoBoy's You Own : {totalTokensOwnedByAccount}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {myBscBoys.map((cryptoboy) => {
          return (
            <div
              key={cryptoboy.tokenId.toNumber()}
              className="w-50 p-4 mt-1 border"
            >
              <div className="row">
                <div className="col-md-6">
                  {!loading ? (
                    <CryptoBoyNFTImage
                      colors={
                        cryptoboy.metaData !== undefined
                          ? cryptoboy.metaData.metaData.colors
                          : ""
                      }
                    />
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

export default MyBscBoys;
