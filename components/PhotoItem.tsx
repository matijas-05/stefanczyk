import { useNavigation } from "@react-navigation/native";
import { Asset, AssetRef } from "expo-media-library";
import React from "react";
import { Image, Pressable, StyleSheet, useWindowDimensions } from "react-native";

import { Navigation } from "../App";

interface Props {
    asset: Asset;
    n: number;
    selected: AssetRef[];
    setSelected: (newSelected: AssetRef[]) => void;
}
export default function PhotoItem(props: Props) {
    const dimensions = useWindowDimensions();
    const { navigate } = useNavigation<Navigation>();

    const size = dimensions.width / props.n;
    const isSelected = props.selected.includes(props.asset.id);

    function onPress() {
        if (isSelected) {
            props.setSelected(props.selected.filter((id) => id !== props.asset.id));
        } else if (props.selected.length > 0) {
            props.setSelected([...props.selected, props.asset.id]);
        } else if (props.selected.length === 0) {
            navigate("Photo", { asset: props.asset });
        }
    }
    function onLongPress() {
        if (props.selected.length === 0) {
            props.setSelected([...props.selected, props.asset.id]);
        }
    }

    return (
        <Pressable style={styles.container} onPress={onPress} onLongPress={onLongPress}>
            <Image
                style={[
                    { width: size },
                    { height: size },
                    isSelected ? { opacity: 0.25 } : { opacity: 1 },
                ]}
                source={{ uri: props.asset.uri }}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    selection: {
        position: "absolute",
        top: 0,
        right: 0,
        color: "white",
        fontSize: 32,
        opacity: 1,
    },
});
