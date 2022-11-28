import React, { memo } from 'react';
import { TokenDataInterface } from '../types';
import { Image, Text, View } from 'react-native';
import { Fonts, Style } from '../../../../styles';
import { colors } from '../../../../styles/common';
import Colors from '../../../../styles/colors';

interface TokenItemInterface {
  token: TokenDataInterface;
}

export const TokenItem = memo(({ token }: TokenItemInterface) => {
  return (
    <View
      style={[
        Style.s({
          mt: 12,
          direc: 'row',
          items: 'center',
          justify: 'space-between',
        }),
      ]}
    >
      <View style={Style.s({ direc: 'row' })}>
        <Image source={token.icon} style={Style.s({ size: 40, mr: 16 })} />
        <View
          style={[
            Style.s({
              direc: 'row',
              flex: 1,
              justify: 'space-between',
              pb: 12,
            }),
            Style.b({ bbw: 1, color: Colors.divider[1] }),
          ]}
        >
          <View style={Style.s({ justify: 'space-around' })}>
            <Text style={Fonts.t({ c: colors.gray5, s: 14, w: '400' })}>
              {token.name}
            </Text>
            <View style={Style.s({ direc: 'row' })}>
              <Text
                style={[
                  Fonts.t({ c: Colors.gray[5], s: 12, w: '400' }),
                  Style.s({ mr: 12 }),
                ]}
              >
                {`$${token.amount}`}
              </Text>
              <Text style={Fonts.t({ c: colors.green1, s: 12, w: '400' })}>
                {`+${token.percent}`}
              </Text>
            </View>
          </View>
          <View style={Style.s({ justify: 'space-around', items: 'flex-end' })}>
            <Text style={Fonts.t({ c: colors.gray5, s: 14, w: '400' })}>
              {token.userAmount}
            </Text>
            <Text
              style={Fonts.t({ c: colors.gray5, s: 14, w: '400' })}
            >{`$${token.userDollar}`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default TokenItem;
