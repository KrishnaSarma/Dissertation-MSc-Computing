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

export const getUsername = async (userEmail) => {
    let username = "";
    await users.findOne({email: userEmail})
    .then((user) => {
        username = user.username
    })
    .catch( (err) => {
        console.log("Error finding user by email", err)
    })    
    return username
}

export const changePassword = (request, response) => {
        
        var email= request.body.email
        var oldPassword = request.body.currentPassword
        var newPassword = request.body.newPassword

        users.findOneAndUpdate(
            {
                $and:[{"email": email},{"password": oldPassword}]
            },
            {
                password: newPassword
            },
            {
                new: true
            })
            .then(usr => {
                if(usr){
                    return response.status(201).json({
                        passwordChanged: true
                    });
                }
                else{
                    return response.status(404).json({
                        passwordChanged: false
                    });
                }
            })
            .catch((err)=>{
                console.log("Error", err)
                return response.status(500).json({
                    data: "Internal server error!"
                });
            })
}

export const saveUserDetails = (request, response) => {
        
    var email = request.body.prevEmail
    var newEmail = request.body.newEmail
    var newUsername = request.body.newUsername
    var newLanguage = request.body.newLanguage

    users.findOneAndUpdate(
        {
            email: email
        },
        {
            username: newUsername,
            email: newEmail,
            language: newLanguage
        },
        {
            new: true
        })
        .then(usr => {
            console.log("usr", usr)
            if(usr){
                return response.status(201).json({
                    changesSaved: true,
                    topicName: usr.topicName
                });
            }
            else{
                return response.status(404).json({
                    changesSaved: false
                });
            }
        })
        .catch((err)=>{
            console.log("Error", err)
            return response.status(500).json({
                data: "Internal server error!"
            });
        })
}

export const getUserData = (req, response) => {
    console.log("getUserData", req.query)
    var email = req.query.email;
    users.findOne({email: email})
    .then((user)=>{
        if(user){
            if (user){
                console.log("user", user)       
                return response.status(201).json({
                    topicName: user.topicName,
                    username: user.username,
                    language: user.language
                });
            }
        }
        return response.status(404).json({
            signin: false
        });
    }).catch((err)=>{
        console.log("Error authenticating", err)
        return response.status(500).json({
            data: "Internal server error!"
        });
    })
    
}

export const addUserData = (req, response) => {
    console.log("server add user data", req.body)
    var username = req.body.username;
    var email = req.body.email;
    var language = req.body.language
    var topicName = email.replace("@","_")
    var newUser = new users({
        email: email,
        username: username,
        language: language,
        topicName: topicName
    })
    newUser.save()
    .then((res)=>{
        if(res){
            console.log(res)
            return response.status(201).json({
                topicName: res.topicName
            })
        }        
    }).catch((err)=>{
        console.log("Error authenticating", err)
        return response.status(500).json({
            data: "Internal server error!"
        });
    })
    
}