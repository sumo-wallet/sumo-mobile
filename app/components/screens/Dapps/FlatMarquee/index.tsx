import React, { Component } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import MarqueeItem from './MarqueeItem';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 40,
    flexGrow: 0,
  },
});

const NO_PER_SCREEN = 5;
const itemWidth = Dimensions.get('window').width / NO_PER_SCREEN;

const FlatMarquee = ({ data }: { data: any[] }) => {
  const [currentPosition, setCurrentPosition] = React.useState<number>(0);
  const [scrolling, setScrolling] = React.useState<boolean>(false);
  const [momentumScrolling, setMomentumScrolling] =
    React.useState<boolean>(false);
  const tickerRef = React.useRef<FlatList>();

  let activeInterval: number | NodeJS.Timeout | null;

  const _renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <MarqueeItem
        title={item.title}
        price={item.price}
        change={item.change}
        isGain={item.isGain}
        itemWidth={itemWidth}
        style={{
          marginStart: index === 0 ? 16 : 0,
        }}
      />
    );
  };

  // Clear interval when user closes
  // componentWillUnmount() {
  //   clearInterval(this.activeInterval);
  // }

  const clearScrolling = React.useCallback(() => {
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
  }, []);

  const handleScrolling = React.useCallback(() => {
    // Start scrolling if there's more than one stock to display
    let _currentPosition = currentPosition;
    if (_currentPosition < 0) {
      _currentPosition = 0;
    }
    if (data?.length > 5) {
      // Increment position with each new interval
      const position = _currentPosition + 0.5;
      tickerRef?.current?.scrollToOffset({ offset: position, animated: false });
      // After position passes this value, snaps back to beginning
      const maxOffset = data.length * itemWidth;
      // Set animation to repeat at end of scroll
      if (_currentPosition > maxOffset) {
        const offset = _currentPosition - maxOffset;
        tickerRef?.current?.scrollToOffset({
          offset,
          animated: false,
        });
        setCurrentPosition(offset);
      } else {
        setCurrentPosition(position);
      }
    }
  }, [currentPosition, data.length]);

  const startScroll = React.useCallback(() => {
    activeInterval = setInterval(handleScrolling, 32);
  }, []);

  React.useEffect(() => {
    startScroll();
  }, [startScroll]);

  const onMomentumScrollBegin = () => {
    setMomentumScrolling(true);
    clearScrolling();
  };

  const onMomentumScrollEnd = React.useCallback(
    (event) => {
      if (momentumScrolling) {
        setMomentumScrolling(false);
        setCurrentPosition(event.nativeEvent.contentOffset.x);
        startScroll();
      }
    },
    [momentumScrolling, startScroll],
  );

  const onScrollBegin = React.useCallback(() => {
    setScrolling(true);
    clearScrolling();
  }, [clearScrolling]);

  const onScrollEnd = (event: any) => {
    setScrolling(false);
    setCurrentPosition(event.nativeEvent.contentOffset.x);
    startScroll();
  };

  const onTouchBegin = () => {
    clearScrolling();
  };

  const onTouchEnd = React.useCallback(() => {
    if (!scrolling) {
      startScroll();
    }
  }, [scrolling, startScroll]);

  const getOverlappingNo = () => {
    const { length } = data;
    let overlappingNo = 10;
    if (length < 10) {
      overlappingNo = length;
    }
    return overlappingNo;
  };

  const getWrappedData = () => {
    const overlappingNo = getOverlappingNo();
    return {
      data: [...data, ...data.slice(0, overlappingNo)],
    };
  };

  const { data: listData } = getWrappedData();
  return (
    <FlatList
      initialNumToRender={4}
      ref={tickerRef as any}
      decelerationRate="fast"
      onTouchStart={onTouchBegin}
      onTouchEnd={onTouchEnd}
      onScrollBeginDrag={onScrollBegin}
      onScrollEndDrag={onScrollEnd}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      getItemLayout={(_, index) => ({
        length: listData.length,
        offset: itemWidth * index,
        index,
      })}
      showsHorizontalScrollIndicator={false}
      data={listData}
      renderItem={_renderItem}
      horizontal
      style={styles.wrapper}
      keyExtractor={(item, index) => item.title + index}
    />
  );
};

FlatMarquee.propTypes = {
  stockData: PropTypes.array,
};

FlatMarquee.defaultProps = {
  stockData: [],
};

export default FlatMarquee;
