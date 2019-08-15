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