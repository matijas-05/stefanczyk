import { AssetRef } from "expo-media-library";
import React from "react";
import { Image, Pressable, StyleSheet, useWindowDimensions, Text } from "react-native";

interface Props {
    id: AssetRef;
    uri: string;
    n: number;
    selected: AssetRef[];
    setSelected: (newSelected: AssetRef[]) => void;
}
export default function PhotoItem(props: Props) {
    const dimensions = useWindowDimensions();
    const size = dimensions.width / props.n;
    const isSelected = props.selected.includes(props.id);

    function onPress() {
        if (isSelected) {
            props.setSelected(props.selected.filter((id) => id !== props.id));
        } else if (props.selected.length > 0) {
            props.setSelected([...props.selected, props.id]);
        } else if (props.selected.length === 0) {
            alert("open photo");
        }
    }
    function onLongPress() {
        if (props.selected.length === 0) {
            props.setSelected([...props.selected, props.id]);
        }
    }

    return (
        <Pressable style={styles.container} onPress={onPress} onLongPress={onLongPress}>
            <Image
                style={[
                    {
                        width: size,
                    },
                    {
                        height: size,
                    },
                    isSelected ? { opacity: 0.25 } : { opacity: 1 },
                ]}
                source={{ uri: props.uri }}
            />
            {/* <Text style={[styles.selection, isSelected ? { opacity: 1 } : { opacity: 0 }]}>+</Text> */}
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
