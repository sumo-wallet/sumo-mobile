import React, {memo, useMemo} from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import RenderHTML, {
  CustomBlockRenderer,
  CustomMixedRenderer,
  CustomTagRendererRecord,
  HTMLContentModel,
  HTMLElementModel,
  HTMLElementModelRecord,
  useRendererProps,
} from 'react-native-render-html';

import FastImage, {ImageStyle} from 'react-native-fast-image';
import styled from 'styled-components/native';
import {Colors} from '@/themes';
import {noAvatarUri} from '@/components/Avatar';
import linkifyHtml from 'linkify-html';
import {Opts} from 'linkifyjs';
import {textContent} from 'domutils';
// @ts-ignore
import MathView, {MathText} from 'react-native-math-view';
import {MixedStyleDeclaration} from '@native-html/transient-render-engine';
import {tableModel, useHtmlTableProps} from '@native-html/table-plugin';
import WebView from 'react-native-webview';
import WebviewTable from '@/components/Views/WebviewTable';
import PhotoViewModal from '@/components/PhotoView';
import useBoolean from '@/hooks/useBoolean';
import {decode} from 'html-entities';

const urlRegex = /\bhttps?:\/\/[a-z0-9\.\-_](:\d+)?[^ \n\t<>()\[\]]*/i;

const linkifyOptions: Opts = {
  validate: {
    url: function (value: string) {
      return urlRegex.test(value);
    },
    email: false,
  },
  ignoreTags: ['a', 'script', 'style'],
};

const customHTMLElementModels: HTMLElementModelRecord = {
  sup: HTMLElementModel.fromCustomModel({
    tagName: 'sup',
    contentModel: HTMLContentModel.mixed,
    mixedUAStyles: {
      textAlignVertical: 'top',
      fontSize: 10,
    },
  }),
  table: tableModel,
};

const ImageRenderer: CustomBlockRenderer = function ImageRenderer({
  TDefaultRenderer,
  tnode,
  ...props
}) {
  const {src} = tnode.attributes;

  const [isPhotoViewVisible, setPhotoViewOn, setPhotoViewOff] =
    useBoolean(false);
  const {isSelectImage} = useRendererProps<any>('img');

  const imageDropDown = useMemo((): StyleProp<ImageStyle> => {
    if (src.startsWith('data:')) {
      return {width: 16, height: 16};
    }
    return styles.img;
  }, [src]);

  return (
    <>
      <TouchableOpacity disabled={!isSelectImage} onPress={setPhotoViewOn}>
        <FastImage
          style={imageDropDown}
          source={{uri: src || noAvatarUri}}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableOpacity>
      <PhotoViewModal
        images={[src || noAvatarUri]}
        isVisible={!!(isPhotoViewVisible && src)}
        onCloseRequest={setPhotoViewOff}
      />
    </>
  );
};

const MathRenderer: CustomMixedRenderer = function MathRenderer({
  TDefaultRenderer,
  tnode,
  type,
  ...props
}) {
  // @ts-ignore
  const text = textContent(tnode.domNode);
  if (text.match(/\\\(|\$\$|\\\[/)) {
    return <MathText value={text} />;
  }
  return <TDefaultRenderer {...props} type={'text'} tnode={tnode} />;
};

const SpanRenderer: CustomBlockRenderer = function SpanRenderer({
  TDefaultRenderer,
  tnode,
  type,
  ...props
}) {
  // @ts-ignore
  const text = textContent(tnode.domNode);
  if (text.match(/\\\(|\$\$|\\\[/)) {
    return <MathText value={text} />;
  }
  if (tnode.attributes['data-sheets-userformat']) {
    return (
      <TDefaultRenderer
        {...props}
        type={'text'}
        tnode={tnode}
        style={styles.containerSpan}
      />
    );
  }
  return <TDefaultRenderer {...props} type={'text'} tnode={tnode} />;
};

const CustomTableRender = function CustomTableRender(props: any) {
  const tableProps = useHtmlTableProps(props);
  return React.createElement(WebviewTable, tableProps);
};

const renderers: CustomTagRendererRecord = {
  img: ImageRenderer,
  span: SpanRenderer,
  p: MathRenderer,
  table: CustomTableRender,
};

interface Props {
  htmlContent: string;
  containerStyle?: MixedStyleDeclaration;
  isSelectImage?: boolean;
}
export const HTMLRenderer = memo(
  ({htmlContent, containerStyle, isSelectImage = false}: Props) => {
    const htmlContentStr = useMemo(
      () =>
        htmlContent ? decode(linkifyHtml(htmlContent, linkifyOptions)) : '',
      [htmlContent],
    );

    const {width} = useWindowDimensions();
    const containerStyles: MixedStyleDeclaration = {
      paddingBottom: 0,
      marginBottom: 0,
    };

    const renderersPropsCustom: Partial<any> = {
      img: {
        isSelectImage,
        enableExperimentalPercentWidth: true,
      },
    };

    return (
      <>
        <SHTML
          source={{
            html: `<div>${htmlContentStr}</div>`,
          }}
          baseStyle={Object.assign(containerStyles, containerStyle)}
          customHTMLElementModels={customHTMLElementModels}
          renderers={renderers}
          contentWidth={width}
          renderersProps={renderersPropsCustom}
          WebView={WebView}
        />
      </>
    );
  },
);

const SHTML = styled(RenderHTML).attrs(props => ({
  baseFontStyle: {
    fontSize: 13,
  },

  classesStyles: {
    mention: {
      fontSize: 13,
      textDecorationLine: 'none',
    },
  },
  containerStyle: {
    marginTop: 4,
  },
  imagesMaxWidth: Dimensions.get('window').width - 16 * 2,

  tagsStyles: {
    span: {
      textDecorationLine: 'none',
    },
    a: {
      color: Colors.gray1,
    },
    div: {
      color: Colors.gray1,
    },
    ul: {
      color: Colors.gray1,
    },
    li: {
      color: Colors.gray1,
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
    sup: {
      textAlignVertical: 'top',
    },
    td: {
      borderWidth: 0.5,
    },
    table: {
      borderWidth: 0.5,
    },
  },
}))`
  font-size: 13px;
`;

// @ts-ignore
const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  baseFont: {
    fontSize: 15,
    lineHeight: 22,
  },
  img: {
    width: '100%',
    height: 150,
  },
  parentView: {flexDirection: 'row', marginBottom: 10},
  flex1: {flex: 1},
  optionContainer: {
    paddingHorizontal: 0,
  },
  containerSpan: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
