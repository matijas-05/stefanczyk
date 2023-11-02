import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { Navigation } from "../../App";
import { Config } from "../../config";
import Button from "../Button";
import PhotoItem from "../PhotoItem";

export default function Gallery() {
    const [assets, setAssets] = useState<MediaLibrary.PagedInfo<MediaLibrary.Asset>>();
    const [cols, setCols] = useState(4);
    const [selected, setSelected] = useState<MediaLibrary.AssetRef[]>([]);
    const navigation = useNavigation<Navigation>();

    useEffect(() => {
        (async () => {
            await MediaLibrary.requestPermissionsAsync();
            refreshGallery();
        })();
    }, []);
    useFocusEffect(() => {
        refreshGallery();
    });

    async function refreshGallery() {
        const album = await MediaLibrary.getAlbumAsync("DCIM");
        setAssets(await MediaLibrary.getAssetsAsync({ album }));
    }

    async function deleteSelected() {
        await MediaLibrary.deleteAssetsAsync(selected);
        setSelected([]);
        refreshGallery();
    }
    async function uploadSelected() {
        const fd = new FormData();
        selected.forEach((id) => {
            const asset = assets?.assets.find((a) => a.id === id)!;
            // @ts-expect-error
            fd.append("photo", {
                uri: asset.uri,
                type: "image/jpg",
                name: asset.filename,
            });
        });

        const res = await fetch(`${await Config.getApiUrl()}/image`, {
            method: "POST",
            body: fd,
        });
        if (res.ok) {
            alert("Photos uploaded successfully!");
        } else {
            alert("Something went wrong!");
        }

        setSelected([]);
    }

    return (
        <View>
            <View style={styles.buttons}>
                <Button title="LAYOUT" onPress={() => setCols(cols === 4 ? 1 : 4)} />
                <Button title="CAMERA" onPress={() => navigation.navigate("Camera")} />
                <Button title="DELETE" onPress={deleteSelected} disabled={selected.length === 0} />
                <Button title="UPLOAD" onPress={uploadSelected} disabled={selected.length === 0} />
                <Button title="CONFIG" onPress={() => navigation.navigate("Settings")} />
            </View>

            <View>
                <FlatList
                    key={cols}
                    data={assets?.assets}
                    numColumns={cols}
                    renderItem={({ item }) => (
                        <PhotoItem
                            asset={item}
                            n={cols}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttons: {
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 6,
    },
});
