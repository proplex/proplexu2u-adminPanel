== Logs ==
  === OWNMALI DEPLOYMENT STARTING ===
  Deployer: 0xFDa522b8c863ed7Abf681d0c86Cc0c5DCb95d4E6
  Admin: 0xFDa522b8c863ed7Abf681d0c86Cc0c5DCb95d4E6
  Asset Owner: 0x6928Fc433dBE09B1b10bEeDf390B0F00f7476465
  Investor: 0x80F390AB073Ef7d09268e84ddA6E431b5A7dC895
  Step 1: Deploying mock compliance contracts...
  Mock contracts deployed successfully
  Step 2: Deploying implementation contracts...
  Implementation contracts deployed successfully
  Step 3: Deploying and initializing core proxies...
  Core proxies deployed and initialized successfully
  Step 4: Deploying and initializing SPV Factory...
  SPV Factory deployed and initialized successfully
  Step 5: Deploying and initializing Asset Factory...
  AssetFactory initialized
  Asset Factory deployed and initialized successfully
  Step 6: Setting up contract relationships...
  Initializing OwnmaliFinancialLedger...
  Admin address: 0xFDa522b8c863ed7Abf681d0c86Cc0c5DCb95d4E6
  Storage slot: 112804559616843603168457624033212448442960995043819141233988983864999265594782
  Contract not yet initialized, proceeding...
  Initializing AccessControl...
  Initializing Pausable...
  Initializing UUPSUpgradeable...
  Initializing ReentrancyGuard...
  Setting up roles...
  OwnmaliFinancialLedger initialized successfully
  Contract relationships set up successfully
  SPV Address: 0xa8A83846d442c9B3ccef8b86B51c9cc5593a7E76
  Step 7: Running verification tests...
  All verification tests passed
  === DEPLOYMENT COMPLETED SUCCESSFULLY ===
  
=== OWNMALI DEPLOYMENT SUMMARY ===
  Network: Current Network
  Deployer: 0xFDa522b8c863ed7Abf681d0c86Cc0c5DCb95d4E6
  Admin: 0xFDa522b8c863ed7Abf681d0c86Cc0c5DCb95d4E6
  
  === IMPLEMENTATION CONTRACTS ===
  OwnmaliRegistry (impl): 0x9646c0A80F32E7359992630f9AFB6E3c456E7c12
  OwnmaliAsset (impl): 0x56bc000bb3393122B7ef68A372bf51d13EB1f25D
  OwnmaliAssetManager (impl): 0x67A80B12c3b7Eb8383ffe4e0494c8dE9C319487A
  OwnmaliOrderManager (impl): 0x67E5067d72C434D947c861Fa2B571e46e37C6341
  OwnmaliSPV (impl): 0xB7Ad4322ba8fe6e8Ea9c27a18c47B2E1572812a3
  OwnmaliDAO (impl): 0xA8c793e12c2731e9B2eE4EB65E31027833830c76
  OwnmaliFinancialLedger (impl): 0xC53785ABDDD0eA3a2Ae9eaD19AA13D0dD507b8CE
  OwnmaliSPVFactory (impl): 0xd72516bF2809F231142783bc6D6Ebdd06370cf71
  OwnmaliAssetFactory (impl): 0x08a5AAdB6AfdEf03013904782767857868E7d55d
  
  === PROXY CONTRACTS (MAIN ADDRESSES TO USE) ===
  OwnmaliRegistry (proxy): 0x89cB8c5E197EABbFF001282E06C68e7e6b0ed8a6
  OwnmaliAssetFactory (proxy): 0xB517647af92264bbD3Fdb5ed0ED12Cc224ec2d9E
  OwnmaliSPVFactory (proxy): 0xb6A409b8C74f3F932315a47A190398e2A880D1Df
  
  === MOCK COMPLIANCE CONTRACTS (TESTNET ONLY) ===
  MockIdentityRegistry: 0x1bfE79c579c72f43D07F5F43878afdBD09a2726a
  MockModularCompliance: 0xe42eE8C6ca221b582fd8Fb93476DB1c47E08e244
  MockClaimIssuerRegistry: 0xEAFaF64aDbc6a626261B4dC5aAED112cC6844bE5
  MockClaimRegistry: 0x5Efdfa516F4F8Bac356f2eb6c0d8F9424A629f47
  
  === SAMPLE CONFIGURATION ===
  SPV ID: SPV_001
  Asset Name: Test Real Estate
  Asset Symbol: TRE
  Max Supply: 1000000000000000000000000
  SPV ID Hash: 0x4f8560b131808f8e2d58da994be0f9008656ac15840ef3695c37e0725ec75c81
  Deployed SPV Address: 0xa8A83846d442c9B3ccef8b86B51c9cc5593a7E76
  
  === TEST ADDRESSES ===
  Asset Owner: 0x6928Fc433dBE09B1b10bEeDf390B0F00f7476465
  Investor: 0x80F390AB073Ef7d09268e84ddA6E431b5A7dC895
  
  === NEXT STEPS ===
  1. Use AssetFactory.prepareDeploy() to prepare asset deployment
  2. Use AssetFactory.executeDeploy() to deploy and initialize assets
  3. Use OrderManager to create and complete orders
  4. Verify all contracts on block explorer
  5. Set up proper compliance contracts for production
  
  === USAGE EXAMPLE ===
  // Prepare asset deployment
  assetFactory.prepareDeploy(
    " SPV_001 ",
    " Test Real Estate ",
    " TRE ",
     18 ,
     1000000000000000000000000 ,
     0x0a3f6d9a27d0804c0556e46828bf640ca2ff345dfed062747ad2a7d811aee243 ,
     0x609f839b2dc9db2830fa601f5bf75bcce6ae1e8943d48fbb7683215d014f7315
  );
  
  // Execute asset deployment
  assetFactory.executeDeploy(
     0x1bfE79c579c72f43D07F5F43878afdBD09a2726a ,
     0xe42eE8C6ca221b582fd8Fb93476DB1c47E08e244 ,
     0xEAFaF64aDbc6a626261B4dC5aAED112cC6844bE5 ,
     0x5Efdfa516F4F8Bac356f2eb6c0d8F9424A629f47 ,
     0xa8A83846d442c9B3ccef8b86B51c9cc5593a7E76 ,
     0x6928Fc433dBE09B1b10bEeDf390B0F00f7476465
  );