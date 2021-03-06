import {StyleSheet} from "react-native";
import {primaryColor, secondaryColor} from "../constants";

export const chatScreen = StyleSheet.create({
    senderMessage: {
        borderRadius: 10,
        backgroundColor: "#bfa7a7",
        alignSelf: "flex-end",
        margin: 10,
        maxWidth: "70%"
    },
    recieverMessage: {
        borderRadius: 10,
        backgroundColor: "#eee8e8",
        alignSelf: "flex-start",
        margin: 10,
        maxWidth: "70%"
    },
    typeInput: {
        position: "absolute",
        width: "100%",
        height: "100%",
        bottom: 0,
        flex: 1,
        justifyContent: 'flex-end',
        borderTopWidth: 2
    }
})