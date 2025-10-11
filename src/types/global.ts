
export interface PaginationTypes {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
}

export interface IBoardMember {
  id: string;
  uuid: string;
  name: string;
  email: string;
  title: string;
  permission_level: string;
  status: boolean;
  dsc_din: boolean;
  llp_document: boolean;
  whatsapp_number: string | null;
  provide_customer_support: string;
  note: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyResponse {
  status?: string;
  message?: string;
  statusCode?: number;
  data?: CompanyData;
}

export interface CompanyData {
  memoAndTerms?: MemoAndTerms;
  escrowBankDetails?: EscrowBankDetails;
  legalDocuments?: LegalDocuments;
  boardOfDirectors?: BoardOfDirectors;
  daoConfiguration?: DaoConfiguration;
  _id?: string;
  name?: string;
  type?: string;
  jurisdiction?: string;
  formationDate?: string; // ISO Date
  businessPurpose?: string;
  status?: string;
  currency?: string;
  logo?: string;
  completedSteps?: string[];
  createdAt?: string; // ISO Date
  updatedAt?: string; // ISO Date
  __v?: number;
  id?: string;
  assets?: Asset[];
}

export interface MemoAndTerms {
  investmentMemorandum?: string;
  termsAndConditions?: string;
  riskFactor?: string;
  investmentStrategy?: string;
}

export interface EscrowBankDetails {
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
  routingNumber?: string | null;
  bankStatement?: string | null;
}

export interface LegalDocuments {
  llcOperatingAgreement?: FileDocument;
  articlesOfAssociation?: FileDocument;
  memorandumOfAssociation?: FileDocument;
  otherDocuments?: FileDocument[] | null;
}

export interface FileDocument {
  name?: string;
  url?: string;
  _id?: string;
  id?: string;
}

export interface BoardOfDirectors {
  treasuryManager?: BoardMember;
  assetManager?: BoardMember;
  additionalBoardMembers?: AdditionalBoardMember[];
}

export interface BoardMember {
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  idNumber?: string | null;
  idProof?: FileDocument | null;
}

export interface AdditionalBoardMember {
  _id?: string;
  companyId?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  idNumber?: string;
  idProof?: FileDocument;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface DaoConfiguration {
  votingPeriod?: {
    days?: number;
    hours?: number;
  };
  governanceRights?: {
    votingRights?: boolean;
    proposalCreation?: boolean;
    adminVotePower?: boolean;
  };
  daoName?: string;
  tokenSymbol?: string;
  blockchain?: string | null;
  governanceModel?: string | null;
  proposalThresholdPercent?: number;
  quorumPercent?: number;
  decisionType?: string;
  issuerRepSignature?: boolean;
}

export interface Asset {
  investmentPerformance?: InvestmentPerformance;
  investorRequirementsAndTimeline?: InvestorRequirementsAndTimeline;
  rentalInformation?: RentalInformation;
  escrowInformation?: EscrowInformation;
  legalAdivisory?: EntityInfo;
  assetManagementCompany?: EntityInfo;
  brokerage?: EntityInfo;
  loanInformation?: LoanInformation;
  tokenInformation?: TokenInformation;
  media?: Media;
  hostedBy?: HostedBy;
  _id?: string;
  companyId?: string;
  class?: string;
  category?: string;
  stage?: string;
  style?: string;
  currency?: string;
  instrumentType?: string;
  metadata?: {
    places?: Record<string, any>;
  };
  status?: string;
  bookmarks?: number;
  name?: string;
  about?: string;
  eoi?: number;
  country?: string;
  city?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  hasGlobalFeePercentagesSynced?: boolean;
  hasGlobalFAQsSynced?: boolean;
  hasGlobalRiskFactorsSynced?: boolean;
  hasGlobalRiskDisclosuresSynced?: boolean;
  hasGlobalAdditionalTaxesSynced?: boolean;
  hasGlobalExitOpportunitiesSynced?: boolean;
  totalNumberOfSfts?: number;
  pricePerSft?: number;
  basePropertyValue?: number;
  totalPropertyValueAfterFees?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface InvestmentPerformance {
  holdingPeriod?: number;
  moic?: number;
  targetCapitalAppreciation?: number;
  numberOfYears?: number;
  netInvestmentMultiplier?: number;
  estimatedSalePriceAsPerLockInPeriod?: number;
  capitalGains?: number;
  capitalGainsTax?: number;
  estimatedReturnsAsPerLockInPeriod?: number;
  interestRateonReserves?: number;
  netRentalYield?: number;
  grossRentalYield?: number;
  irr?: number;
  latestPropertyValue?: number;
  latestPropertyValueDate?: string;
}

export interface InvestorRequirementsAndTimeline {
  investorAcreditation?: string;
  kycOrAmlRequirements?: string;
  lockupPeriod?: number;
  lockupPeriodType?: string;
  rentalYield?: number;
  distributionStartDate?: string | null;
  distributionEndDate?: string | null;
}

export interface RentalInformation {
  expenses?: {
    monthlyExpenses?: number;
    annualExpenses?: number;
  };
  rentPerSft?: number;
  vacancyRate?: number;
  grossMonthlyRent?: number;
  netMonthlyRent?: number;
  grossAnnualRent?: number;
  netAnnualRent?: number;
  netCashFlow?: number;
}

export interface EscrowInformation {
  country?: string;
  state?: string;
  escrowBank?: string;
  escrowAgent?: string;
}

export interface EntityInfo {
  name?: string;
  document?: string | null;
}

export interface LoanInformation {
  hasAssetPossesLoan?: boolean;
  currentLoanAmount?: number;
  totalNumberOfYears?: number;
  totalLoanAmount?: number;
  numberOfEMIsYetToPay?: number;
  interestRate?: number;
  pendingLoanAmount?: number;
  bankName?: string;
  brankBranch?: string;
}

export interface TokenInformation {
  tokenSupply?: number;
  tokenSymbol?: string;
  minimumTokensToBuy?: number;
  maximumTokensToBuy?: number;
  availableTokensToBuy?: number;
  tokenPrice?: number;
}

export interface Media {
  imageURL?: string;
  videoURL?: string;
  gallery?: string[];
  pitchDeckURL?: string;
}

export interface HostedBy {
  name?: string;
  isVerified?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoURL?: string;
  whatsappNumber?: string;
  totalProjects?: number;
  onGoingProjects?: number;
  primeLocation?: string;
  about?: string;
  yearEstablished?: number | null;
}
