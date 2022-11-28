import { Image } from 'react-native';
import React from 'react';
import images from 'images/image-icons';

interface ImageIconPropTypes {
  image: string;
  style: any;
}

const ImageIcon = (props: ImageIconPropTypes) => {
  const { image, style, ...rest } = props;

  if (!image) return null;
  const source = images[image];
  if (!source) {
    return null;
  }

  return <Image source={source} style={style} {...rest} />;
};

export default ImageIcon;
