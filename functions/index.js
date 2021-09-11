const axios = require("axios");



async function viacep(cep) {
  const result = await axios.get(`${process.env.URL_VIACEP}${cep}/json`);

  return result.data;
}



async function cnpjCpf(cnpj) {
  const result = await axios.get(`${process.env.URL_RECEITANEWS}${cnpj}`);
  console.log(result.data)
  return result.data;
}

function TestaCPF(strCPF) {
    let Soma;
    let Resto;
    Soma = 0;
  if (strCPF == "00000000000") return false;

  for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}


async function geolocation (numero1, rua1, cidade1 , uf1 ) {

  //https://maps.googleapis.com/maps/api/geocode/json?address=340+Avenida+Pirapo,+Apucarana,+PR&key=AIzaSyBEvaFSyLB4d_HD2ylCYX3ZqSISAg8cKwQ

const rua =  rua1.replace(" ", "+");
const cidade =  cidade1.replace(" ", "+");
console.log("teste geolocation")
console.log(rua)
console.log(cidade)
console.log(numero1)
console.log(uf1)
console.log(await axios.get(`${process.env.URL_GEO}${numero1}+${rua},+${cidade},+${uf1}&key=${process.env.KEY_GEO}`))

const result = await axios.get(`${process.env.URL_GEO}${numero1}+${rua},+${cidade},+${uf1}&key=${process.env.KEY_GEO}`);
console.log(result.data)

return result.data;
}



async function sms(cnpj, numerosms) {
 console.log("teste sms")
   let textoAjustado 
  
        const parte1= String(numerosms).match(/\d+/g).join('');
        const parte2 = parte1.slice(1,12);       
        textoAjustado = `55${parte2}`
        const celular = textoAjustado
  console.log(celular)
   let texto2Ajustado;

       console.log(cnpj)
        const parte3 = String(cnpj).match(/\d+/g).join('');
        console.log(parte3)
      const parte4 = `${parte3.slice(6,7)}${parte3.slice(3,4)}${parte3.slice(1,2)}${parte3.slice(7,8)}`;
        console.log(parte4)
  texto2Ajustado = `${parte4}`;
        const senha = texto2Ajustado
 console.log(senha)
 console.log(`senha:${senha}`)
 
  
 const texto1 = `Cadastro%20102paraWhats%20feito%20com%20sucesso!%20Sua%20senha%20e:%20${senha}.%20Para%20modificar%20seu%20cadastro%20acesso%20o%20link:%20https://wa.me/554391169015%20e%20digite%20CADASTRO.%20Obrigado%20:)`;
  const texto = texto1
   const URL_SMS = "http://smsmarketing.smslegal.com.br/index.php?app=webservices&u="
 
  console.log(`${URL_SMS}${process.env.LOGIN_SMS}&p=${process.env.SENHA_SMS}&ta=pv&to=${celular}&msg=${texto}`)
 const result =  await axios.get(`${URL_SMS}${process.env.LOGIN_SMS}&p=${process.env.SENHA_SMS}&ta=pv&to=${celular}&msg=${texto}`)

 const retorno = result.data
  return { retorno, senha };
}

// function startTimer(duration, display) {
//     var timer = duration, minutes, seconds;
//     setInterval(function () {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);
//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;
//         display.textContent = minutes + ":" + seconds;
//         if (--timer < 0) {
//             timer = duration;
//         }
//     }, 1000);
// }
// window.onload = function () {
//     var duration = 60 * 5; // Converter para segundos
//         display = document.querySelector('#timer'); // selecionando o timer
//     startTimer(duration, display); // iniciando o timer
// };

async function sms2(numerosms) {
 console.log("teste sms")
   let textoAjustado 
  
        const parte1= String(numerosms).match(/\d+/g).join('');
        const parte2 = parte1.slice(1,12);       
        textoAjustado = `55${parte2}`
        const celular = textoAjustado
 
 console.log("teste sms")
  console.log(celular)
 const texto1 = `Ola!%20Somos%20o%20102paraWhats%20e%20voce%20foi%20indicado%20para%20aparecer%20em%20nosso%20guia%20comercial,%20acesse%20o%20link:%20https://wa.me/554391169015%20e%20na%20a%20opcao%203%20do%20MENU.%20:)`;
  const texto = texto1
   const URL_SMS = "http://smsmarketing.smslegal.com.br/index.php?app=webservices&u="
 
  
 const result =  await axios.get(`${URL_SMS}${process.env.LOGIN_SMS}&p=${process.env.SENHA_SMS}&ta=pv&to=${celular}&msg=${texto}`)

  return ;
}


module.exports = { viacep, cnpjCpf, TestaCPF, geolocation, sms, sms2 };
