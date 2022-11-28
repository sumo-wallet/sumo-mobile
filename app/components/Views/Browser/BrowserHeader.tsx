import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Style, Colors, Fonts } from './../../../styles';
import { icons } from './../../../assets';
import { useTheme } from './../../../util/theme';
import { useNavigator } from './../../hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNewTab,
  closeAllTabs,
  closeTab,
  setActiveTab,
  updateTab,
} from '../../../actions/browser';

export interface BrowserHeaderProps {
  title?: string;
  goBack?: () => void;
  goForward?: () => void;
  toggleOptions?: () => void;
}

export const BrowserHeader = ({
  title,
  goBack,
  goForward,
  toggleOptions,
}: BrowserHeaderProps) => {
  const nav = useNavigator();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { activeTab: activeTabId } = useSelector((state: any) => state?.browser);

  const handleCloseBrowser = React.useCallback(()=>{
    nav.goBack();
  }, [nav])
  const handleCloseTab = React.useCallback(()=>{
    // dispatch(closeTab(activeTabId))
  }, [])
  return (
    <View
      style={Style.s({
        direc: 'row',
        items: 'center',
        justify: 'space-between',
        px: 16,
        py: 12,
        minH: 48,
        bg: colors.background.default,
        // bg: Colors.grayscale[100],
      })}
    >
      <View style={Style.s({ direc: 'row', items: 'center', py: 2 })}>
        <TouchableOpacity onPress={goBack} >
          <FastImage
            style={Style.s({ size: 20 })}
            source={icons.iconPrevious}
            tintColor={colors.icon.default}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={goForward} style={Style.s({ ml: 24 })}>
          <FastImage
            style={Style.s({ size: 20 })}
            tintColor={colors.icon.default}
            source={icons.iconNext}
          />
        </TouchableOpacity>
      </View>
      <View style={Style.s({ direc: 'row', items: 'center', py: 2 })}>
        <TouchableOpacity onPress={toggleOptions} >
          <FastImage
            style={Style.s({ size: 24 })}
            source={icons.iconMenu2}
            tintColor={colors.icon.default}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCloseTab} style={Style.s({ ml: 24 })}>
          <FastImage
            style={Style.s({ size: 24 })}
            source={icons.iconMinus}
            tintColor={colors.icon.default}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCloseBrowser} style={Style.s({ ml: 24 })}>
          <FastImage
            style={Style.s({ size: 24 })}
            source={icons.iconClose2}
            tintColor={colors.icon.default}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
