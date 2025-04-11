import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Pressable, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesSaveToGalleryModal from '../styles/modals/StylesSaveToGalleryModal';

interface SaveToGalleryModalProps {
    isVisible: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    saveToGallery: boolean;
    onToggleSave: () => void;
}

const SaveToGalleryModal: React.FC<SaveToGalleryModalProps> = ({
    isVisible,
    onClose,
    isDarkMode,
    saveToGallery,
    onToggleSave
}) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(1000)).current;

    useEffect(() => {
        if (isVisible) {
            pan.setValue({ x: 0, y: 0 });
            fadeAnim.setValue(0);
            slideAnim.setValue(1000);
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 50,
                    stiffness: 300,
                })
            ]).start();
        }
    }, [isVisible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    pan.y.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    Animated.parallel([
                        Animated.timing(pan.y, {
                            toValue: 1000,
                            duration: 200,
                            useNativeDriver: true
                        }),
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true
                        })
                    ]).start(onClose);
                } else {
                    Animated.spring(pan.y, {
                        toValue: 0,
                        useNativeDriver: true
                    }).start();
                }
            }
        })
    ).current;

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(pan.y, {
                toValue: 1000,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
        ]).start(onClose);
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View 
                style={[
                    stylesSaveToGalleryModal.modalContainer,
                    { opacity: fadeAnim }
                ]}
            >
                <Pressable 
                    style={stylesSaveToGalleryModal.modalOverlay}
                    onPress={handleClose}
                />
                <Animated.View 
                    style={[
                        stylesSaveToGalleryModal.modalContent, {
                        backgroundColor: isDarkMode ? 
                            "rgb(29, 29, 29)" : 
                            "rgb(253, 253, 253)",
                        },
                        {
                            transform: [
                                { translateY: Animated.add(slideAnim, pan.y) }
                            ]
                        }
                    ]}
                    {...panResponder.panHandlers}
                >
                    <Pressable 
                        style={stylesSaveToGalleryModal.indicatorContainer}
                        onPress={handleClose}
                    >
                        <View style={[
                            stylesSaveToGalleryModal.indicator,
                            isDarkMode && stylesSaveToGalleryModal.darkIndicator
                        ]} />
                    </Pressable>
                    
                    <View style={stylesSaveToGalleryModal.contentContainer}>
                        <Text style={[
                            stylesSaveToGalleryModal.title,
                            isDarkMode && stylesSaveToGalleryModal.darkTitle
                        ]}>
                            Save Options
                        </Text>
                        
                        <Pressable
                            style={({ pressed }) => [
                                stylesSaveToGalleryModal.optionButton,
                                isDarkMode && stylesSaveToGalleryModal.darkOptionButton,
                                pressed && stylesSaveToGalleryModal.pressedOptionButton,
                                { borderColor: isDarkMode ? 
                                    "rgb(223, 223, 223)" : 
                                    "rgb(29, 29, 29)" }
                            ]}
                            onPress={onToggleSave}
                        >
                            <Ionicons 
                                name={saveToGallery ? "download" : "download-outline"} 
                                size={24} 
                                color={isDarkMode ? "#ffffff" : "#262626"} 
                            />
                            <Text style={[
                                stylesSaveToGalleryModal.optionText,
                                isDarkMode && stylesSaveToGalleryModal.darkOptionText
                            ]}>
                                {saveToGallery ? "Saving to Gallery" : "Not Saving to Gallery"}
                            </Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default SaveToGalleryModal; 