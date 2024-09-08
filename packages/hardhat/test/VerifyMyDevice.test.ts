import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { MockUSDT, VerifyMyDevice } from "../typechain-types";

describe("VerifyMyDevice", function () {
  let verifyMyDevice: VerifyMyDevice;
  let mockUSDT: MockUSDT;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;

  const initialUSDTSupply = ethers.parseUnits("100000", 6); // 100,000 USDT
  const productPrice = ethers.parseUnits("15", 6); // 15 USDT

  beforeEach(async function () {
    [seller, buyer] = await ethers.getSigners();

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy(initialUSDTSupply);
    await mockUSDT.waitForDeployment();

    const VerifyMyDevice = await ethers.getContractFactory("VerifyMyDevice");
    verifyMyDevice = await VerifyMyDevice.deploy();
    await verifyMyDevice.waitForDeployment();

    // Transfer some USDT to the buyer
    await mockUSDT.transfer(buyer.address, ethers.parseUnits("1000", 6));
  });

  describe("Seller Registration and Update", function () {
    it("Should allow a seller to register", async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      const sellerInfo = await verifyMyDevice.sellers(seller.address);
      expect(sellerInfo.name).to.equal("Rome Phone Service");
      expect(sellerInfo.location).to.equal("Rome");
      expect(sellerInfo.isRegistered).to.be.true;
    });

    it("Should not allow a seller to register twice", async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await expect(
        verifyMyDevice.connect(seller).createSellerAccount("Milan", "Milan Phone Service"),
      ).to.be.revertedWith("Seller already registered");
    });

    it("Should allow a registered seller to update their account", async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await verifyMyDevice.connect(seller).updateSellerAccount("Milan", "Milan Phone Service");
      const updatedSellerInfo = await verifyMyDevice.sellers(seller.address);
      expect(updatedSellerInfo.name).to.equal("Milan Phone Service");
      expect(updatedSellerInfo.location).to.equal("Milan");
      expect(updatedSellerInfo.isRegistered).to.be.true;
    });

    it("Should not allow an unregistered seller to update their account", async function () {
      await expect(
        verifyMyDevice.connect(buyer).updateSellerAccount("Milan", "Milan Phone Service"),
      ).to.be.revertedWith("Not a registered seller");
    });

    it("Should not allow updating with empty location or name", async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await expect(verifyMyDevice.connect(seller).updateSellerAccount("", "Milan Phone Service")).to.be.revertedWith(
        "Location cannot be empty",
      );
      await expect(verifyMyDevice.connect(seller).updateSellerAccount("Milan", "")).to.be.revertedWith(
        "Name cannot be empty",
      );
    });

    it("Should emit SellerAccountUpdated event when updating account", async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await expect(verifyMyDevice.connect(seller).updateSellerAccount("Milan", "Milan Phone Service"))
        .to.emit(verifyMyDevice, "SellerAccountUpdated")
        .withArgs(seller.address, "Milan Phone Service", "Milan");
    });
  });

  describe("Product Creation", function () {
    beforeEach(async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
    });

    it("Should allow a registered seller to create a product", async function () {
      await verifyMyDevice.connect(seller).createProduct("phone", productPrice, await mockUSDT.getAddress());
      const product = await verifyMyDevice.products(1);
      expect(product.deviceType).to.equal("phone");
      expect(product.price).to.equal(productPrice);
      expect(product.tokenAddress).to.equal(await mockUSDT.getAddress());
      expect(product.sellerAddress).to.equal(seller.address);
    });

    it("Should not allow an unregistered seller to create a product", async function () {
      await expect(
        verifyMyDevice.connect(buyer).createProduct("phone", productPrice, await mockUSDT.getAddress()),
      ).to.be.revertedWith("Not a registered seller");
    });
  });

  describe("Certificate Purchase", function () {
    beforeEach(async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await verifyMyDevice.connect(seller).createProduct("phone", productPrice, await mockUSDT.getAddress());
      await mockUSDT.connect(buyer).approve(await verifyMyDevice.getAddress(), productPrice);
    });

    it("Should allow a buyer to purchase a certificate", async function () {
      await verifyMyDevice.connect(buyer).purchaseProduct(1, "Apple", "128GB", "iPhone 12", ethers.id("12345"));
      const certificate = await verifyMyDevice.certificates(1);
      expect(certificate.seller).to.equal(seller.address);
      expect(certificate.productId).to.equal(1);
      expect(certificate.deviceBrand).to.equal("Apple");
      expect(certificate.deviceModel).to.equal("iPhone 12");
      expect(certificate.deviceVariant).to.equal("128GB");
    });

    it("Should transfer tokens from buyer to seller upon purchase", async function () {
      const sellerBalanceBefore = await mockUSDT.balanceOf(seller.address);
      await verifyMyDevice.connect(buyer).purchaseProduct(1, "Apple", "iPhone 12", "128GB", ethers.id("12345"));
      const sellerBalanceAfter = await mockUSDT.balanceOf(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(productPrice);
    });
  });

  describe("Certification Completion", function () {
    beforeEach(async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await verifyMyDevice.connect(seller).createProduct("phone", productPrice, await mockUSDT.getAddress());
      await mockUSDT.connect(buyer).approve(await verifyMyDevice.getAddress(), productPrice);
      await verifyMyDevice.connect(buyer).purchaseProduct(1, "Apple", "iPhone 12", "128GB", ethers.id("12345"));
    });

    it("Should allow the seller to complete a certification", async function () {
      await verifyMyDevice
        .connect(seller)
        .completeCertification(1, "Apple", "iPhone 12", "128GB", "Good", "Minor scratches");
      const certificate = await verifyMyDevice.certificates(1);
      expect(certificate.isCompleted).to.be.true;
      expect(certificate.verifiedBrand).to.equal("Apple");
      expect(certificate.verifiedModel).to.equal("iPhone 12");
      expect(certificate.verifiedVariant).to.equal("128GB");
      expect(certificate.condition).to.equal("Good");
      expect(certificate.remarks).to.equal("Minor scratches");
    });

    it("Should not allow a non-seller to complete a certification", async function () {
      await expect(
        verifyMyDevice
          .connect(buyer)
          .completeCertification(1, "Apple", "iPhone 12", "128GB", "Good", "Minor scratches"),
      ).to.be.revertedWith("Not a registered seller");
    });
  });

  describe("Refund", function () {
    beforeEach(async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await verifyMyDevice.connect(seller).createProduct("phone", productPrice, await mockUSDT.getAddress());
      await mockUSDT.connect(buyer).approve(await verifyMyDevice.getAddress(), productPrice);
      await mockUSDT.connect(seller).approve(await verifyMyDevice.getAddress(), productPrice);
      await verifyMyDevice.connect(buyer).purchaseProduct(1, "Apple", "iPhone 12", "128GB", ethers.id("12345"));
    });

    it("Should allow the seller to refund an uncompleted certificate", async function () {
      const buyerBalanceBefore: bigint = BigInt(await mockUSDT.balanceOf(buyer.address));
      console.log(`Buyer Balance Before: ${buyerBalanceBefore}`);

      await verifyMyDevice.connect(seller).refundCertificate(1);

      const buyerBalanceAfter: bigint = BigInt(await mockUSDT.balanceOf(buyer.address));
      console.log(`Buyer Balance After: ${buyerBalanceAfter}`);

      const certificate = await verifyMyDevice.certificates(1);
      console.log(`Certificate Refunded: ${certificate.isRefunded}`);

      const productPrice: bigint = BigInt(ethers.parseUnits("15", 6).toString());
      console.log(`Product Price: ${productPrice}`);

      expect(certificate.isRefunded).to.be.true;
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(productPrice);

      // Additional check for balance difference
      const balanceDifference = buyerBalanceAfter - buyerBalanceBefore;
      console.log(`Balance Difference: ${balanceDifference}`);
      expect(balanceDifference).to.equal(productPrice);
    });

    it("Should not allow refunding a completed certificate", async function () {
      await verifyMyDevice
        .connect(seller)
        .completeCertification(1, "Apple", "iPhone 12", "128GB", "Good", "Minor scratches");
      await expect(verifyMyDevice.connect(seller).refundCertificate(1)).to.be.revertedWith(
        "Cannot refund completed certificate",
      );
    });
  });

  describe("Data Retrieval", function () {
    beforeEach(async function () {
      await verifyMyDevice.connect(seller).createSellerAccount("Rome", "Rome Phone Service");
      await verifyMyDevice.connect(seller).createProduct("phone", productPrice, await mockUSDT.getAddress());
      await mockUSDT.connect(buyer).approve(await verifyMyDevice.getAddress(), productPrice);
      await verifyMyDevice.connect(buyer).purchaseProduct(1, "Apple", "iPhone 12", "128GB", ethers.id("12345"));
    });

    it("Should return all products", async function () {
      const products = await verifyMyDevice.getAllProducts();
      expect(products.length).to.equal(1);
      expect(products[0].deviceType).to.equal("phone");
      expect(products[0].price).to.equal(productPrice);
    });

    it("Should return all certificates for a buyer", async function () {
      const certificates = await verifyMyDevice.getAllCertificatesByBuyer(buyer.address);
      expect(certificates.length).to.equal(1);
      expect(certificates[0]).to.equal(1);
    });

    it("Should return all certificates for a seller", async function () {
      const certificates = await verifyMyDevice.getAllPurchasedCertificatesBySeller(seller.address);
      expect(certificates.length).to.equal(1);
      expect(certificates[0]).to.equal(1);
    });
  });
});
