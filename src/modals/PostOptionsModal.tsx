import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Pressable, Alert, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesPostOptionsModal from '../styles/modals/StylesPostOptionsModal';

interface PostOptionsModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDelete: () => void;
    isDarkMode: boolean;
}

const PostOptionsModal: React.FC<PostOptionsModalProps> = ({
    isVisible,
    onClose,
    onDelete,
    isDarkMode
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

    const handleDelete = () => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        onDelete();
                        handleClose();
                    },
                    style: "destructive"
                }
            ]
        );
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
                    stylesPostOptionsModal.modalContainer,
                    { opacity: fadeAnim }
                ]}
            >
                <Pressable 
                    style={stylesPostOptionsModal.modalOverlay}
                    onPress={handleClose}
                />
                <Animated.View 
                    style={[
                        stylesPostOptionsModal.modalContent,
                        isDarkMode && stylesPostOptionsModal.darkModalContent,
                        {
                            transform: [
                                { translateY: Animated.add(slideAnim, pan.y) }
                            ]
                        }
                    ]}
                    {...panResponder.panHandlers}
                >
                    <Pressable 
                        style={stylesPostOptionsModal.indicatorContainer}
                        onPress={handleClose}
                    >
                        <View style={[
                            stylesPostOptionsModal.indicator,
                            isDarkMode && stylesPostOptionsModal.darkIndicator
                        ]} />
                    </Pressable>
                    
                    <Pressable
                        style={({ pressed }) => [
                            stylesPostOptionsModal.optionButton,
                            stylesPostOptionsModal.deleteButton,
                            isDarkMode && stylesPostOptionsModal.darkDeleteButton,
                            pressed && stylesPostOptionsModal.pressedDeleteButton
                        ]}
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash-outline" size={24} color="#ff3b30" />
                        <Text style={stylesPostOptionsModal.deleteText}>
                            Delete
                        </Text>
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default PostOptionsModal; 