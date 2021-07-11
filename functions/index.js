const axios = require("axios");

async function viacep(cep) {
  const result = await axios.get(`${process.env.URL_VIACEP}${cep}/json`);

  return result.data;
}



async function cnpjCpf(cnpj) {
  const result = await axios.get(`${process.env.URL_RECEITANEWS}${cnpj}`,{
    headers: {
      'Authorization': `Bearer ${process.env.TOKEN_RECEITA}`
  }});
  console.log(result.data)
  return result.data;
}
module.exports = { viacep, cnpjCpf };
