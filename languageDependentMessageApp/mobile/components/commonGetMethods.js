
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import firebase from "react-native-firebase";

import {ipAddress} from "../constants";

export const getUserLanguage = async () => {
    try{
        return await AsyncStorage.getItem("language")
    }
    catch(e){
        console.log(e);
    }
}

export const getUserTopicName = async () => {
    try{
        return await AsyncStorage.getItem("fcmTopicName")
    }
    catch(e){
        console.log(e);
    }
}

export const getUserEmail = async () => {
    try{
        return await AsyncStorage.getItem("email")
    }
    catch(e){
        console.log(e);
    }
}

export const getUsername = async () => {
    try{
        return await AsyncStorage.getItem("username")
    }
    catch(e){
        console.log(e);
    }
}

export const getAvailableLanguages = () => {
    return new Promise( (resolve,reject) => {
        axios.get("http://"+ipAddress+":3000/getLanguages")
        .then((response) => {
            console.log("languages response", response.data);
            resolve(response.data)
            
        })
        .catch(err => {
            reject('getting language error')
            if (err.status == 500){
                alert("Internal server error. Please try again.", [{
                    text: "Okay"
                }])
            }
            else{
                alert(err, [{
                    text: "Okay"
                }])
            }
          });
        }); 
}