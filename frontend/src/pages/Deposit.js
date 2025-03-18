import React, { useState, useEffect } from 'react';
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
  Image,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';

export default function Deposit() {
  const [walletAddress, setWalletAddress] = useState('D7xyWQqUyuAFR5A7Dnxy9vXhTo5UAmdYQfZDGoMeV2PN');
  const toast = useToast();

  // Fake QR code - in a real app this would be generated based on the wallet address
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + walletAddress;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(
      function() {
        toast({
          title: 'Address copied',
          description: 'Wallet address copied to clipboard',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      },
      function(err) {
        toast({
          title: 'Error',
          description: 'Could not copy address: ' + err,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    );
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Deposit</Heading>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Deposit SOL to Your MEV Bot Wallet</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="center">
              <Text color="gray.400" textAlign="center">
                Scan the QR code or copy the address below to deposit SOL to your MEV bot wallet.
              </Text>

              <Box 
                bg="white" 
                p={4} 
                borderRadius="md" 
                boxShadow="md"
                width="220px"
                height="220px"
              >
                <Image 
                  src={qrCodeUrl} 
                  alt="Deposit QR Code" 
                  boxSize="200px"
                />
              </Box>

              <VStack width="100%" spacing={2}>
                <Text color="gray.400" alignSelf="flex-start">Wallet Address:</Text>
                <InputGroup>
                  <Input 
                    value={walletAddress} 
                    isReadOnly 
                    bg="gray.700" 
                    color="white"
                  />
                  <InputRightElement>
                    <Button h='1.75rem' size='sm' onClick={handleCopy}>
                      <FaCopy />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </VStack>

              <Divider my={4} />

              <VStack width="100%" spacing={4}>
                <Text color="white" fontWeight="bold">Important Notes:</Text>
                <Text color="gray.400" fontSize="sm" textAlign="left">
                  • Send only SOL to this address. Other tokens may be lost.
                </Text>
                <Text color="gray.400" fontSize="sm" textAlign="left">
                  • Minimum deposit: 0.1 SOL
                </Text>
                <Text color="gray.400" fontSize="sm" textAlign="left">
                  • Deposits typically arrive within 1 minute but may take longer during network congestion.
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 