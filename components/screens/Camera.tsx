import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType, Camera as ExpoCamera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import CircleButton from "../CircleButton";
import Settings, { CameraSettings } from "../Settings";

export default function Camera() {
    const [status] = ExpoCamera.useCameraPermissions({ request: true });
    const cameraRef = useRef<ExpoCamera>(null);

    const [cameraType, setCameraType] = useState(CameraType.back);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<CameraSettings>({
        whiteBalance: "auto",
        flashMode: "auto",
        cameraRatio: "1:1",
        pictureSize: "",
    });
    const [ratios, setRatios] = useState<string[]>([]);
    const [pictureSizes, setPictureSizes] = useState<string[]>([]);

    const prevRatio = useRef(settings.cameraRatio);

    async function onCameraReady() {
        setRatios((await cameraRef.current?.getSupportedRatiosAsync()) ?? []);

        const sizes = await cameraRef.current!.getAvailablePictureSizesAsync(settings.cameraRatio);
        setPictureSizes(sizes);
        setSettings({ ...settings, pictureSize: sizes[0] });
    }
    async function onSettingsChanged(settings: CameraSettings) {
        if (prevRatio.current !== settings.cameraRatio) {
            const sizes = await cameraRef.current!.getAvailablePictureSizesAsync(
                settings.cameraRatio,
            );
            setPictureSizes(sizes);
            setSettings({ ...settings, pictureSize: sizes[0] });
        } else {
            setSettings(settings);
        }
        prevRatio.current = settings.cameraRatio;
    }
    function getCSSRatio() {
        const a = settings.cameraRatio.split(":")[1];
        const b = settings.cameraRatio.split(":")[0];
        return Number(a) / Number(b);
    }

    async function takePicture() {
        const picture = await cameraRef.current?.takePictureAsync({ isImageMirror: false });
        MediaLibrary.createAssetAsync(picture!.uri);
    }
    function switchCamera() {
        setCameraType(cameraType === CameraType.front ? CameraType.back : CameraType.front);
    }

    if (status?.granted === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <ExpoCamera
                ref={cameraRef}
                onCameraReady={onCameraReady}
                style={{
                    aspectRatio: getCSSRatio(),
                }}
                type={cameraType}
                whiteBalance={ExpoCamera.Constants.WhiteBalance[settings.whiteBalance]}
                flashMode={ExpoCamera.Constants.FlashMode[settings.flashMode]}
                ratio={settings.cameraRatio}
                pictureSize={settings.pictureSize !== "" ? settings.pictureSize : undefined}
            >
                <View style={styles.buttons}>
                    <CircleButton
                        icon={<Ionicons name="camera-reverse" size={32} color="white" />}
                        onPress={switchCamera}
                    />
                    <CircleButton
                        icon={<Ionicons name="camera" size={48} color="white" />}
                        onPress={takePicture}
                        style={{ width: 80, height: 80 }}
                    />
                    <CircleButton
                        icon={<Ionicons name="settings" size={32} color="white" />}
                        onPress={() => setSettingsOpen(!settingsOpen)}
                    />
                </View>
            </ExpoCamera>

            <Settings
                open={settingsOpen}
                setOpen={setSettingsOpen}
                settings={settings}
                setSettings={onSettingsChanged}
                values={{
                    whiteBalance: Object.keys(ExpoCamera.Constants.WhiteBalance),
                    flashMode: Object.keys(ExpoCamera.Constants.FlashMode),
                    cameraRatio: ratios,
                    pictureSize: pictureSizes,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    buttons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
});
