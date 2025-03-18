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
  HStack,
  Icon,
  useToast,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { FaWallet, FaExchangeAlt, FaHistory } from 'react-icons/fa';

export default function Wallet() {
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: 'Wallet connected',
      description: 'Your wallet has been successfully connected',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: 'Wallet disconnected',
      description: 'Your wallet has been disconnected',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Wallet</Heading>

        <Card bg="gray.800">
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md" color="white">Wallet Connection</Heading>
              <Button
                colorScheme={isConnected ? 'red' : 'brand'}
                onClick={isConnected ? handleDisconnect : handleConnect}
              >
                {isConnected ? 'Disconnect' : 'Connect Wallet'}
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            {isConnected ? (
              <VStack spacing={6} align="stretch">
                <Stat>
                  <StatLabel color="gray.400">SOL Balance</StatLabel>
                  <StatNumber color="white">25.5 SOL</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12.5%
                  </StatHelpText>
                </Stat>

                <Divider />

                <HStack spacing={4}>
                  <Button leftIcon={<FaExchangeAlt />} colorScheme="brand">
                    Send
                  </Button>
                  <Button leftIcon={<FaExchangeAlt />} colorScheme="brand">
                    Receive
                  </Button>
                </HStack>

                <Button leftIcon={<FaHistory />} variant="outline" colorScheme="brand">
                  View Transaction History
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4}>
                <Icon as={FaWallet} w={10} h={10} color="gray.400" />
                <Text color="gray.400">Connect your wallet to view balance and transactions</Text>
              </VStack>
            )}
          </CardBody>
        </Card>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Supported Wallets</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Button
                leftIcon={<FaWallet />}
                variant="outline"
                colorScheme="brand"
                justifyContent="flex-start"
                size="lg"
              >
                Phantom
              </Button>
              <Button
                leftIcon={<FaWallet />}
                variant="outline"
                colorScheme="brand"
                justifyContent="flex-start"
                size="lg"
              >
                Solflare
              </Button>
              <Button
                leftIcon={<FaWallet />}
                variant="outline"
                colorScheme="brand"
                justifyContent="flex-start"
                size="lg"
              >
                Sollet
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 