
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

  const client = await show(session);

   
 if (!client)
      return response.json({ followupEventInput: { name: "perguntacadastro" } });
      return response.json({ followupEventInput: { name: "menu", parameters: {"nome":`${client.nome}`}}});
  
     

 }

 if (queryResult.intent.displayName === "cadastro") {
    const cliente = await create(queryResult.parameters, session);

    console.log(cliente);
    if(cliente.andress.logradouro){
      return response.json({fulfillmentText: `${cliente.parameters.nome}, esses dados estão corretos?\n Telefone: ${cliente.parameters.telefone}\n Rua: ${cliente.andress.logradouro}, nº: ${cliente.parameters.numero}\n Localidade: ${cliente.andress.localidade}/${cliente.andress.uf}\n *SIM* ou *NÃO*`
    });

    }
    return response.json({fulfillmentText: `${cliente.parameters.nome}, esses dados estão corretos?\n Telefone: ${cliente.parameters.telefone}\n Localidade: ${cliente.andress.localidade}/${cliente.andress.uf}\n *SIM* ou *NÃO*`
    });
  }
  
 if (queryResult.intent.displayName === "perguntacadastro - no") {
    return response.json({ followupEventInput: { "name": "menu","languageCode": "pt-BR"}});
 }
  
 if (queryResult.intent.displayName === "perguntacadastro - yes") {
       return response.json({ followupEventInput: { name: "cadastro" }});
  }
  
 if (queryResult.intent.displayName === "cadastro - yes") {
   
      const client = await show(session);
      console.log(client)
    return response.json({ followupEventInput: { name: "menu", "languageCode": "pt-BR", "parameters": {"nome":`${client.nome}`}}

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
