import { GroupDapp, DAppPageData } from './../types';
import { placeholders } from './../assets';

export const dummyDataGroupDapps: GroupDapp[] = [
  {
    id: 1,
    apps: [
      {
        id: 'pancakeswap.1',
        name: 'Pancakeswap',
        description: 'AMM DEX',
        image: placeholders.dapp7,
        website: 'https://pancakeswap.finance/',
      },
      {
        id: 'uniswap.1',
        name: 'Uniswap',
        description: 'AMM DEX',
        image: placeholders.dapp4,
        website: 'https://app.uniswap.org/#/swap',
      },
      {
        id: 'compound.1',
        name: 'Compound',
        description: 'Lending and borrowing',
        image: placeholders.dapp6,
        website: 'https://compound.finance/',
      },
    ],
  },
  {
    id: 1,
    apps: [
      {
        id: 'pancakeswap.2',
        name: 'Pancakeswap',
        description: 'AMM DEX',
        image: placeholders.dapp6,
      },
      {
        id: 'uniswap.2',
        name: 'Uniswap',
        description: 'AMM DEX',
        image: placeholders.dapp4,
      },
      {
        id: 'uniswap.2',
        name: 'Uniswap',
        description: 'AMM DEX',
        image: placeholders.dapp4,
      },
    ],
  },
  {
    id: 1,
    apps: [
      {
        id: 'pancakeswap.3',
        name: 'Pancakeswap',
        description: 'AMM DEX',
        image: placeholders.dapp6,
      },
      {
        id: 'uniswap.3',
        name: 'Uniswap',
        description: 'AMM DEX',
        image: placeholders.dapp4,
      },
      {
        id: 'uniswap.3',
        name: 'Uniswap',
        description: 'AMM DEX',
        image: placeholders.dapp4,
      },
    ],
  },
];

export const dummyDAppPageData: DAppPageData[] = [
  {
    id: 1,
    title: 'All',
    groups: [
      {
        id: 1,
        apps: [
          {
            id: 'pancakeswap.1',
            name: 'Pancake Swap',
            description: 'AMM DEX',
            image: placeholders.dapp7,
            website: 'https://pancakeswap.finance/',
          },
          {
            id: 'uniswap.1',
            name: 'Uniswap',
            description: 'AMM DEX',
            image: placeholders.dapp4,
            website: 'https://app.uniswap.org/#/swap',
          },
          {
            id: 'compound.1',
            name: 'Compound',
            description: 'Lending and borrowing',
            image: placeholders.dapp6,
            website: 'https://compound.finance/',
          },
        ],
      },
      {
        id: 2,
        apps: [
          {
            id: 'Curve',
            name: 'Curve (ETH)',
            description: 'Curve DAO',
            image: placeholders.dapp6,
          },
          {
            id: 'Biswap',
            name: 'Biswap',
            description: 'AMM DEX',
            image: placeholders.dapp5,
          },
          {
            id: 'Aave.2',
            name: 'Aave (ETH)',
            description: 'AMM DEX',
            image: placeholders.dapp3,
          },
        ],
      },
      {
        id: 3,
        apps: [
          {
            id: 'Fortube',
            name: 'Fortube (BSC)',
            description: 'Crypto Open Financial Platform',
            image: placeholders.dapp6,
          },
          {
            id: 'Autofarm.bsc',
            name: 'Autofarm (BSC)',
            description: 'Hyper-optimised cross-chain',
            image: placeholders.dapp4,
          },
          {
            id: 'JustSwap.3',
            name: 'JustSwap',
            description: 'JustSwap is the first...',
            image: placeholders.dapp4,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'BSC',
    groups: [
      {
        id: 1,
        apps: [
          {
            id: 'pancakeswap.1',
            name: 'Pancake Swap',
            description: 'AMM DEX',
            image: placeholders.dapp7,
            website: 'https://pancakeswap.finance/',
          },
          {
            id: 'bakeryswap.1',
            name: 'Bakery Swap',
            description: 'AMM DEX',
            image: placeholders.dapp4,
            website: 'https://www.bakeryswap.org/#/swap',
          },
          {
            id: 'Venus.1',
            name: 'Venus',
            description: 'A decentralized marketplace',
            image: placeholders.dapp6,
            website: 'https://protocolvenus.com/?gclid=EAIaIQobChMIlfSJy8vQ-wIVwmkqCh2WDgOFEAAYASAAEgJx-fD_BwE',
          },
        ],
      },
    ],
  },
  // {
  //   id: 2,
  //   title: 'Defi',
  //   groups: dummyDataGroupDapps,
  // },
  // {
  //   id: 3,
  //   title: 'BSC',
  //   groups: dummyDataGroupDapps,
  // },
  // {
  //   id: 4,
  //   title: 'Tools',
  //   groups: dummyDataGroupDapps,
  // },
  // {
  //   id: 5,
  //   title: 'ETH',
  //   groups: dummyDataGroupDapps,
  // },
  // {
  //   id: 6,
  //   title: 'Solana',
  //   groups: dummyDataGroupDapps,
  // },
];
