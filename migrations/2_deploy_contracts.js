const CryptoBoys = artifacts.require("CryptoBoys");
bal = async () => {
  let balance = await web3.eth.getBalance("0x297b0eC2EF5EB41b724DB54c0555b2E3Ae348701")
  console.log(balance)
}
bal()

module.exports = async function(deployer) {
  await deployer.deploy(CryptoBoys, { from: "0x297b0eC2EF5EB41b724DB54c0555b2E3Ae348701"});
};