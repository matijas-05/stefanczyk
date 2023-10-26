import React from "react";
import { Image, useWindowDimensions } from "react-native";

interface Props {
    uri: string;
    n: number;
}
export default function PhotoItem({ uri, n }: Props) {
    const dimensions = useWindowDimensions();
    const size = dimensions.width / n;

    return (
        <Image
            style={{
                width: size,
                height: size,
            }}
            source={{ uri }}
        />
    );
}
