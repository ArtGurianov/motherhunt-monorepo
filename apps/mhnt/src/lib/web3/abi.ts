export const systemContractAbi = [
  {
    type: "function",
    name: "addProjectSuperAdmin",
    inputs: [
      { name: "_superAdminAddress", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeProjectSuperAdmin",
    inputs: [
      { name: "_superAdminAddress", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getProjectSuperAdmins",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProjectAdmins",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoleByAddress",
    inputs: [
      { name: "_targetAddress", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum MyDaogsAbstractProject.AdminRole",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isWhitelistedAgency",
    inputs: [{ name: "_agencyId", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "whitelistAgency",
    inputs: [{ name: "_agencyId", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "WhitelistedAgency",
    inputs: [
      {
        name: "_agencyId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "_whitelistedBy",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
  },
  {
    type: "function",
    name: "getAgencyAddress",
    inputs: [{ name: "_agencyId", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setAgencyAddress",
    inputs: [
      { name: "_agencyId", type: "bytes32", internalType: "bytes32" },
      { name: "_newAddress", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const usdContractAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;
