export interface UserToken {
  address: string;
  symbol: string;
  decimals: number;
  image: string; // https://static.metaswap.codefi.network/api/v1/tokenIcons/97/0x6eae77b4fad152328f8e481424ca418af180bd7b.png
  isERC721: boolean;
  aggregators: any[];
  balanceError: any;
}
