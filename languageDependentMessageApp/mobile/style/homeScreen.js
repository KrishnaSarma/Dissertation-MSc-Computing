import {StyleSheet} from "react-native";

export const homeStyles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignSelf: "center"
    },
    backgroundImage : {
        resizeMode: 'cover',
        justifyContent: "center",
        width: "100%",
        height: "100%"
    },
    button: {
        height: "60%",
        width: "65%",
        justifyContent: "center",
        alignSelf: "center", 
        alignItems: 'center',
        backgroundColor: "#c5c4c4",
        borderRadius: 50
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 22
    },
    titleText: {
        color: "#c5c4c4",
        margin: 20,
        fontSize: 70,
        fontWeight: "bold",
        textAlign: "center"
    },
    appNameText: {
        color: "#FD817D",
        margin: 10,
        fontSize: 65,
        fontStyle: "italic",
        fontWeight: "bold",
        textAlign: "center"
    }
})