import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Stack,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaWallet, FaChartLine, FaCog, FaQrcode, FaMoneyBillWave, FaPlay, FaHistory, FaPlus, FaKey } from 'react-icons/fa';

const Links = [
  { name: '💼 Wallet Info', path: '/wallet', icon: FaWallet },
  { name: '💰 Deposit QR code', path: '/deposit', icon: FaQrcode },
  { name: '💳 Balance', path: '/balance', icon: FaMoneyBillWave },
  { name: '▶️ Start', path: '/dashboard', icon: FaPlay },
  { name: '💸 Withdraw', path: '/withdraw', icon: FaMoneyBillWave },
  { name: '⚙️ Settings', path: '/settings', icon: FaCog },
  { name: '🔄 New MevBot Wallet', path: '/new-wallet', icon: FaPlus },
  { name: '🔑 Import Wallet', path: '/import-wallet', icon: FaKey },
];

const NavLink = ({ children, to, icon: Icon, isActive }) => (
  <Link
    as={RouterLink}
    to={to}
    px={3}
    py={2}
    rounded={'md'}
    bg={isActive ? 'brand.700' : 'transparent'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('brand.600', 'brand.700'),
    }}
    color="white"
    fontWeight={isActive ? 'bold' : 'normal'}
  >
    <Flex align="center">
      {Icon && <Icon style={{ marginRight: '8px' }} />}
      {children}
    </Flex>
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  return (
    <Box bg={useColorModeValue('gray.900', 'gray.900')} px={4} position="fixed" w="100%" zIndex={100} borderBottom="1px" borderColor="gray.700">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          bg="gray.800"
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box fontWeight="bold" fontSize="xl" color="white">
            Solana MevBot
          </Box>
        </HStack>
        <HStack as={'nav'} spacing={2} display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              icon={link.icon}
              isActive={location.pathname === link.path}
            >
              {link.name}
            </NavLink>
          ))}
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path} 
                icon={link.icon}
                isActive={location.pathname === link.path}
              >
                {link.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
      
      <Box textAlign="center" py={1} fontSize="sm" color="gray.500">
        <Text>Solana Mev-Bot v1.03</Text>
      </Box>
    </Box>
  );
} 