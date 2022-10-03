//export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//export const contractAddress = "0x91CCC3cdD6D3914D4dbeB07C41C9e05E28687e6e" // polygoon
export const contractAddress = "0xB53b80aeeB602f1132D0d94Ba2DB2D32F9EfcAB1"
export const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "sended",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "addrToName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_from",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_to",
          "type": "string"
        }
      ],
      "name": "getFullConversation",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMembers",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "nameToAddr",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_from",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_to",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_msg",
          "type": "string"
        }
      ],
      "name": "sendMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "subscribe",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];