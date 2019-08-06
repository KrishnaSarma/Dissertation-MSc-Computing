import request from "request";
import uuidv4 from "uuid/v4";

export const getLanguages = async (req, response) => {
    let options = {
        method: 'GET',
        baseUrl: 'https://api.cognitive.microsofttranslator.com/',
        url: 'languages',
        qs: {
          'api-version': '3.0',
        },
        headers: {
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        json: true,
    };

    request(options, function(err, res, body){
        // console.log(JSON.stringify(body, null, 4));

        // console.log("json body", body.dictionary)
        // let languages = []

        // for (var lang of body.dictionary){
        //     languages.push(lang.name)
        // }

        // console.log("languages list", languages)
        return response.status(201).json({body})
    });

    
}

export const translateText = (message, finalLanguage) => {
    return new Promise( (resolve,reject) => {
        const subscriptionKey = "3f9c828f2abc46359519882f4a0e96ad"

        let options = {
            method: 'POST',
            baseUrl: 'https://api.cognitive.microsofttranslator.com/',
            url: 'translate',
            qs: {
            'api-version': '3.0',
            'to': [finalLanguage]
            },
            headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
            },
            body: [{
                'text': message
            }],
            json: true,
        };

        request(options, function(err, res, body){

            console.log("2 json body", body)

            console.log("3 body", JSON.stringify(body, null, 4));

            console.log("err translator", err);

        
                if(!err){
                    resolve((body[0].translations[0].text))

                }
                if(err){
                    reject('error')
                }
            }) 
    });
}