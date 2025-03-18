const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/config');

/**
 * Service for interacting with decentralized exchanges to find arbitrage opportunities
 */
class DexService {
  constructor() {
    this.jupiterApi = config.dexes.jupiter.apiUrl;
    this.raydiumApi = config.dexes.raydium.apiUrl;
    this.orcaApi = config.dexes.orca.apiUrl;
    
    this.enabledDexes = Object.entries(config.dexes)
      .filter(([_, dexConfig]) => dexConfig.enabled)
      .map(([name]) => name);
    
    logger.info(`DexService initialized with enabled DEXes: ${this.enabledDexes.join(', ')}`);
  }
  
  /**
   * Get token price from Jupiter DEX
   * @param {string} tokenMint - Token mint address
   * @returns {Promise<number>} - Token price in USDC
   */
  async getJupiterPrice(tokenMint) {
    try {
      const response = await axios.get(`${this.jupiterApi}/quote`, {
        params: {
          inputMint: tokenMint,
          outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint address
          amount: 1000000, // 1 token with 6 decimals
          slippage: 0.5
        }
      });
      
      if (response.data && response.data.outAmount) {
        // The returned amount is in USDC (6 decimals)
        return parseInt(response.data.outAmount) / 1000000;
      }
      
      return null;
    } catch (error) {
      logger.error('Error getting Jupiter price:', error.message);
      return null;
    }
  }
  
  /**
   * Get token price from Raydium DEX
   * @param {string} tokenMint - Token mint address
   * @returns {Promise<number>} - Token price in USDC
   */
  async getRaydiumPrice(tokenMint) {
    try {
      // This is a simplified implementation
      // In a real bot, use the actual Raydium API endpoints
      const response = await axios.get(`${this.raydiumApi}/pairs`, {
        params: { 
          bases: ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'], // USDC
          quoteMint: tokenMint
        }
      });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        return parseFloat(response.data.data[0].price);
      }
      
      return null;
    } catch (error) {
      logger.error('Error getting Raydium price:', error.message);
      return null;
    }
  }
  
  /**
   * Get token price from Orca DEX
   * @param {string} tokenMint - Token mint address
   * @returns {Promise<number>} - Token price in USDC
   */
  async getOrcaPrice(tokenMint) {
    try {
      // This is a simplified implementation
      // In a real bot, use the actual Orca API endpoints
      const response = await axios.get(`${this.orcaApi}/pools`, {
        params: { tokenMint }
      });
      
      if (response.data && response.data.pools) {
        const usdcPool = response.data.pools.find(pool => 
          pool.tokenBMint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
        );
        
        if (usdcPool) {
          return parseFloat(usdcPool.price);
        }
      }
      
      return null;
    } catch (error) {
      logger.error('Error getting Orca price:', error.message);
      return null;
    }
  }
  
  /**
   * Get prices from all enabled DEXes
   * @param {string} tokenMint - Token mint address
   * @returns {Promise<Object>} - Prices from all DEXes
   */
  async getAllPrices(tokenMint) {
    const prices = {};
    const promises = [];
    
    if (this.enabledDexes.includes('jupiter')) {
      promises.push(
        this.getJupiterPrice(tokenMint)
          .then(price => { prices.jupiter = price; })
      );
    }
    
    if (this.enabledDexes.includes('raydium')) {
      promises.push(
        this.getRaydiumPrice(tokenMint)
          .then(price => { prices.raydium = price; })
      );
    }
    
    if (this.enabledDexes.includes('orca')) {
      promises.push(
        this.getOrcaPrice(tokenMint)
          .then(price => { prices.orca = price; })
      );
    }
    
    await Promise.all(promises);
    return prices;
  }
  
  /**
   * Find price differences between DEXes for arbitrage opportunities
   * @param {string} tokenMint - Token mint address
   * @returns {Promise<Object>} - Arbitrage opportunities
   */
  async findArbitrageOpportunities(tokenMint) {
    const prices = await this.getAllPrices(tokenMint);
    const opportunities = [];
    
    // Filter out null prices
    const validPrices = Object.entries(prices)
      .filter(([_, price]) => price !== null)
      .map(([dex, price]) => ({ dex, price }));
    
    // Need at least 2 DEXes with valid prices to compare
    if (validPrices.length < 2) {
      return [];
    }
    
    // Sort by price (lowest to highest)
    validPrices.sort((a, b) => a.price - b.price);
    
    // Find opportunities (buy from lowest, sell to highest)
    for (let i = 0; i < validPrices.length - 1; i++) {
      const buyFrom = validPrices[i];
      const sellTo = validPrices[validPrices.length - 1];
      
      // Calculate profit percentage
      const profitPercent = ((sellTo.price - buyFrom.price) / buyFrom.price) * 100;
      
      // Check if profit meets minimum threshold
      if (profitPercent > config.trading.minProfitThreshold) {
        opportunities.push({
          tokenMint,
          buyFrom: {
            dex: buyFrom.dex,
            price: buyFrom.price
          },
          sellTo: {
            dex: sellTo.dex,
            price: sellTo.price
          },
          profitPercent,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return opportunities;
  }
  
  /**
   * Scan multiple tokens for arbitrage opportunities
   * @param {string[]} tokenMints - Array of token mint addresses
   * @returns {Promise<Object[]>} - Array of arbitrage opportunities
   */
  async scanForOpportunities(tokenMints) {
    const allOpportunities = [];
    
    // Process tokens in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < tokenMints.length; i += batchSize) {
      const batch = tokenMints.slice(i, i + batchSize);
      const batchPromises = batch.map(mint => this.findArbitrageOpportunities(mint));
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(opportunities => {
        if (opportunities.length > 0) {
          allOpportunities.push(...opportunities);
        }
      });
      
      // Sleep between batches to avoid rate limiting
      if (i + batchSize < tokenMints.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Sort by profit percentage (highest first)
    allOpportunities.sort((a, b) => b.profitPercent - a.profitPercent);
    
    return allOpportunities;
  }
}

module.exports = new DexService(); 