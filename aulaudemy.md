// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
extended: true
}));

var buscaCep = require('busca-cep');
var mysql = require("mysql");

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
response.sendFile(\_\_dirname + '/views/index.html');
});

app.post('/cursowebhook', function(request, response) {

var intentName = request.body.queryResult.intent.displayName;

if ( intentName == "processo.seletivo" ) {
  
  
 response.json({
"fulfillmentMessages": [
{
"card": {
"title": "Processo Seletivo",
"subtitle": "Bem vindo ao nosso processo seletivo",
"imageUri": "https://firebasestorage.googleapis.com/v0/b/universidade-3d7f8.appspot.com/o/processo%2Fprocesso-seletivo.png?alt=media&token=d5a89cec-1c07-4dad-9b44-7aaf098128bd"
}
},
{
"text" :{
"text": [
"Temos os melhores cursos nas areas de Humanas, exatas e Biologicas"
]
}
},
{
"image":{
  
 "imageUri": "https://firebasestorage.googleapis.com/v0/b/universidade-3d7f8.appspot.com/o/processo%2Falunos_campus.jpg?alt=media&token=af408613-e87c-4f2c-982e-dbc1b5d29748",
"accessibilityText": "Temos Campus em todas as areas da cidade"
  
 }
},
{
"text" :{
"text": [
"Nossos Campus são os melhores do Brasil"
]
}
},
{
"image":{
  
 "imageUri": "https://firebasestorage.googleapis.com/v0/b/universidade-3d7f8.appspot.com/o/processo%2Flaboratorio.jpg?alt=media&token=83f17a55-5943-4592-a06f-64230f07afe2",
"accessibilityText": "Laboratorios"
  
 }
},
{
"text" :{
"text": [
"Temos os melhores laboratorios"
]
}
},
{
"text" :{
"text": [
"Voce quer participar do processo seletivo ?"
]
}
}
]
});

}
else if ( intentName == "processo.seletivo - yes" ) {
  
 var aluno_cep = request.body.queryResult.parameters['aluno-cep'];
  
 buscaCep(aluno_cep, {sync: false, timeout: 1000})
.then(endereco => {
  
 var aluno_nome = request.body.queryResult.parameters['aluno-nome'];
var aluno_cpf = request.body.queryResult.parameters['aluno-cpf'];
var aluno_curso = request.body.queryResult.parameters['aluno-curso'];  
  
 var aluno_endereco = endereco.logradouro+"-"+endereco.bairro+","+endereco.localidade+"-"+endereco.uf+"--"+endereco.cep;
  
  
 var connection = mysql.createConnection({
host : process.env.MYSQL_HOST,
user : process.env.MYSQL_USER,
password : process.env.MYSQL_PASS,
database : process.env.MYSQL_DB  
 });

    connection.connect();

    //insert into unive260_dialogflow.alunos values ( 'nome','cpf','curso','endereco')

     connection.query("insert into unive260_dialogflow.alunos values ('"+aluno_nome+"','"
                   +aluno_cpf+"','"
                   +aluno_curso+"','"
                   +aluno_endereco+"')",

     function (error, results, fields) {
     if (error) throw error;
     connection.end();

         response.json({"fulfillmentText" :"Voce foi cadastrado(a) para o nosso processo seletivo - Verifique a data das provas" })

    });


    })

}

});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
console.log('Your app is listening on port ' + listener.address().port);
});
