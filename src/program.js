const inquirer = require('inquirer');
const chalk = require('chalk');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const logger = require('./utils/logger');
const walletManager = require('./utils/wallet-manager');
const dexService = require('./services/dex-service');
const tokenScanner = require('./services/token-scanner');
const tradingService = require('./services/trading-service');
const config = require('./config/config');

/**
 * Main program class that manages the MEV bot
 */
class Program {
  constructor() {
    this.isRunning = false;
    this.scanInterval = null;
    this.walletInfo = null;
    
    logger.info('Program initialized');
  }
  
  /**
   * Start the program
   */
  async run() {
    console.clear();
    console.log(chalk.green('============================================='));
    console.log(chalk.green('          SOLANA MEV BOT - v1.0.0'));
    console.log(chalk.green('=============================================\n'));
    
    await this.loadWallet();
    await this.showMainMenu();
  }
  
  /**
   * Load wallet from file or create new one
   */
  async loadWallet() {
    // Check if wallet file exists
    const mainWallet = walletManager.loadWallet(walletManager.WALLET_FILE);
    const importedWallet = walletManager.loadWallet(walletManager.IMPORTED_WALLET_FILE);
    
    if (!mainWallet && !importedWallet) {
      await this.showFirstRunMenu();
      return;
    }
    
    if (mainWallet && !importedWallet) {
      this.walletInfo = mainWallet;
      tradingService.setWallet(mainWallet);
      logger.info('Loaded main wallet');
      this.displayWalletInfo(mainWallet);
      return;
    }
    
    if (!mainWallet && importedWallet) {
      this.walletInfo = importedWallet;
      tradingService.setWallet(importedWallet);
      logger.info('Loaded imported wallet');
      this.displayWalletInfo(importedWallet);
      return;
    }
    
    // If both wallets exist, let user choose
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: chalk.cyan('Multiple wallets found. Which one do you want to use?'),
        choices: [
          { name: `Main wallet: ${mainWallet.address.substring(0, 8)}...`, value: 'main' },
          { name: `Imported wallet: ${importedWallet.address.substring(0, 8)}...`, value: 'imported' }
        ]
      }
    ]);
    
    if (choice === 'main') {
      this.walletInfo = mainWallet;
      tradingService.setWallet(mainWallet);
      logger.info('Selected main wallet');
      this.displayWalletInfo(mainWallet);
    } else {
      this.walletInfo = importedWallet;
      tradingService.setWallet(importedWallet);
      logger.info('Selected imported wallet');
      this.displayWalletInfo(importedWallet);
    }
  }
  
  /**
   * Display wallet information
   * @param {Object} walletInfo - Wallet information
   */
  displayWalletInfo(walletInfo) {
    console.log(chalk.magenta('\n=== 🔑 Wallet Information 🔑 ==='));
    console.log(`${chalk.cyan('📍 Address:')} ${chalk.blueBright(walletInfo.address)}`);
    console.log(`${chalk.cyan('🔗 Explorer:')} ${chalk.blue(`https://solscan.io/account/${walletInfo.address}`)}`);
    
    if (walletInfo.isEncrypted) {
      console.log(chalk.green('🔒 Private key is encrypted'));
    } else {
      console.log(`${chalk.cyan('🔑 Private Key:')} ${chalk.grey('*'.repeat(20))}`);
    }
    
    console.log(chalk.magenta('===============================\n'));
  }
  
  /**
   * Show first run menu for new wallets
   */
  async showFirstRunMenu() {
    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: chalk.cyan('No wallet found. What would you like to do?'),
          choices: [
            { name: '🆕 Create New Wallet', value: 'create' },
            { name: '📥 Import Existing Wallet', value: 'import' },
            { name: '🚪 Exit', value: 'exit' }
          ]
        }
      ]);
      
      switch (action) {
        case 'create':
          await this.createWallet();
          return;
        case 'import':
          await this.importWallet();
          return;
        case 'exit':
          console.log(chalk.yellow('Exiting program...'));
          process.exit(0);
      }
    }
  }
  
  /**
   * Create a new wallet
   */
  async createWallet() {
    const { useEncryption } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useEncryption',
        message: chalk.cyan('Do you want to encrypt your private key with a password?'),
        default: true
      }
    ]);
    
    let password = null;
    if (useEncryption) {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: chalk.cyan('Enter a strong password:'),
          validate: input => input.length >= 8 ? true : 'Password must be at least 8 characters'
        },
        {
          type: 'password',
          name: 'confirmPassword',
          message: chalk.cyan('Confirm password:'),
          validate: (input, answers) => input === answers.password ? true : 'Passwords do not match'
        }
      ]);
      
      password = answers.password;
    }
    
    try {
      const walletInfo = walletManager.generateWallet(password);
      walletManager.saveWallet(walletInfo);
      
      this.walletInfo = walletInfo;
      tradingService.setWallet(walletInfo);
      
      console.log(chalk.green('\nWallet created successfully!'));
      this.displayWalletInfo(walletInfo);
      
      console.log(chalk.yellow('⚠️ IMPORTANT: Back up your private key/password in a safe place!'));
      console.log(chalk.yellow('    You will lose access to your funds if you lose this information.\n'));
      
    } catch (error) {
      console.log(chalk.red('Error creating wallet:', error.message));
    }
  }
  
  /**
   * Import an existing wallet
   */
  async importWallet() {
    const { importType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'importType',
        message: chalk.cyan('How do you want to import your wallet?'),
        choices: [
          { name: '🔑 Private Key (Base58)', value: 'privateKey' },
          { name: '📝 Mnemonic Phrase (12/24 words)', value: 'mnemonic' }
        ]
      }
    ]);
    
    let privateKeyOrMnemonic;
    
    if (importType === 'privateKey') {
      const { key } = await inquirer.prompt([
        {
          type: 'password',
          name: 'key',
          message: chalk.cyan('Enter your private key (Base58 format):')
        }
      ]);
      privateKeyOrMnemonic = key;
    } else {
      const { mnemonic } = await inquirer.prompt([
        {
          type: 'password',
          name: 'mnemonic',
          message: chalk.cyan('Enter your mnemonic phrase (12 or 24 words separated by spaces):')
        }
      ]);
      privateKeyOrMnemonic = mnemonic;
    }
    
    const { useEncryption } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useEncryption',
        message: chalk.cyan('Do you want to encrypt your wallet with a password?'),
        default: true
      }
    ]);
    
    let password = null;
    if (useEncryption) {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: chalk.cyan('Enter a strong password:'),
          validate: input => input.length >= 8 ? true : 'Password must be at least 8 characters'
        },
        {
          type: 'password',
          name: 'confirmPassword',
          message: chalk.cyan('Confirm password:'),
          validate: (input, answers) => input === answers.password ? true : 'Passwords do not match'
        }
      ]);
      
      password = answers.password;
    }
    
    try {
      const walletInfo = walletManager.importWallet(privateKeyOrMnemonic, password);
      
      if (!walletInfo) {
        console.log(chalk.red('Failed to import wallet. Invalid private key or mnemonic.'));
        return;
      }
      
      walletManager.saveWallet(walletInfo, walletManager.IMPORTED_WALLET_FILE);
      
      this.walletInfo = walletInfo;
      tradingService.setWallet(walletInfo);
      
      console.log(chalk.green('\nWallet imported successfully!'));
      this.displayWalletInfo(walletInfo);
      
    } catch (error) {
      console.log(chalk.red('Error importing wallet:', error.message));
    }
  }
  
  /**
   * Generate QR code for wallet address
   */
  async generateQRCode() {
    if (!this.walletInfo) {
      console.log(chalk.red('No wallet loaded.'));
      return;
    }
    
    console.log(chalk.yellow(`\nScan this QR code to send SOL to: ${this.walletInfo.address}\n`));
    
    qrcode.generate(this.walletInfo.address, { small: true });
    
    console.log(`\nSOL Address: ${chalk.cyan(this.walletInfo.address)}\n`);
    
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }
  
  /**
   * Check wallet balance
   */
  async checkBalance() {
    if (!this.walletInfo) {
      console.log(chalk.red('No wallet loaded.'));
      return;
    }
    
    console.log(chalk.yellow('Checking balance...'));
    
    const balance = await tradingService.getBalance();
    
    console.log(`\n${chalk.cyan('Current Balance:')} ${chalk.green(balance.toFixed(5))} SOL`);
    
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }
  
  /**
   * Configure bot settings
   */
  async configureSettings() {
    while (true) {
      const { setting } = await inquirer.prompt([
        {
          type: 'list',
          name: 'setting',
          message: chalk.cyan('Which setting would you like to configure?'),
          choices: [
            { name: '💲 Profit Threshold (%)', value: 'profit' },
            { name: '📉 Max Slippage (%)', value: 'slippage' },
            { name: '💸 Trade Amount (SOL)', value: 'amount' },
            { name: '📊 DEX Selection', value: 'dex' },
            { name: '📈 Minimum Market Cap ($)', value: 'marketCap' },
            { name: '🔄 Simulation Mode', value: 'simulation' },
            { name: '🔙 Back to Main Menu', value: 'back' }
          ]
        }
      ]);
      
      if (setting === 'back') {
        break;
      }
      
      switch (setting) {
        case 'profit': {
          const { threshold } = await inquirer.prompt([
            {
              type: 'number',
              name: 'threshold',
              message: chalk.cyan('Enter minimum profit threshold (%):'),
              default: config.trading.minProfitThreshold,
              validate: input => input > 0 ? true : 'Enter a value greater than 0'
            }
          ]);
          
          config.trading.minProfitThreshold = threshold;
          console.log(chalk.green(`Profit threshold set to ${threshold}%`));
          break;
        }
        
        case 'slippage': {
          const { slippage } = await inquirer.prompt([
            {
              type: 'number',
              name: 'slippage',
              message: chalk.cyan('Enter maximum slippage (%):'),
              default: config.trading.maxSlippage,
              validate: input => input > 0 && input <= 5 ? true : 'Enter a value between 0 and 5'
            }
          ]);
          
          config.trading.maxSlippage = slippage;
          console.log(chalk.green(`Max slippage set to ${slippage}%`));
          break;
        }
        
        case 'amount': {
          const { min, max } = await inquirer.prompt([
            {
              type: 'number',
              name: 'min',
              message: chalk.cyan('Enter minimum trade amount (SOL):'),
              default: config.trading.minAmount,
              validate: input => input > 0 ? true : 'Enter a value greater than 0'
            },
            {
              type: 'number',
              name: 'max',
              message: chalk.cyan('Enter maximum trade amount (SOL):'),
              default: config.trading.maxAmount,
              validate: (input, answers) => input >= answers.min ? true : 'Max amount must be greater than or equal to min amount'
            }
          ]);
          
          config.trading.minAmount = min;
          config.trading.maxAmount = max;
          console.log(chalk.green(`Trade amount set to min: ${min} SOL, max: ${max} SOL`));
          break;
        }
        
        case 'dex': {
          const choices = Object.keys(config.dexes).map(dex => ({
            name: `${config.dexes[dex].enabled ? '✅' : '❌'} ${dex.charAt(0).toUpperCase() + dex.slice(1)}`,
            value: dex
          }));
          
          const { dex } = await inquirer.prompt([
            {
              type: 'list',
              name: 'dex',
              message: chalk.cyan('Toggle DEX status:'),
              choices: [...choices, { name: '🔄 Toggle All', value: 'all' }, { name: '🔙 Back', value: 'back' }]
            }
          ]);
          
          if (dex === 'back') {
            break;
          }
          
          if (dex === 'all') {
            // Count enabled DEXes
            const enabledCount = Object.values(config.dexes).filter(d => d.enabled).length;
            const totalCount = Object.keys(config.dexes).length;
            
            // Toggle all to the opposite of current majority
            const newState = enabledCount <= totalCount / 2;
            
            for (const d of Object.keys(config.dexes)) {
              config.dexes[d].enabled = newState;
            }
            
            console.log(chalk.green(`All DEXes are now ${newState ? 'enabled' : 'disabled'}`));
          } else {
            config.dexes[dex].enabled = !config.dexes[dex].enabled;
            console.log(chalk.green(`${dex.charAt(0).toUpperCase() + dex.slice(1)} is now ${config.dexes[dex].enabled ? 'enabled' : 'disabled'}`));
          }
          break;
        }
        
        case 'marketCap': {
          const { marketCap } = await inquirer.prompt([
            {
              type: 'number',
              name: 'marketCap',
              message: chalk.cyan('Enter minimum market cap ($):'),
              default: config.trading.minMarketCap,
              validate: input => input >= 0 ? true : 'Enter a value greater than or equal to 0'
            }
          ]);
          
          config.trading.minMarketCap = marketCap;
          console.log(chalk.green(`Minimum market cap set to $${marketCap}`));
          break;
        }
        
        case 'simulation': {
          const { enabled } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'enabled',
              message: chalk.cyan('Enable simulation mode? (No real trades will be executed)'),
              default: config.simulation.enabled
            }
          ]);
          
          if (enabled) {
            const { balance } = await inquirer.prompt([
              {
                type: 'number',
                name: 'balance',
                message: chalk.cyan('Enter simulated balance (SOL):'),
                default: config.simulation.balanceSol,
                validate: input => input > 0 ? true : 'Enter a value greater than 0'
              }
            ]);
            
            config.simulation.balanceSol = balance;
          }
          
          config.simulation.enabled = enabled;
          tradingService.isSimulationMode = enabled;
          
          console.log(chalk.green(`Simulation mode ${enabled ? 'enabled' : 'disabled'}`));
          break;
        }
      }
    }
  }
  
  /**
   * Start the arbitrage bot
   */
  async startBot() {
    if (this.isRunning) {
      console.log(chalk.yellow('Bot is already running.'));
      return;
    }
    
    if (!this.walletInfo) {
      console.log(chalk.red('No wallet loaded.'));
      return;
    }
    
    const balance = await tradingService.getBalance();
    if (balance < config.trading.minAmount && !config.simulation.enabled) {
      console.log(chalk.red(`Insufficient balance (${balance.toFixed(5)} SOL). Minimum required: ${config.trading.minAmount} SOL.`));
      
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: chalk.cyan('What would you like to do?'),
          choices: [
            { name: '💰 Enable Simulation Mode', value: 'simulation' },
            { name: '🔙 Back to Main Menu', value: 'back' }
          ]
        }
      ]);
      
      if (action === 'simulation') {
        config.simulation.enabled = true;
        tradingService.isSimulationMode = true;
        console.log(chalk.green('Simulation mode enabled'));
      } else {
        return;
      }
    }
    
    this.isRunning = true;
    console.log(chalk.green('Starting MEV bot...'));
    
    // Display configuration
    console.log('\n' + chalk.cyan('Current Configuration:'));
    console.log(chalk.cyan('--------------------------'));
    console.log(`${chalk.yellow('Min Profit:')} ${config.trading.minProfitThreshold}%`);
    console.log(`${chalk.yellow('Max Slippage:')} ${config.trading.maxSlippage}%`);
    console.log(`${chalk.yellow('Trade Amount:')} ${config.trading.minAmount} - ${config.trading.maxAmount} SOL`);
    console.log(`${chalk.yellow('Min Market Cap:')} $${config.trading.minMarketCap}`);
    console.log(`${chalk.yellow('Simulation Mode:')} ${config.simulation.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`${chalk.yellow('DEXes:')} ${Object.entries(config.dexes)
      .filter(([_, dexConfig]) => dexConfig.enabled)
      .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(', ')}`);
    console.log(chalk.cyan('--------------------------\n'));
    
    // Start scanning for tokens and opportunities
    console.log(chalk.yellow('Scanning for tokens...'));
    
    // Get tokens to monitor
    const tokens = await tokenScanner.getTokensToMonitor();
    console.log(chalk.green(`Found ${tokens.length} tokens to monitor.`));
    
    // Initial scan
    await this.scanForOpportunities(tokens);
    
    // Start polling at interval
    const scanIntervalMs = 60000; // 1 minute
    this.scanInterval = setInterval(async () => {
      await this.scanForOpportunities(tokens);
    }, scanIntervalMs);
    
    console.log(chalk.green(`\nBot is running. Scanning every ${scanIntervalMs / 1000} seconds.`));
    console.log(chalk.yellow('Press Ctrl+C to stop the bot.'));
    
    // Show live stats periodically
    const statsIntervalMs = 10000; // 10 seconds
    const statsInterval = setInterval(() => {
      this.showLiveStats();
    }, statsIntervalMs);
    
    // Wait for user to stop the bot
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: chalk.cyan('Bot is running. What would you like to do?'),
        choices: [
          { name: '⏹️ Stop Bot', value: 'stop' },
          { name: '📊 View Trading History', value: 'history' }
        ]
      }
    ]);
    
    clearInterval(this.scanInterval);
    clearInterval(statsInterval);
    this.scanInterval = null;
    this.isRunning = false;
    
    if (action === 'history') {
      this.showTradingHistory();
    }
    
    console.log(chalk.yellow('Bot stopped.'));
  }
  
  /**
   * Scan for arbitrage opportunities
   * @param {string[]} tokens - Array of token mint addresses to scan
   */
  async scanForOpportunities(tokens) {
    try {
      // Log start of scan
      logger.info(`Scanning ${tokens.length} tokens for arbitrage opportunities...`);
      
      // Find opportunities
      const opportunities = await dexService.scanForOpportunities(tokens);
      
      // Log results
      if (opportunities.length > 0) {
        logger.info(`Found ${opportunities.length} arbitrage opportunities`);
        
        // Execute trades for the best opportunities
        for (const opportunity of opportunities.slice(0, 3)) { // Limit to top 3
          try {
            await tradingService.executeTrade(opportunity);
          } catch (error) {
            logger.error(`Failed to execute trade: ${error.message}`);
          }
        }
      } else {
        logger.info('No profitable arbitrage opportunities found');
      }
    } catch (error) {
      logger.error(`Error scanning for opportunities: ${error.message}`);
    }
  }
  
  /**
   * Show live trading stats
   */
  showLiveStats() {
    const history = tradingService.getTradingHistory();
    const totalProfit = tradingService.getTotalProfit();
    
    console.log('\n' + chalk.cyan('======== MEV Bot Stats ========'));
    console.log(`${chalk.yellow('Total Trades:')} ${history.length}`);
    console.log(`${chalk.yellow('Total Profit:')} ${totalProfit.toFixed(6)} SOL`);
    console.log(`${chalk.yellow('Simulation Mode:')} ${config.simulation.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(chalk.cyan('==============================\n'));
  }
  
  /**
   * Show trading history
   */
  async showTradingHistory() {
    const history = tradingService.getTradingHistory();
    const totalProfit = tradingService.getTotalProfit();
    
    if (history.length === 0) {
      console.log(chalk.yellow('No trading history yet.'));
      return;
    }
    
    console.log('\n' + chalk.cyan('======== Trading History ========'));
    
    for (let i = 0; i < Math.min(history.length, 10); i++) {
      const trade = history[i];
      console.log(`${chalk.yellow(`[${new Date(trade.timestamp).toLocaleTimeString()}]`)} ${trade.tokenMint.substring(0, 8)}... | ${chalk.cyan(`${trade.buyDex} → ${trade.sellTo}`)} | ${chalk.green(`+${trade.profit.toFixed(6)} SOL (${trade.profitPercent.toFixed(2)}%)`)}`);
    }
    
    if (history.length > 10) {
      console.log(chalk.gray(`... and ${history.length - 10} more trades`));
    }
    
    console.log(`${chalk.yellow('Total Profit:')} ${chalk.green(`${totalProfit.toFixed(6)} SOL`)}`);
    console.log(chalk.cyan('================================\n'));
    
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }
  
  /**
   * Show the main menu
   */
  async showMainMenu() {
    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: chalk.cyan('What would you like to do?'),
          choices: [
            { name: '🏦 Wallet Info', value: 'wallet' },
            { name: '💰 Generate Deposit QR Code', value: 'qr' },
            { name: '💵 Check Balance', value: 'balance' },
            { name: '⚙️ Configure Settings', value: 'settings' },
            { name: '🚀 Start Bot', value: 'start' },
            { name: '📊 View Trading History', value: 'history' },
            { name: '🔄 Create New Wallet', value: 'create' },
            { name: '📥 Import Wallet', value: 'import' },
            { name: '🚪 Exit', value: 'exit' }
          ]
        }
      ]);
      
      switch (action) {
        case 'wallet':
          if (this.walletInfo) {
            this.displayWalletInfo(this.walletInfo);
          } else {
            console.log(chalk.red('No wallet loaded.'));
          }
          break;
          
        case 'qr':
          await this.generateQRCode();
          break;
          
        case 'balance':
          await this.checkBalance();
          break;
          
        case 'settings':
          await this.configureSettings();
          break;
          
        case 'start':
          await this.startBot();
          break;
          
        case 'history':
          await this.showTradingHistory();
          break;
          
        case 'create':
          await this.createWallet();
          break;
          
        case 'import':
          await this.importWallet();
          break;
          
        case 'exit':
          console.log(chalk.green('Thank you for using Solana MEV Bot!'));
          process.exit(0);
      }
    }
  }
}

// Export a new instance of the Program class
module.exports = { program: new Program() }; 