import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import MapView, { Marker } from "react-native-maps";

import { NavigationStackParamList } from "../../App";

export default function Map() {
    const { params } = useRoute<RouteProp<NavigationStackParamList, "Map">>();

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
                latitude: params.positions[0].coords.latitude,
                longitude: params.positions[0].coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            }}
        >
            {params.positions.map((position, index) => (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }}
                />
            ))}
        </MapView>
    );
}
