import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FaChartLine, FaShieldAlt, FaRobot, FaWallet } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack
      align={'center'}
      textAlign={'center'}
      bg={useColorModeValue('gray.800', 'gray.800')}
      p={6}
      rounded={'xl'}
      height={'100%'}
    >
      <Icon as={icon} w={10} h={10} color="brand.500" />
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.400'}>{text}</Text>
    </Stack>
  );
};

export default function Home() {
  return (
    <Box>
      <Container maxW={'7xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
            color="white"
          >
            Maximize Your Solana <br />
            <Text as={'span'} color={'brand.500'}>
              Trading Profits
            </Text>
          </Heading>
          <Text color={'gray.400'} fontSize={'xl'}>
            Advanced MEV bot for Solana blockchain that performs arbitrage between
            decentralized exchanges like Jupiter, Raydium, and Orca.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Button
              as={RouterLink}
              to="/dashboard"
              colorScheme={'brand'}
              bg={'brand.500'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'brand.600',
                boxShadow: 'lg',
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={10}>
          <Feature
            icon={FaChartLine}
            title={'Multi-DEX Arbitrage'}
            text={
              'Automatically identifies and executes profitable trading opportunities across Jupiter, Raydium, and Orca.'
            }
          />
          <Feature
            icon={FaShieldAlt}
            title={'Secure & Reliable'}
            text={
              'Local encrypted storage of wallet keys and no external API dependencies for critical operations.'
            }
          />
          <Feature
            icon={FaRobot}
            title={'Smart Automation'}
            text={
              'Advanced algorithms for token discovery, price analysis, and profit calculation.'
            }
          />
          <Feature
            icon={FaWallet}
            title={'Risk Management'}
            text={
              'Configurable stop-loss, take-profit, and position sizing for maximum safety.'
            }
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
} 