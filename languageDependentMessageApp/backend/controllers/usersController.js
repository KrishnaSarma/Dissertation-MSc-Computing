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
        })
}

export const getUserLanguage = async (userEmail) => {

    // todo: do error handling here

    let language = ""

    await users.findOne({email: userEmail})
    .then( (user) => {
        console.log("2 user", user)
        console.log("2.1 language", user.language, typeof(user.language))
        language = user.language
    })
    .catch( (err) => {
        console.log("err", err)
    })    
    return language
}