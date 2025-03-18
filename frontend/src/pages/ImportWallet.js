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
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Textarea,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  Code,
} from '@chakra-ui/react';

export default function ImportWallet() {
  const [importMethod, setImportMethod] = useState('phrase');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isImported, setIsImported] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  const toast = useToast();

  const handleImport = () => {
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate seed phrase or private key
    if (importMethod === 'phrase' && !seedPhrase) {
      toast({
        title: 'Missing seed phrase',
        description: 'Please enter your seed phrase',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (importMethod === 'key' && !privateKey) {
      toast({
        title: 'Missing private key',
        description: 'Please enter your private key',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsImporting(true);
    
    // Mock wallet import with timeout to simulate API call
    setTimeout(() => {
      // In a real app, this would validate and import the seed phrase or private key
      const mockAddress = 'D7xyWQqUyuAFR5A7Dnxy9vXhTo5UAmdYQfZDGoMeV2PN';
      
      setWalletAddress(mockAddress);
      setIsImported(true);
      setIsImporting(false);
      
      toast({
        title: 'Wallet imported successfully',
        description: 'Your wallet has been imported and is ready to use',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Import Existing Wallet</Heading>

        {!isImported ? (
          <Card bg="gray.800">
            <CardHeader>
              <Heading size="md" color="white">Import Wallet</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Secure Import Process</AlertTitle>
                    <AlertDescription>
                      Your seed phrase or private key will be encrypted locally and will never be sent to our servers.
                    </AlertDescription>
                  </Box>
                </Alert>

                <FormControl>
                  <FormLabel color="gray.400">Import Method</FormLabel>
                  <RadioGroup onChange={setImportMethod} value={importMethod} colorScheme="brand">
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={5}>
                      <Radio value="phrase" borderColor="gray.400">
                        <Text color="gray.400">Seed Phrase (12 or 24 words)</Text>
                      </Radio>
                      <Radio value="key" borderColor="gray.400">
                        <Text color="gray.400">Private Key</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                {importMethod === 'phrase' ? (
                  <FormControl isRequired>
                    <FormLabel color="gray.400">Seed Phrase</FormLabel>
                    <Textarea 
                      placeholder="Enter your 12 or 24 word seed phrase separated by spaces" 
                      value={seedPhrase}
                      onChange={(e) => setSeedPhrase(e.target.value)}
                      bg="gray.700"
                      color="white"
                      rows={4}
                    />
                    <FormHelperText color="gray.400">
                      Words should be separated by single spaces
                    </FormHelperText>
                  </FormControl>
                ) : (
                  <FormControl isRequired>
                    <FormLabel color="gray.400">Private Key</FormLabel>
                    <Input 
                      placeholder="Enter your private key" 
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      bg="gray.700"
                      color="white"
                    />
                  </FormControl>
                )}

                <FormControl isRequired>
                  <FormLabel color="gray.400">New Password</FormLabel>
                  <Input 
                    type="password"
                    placeholder="Create a password to encrypt your wallet" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.700"
                    color="white"
                  />
                  <FormHelperText color="gray.400">
                    This password will be used to encrypt your wallet locally
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

                <Button 
                  colorScheme="brand" 
                  size="lg"
                  isLoading={isImporting}
                  loadingText="Importing Wallet"
                  onClick={handleImport}
                  isDisabled={
                    !password || 
                    !confirmPassword || 
                    (importMethod === 'phrase' && !seedPhrase) || 
                    (importMethod === 'key' && !privateKey)
                  }
                >
                  Import Wallet
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Card bg="gray.800">
            <CardHeader>
              <Heading size="md" color="white">Wallet Imported Successfully</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Wallet Imported</AlertTitle>
                    <AlertDescription>
                      Your wallet has been successfully imported and is ready to use with the MEV bot.
                    </AlertDescription>
                  </Box>
                </Alert>

                <Box>
                  <Text color="gray.400" mb={2}>Wallet Address:</Text>
                  <Code p={2} borderRadius="md" width="100%" bg="gray.700" color="white">
                    {walletAddress}
                  </Code>
                </Box>

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