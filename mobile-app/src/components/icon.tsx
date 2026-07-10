import { Image } from "react-native";

export function BackIcon() {

    return (
        <Image
            source={require('@/assets/images/previous1.png')}
            style={{ width: 24, height: 24 }}
        />
    );
}