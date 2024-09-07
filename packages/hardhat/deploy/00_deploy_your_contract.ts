import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the VerifyMyDevice and CertificationNFT contracts
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Step 1: Deploy the CertificationNFT contract
  const certificationNFTDeployment = await deploy("CertificationNFT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Step 2: Deploy the USDT Mock Token contract (if not already deployed)
  const usdtTokenDeployment = await deploy("MockUSDT", {
    from: deployer,
    args: [100000], // Initial supply of 1,000,000 USDT
    log: true,
    autoMine: true,
  });

  // Step 3: Deploy the VerifyMyDevice contract
  await deploy("VerifyMyDevice", {
    from: deployer,
    args: [usdtTokenDeployment.address, certificationNFTDeployment.address], // Pass USDT and CertificationNFT addresses
    log: true,
    autoMine: true,
  });

  // Step 4: Get the deployed contracts to interact with them after deploying.
  await hre.ethers.getContract<Contract>("VerifyMyDevice", deployer);
  await hre.ethers.getContract<Contract>("CertificationNFT", deployer);
  await hre.ethers.getContract<Contract>("MockUSDT", deployer);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["VerifyMyDevice"];
