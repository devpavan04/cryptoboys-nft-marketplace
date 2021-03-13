import React from "react";

const ContractNotDeployed = () => {
  return (
    <div className="jumbotron">
      <h3>Crypto Boys Contract Not Deployed To This Network.</h3>
      <hr className="my-4" />
      <p className="lead">
        Connect Metamask to Kovan Testnet Or Localhost 7545 running a custom RPC
        like Ganache.
      </p>
    </div>
  );
};

export default ContractNotDeployed;
