const axios = require("axios");

async function viacep(cep) {
  const result = await axios.get(`${process.env.URL_VIACEP}${cep}/json`);

  return result.data;
}

module.exports = { viacep };
