const fs = require('fs');
const path = require('path');
const bip39 = require('bip39');
const bs58 = require('bs58');
const { Keypair, PublicKey } = require('@solana/web3.js');
const logger = require('./logger');
const crypto = require('crypto');

// Constants
const WALLET_DIR = path.join(__dirname, '../../wallets');
const WALLET_FILE = path.join(WALLET_DIR, 'wallet.json');
const IMPORTED_WALLET_FILE = path.join(WALLET_DIR, 'imported_wallet.json');

// Ensure wallet directory exists
if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR, { recursive: true });
}

/**
 * Encrypts sensitive wallet data with a password
 * @param {string} data - The data to encrypt
 * @param {string} password - The encryption password
 * @returns {string} - The encrypted data
 */
function encrypt(data, password) {
  // In a real implementation, use a proper encryption algorithm with salt and IV
  // This is a simplified version for demonstration
  const cipher = crypto.createCipher('aes-256-cbc', password);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypts wallet data
 * @param {string} encryptedData - The encrypted data
 * @param {string} password - The decryption password
 * @returns {string} - The decrypted data
 */
function decrypt(encryptedData, password) {
  // In a real implementation, handle salt and IV properly
  // This is a simplified version for demonstration
  const decipher = crypto.createDecipher('aes-256-cbc', password);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Generates a new Solana wallet
 * @param {string} password - Optional password for encryption
 * @returns {Object} - Wallet info object
 */
function generateWallet(password = null) {
  try {
    // Generate new keypair
    const keypair = Keypair.generate();
    const privateKeyBase58 = bs58.encode(keypair.secretKey);
    const publicKey = keypair.publicKey.toBase58();
    
    // Create wallet object
    const walletInfo = {
      address: publicKey,
      privateKey: privateKeyBase58,
      createdAt: new Date().toISOString()
    };
    
    // Optional encryption
    const dataToSave = password 
      ? { address: publicKey, encryptedKey: encrypt(privateKeyBase58, password), isEncrypted: true }
      : walletInfo;
    
    return dataToSave;
  } catch (error) {
    logger.error('Failed to generate wallet:', error);
    throw error;
  }
}

/**
 * Saves wallet information to file
 * @param {Object} walletInfo - The wallet info object
 * @param {string} filename - Optional custom filename
 * @returns {boolean} - Success status
 */
function saveWallet(walletInfo, filename = WALLET_FILE) {
  try {
    fs.writeFileSync(filename, JSON.stringify(walletInfo, null, 2));
    logger.info(`Wallet saved to ${filename}`);
    return true;
  } catch (error) {
    logger.error(`Failed to save wallet to ${filename}:`, error);
    return false;
  }
}

/**
 * Loads wallet from file
 * @param {string} filename - The wallet file path
 * @param {string} password - Optional password for decryption
 * @returns {Object|null} - Wallet info or null if error
 */
function loadWallet(filename = WALLET_FILE, password = null) {
  try {
    if (!fs.existsSync(filename)) {
      logger.warn(`Wallet file not found: ${filename}`);
      return null;
    }
    
    const walletData = JSON.parse(fs.readFileSync(filename, 'utf8'));
    
    // Handle encrypted wallets
    if (walletData.isEncrypted && password) {
      try {
        const decryptedKey = decrypt(walletData.encryptedKey, password);
        return {
          address: walletData.address,
          privateKey: decryptedKey,
          isEncrypted: true
        };
      } catch (error) {
        logger.error('Failed to decrypt wallet:', error);
        return null;
      }
    }
    
    return walletData;
  } catch (error) {
    logger.error(`Failed to load wallet from ${filename}:`, error);
    return null;
  }
}

/**
 * Imports wallet from private key or mnemonic
 * @param {string} privateKeyOrMnemonic - Private key (base58) or mnemonic phrase
 * @param {string} password - Optional password for encryption
 * @returns {Object|null} - Wallet info or null if error
 */
function importWallet(privateKeyOrMnemonic, password = null) {
  try {
    let keypair;
    
    // Check if input is a mnemonic phrase
    if (privateKeyOrMnemonic.includes(' ') && bip39.validateMnemonic(privateKeyOrMnemonic)) {
      const seed = bip39.mnemonicToSeedSync(privateKeyOrMnemonic);
      // Note: In a real implementation, use proper derivation path for Solana
      keypair = Keypair.fromSeed(seed.slice(0, 32));
    } else {
      // Assume it's a base58 private key
      keypair = Keypair.fromSecretKey(bs58.decode(privateKeyOrMnemonic));
    }
    
    const privateKeyBase58 = bs58.encode(keypair.secretKey);
    const publicKey = keypair.publicKey.toBase58();
    
    // Create wallet object
    const walletInfo = {
      address: publicKey,
      privateKey: privateKeyBase58,
      importedAt: new Date().toISOString()
    };
    
    // Optional encryption
    const dataToSave = password 
      ? { address: publicKey, encryptedKey: encrypt(privateKeyBase58, password), isEncrypted: true }
      : walletInfo;
    
    return dataToSave;
  } catch (error) {
    logger.error('Failed to import wallet:', error);
    return null;
  }
}

/**
 * Validates a Solana address
 * @param {string} address - The address to validate
 * @returns {boolean} - Whether the address is valid
 */
function isValidAddress(address) {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  generateWallet,
  saveWallet,
  loadWallet,
  importWallet,
  isValidAddress,
  WALLET_FILE,
  IMPORTED_WALLET_FILE
}; 