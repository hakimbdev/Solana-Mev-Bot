import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Switch,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  useToast,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { time: '00:00', profit: 0.5 },
  { time: '04:00', profit: 1.2 },
  { time: '08:00', profit: 0.8 },
  { time: '12:00', profit: 1.5 },
  { time: '16:00', profit: 2.1 },
  { time: '20:00', profit: 1.8 },
];

export default function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const toast = useToast();

  const handleToggle = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? 'Bot stopped' : 'Bot started',
      description: isRunning
        ? 'The MEV bot has been stopped'
        : 'The MEV bot is now running',
      status: isRunning ? 'info' : 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg="gray.800">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Total Profit</StatLabel>
                <StatNumber color="white">2.5 SOL</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg="gray.800">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Active Trades</StatLabel>
                <StatNumber color="white">3</StatNumber>
                <StatHelpText>Last 24 hours</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg="gray.800">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Success Rate</StatLabel>
                <StatNumber color="white">92%</StatNumber>
                <StatHelpText>Last 100 trades</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Profit History</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="gray.600" />
                  <XAxis dataKey="time" stroke="gray.400" />
                  <YAxis stroke="gray.400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#2D3748',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card bg="gray.800">
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md" color="white">Bot Controls</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" color="gray.400">
                  Auto Trading
                </FormLabel>
                <Switch
                  isChecked={isRunning}
                  onChange={handleToggle}
                  colorScheme="brand"
                />
              </FormControl>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Button colorScheme="brand" size="lg">
                Start New Trade
              </Button>
              <Button colorScheme="red" size="lg">
                Emergency Stop
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 