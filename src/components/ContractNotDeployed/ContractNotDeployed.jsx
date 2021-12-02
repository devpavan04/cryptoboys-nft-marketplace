import React from "react";

const ContractNotDeployed = () => {
  return (
    <div className="jumbotron">
      <h3>CRSkull Contract Not Deployed To This Network.</h3>
      <hr className="my-4" />
      <p className="lead">
        Connect Metamask to Cassini Testnet Or Cronos Mainnet
      </p>
    </div>
  );
};

export default ContractNotDeployed;
