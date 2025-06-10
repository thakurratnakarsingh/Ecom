import { NativeModules ,Platform} from 'react-native';


interface CameraModuleType {
  launchCamera(): Promise<string>;
}

const { CameraModule } = NativeModules;

export default CameraModule as CameraModuleType;
