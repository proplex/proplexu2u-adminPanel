# Proplex

A modern admin dashboard for the Proplex platform, built with React, TypeScript, Vite, Redux Toolkit, and Tailwind CSS. Proplex is a pioneering blockchain platform democratizing access to high-value real-world assets (RWAs) like commercial real estate, private equity, and infrastructure projects via fractional tokenized ownership on a multi-chain ecosystem (Ethereum, Polygon, Solana, U2U Network).

## Features
- Modular, scalable codebase for RWA tokenization, DAO governance, and compliance management
- TypeScript for type safety in handling on-chain assets, yields, and KYC/AML data
- Redux Toolkit for state management of multi-chain portfolios, USDC transactions, and PXT governance
- React Hook Form & Zod for robust form validation in asset onboarding, SPV setup, and investor verification
- Tailwind CSS for rapid UI development of intuitive, responsive dashboards
- Code splitting and lazy loading for performance in real-time oracle feeds and liquidity pool monitoring
- REST API integration with Chainlink oracles, LayerZero bridges, and Circle USDC APIs
- Responsive design enabling seamless admin oversight on desktop and mobile for global operations

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
git clone <repo-url>
cd proplex-admin
npm install # or yarn install
```

### Running the App
```bash
npm run dev # or yarn dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production
```bash
npm run build # or yarn build
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## Project Structure
- `src/components/` — Reusable UI components for RWA workflows and governance interfaces
- `src/pages/` — Application pages for asset management, investor dashboards, and DAO voting
- `src/store/` — Redux slices and store setup for cross-chain state, yields, and compliance tracking
- `src/hooks/` — Custom React hooks for blockchain interactions and automated distributions
- `src/types/` — TypeScript type definitions for tokens (ERC-3643), RWAs, and regulatory entities
- `src/config/` — App configuration files for chains, oracles, and USDC settlements
- `src/helpers/` — Utility/helper functions for validations, date formatting, and interoperability

## Detailed Project Structure

### Components
- `Curd/` — CRUD-related components for managing Asset Tokens and SPVs.
- `LoadingSpinner.tsx` — A spinner component for loading states during Chainlink oracle queries.
- `LocationCard.tsx` — Displays location-related information for real estate and infrastructure RWAs.
- `OrderStatusCard.tsx` — Represents investment and yield status visually (e.g., tokenized, distributed).
- `SearchFilter.tsx` — A search filter component for asset classes and liquidity pools.
- `TableComponent/` — Components for table rendering of portfolios, trades, and governance proposals.
- `UseForm/` — Form-related components for KYC (Civic), issuance, and redemption workflows.
- `cards/` — Card UI components for asset overviews, yield analytics, and PXT staking.
- `common/` — Common reusable components for multi-chain displays and USDC transaction flows.
- `form/` — Form-specific components for primary sales, secondary trading, and fee calculations.
- `role/` — Role-based UI components for admins, issuers, liquidity providers, and DAO voters.
- `spv/` — SPV-related components for jurisdiction-specific legal wrappers and compliance.
- `stepper.tsx` — A stepper component for multi-step processes like asset onboarding and tokenization.
- `ui/` — General UI components for dashboards, charts, and real-time reporting.

### Hooks
- `useAddAdvisor.tsx` — Hook for adding advisors to private equity and infrastructure projects.
- `useAddBank.tsx` — Hook for adding bank details in fiat on-ramps and USDC conversions.
- `useAddBoardMember.tsx` — Hook for adding board members to SPVs and RWA entities.
- `useApi.tsx` — General API interaction hook for LayerZero, Chainlink CCIP, and Circle integrations.
- `useCancel.tsx` — Hook for handling investment cancellations and proposal retractions.
- `useCreateCompany.tsx` — Hook for creating SPVs and fractionalizing RWAs into Asset Tokens.
- `useCrud.tsx` — CRUD operation hooks for tokens, listings, and liquidity incentives.
- `useDebounce.tsx` — Debounce utility hook for searches in asset discovery and investor queries.
- `useDeleteAdvisor.tsx` — Hook for deleting advisors from RWA portfolios and governance.
- `useDeleteCompanyMember.tsx` — Hook for deleting members from equity funds and teams.
- `useDistribution.tsx` — Hook for handling automated yield distributions in USDC.
- `useEOI.tsx` — Hook for managing expressions of interest in new RWA listings.
- `useEmployee.tsx` — Hook for employee-related operations in DAO and platform teams.
- `useFeePercentage.tsx` — Hook for fee percentage calculations in DEX trades and staking.
- `useFetchCompany.tsx` — Hook for fetching RWA data via valuation oracles.
- `useInvestors.tsx` — Hook for managing verified investors and Civic KYC/AML checks.
- `useLocations.tsx` — Hook for location-related operations in real estate tokenization.
- `useRoyalties.tsx` — Hook for handling royalties from rental yields and dividends.
- `useStatements.tsx` — Hook for managing financial statements, audit trails, and tax reports.

### Other Notable Folders
- `src/config/` — Configuration files for charts (yield projections), dialogs (compliance alerts), and tables (asset listings).
- `src/constants/` — Default values and utility constants for chains, ERC-3643 standards, and USDC addresses.
- `src/helpers/` — Helper functions for global operations, date formatting, validations, and cross-chain bridging.
- `src/layout/` — Layout components for the application, including navigation for multi-chain and phases.
- `src/pages/` — Contains application pages like `customers` (investors), `investors` (portfolios), and `governance` (DAO).
- `src/store/` — Redux store setup and slices for PXT voting, USDC balances, and RWA metadata.
- `src/types/` — TypeScript type definitions for RWAs, tokens, oracles, and MiCA compliance.
- `src/utils/` — General utility functions for oracle parsing, Snapshot integration, and IPFS hosting.

This structure ensures modularity and scalability, aligning with Proplex's multi-chain RWA ecosystem and hackathon-ready deployment.

## Environment Variables
Create a `.env` file in the root directory and add the required variables:
```
VITE_API_URL=<your-api-url>
VITE_CHAINLINK_ORACLE=<chainlink-oracle-url>
VITE_CIVIC_API_KEY=<civic-api-key>
VITE_USDC_ADDRESS=<usdc-contract-address>
VITE_LAYERZERO_ENDPOINT=<layerzero-endpoint>
```

## Security Notice
**Never commit sensitive information (API keys, private keys, passwords) to the repository.** Smart contracts are audited for reentrancy and overflows; compliance enforced via Civic and Gnosis Safe multisigs. Nexus Mutual coverage recommended for production.

## Contributing
Pull requests are welcome! For major changes, especially regulatory or chain expansions, please open an issue first to discuss. Ideal for hackathon collaborators on RWA pilots.

## License
[MIT](LICENSE)