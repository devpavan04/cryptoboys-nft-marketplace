const BscBoys = artifacts.require("BscBoys");

module.exports = async function(deployer) {
  await deployer.deploy(BscBoys);
};
