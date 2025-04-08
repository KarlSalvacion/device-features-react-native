declare module 'expo-camera' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface CameraProps extends ViewProps {
    type: any;
    ref: any;
  }

  export class Camera extends Component<CameraProps> {
    static Constants: {
      Type: {
        back: number;
        front: number;
      };
    };
  }
} 