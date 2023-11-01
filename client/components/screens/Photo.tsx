import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import React from "react";
import { View, Image, StyleSheet, Text, ScrollView } from "react-native";

import { Navigation, NavigationParamMap } from "../../App";
import { Config } from "../../config";
import Button from "../Button";

export default function Photo() {
    const { params } = useRoute<RouteProp<NavigationParamMap, "Photo">>();
    const { navigate } = useNavigation<Navigation>();

    async function deletePhoto() {
        await MediaLibrary.deleteAssetsAsync([params.asset.id]);
        navigate("Gallery");
    }
    async function uploadPhoto() {
        const fd = new FormData();
        // @ts-expect-error
        fd.append("photo", {
            uri: params.asset.uri,
            type: "image/jpg",
            name: params.asset.filename,
        });

        const res = await fetch(`${Config.getApiUrl()}/upload`, {
            method: "POST",
            body: fd,
        });
        if (res.ok) {
            alert("Photo uploaded successfully!");
        } else {
            alert("Something went wrong!");
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                style={{
                    width: "95%",
                    aspectRatio: params.asset.width / params.asset.height,
                }}
                source={{ uri: params.asset.uri }}
            />
            <Text style={styles.dimensions}>
                {params.asset.width}x{params.asset.height}
            </Text>

            <View style={styles.buttons}>
                <Button title="SHARE" onPress={() => Sharing.shareAsync(params.asset.uri)} />
                <Button title="DELETE" onPress={deletePhoto} />
                <Button title="UPLOAD" onPress={uploadPhoto} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 12,
        flex: 1,
        gap: 16,
    },
    buttons: {
        position: "absolute",
        bottom: 16,
        flexDirection: "row",
        gap: 16,
        paddingHorizontal: 16,
    },
    dimensions: {
        fontSize: 32,
    },
});
