# Solana MEV Bot Frontend

This is the frontend interface for the Solana MEV Bot, providing a user-friendly way to interact with the bot's functionality.

## Features

- **Dashboard**: View trading statistics and control the bot
- **Wallet Management**: Create, import, and manage your Solana wallet
- **Deposit/Withdraw**: Easily fund your MEV bot or withdraw profits
- **Settings**: Configure trading parameters, risk management, and DEX preferences
- **Balance Tracking**: Monitor your balance and transaction history

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm (included with Node.js)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `build` directory and can be served by any static file server.

## Navigation

- **Home** - Introduction to the MEV bot and its features
- **Wallet Info** - View wallet details and connection status
- **Deposit QR code** - Generate QR codes for easy deposits
- **Balance** - Check your balance and transaction history
- **Start** - Control panel for the MEV bot
- **Withdraw** - Securely withdraw funds
- **Settings** - Configure trading parameters and preferences
- **New MevBot Wallet** - Create a new wallet
- **Import Wallet** - Import an existing wallet

## Implementation Details

- Built with React and Chakra UI
- Responsive design for all device sizes
- Secure wallet management with local encryption
- Real-time data visualization with Recharts
- Integration with Solana blockchain using @solana/web3.js

## Security Features

- Local wallet encryption
- No private keys or seed phrases transmitted over the network
- Secure connection to RPC endpoints
- Interactive confirmation for transactions

## License

This project is licensed under the MIT License - see the LICENSE file for details. 