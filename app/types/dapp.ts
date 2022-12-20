import { ModelDApp } from './sumo/schema';

export interface Dapp {
  id: number | string;
  image: string | any;
  name: string;
  description?: string;
  banner?: string | any;
  chainName?: string;
  provider?: string;
  website?: string;
}

export interface GroupDapp {
  id: number | string;
  apps: Dapp[];
}

export interface DAppPageData {
  id: string | number;
  title: string;
  groups: GroupDapp[];
}

export interface DappByPage {
  apps: ModelDApp[];
}
