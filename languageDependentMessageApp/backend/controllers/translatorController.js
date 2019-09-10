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

        if(!err){
            let languages = []

            for (var lang in body.dictionary){
                languages.push({
                    name: body.dictionary[lang].name,
                    code: lang
                })
            }  

            return response.status(201).json(languages)
        }
        else{
            console.log("API Language fetch error")
            return response.status(500).json({
                data: "Internal server error!"
            });
        }        
    });

    
}

export const translateText = (message, sourceLanguage, finalLanguage) => {
    return new Promise( (resolve,reject) => {
        const subscriptionKey = "0dfd1f5047ef4aa580c01a1a8a231f82"

        let options = {
            method: 'POST',
            baseUrl: 'https://api.cognitive.microsofttranslator.com/',
            url: 'translate',
            qs: {
            'api-version': '3.0',
            'from': sourceLanguage,
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
        
            if(!err){
                resolve((body[0].translations[0].text))

            }
            else{
                console.log("Translation error", err);
                reject('Translation error')
            }
        }) 
    });
}