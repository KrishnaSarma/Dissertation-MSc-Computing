import {StyleSheet} from "react-native";
import {primaryColor, secondaryColor} from "../constants";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: primaryColor
    },
    content: {
        justifyContent: "space-around",
        alignSelf: "center",
        height: "80%",
        width: "90%"
    },
    icon: {
        width: 150,
        height: 150,
        alignSelf: "center"
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