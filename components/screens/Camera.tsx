import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType, Camera as ExpoCamera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import CircleButton from "../CircleButton";
import Settings from "../Settings";

export default function Camera() {
    const [status] = ExpoCamera.useCameraPermissions({ request: true });
    const cameraRef = useRef<ExpoCamera>(null);
    const [cameraType, setCameraType] = useState(CameraType.back);
    const [settingsOpen, setSettingsOpen] = useState(false);

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
            <ExpoCamera ref={cameraRef} style={{ aspectRatio: 9 / 11 }} type={cameraType}>
                <Settings open={settingsOpen} setOpen={setSettingsOpen} />
                <View style={styles.buttons}>
                    <CircleButton
                        icon={<Ionicons name="settings" size={32} color="white" />}
                        onPress={() => setSettingsOpen(!settingsOpen)}
                    />
                    <CircleButton
                        icon={<Ionicons name="camera" size={48} color="white" />}
                        onPress={takePicture}
                        style={{ width: 80, height: 80 }}
                    />
                    <CircleButton
                        icon={<Ionicons name="camera-reverse" size={32} color="white" />}
                        onPress={switchCamera}
                    />
                </View>
            </ExpoCamera>
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
