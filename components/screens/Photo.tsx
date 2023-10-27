import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import React from "react";
import { View, Image, StyleSheet, Text, ScrollView } from "react-native";

import { Navigation, NavigationParamMap } from "../../App";
import Button from "../Button";

export default function Photo() {
    const { params } = useRoute<RouteProp<NavigationParamMap, "Photo">>();
    const { navigate } = useNavigation<Navigation>();

    async function deletePhoto() {
        await MediaLibrary.deleteAssetsAsync([params.asset.id]);
        navigate("Gallery");
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
                <Button title="DELETE" onPress={deletePhoto} />
                <Button title="SHARE" onPress={() => Sharing.shareAsync(params.asset.uri)} />
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
