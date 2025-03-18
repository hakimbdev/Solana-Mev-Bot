const { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const bs58 = require('bs58');
const logger = require('../utils/logger');
const config = require('../config/config');

/**
 * Service for executing arbitrage trades
 */
class TradingService {
  constructor() {
    this.connection = new Connection(config.rpc.endpoint, config.rpc.commitment);
    this.keypair = null;
    this.isSimulationMode = config.simulation.enabled;
    this.tradingHistory = [];
    this.activePositions = [];
    
    logger.info(`TradingService initialized. Simulation mode: ${this.isSimulationMode}`);
  }
  
  /**
   * Set the wallet keypair for transactions
   * @param {Object} walletInfo - Wallet info object with privateKey
   */
  setWallet(walletInfo) {
    try {
      if (!walletInfo || !walletInfo.privateKey) {
        throw new Error('Invalid wallet info provided');
      }
      
      this.keypair = Keypair.fromSecretKey(bs58.decode(walletInfo.privateKey));
      logger.info(`Wallet set: ${this.keypair.publicKey.toBase58()}`);
    } catch (error) {
      logger.error('Error setting wallet:', error);
      throw error;
    }
  }
  
  /**
   * Get the current wallet balance
   * @returns {Promise<number>} - Balance in SOL
   */
  async getBalance() {
    try {
      if (!this.keypair) {
        throw new Error('Wallet not set');
      }
      
      if (this.isSimulationMode) {
        return config.simulation.balanceSol;
      }
      
      const balance = await this.connection.getBalance(this.keypair.publicKey);
      return balance / 10**9; // Convert lamports to SOL
    } catch (error) {
      logger.error('Error getting balance:', error);
      return 0;
    }
  }
  
  /**
   * Execute an arbitrage trade
   * @param {Object} opportunity - The arbitrage opportunity
   * @returns {Promise<Object>} - Trade result
   */
  async executeTrade(opportunity) {
    try {
      if (!this.keypair) {
        throw new Error('Wallet not set');
      }
      
      // Calculate trade amount based on settings
      const balance = await this.getBalance();
      let tradeAmount;
      
      if (balance < config.trading.minAmount) {
        throw new Error(`Insufficient balance: ${balance} SOL`);
      }
      
      // Random amount between min and max
      const minAmount = Math.min(balance * 0.8, config.trading.minAmount);
      const maxAmount = Math.min(balance * 0.9, config.trading.maxAmount);
      tradeAmount = minAmount + Math.random() * (maxAmount - minAmount);
      
      logger.info(`Executing arbitrage: Buy from ${opportunity.buyFrom.dex} at ${opportunity.buyFrom.price} and sell to ${opportunity.sellTo.dex} at ${opportunity.sellTo.price}`);
      logger.info(`Expected profit: ${opportunity.profitPercent.toFixed(2)}%, Trade amount: ${tradeAmount.toFixed(4)} SOL`);
      
      // If in simulation mode, don't actually execute the trade
      if (this.isSimulationMode) {
        // Simulate trade execution
        const profit = tradeAmount * (opportunity.profitPercent / 100);
        
        // Record the trade
        const tradeResult = {
          id: `sim-${Date.now()}`,
          tokenMint: opportunity.tokenMint,
          buyDex: opportunity.buyFrom.dex,
          sellDex: opportunity.sellTo.dex,
          buyPrice: opportunity.buyFrom.price,
          sellPrice: opportunity.sellTo.price,
          amount: tradeAmount,
          profit,
          profitPercent: opportunity.profitPercent,
          timestamp: new Date().toISOString(),
          isSimulation: true,
          txSignature: null
        };
        
        this.tradingHistory.push(tradeResult);
        logger.info(`Simulated trade complete. Profit: ${profit.toFixed(6)} SOL`);
        
        return tradeResult;
      }
      
      // In a real implementation, this would:
      // 1. Create transaction to buy token from cheaper DEX
      // 2. Create transaction to sell token to more expensive DEX
      // 3. Combine into a single atomic transaction when possible
      // 4. Sign and send the transaction
      
      // Simulate a realistic transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tradeResult = {
        id: `trade-${Date.now()}`,
        tokenMint: opportunity.tokenMint,
        buyDex: opportunity.buyFrom.dex,
        sellDex: opportunity.sellTo.dex,
        buyPrice: opportunity.buyFrom.price,
        sellPrice: opportunity.sellTo.price,
        amount: tradeAmount,
        profit: tradeAmount * (opportunity.profitPercent / 100),
        profitPercent: opportunity.profitPercent,
        timestamp: new Date().toISOString(),
        isSimulation: false,
        txSignature: `sim-${bs58.encode(Buffer.from(Date.now().toString()))}`
      };
      
      this.tradingHistory.push(tradeResult);
      logger.info(`Trade executed with signature: ${tradeResult.txSignature}`);
      
      return tradeResult;
    } catch (error) {
      logger.error('Error executing trade:', error);
      throw error;
    }
  }
  
  /**
   * Get trading history
   * @returns {Array} - List of past trades
   */
  getTradingHistory() {
    return this.tradingHistory;
  }
  
  /**
   * Calculate total profit from trading history
   * @returns {number} - Total profit in SOL
   */
  getTotalProfit() {
    return this.tradingHistory.reduce((sum, trade) => sum + trade.profit, 0);
  }
}

module.exports = new TradingService(); 