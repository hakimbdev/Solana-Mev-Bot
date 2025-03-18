require('dotenv').config();
const path = require('path');

const config = {
  // RPC Configuration
  rpc: {
    endpoint: process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
    commitment: 'confirmed',
    wsEndpoint: process.env.WS_ENDPOINT || 'wss://api.mainnet-beta.solana.com',
  },
  
  // Wallet Configuration
  wallet: {
    privateKey: process.env.PRIVATE_KEY || null,
    walletDir: path.join(__dirname, '../../wallets'),
  },
  
  // Trading Parameters
  trading: {
    // Minimum profit required to execute a trade (in %)
    minProfitThreshold: parseFloat(process.env.MIN_PROFIT_THRESHOLD) || 0.5,
    
    // Maximum slippage allowed (in %)
    maxSlippage: parseFloat(process.env.MAX_SLIPPAGE) || 0.5,
    
    // Minimum token market cap to consider
    minMarketCap: parseInt(process.env.MIN_MARKET_CAP) || 50000,
    
    // Risk management
    stopLoss: parseFloat(process.env.STOP_LOSS) || 10,
    takeProfit: parseFloat(process.env.TAKE_PROFIT) || 20,
    
    // Purchase settings
    minAmount: parseFloat(process.env.MIN_AMOUNT) || 0.1, // in SOL
    maxAmount: parseFloat(process.env.MAX_AMOUNT) || 1.0, // in SOL
    
    // Gas fee settings
    priorityFee: parseInt(process.env.PRIORITY_FEE) || 5000, // micro-lamports
  },
  
  // DEX Configuration
  dexes: {
    jupiter: {
      enabled: process.env.JUPITER_ENABLED !== 'false',
      apiUrl: process.env.JUPITER_API_URL || 'https://quote-api.jup.ag/v6',
      feeStructure: {
        takerFee: 0.0030,
        makerFee: 0.0020
      }
    },
    raydium: {
      enabled: process.env.RAYDIUM_ENABLED !== 'false',
      apiUrl: process.env.RAYDIUM_API_URL || 'https://api-v3.raydium.io/',
      feeStructure: {
        takerFee: 0.0025,
        makerFee: 0.0015
      }
    },
    orca: {
      enabled: process.env.ORCA_ENABLED !== 'false',
      apiUrl: process.env.ORCA_API_URL || 'https://api.orca.so',
      feeStructure: {
        takerFee: 0.0030,
        makerFee: 0.0020
      }
    }
  },
  
  // Simulation Mode
  simulation: {
    enabled: process.env.SIMULATION_MODE === 'true',
    balanceSol: parseFloat(process.env.SIMULATION_BALANCE) || 10,
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logDir: path.join(__dirname, '../../logs'),
  }
};

module.exports = config; 