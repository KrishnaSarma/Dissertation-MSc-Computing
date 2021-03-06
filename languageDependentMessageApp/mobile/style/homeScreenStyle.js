import {StyleSheet} from "react-native";
import {primaryColor, secondaryColor} from "../constants";

export const homeStyles = StyleSheet.create({
    container: {
        backgroundColor: primaryColor
    },
    content: {
        justifyContent: "space-around",
        alignSelf: "center",
        height: "80%",
        width: "90%"
    },
    button: {
        height: "60%",
        width: "65%",
        justifyContent: "center",
        alignSelf: "center", 
        alignItems: 'center',
        backgroundColor: secondaryColor,
        borderRadius: 50
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 22
    },
    titleText: {
        color: secondaryColor,
        fontSize: 70,
        fontWeight: "bold",
        textAlign: "center"
    },
    appNameText: {
        color: secondaryColor,
        marginBottom: 30,
        fontSize: 65,
        // fontStyle: "italic",
        fontWeight: "bold",
        textAlign: "center"
    }
})