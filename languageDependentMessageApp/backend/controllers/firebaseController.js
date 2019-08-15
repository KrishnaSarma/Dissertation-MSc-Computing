import FCM from "fcm-node";
import serverKey from 'C:\\Users\\sarma\\Desktop\\mychatapp-df2b0-firebase-adminsdk-t0oco-fe71130fff.json'

var fcm = new FCM(serverKey)

export const sendNotification = (sender, recieverTopic, message) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: "/topics/"+recieverTopic,
        
        notification: {
            title: sender, 
            body: message 
        },
        
        data: {  //you can send only notification or only data(or include both)
            sender: message
        }
    }
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong with notification!", err)
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}



