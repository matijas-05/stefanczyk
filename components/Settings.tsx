import React, { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, Animated, useAnimatedValue, Dimensions, ScrollView } from "react-native";

import RadioGroup from "./RadioGroup";

const OPENED = 0;
const CLOSED = -Dimensions.get("window").width / 2;

export interface CameraSettings {
    whiteBalance: string;
    flashMode: string;
    cameraRatio: string;
    pictureSize: string;
}

interface Props {
    open: boolean;
    setOpen: (enabled: boolean) => void;
    settings: CameraSettings;
    setSettings: (settings: CameraSettings) => void;
    values: Record<keyof CameraSettings, string[]>;
}
export default function Settings(props: Props) {
    const pos = useAnimatedValue(CLOSED);

    useEffect(() => {
        Animated.spring(pos, {
            toValue: props.open ? OPENED : CLOSED,
            velocity: 1,
            tension: 0,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, [props.open]);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateX: pos }] }]}>
            <ScrollView>
                <Text style={styles.h1}>SETTINGS</Text>

                <Text style={styles.h2}>WHITE BALANCE</Text>
                <RadioGroup
                    options={props.values.whiteBalance}
                    selected={props.settings.whiteBalance}
                    setSelected={(selected) =>
                        props.setSettings({ ...props.settings, whiteBalance: selected })
                    }
                />

                <Text style={styles.h2}>FLASH MODE</Text>
                <RadioGroup
                    options={props.values.flashMode}
                    selected={props.settings.flashMode}
                    setSelected={(selected) =>
                        props.setSettings({ ...props.settings, flashMode: selected })
                    }
                />

                <Text style={styles.h2}>CAMERA RATIO</Text>
                <RadioGroup
                    options={props.values.cameraRatio}
                    selected={props.settings.cameraRatio}
                    setSelected={(selected) =>
                        props.setSettings({ ...props.settings, cameraRatio: selected })
                    }
                />

                <Text style={styles.h2}>PICTURE SIZE</Text>
                <RadioGroup
                    options={props.values.pictureSize}
                    selected={props.settings.pictureSize}
                    setSelected={(selected) =>
                        props.setSettings({ ...props.settings, pictureSize: selected })
                    }
                />
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        opacity: 0.5,
        padding: 16,
        position: "absolute",
        top: 0,
        height: Dimensions.get("window").height,
    },
    h1: {
        fontWeight: "bold",
        fontSize: 30,
    },
    h2: {
        fontWeight: "bold",
        fontSize: 20,
        color: "yellow",
    },
});
