const express = require("express");
const app = express();
const axios = require("axios");

// Criei um Arquivo para separar as coisas e organizar
// Senão fica muito dificil de ver
// Aqui estou fazendo uma Desestruturação de Objetos no JavaScript
// Por exemplo
/*
 aqui estou criando um objeto em javascript e chamando ele de pessoa
 const pessoa = {
  nome: 'Wene',
  sobrenome: 'Alves'
 }
 esse objeto tem duas chaves que são nome e sobrenome
 então para pode-los ver o valor dele é preciso fazer assim pessoa.nome ou pessoa.sobrenome né?
 para ficar mais simples coloquei o destruring que é Desestruturação em português!
 Como o destruring fica muito mais fácil a visualização! por que em vez de você usa assim pessoa.nome ou pessoa.sobrenome
 apenas ultilizamos desse forma: const { nome } = pessoa ou const { sobrenome } = pessoa;
 também podemos utiliza assim: const {nome, sobrenome} = pessoa;
 aqui estou apenas pegando o nome da chave e o valor junto 
 assim fica mais legal de visualizar o código!
 obeservação nunca posso escreve chaves que não existe dentro do objeto exemplo 
 const { idade } = pessoa; nota que não existe nenhuma chave chama idade dentro de pessoa
 isso vai dá um erro em seu código! por que dentro do objeto que nós criamos só apenas existe nome e sobrenome!

*/
const { show } = require("./client");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/dialogflow", async (request, response) => {
  const { queryResult } = request.body;
  if (queryResult.intent.displayName === "Default Welcome Intent") {
    // Aqui estou chamando a função show() que ela executará uma busca pelo o usuário e retorna um objeto com as informações do mesmo!
    const client = await show("Wene");

    // Aqui estou verificando se o usuário existe dentro do do sheetDB, se o usuário existe ele vai retorna true mas estou negando o true então ele vai falso e
    // vai entra dentro do if, mas dê falso negar e vai fica true e vai entra dentro do if e vai chama o envent de cadastro de usuário
    if (!client)
      return response.json({ followupEventInput: { name: "chamacadastro" } });
    // Aqui só vai executar se usuário existe! nunca vai chega aqui se usuário não existe;
    return response.json({
      fulfillmentText: `Seu nome é ${client.nome} certo??`
    });
  }

  if (queryResult.intent.displayName === "cadastro") {
    const nome = queryResult.parameters.nome;
    const telefone = queryResult.parameters.telefone;
    const cep = queryResult.parameters.cep;
    await axios.post(
      process.env.URL_SHEET,
      { nome, telefone, cep },
      {
        auth: {
          username: process.env.LOGIN_SHEET,
          password: process.env.PASSWORD_SHEET
        }
      }
    );
    return response.json({
      fulfillmentText: `${nome}, seu cadastro foi realizado com sucesso`
    });
  }
});

app.listen(process.env.PORT || 3000);
