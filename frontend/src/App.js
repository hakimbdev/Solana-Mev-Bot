import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Balance from './pages/Balance';
import Withdraw from './pages/Withdraw';
import NewWallet from './pages/NewWallet';
import ImportWallet from './pages/ImportWallet';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="gray.900">
          <Navbar />
          <Box as="main" pt={20}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/new-wallet" element={<NewWallet />} />
              <Route path="/import-wallet" element={<ImportWallet />} />
            </Routes>
          </Box>
          <Box textAlign="center" py={4} fontSize="sm" color="gray.500">
            © 2025 MevBot Inc. | Use at your own risk.
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App; 