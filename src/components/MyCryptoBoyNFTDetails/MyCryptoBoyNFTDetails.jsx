import React from "react";
import { Accordion, Card } from "react-bootstrap";

const MyCryptoBoyNFTDetails = (props) => {
  const {
    tokenId,
    tokenName,
    price,
    mintedBy,
    previousOwner,
    numberOfTransfers,
    metaData
  } = props.cryptoboy;
  return (
    <div key={tokenId.toNumber()} className="mt-4 ml-3">
      <p>
        <span className="font-weight-bold">Token Id</span> :{" "}
        {tokenId.toNumber()}
      </p>
      <p>
        <span className="font-weight-bold">Name</span> : {tokenName}
      </p>
      <p>
        <span className="font-weight-bold">Price</span> :{" "}
        {window.web3.utils.fromWei(price.toString(), "Ether")} Ξ
      </p>
      <p>
        <span className="font-weight-bold">No. of Transfers</span> :{" "}
        {numberOfTransfers.toNumber()}
      </p>
      {props.accountAddress === mintedBy &&
        props.accountAddress !== previousOwner ? (
        <div className="alert alert-success w-50 text-center m-auto">
          Minted
        </div>
      ) : (
        <div className="alert alert-info w-50 text-center m-auto">Bought</div>
      )}
      <br></br>
      <Accordion>
        <Card>
          <Accordion.Toggle eventKey="1" className="toogle-button">
            Traits Properties
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body className="vertical mcbd-cbody">
              {metaData ?
                metaData.attributes.map(attribute => {
                  return (
                    <span className="font-weight-bold mcbd-span">{attribute.trait_type}:
                      {attribute.value}
                    </span>
                  )
                })
                : ''}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default MyCryptoBoyNFTDetails;
