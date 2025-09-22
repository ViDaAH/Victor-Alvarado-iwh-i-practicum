const express = require('express');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.TOKEN; // Replace with your private app access token
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    try {
        console.log(PRIVATE_APP_ACCESS);
        const customObjectUrl = 'https://api.hubapi.com/crm/v3/objects/2-50347594?properties=nombre&properties=frecuencia&properties=nivel_experto';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };
        
        const resp = await axios.get(customObjectUrl, { headers });
        const data = resp.data.results || [];
        
        res.render('homepage', { 
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', 
            data: data 
        });
        
    } catch (error) {
        console.error('Error fetching custom objects:', error.response?.data || error.message);
        res.render('homepage', { 
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', 
            data: [] 
        });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-cobj', async (req, res) => {
    const newCustomObject = {
        properties: {
            "nombre": req.body.hobby_name,
            "nivel_experto": req.body.difficulty_level,
            "frecuencia": req.body.time_commitment
        }
    };

    const createCustomObjectUrl = 'https://api.hubapi.com/crm/v3/objects/2-50347594';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createCustomObjectUrl, newCustomObject, { headers });
        res.redirect('/');
    } catch(err) {
        console.error('Error creating custom object:', err.response?.data || err.message);
        res.redirect('/');
    }
});


// * Localhost
app.listen(3005, () => console.log('Listening on http://localhost:3005'));