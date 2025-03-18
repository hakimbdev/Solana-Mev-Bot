import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  useToast,
} from '@chakra-ui/react';

export default function Settings() {
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your configuration has been updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW={'7xl'} py={5}>
      <VStack spacing={8} align="stretch">
        <Heading color="white">Settings</Heading>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Trading Parameters</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel color="gray.400">Minimum Profit Threshold (SOL)</FormLabel>
                <NumberInput min={0.001} step={0.001} defaultValue={0.005}>
                  <NumberInputField bg="gray.700" color="white" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.400">Maximum Slippage (%)</FormLabel>
                <NumberInput min={0.1} max={5} step={0.1} defaultValue={0.5}>
                  <NumberInputField bg="gray.700" color="white" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.400">Stop Loss (%)</FormLabel>
                <NumberInput min={0} max={100} step={1} defaultValue={5}>
                  <NumberInputField bg="gray.700" color="white" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.400">Take Profit (%)</FormLabel>
                <NumberInput min={0} max={1000} step={1} defaultValue={10}>
                  <NumberInputField bg="gray.700" color="white" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">DEX Settings</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel color="gray.400">Primary DEX</FormLabel>
                <Select bg="gray.700" color="white">
                  <option value="jupiter">Jupiter</option>
                  <option value="raydium">Raydium</option>
                  <option value="orca">Orca</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" color="gray.400">
                  Enable Multi-DEX Trading
                </FormLabel>
                <Switch defaultChecked colorScheme="brand" />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="gray.800">
          <CardHeader>
            <Heading size="md" color="white">Risk Management</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel color="gray.400">Maximum Trade Size (SOL)</FormLabel>
                <NumberInput min={0.1} step={0.1} defaultValue={1}>
                  <NumberInputField bg="gray.700" color="white" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.400">Daily Loss Limit (SOL)</FormLabel>
                <NumberInput min={0} step={0.1} defaultValue={2}>
                  <NumberInputField bg="gray.700" color="white" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" color="gray.400">
                  Enable Emergency Stop
                </FormLabel>
                <Switch defaultChecked colorScheme="brand" />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Button colorScheme="brand" size="lg" onClick={handleSave}>
          Save Settings
        </Button>
      </VStack>
    </Container>
  );
} 