require('dotenv').config()
const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const { error } = require('console');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.TOKEN;
const OBJECT_TYPE = process.env.OBJECT_TYPE

const rootAPI = "https://api.hubapi.com";

const headers = {
    "Authorization": `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json"
};

const instance = axios.create({
    baseURL: rootAPI,
    headers: headers
});

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
//PRIMEIRO FOI COLETADO OS ID DOS RECORDS E COM BASE NESSES ID FOI FEITO OUTRA CONSULTA
//NA API PARA COLETAR O CONTEUDO DOS RECORDS

app.get("/", async (request, response) => {
    
    const data = {
        "properties": ["name", "amount", "quantity", "total_amount"],
       
    }

    const listInput = [];

    const customObjURL = `/crm/v3/objects/${OBJECT_TYPE}/batch/read`;
    const getCustomObjURL = `/crm/v3/objects/${OBJECT_TYPE}`;

    const parameters = {
        limit: 10,
        after: undefined,
        properties: ["name", "amount", "quantity", "total_amount"],
        propertiesWithHistory: undefined,
        associations: undefined,
        archived: false
    };

    //pega os ids do objeto personalizado
    await instance.get(getCustomObjURL, {parameters}).then(resp => {
        
        //percorre a lista de objetos results pegando seu indice
        //salva o id de cada record em uma lista 
        for (const key in resp.data.results){
            listInput.push({'id': resp.data.results[key].id});
        };

    }).catch(erro => {
        console.error(erro);
    });

    //insere a lista de ids no atributo input do objeto data
    data['inputs'] = listInput;

    //faz a requizição para coletar um conjunto de records do objeto personalizado
    //retorna os dados de cada record como uma lista de objetos
    const respAPI = await instance.post(customObjURL, data).then(resp => {
        
        let customObject = [];
        let results = resp.data.results;

        for (const key in results){

            customObject.push(    
                {
                "name": results[key].properties.name,
                "quantity": results[key].properties.quantity,  
                "amount": results[key].properties.amount,  
                "total_amount": results[key].properties.total_amount,  
                "id": results[key].id
                }
            );
            
        };
        
        return customObject;

    }).catch(error => {
        console.error(error);
    });


    fs.writeFileSync("./stored.json", JSON.stringify(insertID(respAPI)), (error) => error && console.error(error))
 
    response.render('homepage.pug', 
        {
            customObjects: respAPI, 
            title: "Custom Object Table"
        }
    )
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj/', (request, response) => {
    let objectToUpdate = undefined;
    const id = parseInt(request.query.id);
    if (id){

        let fileContent = fs.readFileSync('./stored.json', 'utf-8',(error) => error && console.error(error));
        let newObject = JSON.parse(fileContent);
        objectToUpdate = newObject[id - 1 ];
        
        response.render('update.pug', {
            title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
            customObject: objectToUpdate
        });

    }
    else {

        response.render('update.pug', {
            title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
        });

    }

});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (request, response) => {
   
    const {name, amount, quantity} = request.body;
    
    const properties = {
        'name': name,
        'amount': amount,
        'quantity': quantity
    };

    if (request.body.flag){

        const objectId = request.body.id
        let updateCustomURL = `/crm/v3/objects/${OBJECT_TYPE}/${objectId}`

        try{

            await instance.patch(updateCustomURL, {properties});

        }
        catch(error){

            console.error(error);

        }
    }
    
    else{

        const createCustomURL = `/crm/v3/objects/${OBJECT_TYPE}`;

        try{
        
            await instance.post(createCustomURL, {properties});
            
        }
        catch(error){
            
            console.error(error);

        }
    }

    response.redirect('/')
});


//Recebe um array de objetos e inseri o atributo ID incremental para cada objecto
function insertID(object){
    let id_increment = 1;
    object.forEach(element => {
        element['id_row'] = id_increment;
        id_increment++;
    });
    return object
}


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));