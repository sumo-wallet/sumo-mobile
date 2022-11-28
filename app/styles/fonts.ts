/* eslint-disable @typescript-eslint/default-param-last */
import { resHeight, resWidth } from './style';

const base = (
  fontSize = 14,
  fontWeight: FontWeight | undefined,
  color = 'black',
  lineHeight: number | undefined,
  italic = false,
) => ({
  fontSize,
  color,
  ...(fontWeight ? { fontWeight } : {}),
  ...(italic ? { fontStyle: 'italic' } : {}),
  ...(typeof lineHeight === 'number' ? { lineHeight } : {}),
});

const margin = (
  left?: number | string,
  top?: number | string,
  right?: number | string,
  bottom?: number | string,
  x?: number | string,
  y?: number | string,
) => ({
  marginLeft: typeof left === 'number' ? resWidth(left) : left,
  marginTop: typeof top === 'number' ? resHeight(top) : top,
  marginRight: typeof right === 'number' ? resWidth(right) : right,
  marginBottom: typeof bottom === 'number' ? resHeight(bottom) : bottom,
  marginHorizontal: typeof x === 'number' ? resWidth(x) : x,
  marginVertical: typeof y === 'number' ? resHeight(y) : y,
});

const align = (
  self = 'auto',
  textAlign = 'auto',
  textAlignVertical = 'auto',
) => ({
  alignSelf: self,
  textAlign,
  textAlignVertical,
});

const decoration = (dec?: string, style?: string, color?: string) => ({
  ...(typeof dec === 'string' ? { textDecorationLine: dec } : {}),
  ...(typeof style === 'string' ? { textDecorationStyle: style } : {}),
  ...(typeof color === 'string' ? { textDecorationColor: color } : {}),
});

export type FontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | 'bold'
  | 'normal'
  | 'medium';

export interface FontStyle {
  s?: number;
  c?: string;
  w?: FontWeight;
  l?: number | string;
  t?: number | string;
  r?: number | string;
  b?: number | string;
  x?: number | string;
  y?: number | string;
  self?: string;
  text?: string;
  op?: number;
  dec?: string;
  decStyle?: string;
  secColor?: string;
  textVer?: string;
  italic?: boolean;
  h?: number;
}

const Fonts = {
  t: ({
    s,
    c,
    w,
    l,
    t,
    r,
    b,
    x,
    y,
    self,
    text,
    op,
    dec,
    decStyle,
    secColor,
    textVer,
    italic,
    h,
  }: FontStyle = {}): any =>
    ({
      ...base(s, w, c, h, italic),
      ...margin(l, t, r, b, x, y),
      ...align(self, text, textVer),
      ...decoration(dec, decStyle, secColor),
      opacity: op,
    } as any),
};

export default Fonts;
