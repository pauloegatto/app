const express = require("express");
const app = express();
require('dotenv').config()
const axios = require("axios");


const { show, create, updateName, deleteAll } = require("./client");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/dialogflow", async (request, response) => {
  const { queryResult, session } = request.body;
  
  if (queryResult.intent.displayName === "Default Welcome Intent") {

   // const client = await show(session);
    return response.json({fulfillmentText: "oi vs code"})
  //if (!client)
     // return response.json({ followupEventInput: { name: "perguntacadastro" } });
     
    // return response.json({ followupEventInput: { name: "menusimples", parameters: {"nome":`${client.nome}`}}});
        // response.json({ followupEventInput: { name: "calltest", parameters: {"nome":"Visitante'"}}});

 }

 if (queryResult.intent.displayName === "cadastro") {
    const cliente = await create(queryResult.parameters, session);

    console.log(cliente);

    return response.json({fulfillmentText: `${cliente.parameters.nome}, esses dados estão corretos?\n Telefone: ${cliente.parameters.telefone}\n Localidade: ${cliente.andress.localidade}/${cliente.andress.uf}\n *SIM* ou *NÃO*`
    });
  }
  
 if (queryResult.intent.displayName === "perguntacadastro - no") {
    return response.json({ followupEventInput: { "name": "menusimples","languageCode": "pt-BR", "parameters":{ nome: "Visitante"}}});
 }
  
if (queryResult.intent.displayName === "perguntacadastro - yes") {
       return response.json({ followupEventInput: { name: "cadastro" }});
  }
  
 if (queryResult.intent.displayName === "cadastro - yes") {
    const client = await show(session);
  
    return response.json({ followupEventInput: { name: "menusimples", "languageCode": "pt-BR", "parameters": {"nome":`${client.nome}`}}

    });
 }
  
  if (queryResult.intent.displayName === "cadastro - no") {
       return response.json({ followupEventInput: { name: "alteracadastro" }});
  }
  
  if (queryResult.intent.displayName === "deleteall")
  {
       await  deleteAll();
    
    return response.json({fulfillmentText: "OK"})
  }
  
if (queryResult.intent.displayName === "alteracadastronome") {
  


   const nome = await updateName(queryResult.parameters.nome, session);  
  
   return response.json({fulfillmentText: `OK ${nome} Seu nome foi alterado com succeessso `});
  }
  
   

 });

app.listen(process.env.PORT || 3000);
