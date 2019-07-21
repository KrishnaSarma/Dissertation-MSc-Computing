import users from '../models/UsersDb';
import { type } from 'os';

export const login = (req, response) => {
    var username = req.body.username;
    var password = req.body.password;
    users.findOne({email: username})
    .then((user)=>{
        if(user){
            if (user.password == password){       
                return response.status(201).json({
                    signin: true
                });
            }
        }
        return response.status(404).json({
            signin: false
        });
    }).catch((err)=>{
        return response.status(500).json({
            data: "Internal server error!"
        });
    })
    
}

export const signup = (req, response) => {
    var username = req.body.username;
    var password = req.body.password;
    newUser = new users()
    users.findOne({email: username})
    .then((user)=>{
        if(user){
            if (user.password == password){       
                return response.status(201).json({
                    signin: true
                });
            }
        }
        return response.status(404).json({
            signin: false
        });
    }).catch((err)=>{
        return response.status(500).json({
            data: "Internal server error!"
        });
    })
    
}

// The login function will login the user if the email id is present
// and if not, it will add new email id to the db.


// login function

// export const login = (req, res) => {

//  add google authentication  

// const { errors, isValid } = validateLoginInput(req.body);
// 
// }  