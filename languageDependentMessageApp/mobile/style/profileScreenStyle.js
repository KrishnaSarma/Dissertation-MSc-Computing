import {StyleSheet} from "react-native";
import {primaryColor, secondaryColor, disabledColor} from "../constants";

export const profileStyles = StyleSheet.create({
    content: {
        // backgroundColor: "blue"
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
    picture: {
        height: 150,
        width: 150,
        borderRadius: 75,
        alignSelf: "center",
        marginTop: 40,
        marginBottom: 40
    },
    input: {
        flex: 2, 
        borderLeftWidth: 0.2
    },
    text: {
        flex: 1, 
        marginLeft: 15, 
        fontSize: 22
    },
    list: {
        marginTop: 20
    },
    listItemText: {
        fontSize: 18
    }
})