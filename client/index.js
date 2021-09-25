
const axios = require("axios");
const { viacep, cnpjCpf, geolocation, sms, calcGeo } = require("../functions");

async function show(query) {
  const data = query.split('/');
  const numero = data[data.length - 1]   
  
  
  const idUser = String(numero).match(/\d+/g).join('');
  const result = await axios.get(`${process.env.URL_SHEET}/search`, {
    params: {
      id: idUser
    },
    auth: {
      username: process.env.LOGIN_SHEET,
      password: process.env.PASSWORD_SHEET
    }
  });

  return result.data[0];
}

async function createempresa(parameters, session, textoCnpj) {
  console.log(parameters)
  const empresa = await cnpjCpf(textoCnpj);
  
  const data = session.split('/');
  const numero = data[data.length - 1]
  const idUser = String(numero).match(/\d+/g).join('');
  const cnpj = String(empresa.cnpj).match(/\d+/g).join('');
  const tipo = String(parameters.tipo);
  const modo = tipo.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
 // const numerosms = parameters.whats
    //await sms(cnpj, numerosms)
  let texto2Ajustado;
      const parte3 = String(cnpj).match(/\d+/g).join('');
      const parte4 = `${parte3.slice(6,7)}${parte3.slice(3,4)}${parte3.slice(1,2)}${parte3.slice(7,8)}`;
      texto2Ajustado = `${parte4}`;
      const senha = texto2Ajustado
  
      const cell = await arrumaCelular2(parameters.whats);
      const celular = await arrumaCelular3(cell.celular);
  const numero1 = empresa.numero
  const rua1 = empresa.logradouro
  const cidade1 = empresa.municipio
  const uf1 = empresa.uf
  const geo = await geolocation(numero1, rua1, cidade1 , uf1)
  console.log("teste geo create")
  
  await axios.post(
    process.env.URL_SHEET3,
    {
      id: idUser,
      nomeFantasia: parameters.fantasias.toUpperCase(),
      razaoSocial:  empresa.nome,
      cnpj:  cnpj,
      whats:  celular.celular,
      telefone:  empresa.telefone,
      cep:  empresa.cep,
      localidade:  empresa.municipio,
      uf:  empresa.uf,
      rua:  empresa.logradouro,
      numero:  empresa.numero,
      bairro: empresa.bairro,
      tipo: tipo,
      horario: parameters.horario,
      atividade: parameters.atividade,
      responsavel: parameters.responsavel,
      login: senha,
     contaverificada: "NÃO VERIFICADA",
      estrela: "SEJA O PRIMEIRO A AVALIAR",
      cidadematriz: parameters.matriz.toUpperCase(),
      facebook: "não informado",
      instagram: "não informado",
      site: "não informado",
      site: "não informado",
      comochegar: "não informado",
      email: parameters.email.toLowerCase(),
      subbusca1: "não informado",
      subbusca2: "não informado",
      subbusca3: "não informado",
      lat: String(geo.lat),
      lng: String(geo.lng)
    },
    {
      auth: {
        username: process.env.LOGIN_SHEET3,
        password: process.env.PASSWORD_SHEET3
      }
    }
  );
  //console.log(parameters,empresa)
  return { parameters, empresa };
}



async function create(parameters, session) {
  console.log("função create")
  let rua = parameters.rua
  let bairro = parameters.bairro
  let localidade = parameters.localidade
  let uf = parameters.uf
  console.log(rua)
  console.log(bairro)
  console.log(localidade)
  console.log(uf)
  console.log("cep create")
  console.log(parameters.cep)
  if (parameters.cep !== "nao"){ 
  console.log("função create tem cep")
    const andress = await viacep(parameters.cep);
    console.log(andress)
  if (andress.logradouro) { 
  rua = andress.logradouro;
  bairro = andress.bairro;
  localidade = andress.localidade;
  uf = andress.uf;}
  
  localidade = andress.localidade;
  uf = andress.uf;
  
  }
  console.log("função create rua, bairro...")
  
  console.log(rua)
  console.log(bairro)
  console.log(localidade)
  console.log(uf)
  
  const numero1 = parameters.numero
  const rua1 = rua
  const cidade1 = localidade
  const uf1 = uf
  const geo = await geolocation(numero1, rua1, cidade1 , uf1)
  console.log("teste geo create")

  
  const data = session.split('/');
  const numero = data[data.length - 1]
  const idUser = String(numero).match(/\d+/g).join('');
  const primeironome = parameters.nome.split(' ')[0];
  await axios.post(
    process.env.URL_SHEET,
    {
      id: idUser,
      nome: primeironome,
      nomecompleto: parameters.nome.toUpperCase(),
      telefone: parameters.telefone.toUpperCase(),
      cep: parameters.cep,
      localidade: localidade,
      uf: uf,
      rua: rua,
      numero: parameters.numero,
      bairro: bairro,
      apoiolocal: parameters.apoiolocal,
      lat: geo.lat,
      lng: geo.lng
    },
    {
      auth: {
        username: process.env.LOGIN_SHEET,
        password: process.env.PASSWORD_SHEET
      }
    }
  );
  return { parameters, rua, bairro, localidade, uf };
}


async function update(parameters, session) {  

  
  const data = session.split('/');
  const numero = data[data.length - 1]
  const idUser = String(numero).match(/\d+/g).join('');
   console.log(parameters)
  
  if (parameters.nomecompleto){
    console.log("nome 1")
      const primeironome = parameters.nomecompleto.split(' ')[0];
     const nome = parameters.nomecompleto.toUpperCase()
   await axios.patch(`${process.env.URL_SHEET}/id/${idUser}`,{
        "data": {  nome: primeironome,
      nomecompleto: nome }
    }).then( response => {
        console.log(response.data);
    });  
  return {...parameters}
  }
     console.log("nome 2")
  await axios.patch(`${process.env.URL_SHEET}/id/${idUser}`,{
        "data": {...parameters}
    }).then( response => {
        console.log(response.data);
    });
  
  
  
//   await axios.patch(
//     `${process.env.URL_SHEET}/id/${idUser}`,
//     {
//       ...parameters,
      
//     },
//     {
//       auth: {
//         username: process.env.LOGIN_SHEET,
//         password: process.env.PASSWORD_SHEET
//       }
//     }
//   );
  
  return {...parameters}
}

async function deleteAll() {  
  

  await axios.delete(`${process.env.URL_SHEET}/all`,
    
    {
      auth: {
        username: process.env.LOGIN_SHEET,
        password: process.env.PASSWORD_SHEET
      }
    }
  );
  
}

async function deleteCpf(session) {  
    const data = session.split('/');
  const numero = data[data.length - 1]
  const idUser = String(numero).match(/\d+/g).join('');
     await axios.delete(`${process.env.URL_SHEET}/id/${idUser}`)
    .then( response => {
        console.log(response.data);
    });
  
}
async function showpj(parameters) {

const textoCnpj = String(parameters);
  console.log("showpj")
  console.log(textoCnpj)
//    let textoAjustado 
 
//         const parte1 = parameters.slice(0,2);
//         const parte2 = parameters.slice(2,5);
//         const parte3 = parameters.slice(5,8);
//         const parte4 = parameters.slice(8,12);
//         const parte5 = parameters.slice(12,14);
     
//         textoAjustado = `${parte1}.${parte2}.${parte3}/${parte4}-${parte5}`
//         const cnpj = await textoAjustado

  const result = await axios.get(`${process.env.URL_SHEET3}/search`, {
    params: {
      cnpj: textoCnpj
    },
    auth: {
      username: process.env.LOGIN_SHEET3,
      password: process.env.PASSWORD_SHEET3
    }
  });

 
  return result.data[0];
}
  
// const result = await axios.get(`${process.env.URL_SHEET2}`,{
//     auth: {
//       username: process.env.LOGIN_SHEET,
//       password: process.env.PASSWORD_SHEET
//     }
//   });

//   return result.data.filter(search => search.cnpjCpf === query);
// }


async function pesquisa (parameters, localidade, session ) {
  console.log("pesquisa/session")
  console.log(session)
  const client = await show(session);
 
  const atividade = String(parameters.atividade).normalize("NFD").replace(/[^a-zA-Zs]/g, "").toUpperCase();
  console.log("pesquisa")
  console.log(atividade)
  const result = await axios.get(`${process.env.URL_SHEET3}`,{
    auth: {
      username: process.env.LOGIN_SHEET3,
      password: process.env.PASSWORD_SHEET3
    }
  });
console.log("pesquisa 1")
const pesquisa1 = result.data.filter(search => search.localidade === localidade.toUpperCase()).filter(search => search.atividade === atividade);
//console.log(pesquisa1)
console.log("pesquisa 2")
const pesquisa2 = result.data.filter(search => search.localidade === localidade.toUpperCase()).filter(search => search.nomeFantasia === atividade);
//console.log(pesquisa2)
console.log("pesquisa 3")
const pesquisa3 = result.data.filter(search => search.localidade === localidade.toUpperCase()).filter(search => search.subbusca1 === atividade);
//console.log(pesquisa3)
console.log("pesquisa 4")
const pesquisa4 = result.data.filter(search => search.localidade === localidade.toUpperCase()).filter(search => search.subbusca2 === atividade);
//console.log(pesquisa4)
console.log("pesquisa 5")
const pesquisa5 = result.data.filter(search => search.localidade === localidade.toUpperCase()).filter(search => search.subbusca3 === atividade);
//console.log(pesquisa5)
console.log("pesquisa 1 e 2")
   Array.prototype.push.apply(pesquisa1, pesquisa2);
   Array.prototype.push.apply(pesquisa1, pesquisa3);
   Array.prototype.push.apply(pesquisa1, pesquisa4);
   Array.prototype.push.apply(pesquisa1, pesquisa5);
console.log(pesquisa1)
  //const pesquisafinal = pesquisa1.removeIf(Objects::isNull)
  
  //return result.data.filter(search => search.atividade === atividade);
  
 //  return result.data.filter(search => search.localidade === andress.localidade.toUpperCase()).filter(search => search.atividade === atividade);
 // // console.log(andress)
   
//   certa
//   return result.data.filter(search => search.localidade === localidade.toUpperCase()).filter(search => search.atividade === atividade);
 console.log("pesquisa retorno")
   //console.log(Array(pesquisa1.data))
   console.log("pesquisa retorno result")
   if (!client)
    return pesquisa1;
     
    if (client.lat) { 
      console.log("lat e lng")
     let lat = client.lat.replace(",", ".")
     let lng = client.lng.replace(",", ".")
    


    const distancias = pesquisa1.map((result) => {
        return {
            ...result,
            distancia: calcGeo(Number(lat), Number(lng), Number(result.lat), Number(result.lng))
        }
    });

console.log(distancias)

   
  return distancias.sort(function (a, b) {
        return (a.distancia > b.distancia) ? 1 : ((b.distancia > a.distancia) ? -1 : 0);
    });
  
}
  
  
}
async function pesquisasimples (parameters, localidade) {
   console.log("pesquisasimples")
  //query
  //const andress = await viacep(parameters.cep);

  const result = await axios.get(`${process.env.URL_SHEET3}`,{
    auth: {
      username: process.env.LOGIN_SHEET3,
      password: process.env.PASSWORD_SHEET3
    }
  });

const atividade = "TELEFONE UTEIS"
  const pesquisa1 = result.data.filter(search => search.localidade === localidade.toUpperCase());
  const pesquisa2 = result.data.filter(search => search.atividade === atividade);
   Array.prototype.push.apply(pesquisa1, pesquisa2);
  return pesquisa1;
  
  
  //console.log(andress)
 // console.log(lista)
  //return lista.data.filter(search => search.atividade === atividade);
}

  function arrumaCelular (session) {
   const data = session.split("/");
    const numero = data[data.length - 1];
    const telefone = String(numero)
      .match(/\d+/g)
      .join("");
  
  let textoAjustado 
  

        const parte1 = telefone.slice(2,4);
        const parte2 = telefone.slice(4,8);
        const parte3 = telefone.slice(8,12);

        textoAjustado = `0${parte1} 9${parte2}-${parte3}`
        const celular = textoAjustado
        
        return {celular};
    }

function arrumaCelular2 (telefone) {
  
    let telefones = telefone.match(/\d+/g).join('');
     console.log(telefones)
  let celular 
  
        if (telefones.length === 12){
    celular = telefones
         return {celular}}
    if (telefones.length === 10){
        const parte1 = telefones.slice(0,2)
        const parte2 = telefones.slice(2,10)
        celular = `0${parte1}9${parte2}`;      
      }else { 
         if (telefones.slice(0,1) === "0"){ 
        const parte1 = telefones.slice(0,3)
        const parte2 = telefones.slice(3,12)
        celular = `${parte1}9${parte2}`;       
       }else {
        const parte1 = telefones.slice(0,11)      
        celular = `0${parte1}`;}}
        
        return {celular};
    }

function arrumaCelular3 (telefone) {
   
const telefones = telefone
   
  
  let textoAjustado 
  

        const parte1 = telefones.slice(0,3);
        const parte2 = telefones.slice(3,8);
        const parte3 = telefones.slice(8,12);

        textoAjustado = `${parte1} ${parte2}-${parte3}`
        const celular = textoAjustado
        
        return {celular};
    }


async function createpf(parameters, session, textoCnpj, client) {
  console.log(parameters)
 // const empresa = await cnpjCpf(textoCnpj);

  const data = session.split('/');
  const numero = data[data.length - 1]
  const idUser = String(numero).match(/\d+/g).join('');
  const tipo = String(parameters.tipo);
  const modo = tipo.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

  let texto2Ajustado;
      const parte3 = String(textoCnpj).match(/\d+/g).join('');
      const parte4 = `${parte3.slice(6,7)}${parte3.slice(3,4)}${parte3.slice(1,2)}${parte3.slice(7,8)}`;
      texto2Ajustado = `${parte4}`;
      const senha = texto2Ajustado
      
  console.log(tipo)
  console.log(textoCnpj)
  await axios.post(
    process.env.URL_SHEET3,
    {
      id: idUser,
      nomeFantasia: parameters.nome,
      razaoSocial:  client.nomecompleto,
      cnpj:  textoCnpj,
      whats:  client.telefone,
      telefone:  client.telefone,
      cep:  client.cep,
      localidade:  client.localidade.toUpperCase(),
      uf:  client.uf,
      rua:  client.rua,
      numero:  client.numero,
      bairro: client.bairro,
      tipo: tipo,
      horario: parameters.horario,
      atividade: parameters.servicos,
      responsavel: client.nome,
      login: senha,
      contaverificada: "NÃO VERIFICADA",
      estrela: "SEJA O PRIMEIRO A AVALIAR",
      cidadematriz: client.localidade.toUpperCase(),
      facebook: "não informado",
      instagram: "não informado",
      site: "não informado",
      site: "não informado",
      comochegar: "não informado",
      email: parameters.email.toLowerCase(),
      subbusca1: "não informado",
      subbusca2: "não informado",
      subbusca3: "não informado"
    },
    {
      auth: {
        username: process.env.LOGIN_SHEET3,
        password: process.env.PASSWORD_SHEET3
      }
    }
  );
  //console.log(parameters,empresa)
  return { parameters};
}
async function updatepfpj(texto, digitado, cnpjCpf) {  
console.log("updatepf")
 console.log(texto)
  console.log(digitado)
  console.log(cnpjCpf)
  // await axios.patch(`${process.env.URL_SHEET3}/cnpj/${cnpjCpf}`,{
  //       "data": {  digitado: texto }
  //   }).then( response => {
  //       console.log(response.data);
  //   });  
  
 
  
  await axios.patch(`${process.env.URL_SHEET3}/cnpj/23858717000174`,{
        "data": {  nomeFantasia: "teste" }
    }).then( response => {
        console.log(response.data);
    });

  return 
}


module.exports = { show, createpf, create, update, deleteAll, createempresa, showpj , pesquisa, arrumaCelular, arrumaCelular2, arrumaCelular3, pesquisasimples, deleteCpf, updatepfpj};
