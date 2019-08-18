import {StyleSheet} from "react-native";
import {primaryColor, secondaryColor, disabledColor} from "../constants";

export const profileStyles = StyleSheet.create({
    
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