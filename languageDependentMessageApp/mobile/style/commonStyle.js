import {StyleSheet} from "react-native";
import {primaryColor, secondaryColor} from "../constants";

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignSelf: "center"
    },
    header: {
        backgroundColor: primaryColor
    }
})