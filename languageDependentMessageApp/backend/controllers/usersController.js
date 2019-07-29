import users from '../models/UsersDb';

export const findAll = (request, response) => {
    console.log("users request", request.query)
    users.find({})
        .then(users => {
            let username = []
            for(var user of users){
                if(user.email == request.query.username){
                    continue
                }
                else{
                    username.push(user.email)
                }
            }
            return response.status(201).json({username})
        })
}