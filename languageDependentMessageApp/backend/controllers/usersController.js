import users from '../models/UsersDb';

export const findAll = (request, response) => {
    console.log("users request", request.query)
    users.find({})
        .then(users => {
            let username = []
            for(var user of users){
                if(user.email == request.query.email){
                    continue
                }
                else{
                    username.push({
                        username: user.username,
                        email: user.email
                    })
                }
            }
            console.log("username", username)
            return response.status(201).json(username)
        }).catch((err)=>{
            console.log("Error getting all users", err)
            return response.status(500).json({
                data: "Internal server error!"
            });
        })
}

export const getUserLanguage = async (userEmail) => {

    // todo: do error handling here

    let language = ""

    await users.findOne({email: userEmail})
    .then( (user) => {
        language = user.language
    })
    .catch( (err) => {
        console.log("Error finding user by email", err)
    })    
    return language
}

export const getUserTopicName = async (userEmail) => {

    // todo: do error handling here

    let topicName = ""

    await users.findOne({email: userEmail})
    .then( (user) => {
        topicName = user.topicName
    })
    .catch( (err) => {
        console.log("Error finding user by email", err)
    })    
    return topicName
}