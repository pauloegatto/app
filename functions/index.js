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

const ruas = rua1.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
const rua =  ruas.replace(" ", "+");
const cidades = cidade1.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
const cidade =  cidades.replace(" ", "+");
console.log("teste geolocation")
console.log(numero1)
  console.log(rua1)
   console.log(cidade1)
   console.log(uf1)
   console.log(rua)
  console.log(cidade)
 const result = await axios.get(`${process.env.URL_GEO}${numero1}+${rua},+${cidade},+${uf1}&key=${process.env.KEY_GEO}`);
    const {
        lat,
        lng
    } = result.data.results[0].geometry.location;
console.log(lat)
  console.log(lng)
    return {
        lat,
        lng
    };

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



function calcGeo(lat11, lng11, lat22, lng22) {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
  console.log("calcGeo função1")
 console.log(lat11)
  console.log(lng11)
  console.log(lat22)
  console.log(lng22)
  
    // let latitude1 = Number(lat1);
    // let longitude1 = Number(lng1);
    // let latitude2 = Number(lat2);
    // let longitude2 = Number(lng2);

let lat2 = lat22;
let lon2 = lng22;
let lat1 = lat11;
let lon1 = lng11;
  console.log("calcGeo função2")
 
  console.log(lat2)
  console.log(lon2)
  console.log(lat1)
  console.log(lon1)
let R = 6371; // km 
//has a problem with the .toRad() method below.
let x1 = lat2-lat1;
let dLat = x1.toRad();  
let x2 = lon2-lon1;
let dLon = x2.toRad();  
let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
let d = R * c; 

    return d;
}





module.exports = { viacep, cnpjCpf, TestaCPF, geolocation, sms, sms2, calcGeo };
