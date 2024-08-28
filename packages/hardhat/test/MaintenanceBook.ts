import { expect } from "chai";
import { ethers } from "hardhat";
import { MaintenanceBook, MaintainedItem } from "../typechain-types";

describe("MaintenanceBook", function () {
  let maintenanceBook: MaintenanceBook;
  let maintainedItem: MaintainedItem;
  let owner: string;
  let otherOwner: string;
  let signers: any[];

  before(async () => {
    signers = await ethers.getSigners(); // Get all signers
    owner = signers[0].address;
    otherOwner = signers[1].address;

    const maintenanceBookFactory = await ethers.getContractFactory("MaintenanceBook");
    maintenanceBook = (await maintenanceBookFactory.deploy()) as MaintenanceBook;

    // Create a MaintainedItem with multiple owners
    const initialOwners = [owner, otherOwner];
    await maintenanceBook.createMaintainedItem("Test Item", "Test Location", initialOwners);
    const itemAddress = await maintenanceBook.getMaintainedItem(0);
    maintainedItem = (await ethers.getContractAt("MaintainedItem", itemAddress)) as MaintainedItem;
  });

  describe("Deployment", function () {
    it("Should deploy MaintenanceBook and create a MaintainedItem", async function () {
      expect(await maintenanceBook.getMaintainedItemCount()).to.equal(1);
    });

    it("Should have the correct item name and location", async function () {
      expect(await maintainedItem.itemName()).to.equal("Test Item");
      expect(await maintainedItem.location()).to.equal("Test Location");
    });
  });

  describe("Multi-Owner Functionality", function () {
    it("Should allow owners to add maintenance history", async function () {
      const maintainerAddress = owner; // Using the owner as maintainer for this test
      const comment = "First maintenance";
      const nextServiceDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

      await maintainedItem.connect(signers[0]).addMaintenanceHistory(maintainerAddress, comment, nextServiceDate);
      expect(await maintainedItem.getMaintenanceHistoryCount()).to.equal(1);
    });

    it("Should allow multiple owners to add certifications", async function () {
      const certificationName = "Certification 1";
      const issuer = "Issuer 1";
      const issueDate = Math.floor(Date.now() / 1000);
      const receiver = owner;
      const description = "Description of certification";
      const category = "cars";

      await maintainedItem.connect(signers[1]).addCertification(certificationName, issuer, issueDate, receiver, description, category);
      expect(await maintainedItem.getCertificationCount()).to.equal(1);
    });

    it("Should not allow non-owners to add maintenance history", async function () {
      const maintainerAddress = otherOwner; // Using another owner as maintainer
      const comment = "Unauthorized maintenance";
      const nextServiceDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

      await expect(
        maintainedItem.connect(signers[2]).addMaintenanceHistory(maintainerAddress, comment, nextServiceDate)
      ).to.be.revertedWith("Only an owner can perform this action.");
    });
  });

  describe("Owner Management", function () {
    it("Should return the correct list of owners", async function () {
      const owners = await maintainedItem.getOwners();
      expect(owners).to.include(owner);
      expect(owners).to.include(otherOwner);
      expect(owners.length).to.equal(2);
    });
  });
});