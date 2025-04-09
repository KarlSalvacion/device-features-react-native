import React from 'react';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesHeartAnimation from '../styles/StylesHeartAnimation';

interface AnimatedHeartProps {
    isVisible: boolean;
    onAnimationComplete: () => void;
    tapX: number;
    tapY: number;
}

const AnimatedHeart: React.FC<AnimatedHeartProps> = ({ isVisible, onAnimationComplete, tapX, tapY }) => {
    const scale = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isVisible) {
            scale.setValue(0);
            opacity.setValue(0);
            translateY.setValue(0);

            Animated.parallel([
                Animated.sequence([
                    Animated.spring(scale, {
                        toValue: 1.2,
                        useNativeDriver: true,
                        speed: 20,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: true,
                        speed: 20,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.delay(300), 
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onAnimationComplete();
            });
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <Animated.View
            style={[
                stylesHeartAnimation.heartContainer,
                {
                    transform: [
                        { scale },
                        { translateY },
                    ],
                    opacity,
                    left: tapX - 40,
                    top: tapY - 40,
                },
            ]}
        >
            <Ionicons name="heart" size={80} color="#ff375f" />
        </Animated.View>
    );
};


export default AnimatedHeart; 