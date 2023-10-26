import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import Button from "../Button";
import PhotoItem from "../PhotoItem";

export default function Gallery() {
    const [assets, setAssets] = useState<MediaLibrary.PagedInfo<MediaLibrary.Asset>>();
    const [cols, setCols] = useState(4);

    useEffect(() => {
        (async () => {
            await MediaLibrary.requestPermissionsAsync();
            refreshGallery();
        })();
    }, []);

    async function refreshGallery() {
        setAssets(await MediaLibrary.getAssetsAsync());
    }

    return (
        <View>
            <View style={styles.buttons}>
                <Button title="LAYOUT" onPress={() => setCols(cols === 4 ? 1 : 4)} />
                <Button title="CAMERA" onPress={() => false} />
                <Button title="DELETE" onPress={() => false} />
            </View>

            <View>
                <FlatList
                    key={cols}
                    data={assets?.assets}
                    numColumns={cols}
                    renderItem={({ item }) => <PhotoItem uri={item.uri} n={cols} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttons: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 16,
    },
});
