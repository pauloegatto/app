const axios = require("axios");
const { viacep, cnpjCpf } = require("../functions");

async function show(query) {
  const idUser = query.split('/')[4];
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

async function createempresa(parameters, session) {
  console.log(parameters)
  const empresa = await cnpjCpf(parseInt(parameters.cnpjCpf));
  
  const idUser = session.split('/')[4];

  await axios.post(
    process.env.URL_SHEET2,
    {
      id: idUser,
      nomeFantasia: empresa.fantasia
     // razaoSocial
    //  cnpj:
     // telefoneWhats:
     // telefone: parameters.telefone,
     // cep: parameters.cep,
      //localidade: andress.localidade,
     // uf: andress.uf,
     // rua: andress.logradouro,
     // numero: parameters.numero
    },
    {
      auth: {
        username: process.env.LOGIN_SHEET,
        password: process.env.PASSWORD_SHEET
      }
    }
  );
  console.log(parameters,empresa)
  return { parameters, empresa };
}



async function create(parameters, session) {
  const andress = await viacep(parameters.cep);
  
  const idUser = session.split('/')[4];

  await axios.post(
    process.env.URL_SHEET,
    {
      id: idUser,
      nome: parameters.nome,
      telefone: parameters.telefone,
      cep: parameters.cep,
      localidade: andress.localidade,
      uf: andress.uf,
      rua: andress.logradouro,
      numero: parameters.numero
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


async function updateName(nome, session) {  
  
    const idUser = session.split('/')[4];

  await axios.patch(
    `${process.env.URL_SHEET}/id/${idUser}`,
    {
      nome: nome, 
    },
    {
      auth: {
        username: process.env.LOGIN_SHEET,
        password: process.env.PASSWORD_SHEET
      }
    }
  );
  
  return nome;
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






module.exports = { show, create, updateName, deleteAll, createempresa };
