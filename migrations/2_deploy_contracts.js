const CryptoBoys = artifacts.require("CryptoBoys");

module.exports = async function(deployer) {
  await deployer.deploy(CryptoBoys);
};
