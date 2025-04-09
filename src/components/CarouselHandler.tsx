import React, { useRef } from "react";
import { ScrollView, ScrollViewProps, Dimensions, View } from "react-native";
import stylesCarouselHandler from "../styles/StylesCarouselHandler";

interface CarouselHandlerProps extends ScrollViewProps {
  entryId: string;
  onIndexChange: (entryId: string, index: number) => void;
}

const CarouselHandler: React.FC<CarouselHandlerProps> = ({
  entryId,
  onIndexChange,
  children,
  ...scrollViewProps
}) => {
  const { width: screenWidth } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / screenWidth);
    
    onIndexChange(entryId, currentIndex);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScroll}
      scrollEventThrottle={16}
      style={stylesCarouselHandler.container}
      {...scrollViewProps}
    >
      {React.Children.map(children, (child, index) => (
        <View style={[stylesCarouselHandler.imageContainer, { width: screenWidth }]}>
          {child}
        </View>
      ))}
    </ScrollView>
  );
};

export default CarouselHandler; 