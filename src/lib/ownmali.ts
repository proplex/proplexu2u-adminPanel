import { ethers } from "ethers";
// import OwnmaliRegistryABI from "./ABIS/OwnmaliRegistry.json";
// import OwnmaliAssetFactoryABI from "./ABIS/OwnmaliAssetFactory.json";
// import OwnmaliAssetABI from "./ABIS/OwnmaliAsset.json";
// import OwnmaliAssetManagerABI from "./ABIS/OwnmaliAssetManager.json";
// import OwnmaliOrderManagerABI from "./ABIS/OwnmaliOrderManager.json";
// import OwnmaliSPVABI from "./ABIS/OwnmaliSPV.json";
// import OwnmaliDAOABI from "./ABIS/OwnmaliDAO.json";
// import OwnmaliFinancialLedgerABI from "./ABIS/OwnmaliFinancialLedger.json";
// import OwnmaliComplianceABI from "./ABIS/ModularCompliance.json";
// import OwnmaliIdentityRegistryABI from "./ABIS/IdentityRegistry.json";
// import OwnmaliSpvFactoryABI from "./ABIS/OwnmaliSpvFactory.json";
import OwnmaliRegistryABI from "./abis/OwnmaliRegistry.json";
import OwnmaliAssetFactoryABI from "./abis/OwnmaliAssetFactory.json";
import OwnmaliAssetABI from "./abis/OwnmaliAsset.json";
import OwnmaliAssetManagerABI from "./abis/OwnmaliAssetManager.json";
import OwnmaliOrderManagerABI from "./abis/OwnmaliOrderManager.json";
import OwnmaliSPVABI from "./abis/OwnmaliSPV.json";
import OwnmaliDAOABI from "./abis/OwnmaliDAO.json";
import OwnmaliFinancialLedgerABI from "./abis/OwnmaliFinancialLedger.json";
import OwnmaliComplianceABI from "./abis/ModularCompliance.json";
import OwnmaliIdentityRegistryABI from "./abis/IdentityRegistry.json";
import OwnmaliSpvFactoryABI from "./abis/OwnmaliSpvFactory.json";
export const ADDRESSES = {
  REGISTRY: "0x89cB8c5E197EABbFF001282E06C68e7e6b0ed8a6",
  ASSET_FACTORY: "0xB517647af92264bbD3Fdb5ed0ED12Cc224ec2d9E",
  DAO: "0xA8c793e12c2731e9B2eE4EB65E31027833830c76",
  FINANCIAL_LEDGER: "0xC53785ABDDD0eA3a2Ae9eaD19AA13D0dD507b8CE",
  SPV: "0xB7Ad4322ba8fe6e8Ea9c27a18c47B2E1572812a3",
  SPV_FACTORY: "0xb6A409b8C74f3F932315a47A190398e2A880D1Df",
} as const;

// Types
type Address = string;
type BigNumberish = ethers.BigNumberish;
type BigNumber = ethers.BigNumber;

export enum OrderStatus {
  Pending,
  Completed,
  Cancelled,
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export interface SPV {
  name: string;
  kyc: boolean;
  country: string;
  metadata: string;
  active: boolean;
}

export interface Asset {
  name: string;
  typ: string;
  metadata: string;
  active: boolean;
}

export interface Order {
  investor: string;
  amount: BigNumber;
  status: OrderStatus;
  createdAt: number;
}

export interface Transaction {
  from: string;
  to: string;
  amount: BigNumber;
  txType: string;
  metadataCID: string;
  referenceId: string;
  timestamp: number;
}

export interface Proposal {
  id: number;
  proposer: string;
  description: string;
  startBlock: number;
  endBlock: number;
  forVotes: BigNumber;
  againstVotes: BigNumber;
  executed: boolean;
  canceled: boolean;
  state: ProposalState;
}

export interface Identity {
  verified: boolean;
  countryCode: number;
  identityContract: string;
}

export interface ComplianceRule {
  module: string;
  active: boolean;
}

// Main Ownmali SDK Class
/**
 * @class OwnmaliSDK
 * @description Main SDK class for interacting with the Ownmali protocol
 */
export class OwnmaliSDK {
  private provider: ethers.providers.Provider;
  private signer?: ethers.Signer;

  // Core Contracts
  public readonly registry: ethers.Contract;
  public readonly assetFactory: ethers.Contract;
  public readonly dao: ethers.Contract;
  public readonly financialLedger: ethers.Contract;
  public readonly spv: ethers.Contract;
  public readonly spvFactory: ethers.Contract;
  public readonly compliance: ethers.Contract;
  public readonly identityRegistry: ethers.Contract;

  // Contract ABIs
  private static readonly ABIS = {
    Registry: OwnmaliRegistryABI,
    AssetFactory: OwnmaliAssetFactoryABI,
    Asset: OwnmaliAssetABI,
    AssetManager: OwnmaliAssetManagerABI,
    OrderManager: OwnmaliOrderManagerABI,
    SPV: OwnmaliSPVABI,
    SPVFactory: OwnmaliSpvFactoryABI,
    DAO: OwnmaliDAOABI,
    FinancialLedger: OwnmaliFinancialLedgerABI,
    Compliance: OwnmaliComplianceABI,
    IdentityRegistry: OwnmaliIdentityRegistryABI,
  };

  /**
   * @param provider - Ethers provider instance
   * @param signer - Optional signer for write operations
   */
  constructor(provider: ethers.providers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;

    // Initialize core contracts
    this.registry = new ethers.Contract(
      ADDRESSES.REGISTRY,
      OwnmaliSDK.ABIS.Registry,
      signer || provider
    );

    this.assetFactory = new ethers.Contract(
      ADDRESSES.ASSET_FACTORY,
      OwnmaliSDK.ABIS.AssetFactory,
      signer || provider
    );

    this.spvFactory = new ethers.Contract(
      ADDRESSES.SPV_FACTORY,
      OwnmaliSDK.ABIS.SPVFactory,
      signer || provider
    );

    this.dao = new ethers.Contract(
      ADDRESSES.DAO,
      OwnmaliSDK.ABIS.DAO,
      signer || provider
    );

    this.financialLedger = new ethers.Contract(
      ADDRESSES.FINANCIAL_LEDGER,
      OwnmaliSDK.ABIS.FinancialLedger,
      signer || provider
    );

    this.spv = new ethers.Contract(
      ADDRESSES.SPV,
      OwnmaliSDK.ABIS.SPV,
      signer || provider
    );

    // These addresses would typically be fetched from the registry
    const complianceAddress = ethers.constants.AddressZero; // Replace with actual address
    const identityRegistryAddress = ethers.constants.AddressZero; // Replace with actual address

    this.compliance = new ethers.Contract(
      complianceAddress,
      OwnmaliSDK.ABIS.Compliance,
      signer || provider
    );

    this.identityRegistry = new ethers.Contract(
      identityRegistryAddress,
      OwnmaliSDK.ABIS.IdentityRegistry,
      signer || provider
    );
  }

  // ========== Registry Functions ==========

  /**
   * Register a new SPV
   * @param spvId - Unique identifier for the SPV
   * @param name - Name of the SPV
   * @param kyc - Whether KYC is required
   * @param country - Country of operation
   * @param metadata - IPFS hash of SPV metadata
   */
  /**
   * Deploy a complete SPV suite using the factory contract
   * @param spvId - Unique identifier for the SPV
   * @param name - Name of the SPV
   * @param admin - Admin address for the SPV
   * @param metaCID - IPFS CID of SPV metadata
   */
  async deploySPV(
    spvId: string,
    name: string,
    admin: string,
    metaCID: string,
    gasLimit: BigNumberish = 8000000 // Increased gas limit for deploySPV
  ): Promise<ethers.ContractTransaction> {
    try {
      const metadataBytes32 = ethers.utils.formatBytes32String(
        metaCID.substring(0, 31)
      );

      console.log("Deploying SPV with params:", {
        spvId,
        name,
        admin,
        metaCID: metaCID.substring(0, 31),
        gasLimit,
      });

      return await this.spvFactory.deploySPV(
        spvId,
        name,
        admin,
        metadataBytes32,
        {
          gasLimit,
          gasPrice: await this.provider.getGasPrice(),
        }
      );
    } catch (error: any) {
      console.error("Error in deploySPV:", {
        error: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });
      throw new Error(`Failed to deploy SPV: ${error.message}`);
    }
  }

  async registerSPV(
    spvId: string,
    name: string,
    kyc: boolean,
    country: string,
    metadata: string
  ): Promise<ethers.ContractTransaction> {
    // Convert IPFS CID to bytes32 format (truncate to 31 chars to fit bytes32)
    const metadataBytes32 = ethers.utils.formatBytes32String(
      metadata.substring(0, 31)
    );

    return this.registry.registerSPV(
      ethers.utils.formatBytes32String(spvId),
      name,
      kyc,
      country,
      metadataBytes32
    );
  }

  /**
   * Get SPV details
   * @param spvId - SPV ID to look up
   */
  async getSPV(spvId: string): Promise<SPV> {
    const spvData = await this.registry.getSPV(
      ethers.utils.formatBytes32String(spvId)
    );
    return {
      name: spvData.name,
      kyc: spvData.kyc,
      country: spvData.country,
      metadata: ethers.utils.parseBytes32String(spvData.metadata),
      active: spvData.active,
    };
  }

  /**
   * Get all assets for an SPV
   * @param spvId - SPV ID
   */
  async getAssetsOfSPV(spvId: string): Promise<string[]> {
    return this.registry.getAssetsOfSPV(
      ethers.utils.formatBytes32String(spvId)
    );
  }

  // ========== Asset Factory Functions ==========

  /**
   * STEP 1: Prepare asset deployment - validates and caches deployment parameters
   * @param spvId - SPV ID that will own the asset
   * @param name - Asset name
   * @param symbol - Asset symbol
   * @param decimals - Number of decimal places
   * @param maxSupply - Maximum token supply
   * @param assetId - Unique identifier for the asset (bytes32)
   * @param metaCID - IPFS CID of asset metadata (bytes32)
   */
  async prepareDeploy(
    spvId: string,
    name: string,
    symbol: string,
    decimals: number,
    maxSupply: BigNumberish,
    assetId: string,
    metaCID: string,
    gasLimit: BigNumberish = 5000000 // Increased gas limit for prepareDeploy
  ): Promise<ethers.ContractTransaction> {
    try {
      const assetIdBytes32 = ethers.utils.formatBytes32String(assetId);
      const metaCIDBytes32 = ethers.utils.formatBytes32String(
        metaCID.substring(0, 31)
      );

      console.log("Preparing deploy with params:", {
        spvId,
        name,
        symbol,
        decimals,
        maxSupply: maxSupply.toString(),
        assetId,
        metaCID: metaCID.substring(0, 31),
        gasLimit,
      });

      const gasPrice = await this.provider.getGasPrice();
      console.log("Current gas price:", gasPrice.toString());

      return await this.assetFactory.prepareDeploy(
        spvId,
        name,
        symbol,
        decimals,
        maxSupply,
        assetIdBytes32,
        metaCIDBytes32,
        {
          gasLimit,
          gasPrice: gasPrice.mul(12).div(10), // Add 20% to handle price fluctuations
        }
      );
    } catch (error: any) {
      console.error("Error in prepareDeploy:", {
        error: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });
      throw new Error(`Failed to prepare deploy: ${error.message}`);
    }
  }

  /**
   * STEP 2: Execute asset deployment - deploys the actual contracts with additional addresses
   * @param identityRegistry - Address of the identity registry contract
   * @param compliance - Address of the compliance contract
   * @param issuerRegistry - Address of the issuer registry contract
   * @param claimRegistry - Address of the claim registry contract
   * @param spv - Address of the SPV contract
   * @param assetOwner - Address of the asset owner
   */
  async executeDeploy(
    identityRegistry: string,
    compliance: string,
    issuerRegistry: string,
    claimRegistry: string,
    spv: string,
    assetOwner: string,
    gasLimit: BigNumberish = 7000000 // Increased gas limit for executeDeploy
  ): Promise<ethers.ContractTransaction> {
    try {
      console.log("Executing deploy with params:", {
        identityRegistry,
        compliance,
        issuerRegistry,
        claimRegistry,
        spv,
        assetOwner,
        gasLimit,
      });

      const gasPrice = await this.provider.getGasPrice();
      console.log("Current gas price:", gasPrice.toString());

      return await this.assetFactory.executeDeploy(
        identityRegistry,
        compliance,
        issuerRegistry,
        claimRegistry,
        spv,
        assetOwner,
        {
          gasLimit,
          gasPrice: gasPrice.mul(12).div(10), // Add 20% to handle price fluctuations
        }
      );
    } catch (error: any) {
      console.error("Error in executeDeploy:", {
        error: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });
      throw new Error(`Failed to execute deploy: ${error.message}`);
    }
  }

  /**
   * Deploy a new asset (Legacy method - use prepareDeploy + executeDeploy for new implementations)
   * @param spvId - SPV ID that will own the asset
   * @param assetId - Unique identifier for the asset
   * @param name - Asset name
   * @param symbol - Asset symbol
   * @param decimals - Number of decimal places
   * @param maxSupply - Maximum token supply
   * @deprecated Use prepareDeploy() followed by executeDeploy() for the new two-step deployment process
   */

  // ========== Order Manager Functions ==========

  /**
   * Get OrderManager contract instance for an asset
   * @param assetAddress - Address of the asset
   */
  getOrderManager(assetAddress: string): ethers.Contract {
    return new ethers.Contract(
      assetAddress,
      OwnmaliSDK.ABIS.OrderManager,
      this.signer || this.provider
    );
  }

  /**
   * Create a new order
   * @param orderManager - OrderManager contract instance
   * @param amount - Amount of tokens to order
   */
  async createOrder(
    orderManager: ethers.Contract,
    amount: BigNumberish
  ): Promise<ethers.ContractTransaction> {
    return orderManager.createOrder(amount);
  }

  /**
   * Get order details
   * @param orderManager - OrderManager contract instance
   * @param orderId - Order ID to look up
   */
  async getOrder(
    orderManager: ethers.Contract,
    orderId: number
  ): Promise<Order> {
    const order = await orderManager.orders(orderId);
    return {
      investor: order.investor,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt.toNumber(),
    };
  }

  // ========== Financial Ledger Functions ==========

  /**
   * Record a transaction in the ledger
   */
  async recordTransaction(
    from: string,
    to: string,
    amount: BigNumberish,
    txType: string,
    metadataCID: string,
    referenceId: string
  ): Promise<ethers.ContractTransaction> {
    return this.financialLedger.recordTransaction(
      from,
      to,
      amount,
      ethers.utils.formatBytes32String(txType),
      metadataCID,
      referenceId
    );
  }

  /**
   * Get transaction details
   * @param txId - Transaction ID to look up
   */
  async getTransaction(txId: number): Promise<Transaction> {
    const tx = await this.financialLedger.transactions(txId);
    return {
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
      txType: ethers.utils.parseBytes32String(tx.txType),
      metadataCID: tx.metadataCID,
      referenceId: tx.referenceId,
      timestamp: tx.timestamp.toNumber(),
    };
  }

  // ========== DAO Functions ==========

  /**
   * Create a new proposal
   */
  async createProposal(
    description: string,
    targets: string[],
    values: BigNumberish[],
    calldatas: string[]
  ): Promise<ethers.ContractTransaction> {
    return this.dao.createProposal(description, targets, values, calldatas);
  }

  /**
   * Vote on a proposal
   */
  async castVote(
    proposalId: number,
    support: boolean
  ): Promise<ethers.ContractTransaction> {
    return this.dao.castVote(proposalId, support);
  }

  /**
   * Get proposal details
   * @param proposalId - ID of the proposal
   */
  async getProposal(proposalId: number): Promise<Proposal> {
    const proposal = await this.dao.proposals(proposalId);
    return {
      id: proposalId,
      proposer: proposal.proposer,
      description: proposal.description,
      startBlock: proposal.startBlock.toNumber(),
      endBlock: proposal.endBlock.toNumber(),
      forVotes: proposal.forVotes,
      againstVotes: proposal.againstVotes,
      executed: proposal.executed,
      canceled: proposal.canceled,
      state: proposal.state,
    };
  }

  // ========== SPV Functions ==========

  /**
   * Add an investor to the SPV
   */
  async addInvestor(investor: string): Promise<ethers.ContractTransaction> {
    return this.spv.addInvestor(investor);
  }

  /**
   * Check if an address is an investor
   */
  async isInvestor(address: string): Promise<boolean> {
    return this.spv.isInvestor(address);
  }

  /**
   * Get all investors in the SPV
   */
  async getInvestors(): Promise<string[]> {
    return this.spv.getInvestors();
  }

  // ========== Identity & Compliance Functions ==========

  /**
   * Check if an identity is verified
   * @param identity - Address to check
   */
  async isVerified(identity: string): Promise<boolean> {
    return this.identityRegistry.isVerified(identity);
  }

  /**
   * Get country code for an identity
   * @param identity - Address to check
   */
  async getCountry(identity: string): Promise<number> {
    return this.identityRegistry.countryOf(identity);
  }

  /**
   * Add a compliance module
   * @param module - Address of the compliance module
   */
  async addComplianceModule(
    module: string
  ): Promise<ethers.ContractTransaction> {
    return this.compliance.addModule(module);
  }

  /**
   * Get all compliance modules
   */
  async getComplianceModules(): Promise<ComplianceRule[]> {
    const modules = await this.compliance.getModules();
    const activeStatus = await Promise.all(
      modules.map((module: string) => this.compliance.isModuleActive(module))
    );

    return modules.map((module: string, index: number) => ({
      module,
      active: activeStatus[index],
    }));
  }

  // ========== Token Approval Functions ==========

  /**
   * Approve a spender to spend tokens on behalf of the message sender
   * @param assetAddress - Address of the asset contract
   * @param spender - Address of the spender
   * @param amount - Amount of tokens to approve (in smallest unit)
   * @returns Transaction receipt
   */
  async approve(
    assetAddress: string,
    spender: string,
    amount: BigNumberish,
    gasLimit: BigNumberish = 1000000 // Increased gas limit for approve
  ): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error("Signer is required for this operation");
    }

    try {
      const asset = new ethers.Contract(
        assetAddress,
        OwnmaliSDK.ABIS.Asset,
        this.signer
      );

      console.log("Approving with params:", {
        assetAddress,
        spender,
        amount: amount.toString(),
        gasLimit,
      });

      const gasPrice = await this.provider.getGasPrice();
      console.log("Current gas price:", gasPrice.toString());

      return await asset.approve(spender, amount, {
        gasLimit,
        gasPrice: gasPrice.mul(12).div(10), // Add 20% to handle price fluctuations
      });
    } catch (error: any) {
      console.error("Error in approve:", {
        error: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });
      throw new Error(`Failed to approve tokens: ${error.message}`);
    }
  }

  /**
   * Get the allowance of a spender for a specific owner
   * @param assetAddress - Address of the asset contract
   * @param owner - Address of the token owner
   * @param spender - Address of the spender
   * @returns The amount of tokens the spender is allowed to spend on behalf of the owner
   */
  async allowance(
    assetAddress: string,
    owner: string,
    spender: string
  ): Promise<BigNumber> {
    const asset = new ethers.Contract(
      assetAddress,
      OwnmaliSDK.ABIS.Asset,
      this.provider
    );

    try {
      return await asset.allowance(owner, spender);
    } catch (error: any) {
      console.error("Error in allowance:", {
        error: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });
      throw new Error(`Failed to get allowance: ${error.message}`);
    }
  }

  // ========== Utility Functions ==========

  /**
   * Format an ID string to bytes32
   */
  formatId(id: string): string {
    return ethers.utils.formatBytes32String(id);
  }

  /**
   * Parse a human-readable amount to wei
   */
  parseAmount(amount: string, decimals: number = 18): BigNumber {
    return ethers.utils.parseUnits(amount, decimals);
  }

  /**
   * Format wei to a human-readable amount
   */
  formatAmount(amount: BigNumberish, decimals: number = 18): string {
    return ethers.utils.formatUnits(amount, decimals);
  }

  /**
   * Get contract instance for a deployed asset
   * @param address - Address of the asset contract
   */
  getAssetContract(address: string): ethers.Contract {
    return new ethers.Contract(
      address,
      OwnmaliSDK.ABIS.Asset,
      this.signer || this.provider
    );
  }

  /**
   * Get contract instance for a deployed asset manager
   * @param address - Address of the asset manager contract
   */
  getAssetManagerContract(address: string): ethers.Contract {
    return new ethers.Contract(
      address,
      OwnmaliSDK.ABIS.AssetManager,
      this.signer || this.provider
    );
  }
}
