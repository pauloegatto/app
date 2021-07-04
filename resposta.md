{
"responseId": "response-id",
"session": "projects/project-id/agent/sessions/session-id",
"queryResult": {
"queryText": "End-user expression",
"parameters": {
"param-name": "param-value"
},
"allRequiredParamsPresent": true,
"fulfillmentText": "Response configured for matched intent",
"fulfillmentMessages": [
{
"text": {
"text": [
"Response configured for matched intent"
]
}
}
],
"outputContexts": [
{
"name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
"lifespanCount": 5,
"parameters": {
"param-name": "param-value"
}
}
],
"intent": {
"name": "projects/project-id/agent/intents/intent-id",
"displayName": "matched-intent-name"
},
"intentDetectionConfidence": 1,
"diagnosticInfo": {},
"languageCode": "en"
},
"originalDetectIntentRequest": {}
}

queryResult.intent.displayName === 'Default Welcome Intent'

resposta:
{
"fulfillmentMessages": [
{
"text": {
"text": [
"Text response from webhook"
]
}
}
]
}

evento:
{
"followupEventInput": {
"name": "event-name",
"languageCode": "en-US",
"parameters": {
"param-name": "param-value"
}
}
}

salva planilha
axios
.post(
"https://sheetdb.io/api/v1/whf7lzzniz6ep",
{
nome: name,
telefone: phone,
cep: cep
},
{ auth: { username: "xv0xoxs3", password: "0hbo4solotgbb9seyztd" } }
);

pesquisa cliente
function pesquisa_cliente(agent) {
  
 return axios.get('https://sheetdb.io/api/v1/whf7lzzniz6ep/search', {
params: {
nome: "Wene",
},
auth: {
username: "xv0xoxs3",
password: "0hbo4solotgbb9seyztd"
}
}).then((result) => {
const nome = result.data[0].nome;
agent.add(`Olá ${nome}`);
}).catch((err)=> {
console.log('erro consulta: ' + err);
});
  
  
  
 if (queryResult.intent.displayName === 'pesquisa_cliente') {
  
 await axios.get('https://sheetdb.io/api/v1/whf7lzzniz6ep/search', {
params: {nome: "Wene",},auth: {username: "xv0xoxs3",password: "0hbo4solotgbb9seyztd"}}).then((result) => {
const nome = result.data[0].nome;
agent.add(`Olá ${nome}`);
return response.json( {"fulfillmentText": `Olá ${nome}`} );

      if return response.json({"followupEventInput": {"name": "Welcome",}});


    }



    'string' === true
     1 === true
    -1 === true
    {} === true
    [] === true
    {nome: 'wnee'} === true
    [1] === true
    true === true


    0 === false
    null === false
    unidenif === false
    false === false
     '' === false
     -0 === false



    {

    nome: "Wene",
    tefelone: "9999999",
    cep: "65400000",
    endereco: "rua tal"

    }

    client.nome client.nome

{
parameters: { nome: 'ola', telefone: '7897897997', cep: '86800-500' },
andress: {
cep: '86800-500',
logradouro: 'Avenida Pirapó',
complemento: '',
bairro: 'Barra Funda',
localidade: 'Apucarana',
uf: 'PR',
ibge: '4101408',
gia: '',
ddd: '43',
siafi: '7425'
}
}

PATCH/PUT https://sheetdb.io/api/v1/58f61be4dda40/{column}/{value}