import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Divider,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';

// Mock transaction data
const transactions = [
  {
    id: 'tx1',
    type: 'deposit',
    amount: 5.2,
    timestamp: '2025-03-18T10:24:00Z',
    status: 'confirmed'
  },
  {
    id: 'tx2',
    type: 'profit',
    amount: 0.23,
    timestamp: '2025-03-18T09:15:00Z',
    status: 'confirmed'
  },
  {
    id: 'tx3',
    type: 'withdraw',
    amount: -1.5,
    timestamp: '2025-03-17T16:42:00Z',
    status: 'confirmed'
  },
  {
    id: 'tx4',
    type: 'profit',
    amount: 0.18,
    timestamp: '2025-03-17T14:30:00Z',
    status: 'confirmed'
  },
  {
    id: 'tx5',
    type: 'deposit',
    amount: 10.0,
    timestamp: '2025-03-17T12:00:00Z',
    status: 'confirmed'
  }
];

export default function Balance() {
  // Calculate totals from transactions
  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalProfit = transactions
    .filter(tx => tx.type === 'profit')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Balance</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card bg="gray.800">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Total Balance</StatLabel>
                <StatNumber color="white">{totalBalance.toFixed(2)} SOL</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Updated just now
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg="gray.800">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Total Profit</StatLabel>
                <StatNumber color="white">{totalProfit.toFixed(2)} SOL</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Since first deposit
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Recent Transactions</Heading>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="gray.400">Type</Th>
                    <Th color="gray.400">Amount</Th>
                    <Th color="gray.400">Time</Th>
                    <Th color="gray.400">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((tx) => (
                    <Tr key={tx.id}>
                      <Td>
                        <Badge 
                          colorScheme={
                            tx.type === 'deposit' ? 'green' : 
                            tx.type === 'withdraw' ? 'red' : 'blue'
                          }
                        >
                          {tx.type}
                        </Badge>
                      </Td>
                      <Td color="white">
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} SOL
                      </Td>
                      <Td color="gray.400" fontSize="sm">
                        {formatDate(tx.timestamp)}
                      </Td>
                      <Td>
                        <Badge colorScheme="green">
                          {tx.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Balance Summary</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between">
                <Text color="gray.400">Total Deposits</Text>
                <Text color="white">
                  {transactions
                    .filter(tx => tx.type === 'deposit')
                    .reduce((acc, tx) => acc + tx.amount, 0)
                    .toFixed(2)} SOL
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.400">Total Withdrawals</Text>
                <Text color="white">
                  {Math.abs(transactions
                    .filter(tx => tx.type === 'withdraw')
                    .reduce((acc, tx) => acc + tx.amount, 0))
                    .toFixed(2)} SOL
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.400">Total Profit</Text>
                <Text color="white">
                  {transactions
                    .filter(tx => tx.type === 'profit')
                    .reduce((acc, tx) => acc + tx.amount, 0)
                    .toFixed(2)} SOL
                </Text>
              </Flex>
              <Divider />
              <Flex justify="space-between">
                <Text color="gray.400" fontWeight="bold">Current Balance</Text>
                <Text color="white" fontWeight="bold">
                  {totalBalance.toFixed(2)} SOL
                </Text>
              </Flex>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 