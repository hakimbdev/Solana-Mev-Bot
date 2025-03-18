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
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';

export default function Withdraw() {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState(0.1);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const currentBalance = 14.11; // Mock balance
  const minWithdrawal = 0.1; // Minimum withdrawal amount

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!destinationAddress) {
      toast({
        title: 'Error',
        description: 'Please enter a valid destination address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (amount < minWithdrawal) {
      toast({
        title: 'Error',
        description: `Withdrawal amount must be at least ${minWithdrawal} SOL`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (amount > currentBalance) {
      toast({
        title: 'Error',
        description: 'Insufficient balance',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Process withdrawal (this would be connected to the backend in a real app)
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: 'Withdrawal successful',
        description: `${amount} SOL has been sent to ${destinationAddress}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setDestinationAddress('');
      setAmount(0.1);
    }, 2000);
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Withdraw</Heading>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Withdraw SOL from Your MEV Bot Wallet</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Available Balance: {currentBalance.toFixed(2)} SOL</AlertTitle>
                    <AlertDescription>
                      Minimum withdrawal: {minWithdrawal} SOL
                    </AlertDescription>
                  </Box>
                </Alert>

                <FormControl isRequired>
                  <FormLabel color="gray.400">Destination Address</FormLabel>
                  <Input 
                    placeholder="Enter SOL wallet address" 
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    bg="gray.700"
                    color="white"
                  />
                  <FormHelperText color="gray.400">
                    Double-check this address. Withdrawals cannot be reversed.
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.400">Amount</FormLabel>
                  <InputGroup>
                    <NumberInput 
                      min={minWithdrawal} 
                      max={currentBalance} 
                      step={0.1} 
                      value={amount}
                      onChange={(valueString) => setAmount(parseFloat(valueString))}
                      width="100%"
                    >
                      <NumberInputField bg="gray.700" color="white" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <InputRightAddon children="SOL" bg="gray.600" color="white" />
                  </InputGroup>
                  <FormHelperText color="gray.400">
                    Network fee: 0.000005 SOL
                  </FormHelperText>
                </FormControl>

                <Button 
                  type="submit" 
                  colorScheme="brand" 
                  size="lg"
                  isLoading={isProcessing}
                  loadingText="Processing"
                >
                  Withdraw
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Withdrawal Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text color="gray.400">
                • Withdrawals typically take 1-5 minutes to process
              </Text>
              <Text color="gray.400">
                • Withdrawals are subject to network congestion
              </Text>
              <Text color="gray.400">
                • Send only to Solana (SOL) addresses
              </Text>
              <Text color="gray.400">
                • Withdrawal fees are determined by the Solana network
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 