const Vote = artifacts.require("Vote");

module.exports = async function (deployer) {
  await deployer.deploy(Vote);
};
