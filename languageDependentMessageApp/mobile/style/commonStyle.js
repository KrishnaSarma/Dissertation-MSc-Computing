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
    },
    button: {
        marginTop: 20,
        height: 50,
        width: "50%",
        justifyContent: "center",
        alignSelf: "center", 
        alignItems: 'center',
        backgroundColor: secondaryColor,
        borderRadius: 25
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 22
    },
})