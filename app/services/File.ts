// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from 'react-native';
import { ShareSingleOptions } from 'react-native-share';
import ImagePicker, {
  Image as ImagePickerImage,
  Options as ImagePickerOptions,
} from 'react-native-image-crop-picker';
import { PERMISSIONS, request } from 'react-native-permissions';

export type FileType = Partial<Omit<ImagePickerImage, 'size'>>;

export type ShareOption = ShareSingleOptions & { isBase64?: boolean };

// interface DownloadOptions {
//   url: string;
//   filename?: string;
//   openFile?: boolean;
//   isImage?: boolean;
// }

export type TakeCameraOptions = ImagePickerOptions;
export type PickImageOptions = ImagePickerOptions;
export interface PickFileOptions {
  multiple?: boolean;
}
export type ProgressCallback = (progress: number, total: number) => any;

class File {
  askWritePermission = async () => {
    if (Platform.OS !== 'android') {
      return;
    }
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (response !== 'granted') {
      throw new Error('PERMISSION_REQUEST_FAILED');
    }

    return response;
  };

  askReadPermission = async () => {
    if (Platform.OS !== 'android') {
      return;
    }
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (response !== 'granted') {
      throw new Error('PERMISSION_REQUEST_FAILED');
    }

    return response;
  };

  private _extractFileNameFromPath = (path: string) => {
    const splitFromPath = /\w+.\w+$/.exec(path);
    return splitFromPath?.[0]
      ? splitFromPath[0]
      : Math.random().toString(36) + '.png';
  };

  // takeCamera = async (options: TakeCameraOptions): Promise<FileType[]> => {
  //   if (Platform.OS === 'android') {
  //     const status = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //     );
  //
  //     if (status !== 'granted') {
  //       throw new Error('PERMISSION_REQUEST_FAILED');
  //     }
  //   }
  //
  //   const result = await ImagePicker.openCamera(options);
  //
  //   const output: FileType[] = [];
  //
  //   if (Array.isArray(result)) {
  //     result.forEach((image) => {
  //       const i: FileType = {
  //         ...image,
  //         name: image.filename || this._extractFileNameFromPath(image.path),
  //         size: image.size + '',
  //         type: image.mime || '*/*',
  //         uri: image.path,
  //       };
  //
  //       output.push(i);
  //     });
  //   } else {
  //     const i: FileType = {
  //       ...result,
  //       name: result.filename || this._extractFileNameFromPath(result.path),
  //       size: result.size + '',
  //       type: result.mime || '*/*',
  //       uri: result.path,
  //     };
  //
  //     output.push(i);
  //   }
  //
  //   return output;
  // };

  pickImage = async (
    options: PickImageOptions & {
      changeFileNameExtensionFromHEICToJpg?: boolean;
      onPermissionLimited?: () => any;
    },
  ): Promise<FileType[]> => {
    const permissionResponse = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        default: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      }),
    );

    if (permissionResponse !== 'granted') {
      if (permissionResponse === 'limited' && options.onPermissionLimited) {
        options.onPermissionLimited();
      } else {
        throw new Error(
          'Yêu cầu cấp quyền cho ứng Loigiai.com để lấy ảnh từ thư viện!',
        );
      }
    }

    const pick = await ImagePicker.openPicker(options);

    const output: FileType[] = [];

    const renameImage = (image: FileType) => {
      image.filename = (image.filename || '').split('.HEIC')[0];
      image.name = (image.name || '').split('.HEIC')[0];
      return image;
    };

    if (Array.isArray(pick)) {
      pick.forEach((image) => {
        if (!image) {
          return;
        }
        let i: FileType = {
          ...image,
          uri: image.path,
          type: image.mime || '*/*',
          size: image.size + '',
          name: image.filename || this._extractFileNameFromPath(image.path),
        };

        if (options.changeFileNameExtensionFromHEICToJpg) {
          i = renameImage(i);
        }

        output.push(i);
      });
    } else {
      let i: FileType = {
        ...pick,
        uri: pick.path,
        type: pick.mime || '*/*',
        size: pick.size,
        name: pick.filename || this._extractFileNameFromPath(pick.path),
      };

      if (options.changeFileNameExtensionFromHEICToJpg) {
        i = renameImage(i);
      }

      output.push(i);
    }

    return output;
  };

  /**
   * @todo: Support Video here
   * @param options
   */
  // download = async (options: DownloadOptions) => {
  //   const { config, fs, android } = RNFetchBlob;
  //   await this.askWritePermission();
  //
  //   const mimeType = mime.getType(options.filename || options.url) || '';
  //
  //   if (Platform.OS === 'ios') {
  //     if (mimeType.startsWith('image')) {
  //       return await CameraRoll.saveToCameraRoll(options.url);
  //     }
  //
  //     return Linking.openURL(options.url);
  //   }
  //
  //   const filename = options.filename || /[\w.]+$/.exec(options.url);
  //
  //   const download = await config({
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       path: fs.dirs.DownloadDir + '/' + filename,
  //       mediaScannable: true,
  //     },
  //     overwrite: true,
  //   }).fetch('GET', options.url);
  //
  //   if (options.openFile && Platform.OS === 'android') {
  //     android.actionViewIntent(download.path(), mimeType);
  //   }
  //   if (Platform.OS === 'android') {
  //     await fs.scanFile([{ path: download.path(), mime: mimeType }]);
  //   }
  //
  //   return download;
  // };
}

export default new File();
