import React from "react";
import { StyleProp, StyleSheet, Vibration, View, ViewStyle } from "react-native";

import CircleButton from "./CircleButton";

interface Props {
    inputs: number[];
    radius: number;
    onChanged: (time: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}
export default function TimeSelect(props: Props) {
    return (
        <View style={StyleSheet.compose({ marginRight: 40 }, props.containerStyle)}>
            {props.inputs.map((num, i) => {
                const angleDeg = i * (360 / props.inputs.length) - 90;
                const angleRad = angleDeg * (Math.PI / 180);

                return (
                    <CircleButton
                        key={i}
                        style={StyleSheet.compose(
                            {
                                backgroundColor: "white",
                                width: 48,
                                height: 48,
                                position: "absolute",
                                left: Math.cos(angleRad) * props.radius,
                                top: Math.sin(angleRad) * props.radius,
                            },
                            props.buttonStyle,
                        )}
                        textStyle={{ fontSize: 20 }}
                        onPress={() => {
                            Vibration.vibrate(50);
                            props.onChanged(
                                num.toString().length === 1 ? "0" + num : num.toString(),
                            );
                        }}
                    >
                        {num}
                    </CircleButton>
                );
            })}
        </View>
    );
}
