import { SelectorOption } from '../../common/BottomMenu';
import { icons } from '../../../assets';

export const Types24hSelector: SelectorOption[] = [
  {
    label: '1H',
    value: '1h',
  },
  {
    label: '24H',
    value: '24h',
  },
  {
    label: '7D',
    value: '7d',
  },
];

export const TypeSortSelector: SelectorOption[] = [
  {
    label: 'Rank',
    value: 'id_desc',
    subValue: 'id_asc',
  },
  {
    label: 'Sort By Market Cap',
    value: 'market_cap_desc',
    subValue: 'market_cap_asc',
  },
  {
    label: '% Change',
    value: 'volume_desc',
    subValue: 'volume_asc',
  },
  {
    label: 'Price',
    value: 'price_desc',
    subValue: 'price_asc',
  },
];

export const TypeChart: SelectorOption[] = [
  {
    label: 'Price',
    value: 'line_chart',
    icon: icons.iconLineChart,
  },
  {
    label: 'Price',
    value: 'candlestick_chart',
    icon: icons.iconCandlestickChart,
  },
  {
    label: 'MCap',
    value: 'market_cap',
  },
];
