const axios = require("axios");
require('dotenv').config()


async function viacep(cep) {
  const result = await axios.get(`${process.env.URL_VIACEP}${cep}/json`);

  return result.data;
}



async function cnpjCpf(cnpj) {
  const result = await axios.get(`${process.env.URL_RECEITANEWS}${cnpj}`);
  console.log(result.data)
  return result.data;
}

/*(async()=> {
  
  const resposta = await cnpjCpf(23858717000174)
  console.log(resposta.fantasia)})()*/



module.exports = { viacep, cnpjCpf };
