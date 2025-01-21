require('dotenv').config()
const express = require('express');
const axios = require('axios');
const app = express();


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.TOKEN;

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

app.get("/", async (request, response) => {
    const name = 'frutas';
    const objectType = "2-39592045";
    const objectID = "22668265238"
    const data = {
        "properties": ["name", "amount", "quantity", "total_amount"],
       
    }

    const listInput = [];

    const customObjURL = `/crm/v3/objects/${name}/batch/read`;
    const getCustomObjURL = `/crm/v3/objects/${name}`;
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

                }
            );
        };
        return customObject;

    }).catch(error => {
        console.error(error);
    });


    
    // response.send(respAPI)
    response.render('homepage.pug', 
        {
            customObjects: respAPI, 
            title: "Custom Object Table"
        }
    )
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (request, response) => {
    response.render('update.pug', {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (request, response) => {
   
    const nameObject ="frutas";
    const {name, amount, quantity} = request.body;
    const updateCustomURL = `/crm/v3/objects/${nameObject}`;
    
    const properties = {
        'name': name,
        'amount': amount,
        'quantity': quantity
    };

    const responseAPI = await instance.post(updateCustomURL, {properties}).then(resp => {
        return resp.status;
    }).catch(error => {
        console.error(error);
    });
    
    console.log("response API: ", responseAPI);
    response.redirect('/')
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));