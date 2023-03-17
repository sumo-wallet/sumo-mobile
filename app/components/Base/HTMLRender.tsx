import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import RenderHTML, {
  CustomBlockRenderer,
  CustomTagRendererRecord,
} from 'react-native-render-html';
import linkifyHtml from 'linkify-html';
import WebView from 'react-native-webview';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  MixedStyleDeclaration,
  MixedStyleRecord,
} from '@native-html/transient-render-engine';
import { useTheme } from '../../util/theme';

const urlRegex = /\bhttps?:\/\/[a-z0-9\.\-_](:\d+)?[^ \n\t<>()\[\]]*/i;

const linkifyOptions = {
  validate: {
    url(value: string) {
      return urlRegex.test(value);
    },
    email: false,
  },
  ignoreTags: ['a', 'script', 'style'],
};

const SpanRenderer: CustomBlockRenderer = function SpanRenderer({
  TDefaultRenderer,
  tnode,
  type,
  ...props
}) {
  return <TDefaultRenderer {...props} type={'text'} tnode={tnode} />;
};

const renderers: CustomTagRendererRecord = {
  span: SpanRenderer,
};

interface Props {
  htmlContent: string;
  containerStyle?: MixedStyleDeclaration;
  isSelectImage?: boolean;
}

export const HTMLRenderer = memo(
  ({ htmlContent, containerStyle, isSelectImage = false }: Props) => {
    const htmlContentStr = useMemo(
      () => (htmlContent ? linkifyHtml(htmlContent, linkifyOptions) : ''),
      [htmlContent],
    );

    const { colors } = useTheme();

    const { width } = useWindowDimensions();
    const containerStyles: MixedStyleDeclaration = {
      paddingBottom: 12,
      marginBottom: 0,
      marginHorizontal: 16,
    };

    const renderersPropsCustom: Partial<any> = {
      img: {
        isSelectImage,
        enableExperimentalPercentWidth: true,
      },
    };

    const tagStyle: MixedStyleRecord = {
      span: {
        textDecorationLine: 'none',
      },
      a: {
        color: colors.primary.default,
        textDecorationLine: 'none',
      },
      div: {
        color: colors.text.default,
        fontSize: 14,
      },
      p: {
        margin: 0,
      },
      strong: {},
      b: {},
      h1: {
        fontSize: 25,
        lineHeight: 31,
      },
      h2: {
        margin: 0,
        fontSize: 22,
        lineHeight: 28,
      },
      h3: {
        margin: 0,
        fontSize: 20,
        lineHeight: 25,
      },
      h4: {
        fontSize: 18,
        lineHeight: 23,
      },
      h5: {
        fontSize: 16,
        lineHeight: 20,
      },
      h6: {
        fontSize: 14,
        lineHeight: 18,
      },
    };

    return (
      <>
        <RenderHTML
          source={{
            html: `<p>${htmlContentStr}<p>`,
          }}
          tagsStyles={tagStyle}
          baseStyle={Object.assign(containerStyles, containerStyle)}
          renderers={renderers}
          contentWidth={width}
          renderersProps={renderersPropsCustom}
          WebView={WebView}
        />
      </>
    );
  },
);
