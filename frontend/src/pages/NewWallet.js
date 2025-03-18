import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Divider,
  useClipboard,
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  HStack,
  Checkbox,
} from '@chakra-ui/react';
import { FaCopy, FaDownload } from 'react-icons/fa';

export default function NewWallet() {
  const [mnemonic, setMnemonic] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  
  const { hasCopied, onCopy } = useClipboard(mnemonic);
  const toast = useToast();

  // Mock wallet generation
  const generateWallet = () => {
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: 'Please accept the terms',
        description: 'You must acknowledge that you understand the risks',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    
    // Mock wallet creation with timeout to simulate API call
    setTimeout(() => {
      // Generate random mnemonic and address (in a real app, this would use bip39 and proper derivation)
      const mockMnemonic = 'analyst frame pond salon burst actor horse blouse buyer fiction clip design pond fortune curious bike';
      const mockAddress = 'D7xyWQqUyuAFR5A7Dnxy9vXhTo5UAmdYQfZDGoMeV2PN';
      
      setMnemonic(mockMnemonic);
      setWalletAddress(mockAddress);
      setIsCreated(true);
      setIsGenerating(false);
      
      toast({
        title: 'Wallet created successfully',
        description: 'Make sure to save your seed phrase somewhere safe',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  const downloadMnemonic = () => {
    const element = document.createElement('a');
    const file = new Blob([`Solana MEV Bot Wallet\n\nSeed Phrase: ${mnemonic}\n\nWallet Address: ${walletAddress}\n\nIMPORTANT: Keep this file safe and secure. Anyone with access to this seed phrase has full control of your wallet.`], 
      { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'solana-mev-bot-wallet-backup.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'Backup file downloaded',
      description: 'Store this file in a secure location',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Create New MEV Bot Wallet</Heading>

        {!isCreated ? (
          <Card bg="gray.800">
            <CardHeader>
              <Heading size="md" color="white">Generate New Wallet</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Important Security Information</AlertTitle>
                    <AlertDescription>
                      You are creating a new wallet for your MEV bot. This wallet will be used to store funds and execute trades.
                      Always keep your seed phrase secure and never share it with anyone.
                    </AlertDescription>
                  </Box>
                </Alert>

                <FormControl isRequired>
                  <FormLabel color="gray.400">Password</FormLabel>
                  <Input 
                    type="password"
                    placeholder="Enter a strong password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.700"
                    color="white"
                  />
                  <FormHelperText color="gray.400">
                    Used to encrypt your wallet locally
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.400">Confirm Password</FormLabel>
                  <Input 
                    type="password"
                    placeholder="Confirm your password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    bg="gray.700"
                    color="white"
                  />
                </FormControl>

                <FormControl>
                  <Checkbox 
                    colorScheme="brand"
                    isChecked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  >
                    <Text color="gray.400">
                      I understand that I am responsible for storing my seed phrase securely and that lost seed phrases cannot be recovered.
                    </Text>
                  </Checkbox>
                </FormControl>

                <Button 
                  colorScheme="brand" 
                  size="lg"
                  isLoading={isGenerating}
                  loadingText="Generating Wallet"
                  onClick={generateWallet}
                  isDisabled={!password || !confirmPassword || !acceptedTerms}
                >
                  Generate New Wallet
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Card bg="gray.800">
            <CardHeader>
              <Heading size="md" color="white">Wallet Created Successfully</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Wallet Created</AlertTitle>
                    <AlertDescription>
                      Your new MEV bot wallet has been generated. Please save your seed phrase.
                    </AlertDescription>
                  </Box>
                </Alert>

                <Box>
                  <Text color="gray.400" mb={2}>Seed Phrase:</Text>
                  <Code p={4} borderRadius="md" width="100%" bg="gray.700" color="white" fontSize="sm">
                    {mnemonic}
                  </Code>
                  <HStack mt={2} spacing={2}>
                    <Button leftIcon={<FaCopy />} size="sm" onClick={onCopy}>
                      {hasCopied ? "Copied!" : "Copy"}
                    </Button>
                    <Button leftIcon={<FaDownload />} size="sm" onClick={downloadMnemonic}>
                      Download Backup
                    </Button>
                  </HStack>
                </Box>

                <Divider />

                <Box>
                  <Text color="gray.400" mb={2}>Wallet Address:</Text>
                  <Code p={2} borderRadius="md" width="100%" bg="gray.700" color="white">
                    {walletAddress}
                  </Code>
                </Box>

                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Important!</AlertTitle>
                    <AlertDescription>
                      <Text mb={2}>
                        • Keep your seed phrase safe. It's the only way to recover your wallet.
                      </Text>
                      <Text mb={2}>
                        • Store it in a secure location, ideally offline.
                      </Text>
                      <Text mb={2}>
                        • Never share your seed phrase with anyone.
                      </Text>
                    </AlertDescription>
                  </Box>
                </Alert>

                <Button colorScheme="brand" size="lg" as="a" href="/dashboard">
                  Go to Dashboard
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
} 