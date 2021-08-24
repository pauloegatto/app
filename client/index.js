
const axios = require("axios");
const { viacep, cnpjCpf, geolocation, sms } = require("../functions");

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
  
  
  await axios.post(
    process.env.URL_SHEET3,
    {
      id: idUser,
      nomeFantasia: parameters.fantasias.toUpperCase(),
      razaoSocial:  empresa.nome,
      cnpj:  cnpj,
      whats:  parameters.whats,
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
      facebook: parameters.facebook,
      instagram: parameters.instagram,
      site: parameters.site,
      comochegar: parameters.comochegar,
      email: parameters.email
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
  const andress = await viacep(parameters.cep);
  
  
//   const numero1 = parameters.numero
//   const rua1 = andress.logradouro
//   const cidade1 = andress.localidade
//   const uf1 = andress.uf
//   const geo = await geolocation(numero1, rua1, cidade1 , uf1)
//   console.log("teste geo create")
//   console.log(geo)
//   console.log(geo.results.geometry.location.lat)
//   console.log(geo.location.lat)
  
  
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
      localidade: andress.localidade,
      uf: andress.uf,
      rua: andress.logradouro,
      numero: parameters.numero,
      bairro: andress.bairro,
      apoiolocal: parameters.apoiolocal
    },
    {
      auth: {
        username: process.env.LOGIN_SHEET,
        password: process.env.PASSWORD_SHEET
      }
    }
  );
  return { parameters, andress };
}


async function update(parameters, session) {  
  
  
  const data = session.split('/');
  const numero = data[data.length - 1]
  const idUser = String(numero).match(/\d+/g).join('');
  await axios.patch(
    `${process.env.URL_SHEET}/id/${idUser}`,
    {
      ...parameters,
      
    },
    {
      auth: {
        username: process.env.LOGIN_SHEET,
        password: process.env.PASSWORD_SHEET
      }
    }
  );
  
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


async function pesquisa (parameters) {
   const cepnovo = String(parameters.cep)
      .match(/\d+/g)
      .join("");
  
  let textoAjustado 
  

        const parte1 = cepnovo.slice(0,5);
        const parte2 = cepnovo.slice(5,8);
      

        textoAjustado = `${parte1}-${parte2}`
        const cep = textoAjustado
  
  console.log("teste pesquisa cep")
      console.log(parameters.cep)
 
   console.log(cep)
  
  const andress = await viacep(cep);
  
  const atividade = String(parameters.atividade).normalize("NFD").replace(/[^a-zA-Zs]/g, "").toUpperCase();
 console.log("pesquisa")
   console.log(atividade)

  const result = await axios.get(`${process.env.URL_SHEET3}`,{
    auth: {
      username: process.env.LOGIN_SHEET3,
      password: process.env.PASSWORD_SHEET3
    }
  });

  //return result.data.filter(search => search.atividade === atividade);
  
  return result.data.filter(search => search.localidade === andress.localidade.toUpperCase()).filter(search => search.atividade === atividade);
  console.log(andress)
 // console.log(lista)
  //return lista.data.filter(search => search.atividade === atividade);
}
async function pesquisasimples (parameters) {
   //query
  const andress = await viacep(parameters.cep);
console
  const result = await axios.get(`${process.env.URL_SHEET3}`,{
    auth: {
      username: process.env.LOGIN_SHEET3,
      password: process.env.PASSWORD_SHEET3
    }
  });

  return result.data.filter(search => search.localidade === andress.localidade.toUpperCase());
  
  
  console.log(andress)
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
      login: senha
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


module.exports = { show, createpf, create, update, deleteAll, createempresa, showpj , pesquisa, arrumaCelular, pesquisasimples};
