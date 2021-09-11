const express = require("express");
const app = express();

const axios = require("axios");

const {
  show,
  create,
  update,
  deleteAll,
  createempresa,
  showpj,
  pesquisa,
  arrumaCelular,
  arrumaCelular2,
  arrumaCelular3,
  createpf,
  pesquisasimples,
  deleteCpf,
  updatepfpj
} = require("./client");
const { viacep, cnpjCpf, TestaCPF, sms, sms2 } = require("./functions");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/102paraWhats", async (request, response) => {
  const { queryResult, session } = request.body;

  if (queryResult.intent.displayName === "Default Welcome Intent") {
    const client = await show(session);

    if (!client) {
      return response.json({
        followupEventInput: { name: "perguntacadastro" }
      });
    }

//     return response.json({
//       followupEventInput: {
//         name: "menu",
//         parameters: { nome: `${client.nome}`, usuario: "Acessar meu cadastro" }
//       }
//    });
    
      
    const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`
        }
      }
    });
    
    
    
    
    
    
    
    
    
    
    
  }

  if (queryResult.intent.displayName === "cadastroempresa") {
    const textoCnpj = String(queryResult.parameters.cnpjCpf);
    const cell = await arrumaCelular2(queryResult.parameters.whats);
    const celular = await arrumaCelular3(cell.celular);
    const empresa = await createempresa(
      queryResult.parameters,
      session,
      textoCnpj
    );
    
    const texto = await `*Seus dados estão corretos?*
    \n*Nome fantasia:* ${queryResult.parameters.fantasias.toUpperCase()}
    \n*Razão social:* ${empresa.empresa.nome}
    \n*CNPJ:* ${empresa.empresa.cnpj} 
    \n*Atividade:* ${empresa.parameters.atividade}
    \n*Modo de atendimento:* ${queryResult.parameters.tipo}
    \n*Horario de Atendimento:* ${empresa.parameters.horario}
    \n*WhatsApp:* ${celular.celular} 
    \n*Telefone:* ${empresa.empresa.telefone}     
    \n*Rua:* ${empresa.empresa.logradouro}, *Nº:* ${empresa.empresa.numero}
    \n*Bairro:* ${empresa.empresa.bairro} - *CEP:* ${empresa.empresa.cep}
    \n*Localidade:* ${empresa.empresa.municipio}/${empresa.empresa.uf}
    \n*E-mail:* ${queryResult.parameters.email.toLowerCase()}
    \n*Responsavel pelo Cadastro:* ${empresa.parameters.responsavel} 
    \n*SIM* ou *NÃO* `
    //const client = await show(session);
    //console.log("cadastroempresa")
    //console.log(queryResult.parameters.cnpjCpf)
    // if (empresa.empresa.fantasia === "") {
    //   return response.json({
    //     fulfillmentText: `*Seus dados estão corretos?*
    // \n*Razão social:* ${empresa.empresa.nome}
    // \n*CNPJ:* ${empresa.empresa.cnpj} 
    // \n*Atividade:* ${empresa.parameters.atividade}
    // \n*Horario de Atendimento:* ${empresa.parameters.horario}
    // \n*WhatsApp:* ${empresa.parameters.whats} 
    // \n*Telefone:* ${empresa.empresa.telefone}     
    // \n*Rua:* ${empresa.empresa.logradouro}, Nº: ${empresa.empresa.numero}
    // \n*Bairro:* ${empresa.empresa.bairro} - Cep: ${empresa.empresa.cep}
    // \n*Localidade:* ${empresa.empresa.municipio}/${empresa.empresa.uf}
    // \n*Responsavel pelo Cadastro:* ${empresa.parameters.responsavel} 
    // \n*SIM* ou *NÃO* `
    //   });
    // }

    if (empresa.empresa.cnpj) {
         return response.json({
      followupEventInput: {
        name: "exibecadastroempresa",
        languageCode: "pt-BR",
        parameters: {
          mensagem:`${texto}`,
          cnpj: `${empresa.empresa.cnpj}`, 
          whats: `${empresa.parameters.whats}`
          
        }
      }
    });
    } else {
      return response.json({
        fulfillmentText: `*Algo deu errado, tente novamente*
    `
      });
    }
  }

  if (queryResult.intent.displayName === "cadastro") {
    const cliente = await create(queryResult.parameters, session);
//colocar se tem cliente
    if (cliente.andress.logradouro) {
      return response.json({
        fulfillmentText: `*Esses dados estão corretos?* 
    \n*Nome:* ${cliente.parameters.nome.toUpperCase()}
    \n*Telefone:* ${cliente.parameters.telefone}
    \n*Rua:* ${cliente.andress.logradouro}, *Nº:* ${cliente.parameters.numero}
    \n*Localidade:* ${cliente.andress.localidade}/${cliente.andress.uf}
    \n*Autorizado LGPD:* ${cliente.parameters.apoiolocal.toUpperCase()}
    \n*SIM* ou *NÃO*`
      });
    }
    return response.json({
      fulfillmentText: `*Esses dados estão corretos?* 
    \n*Nome:* ${cliente.parameters.nome}
    \n*Telefone:* ${cliente.parameters.telefone}
    \n*Localidade:* ${cliente.andress.localidade}/${cliente.andress.uf}
    \n*Autorizado LGPD:* ${cliente.parameters.apoiolocal.toUpperCase()}
    \n*SIM* ou *NÃO*`
    });
  }

  if (queryResult.intent.displayName === "perguntacadastro - no") {
    return response.json({
      followupEventInput: { name: "menu", languageCode: "pt-BR" }
    });
  }

  if (queryResult.intent.displayName === "perguntacadastro - yes") {
    const celular = await arrumaCelular(session);

    if (celular.celular.length === 14) {
      return response.json({
        followupEventInput: {
          name: "cadastro",
          parameters: { telefone: `${celular.celular}` }
        }
      });
    }

    return response.json({ followupEventInput: { name: "cadastro" } });
  }

  if (queryResult.intent.displayName === "cadastro - yes") {
    const client = await show(session);
    const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`,
          mensagem: `*Agora já está tudo certo para fazer suas pesquisas* 📝\n\n*Sua preferência é para:* 🧐`
        }
      }
    });
    
  }

   if (queryResult.intent.displayName === "alteracadastrotudo - exibe - yes") {
    const client = await show(session);
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Cadastro alterado com sucesso ${client.nome}`, usuario: "Acessar meu cadastro" }
      }
    });
  }
  
  if (queryResult.intent.displayName === "cadastro - no") {
    const client = await show(session);
        const texto = await`🔢 Digite a opção que deseja *alterar*: 
    \n1️⃣ *Nome:* ${client.nomecompleto.toUpperCase()}
    \n2️⃣ *Telefone:* ${client.telefone}
    \n3️⃣ *Endereço:* ${client.rua}\n${client.localidade}/${client.uf}
    \n4️⃣ *N° da rua:* ${client.numero}   
    \n5️⃣ *Autorização LGPD* ${client.apoiolocal.toUpperCase()}
    \n0️⃣ *Tudo*
    \n#️⃣ *Excluir o meu cadastro*
    \n*️⃣ Retornar ao Menu`
      
      
      
      
      return response.json({
        followupEventInput: {
          name: "alteracadastro",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}`
           
          }
        }
      });
    
  }

  if (queryResult.intent.displayName === "deleteall") {
    await deleteAll();

    return response.json({ fulfillmentText: "Tudo Apagado. OK" });
  }
 if (queryResult.intent.displayName === "alteracadastroexcluir") {
    
    const parameters = await deleteCpf(session);
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Seu cadastro foi *EXCLUIDO* com sucesso!\n*Visitante*`}
      }
    });
  }
  if (queryResult.intent.displayName === "alteracadastronome") {
  console.log("parte 1")
    const parameters = await update(queryResult.parameters, session);
    console.log("parte 2")
      const primeironome = queryResult.parameters.nomecompleto.split(' ')[0];
    console.log("parte 3")
       console.log(primeironome)
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Seu nome foi alterado com sucesso ${primeironome}`, usuario: "Acessar meu cadastro" }
      }
    });
  }
  

  if (queryResult.intent.displayName === "alteracadastrotelefone") {
    const client = await show(session);
    const parameters = await update(queryResult.parameters, session);
       
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `${client.nome}, seu telefone foi alterado para *${parameters.telefone}* com sucesso`, usuario: "Acessar meu cadastro" }
      }
    });
  }
    

  if (queryResult.intent.displayName === "alteracadastrocep") {
    const client = await show(session);
    const andress = await viacep(queryResult.parameters.cep);
    const newData = { rua: andress.logradouro, ...andress };
    const parameters = await update(
      { ...queryResult.parameters, ...newData },
      session
    );
    
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Seu CEP foi alterado para *${parameters.cep}* com sucesso ${client.nome}`, usuario: "Acessar meu cadastro" }
      }
    });
  }
        
    

  if (queryResult.intent.displayName === "alteracadastronumero") {
    const client = await show(session);
    const parameters = await update(queryResult.parameters, session);
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Seu Nº foi alterado para *${parameters.numero}* com sucesso ${client.nome}`, usuario: "Acessar meu cadastro" }
      }
    });
  }
    


  if (queryResult.intent.displayName === "alteracadastroapoiolocal") {
    const client = await show(session);   
    const parameters = await update(queryResult.parameters, session);
   
      return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Apoio local alterado para: *${queryResult.parameters.apoiolocal.toUpperCase()}* com sucesso!\n${client.nome}`, usuario: "Acessar meu cadastro" }
      }
    });
  }
    
  

  if (queryResult.intent.displayName === "alteracadastrotudo") {
   queryResult.parameters.nome =  await queryResult.parameters.nomecompleto.split(' ')[0];
    const client = await show(session);
    const celular = await arrumaCelular(session);
    const andress = await viacep(queryResult.parameters.cep);
    const newData = { rua: andress.logradouro, ...andress };
    const parameters = await update(
      { ...queryResult.parameters, ...newData },
      session
    );

    if (andress.logradouro) {
     const mensagem = `*E agora, seus dados estão corretos?* 
    \n*Nome:* ${parameters.nomecompleto}
    \n*Telefone:* ${celular.celular}
    \n*Cep:* ${parameters.cep}
    \n*Rua:* ${andress.logradouro}, *Nº:* ${parameters.numero}
    \n*Localidade:* ${andress.localidade}/${andress.uf}
    \n*Autorizado LGPD:* ${parameters.apoiolocal.toUpperCase()}
    \n*SIM* ou *NÃO*`
      return response.json({
          followupEventInput: {
            name: "alteracadastrotudoexibe",
            languageCode: "pt-BR",
            parameters: {
              mensagem: `${mensagem}`
            }
          }
        });
    }
       const mensagem2 = `*E agora, seus dados estão corretos:* 
    \n*Nome:* ${parameters.nomecompleto}
    \n*Telefone:* ${celular.celular}
    \n*Cep: ${parameters.cep}
    \n*Localidade:* ${andress.localidade}/${andress.uf}
    \n*Autorizado LGPD:* *${parameters.apoiolocal.toUpperCase()}*
    \n*SIM* ou NÃO*?`
       return response.json({
          followupEventInput: {
            name: "alteracadastrotudoexibe",
            languageCode: "pt-BR",
            parameters: {
              mensagem: `${mensagem2}`
            }
          }
        });       
             
  
  }
  
  if (queryResult.intent.displayName === "alteracadastrotudo - exibe - no") {
    const client = await show(session);
    return response.json({
      followupEventInput: {
        name: "alteracadastro",
        languageCode: "pt-BR",
        parameters: { nome: `${client.nome}` }
      }
    });
  }
  
     if (queryResult.intent.displayName === "alteracadastro - cancel") {
    const client = await show(session);
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Entendido ${client.nome}`, usuario: "Acessar meu cadastro" }
      }
    });
  }
  

  if (queryResult.intent.displayName === "menu2") {
    const celular = await arrumaCelular(session);
    const client = await show(session);
    if (celular.celular.length === 14) {
      if (!client)
        return response.json({
          followupEventInput: {
            name: "cadastro",
            languageCode: "pt-BR",
            parameters: {
              telefone: `${celular.celular}`
            }
          }
        });
       const texto = await`🔢 Digite a opção que deseja *alterar*: 
    \n1️⃣ *Nome:* ${client.nomecompleto.toUpperCase()}
    \n2️⃣ *Telefone:* ${client.telefone}
    \n3️⃣ *Endereço:* ${client.rua}\n${client.localidade}/${client.uf}
    \n4️⃣ *N° da rua:* ${client.numero}   
    \n5️⃣ *Autorização LGPD* ${client.apoiolocal.toUpperCase()}
    \n0️⃣ *Tudo*
    \n#️⃣ *Excluir o meu cadastro*
    \n*️⃣ Retornar ao Menu`
      
      
      
      
      return response.json({
        followupEventInput: {
          name: "alteracadastro",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}`
           
          }
        }
      });
    } else {
      if (!client)
        return response.json({
          followupEventInput: { name: "cadastro", languageCode: "pt-BR" }
        });
    const texto = await`🔢 Digite a opção que deseja *alterar*: 
    \n1️⃣ *Nome:* ${client.nomecompleto.toUpperCase()}
    \n2️⃣ *Telefone:* ${client.telefone}
    \n3️⃣ *Endereço:* ${client.rua}\n${client.localidade}/${client.uf}
    \n4️⃣ *N° da rua:* ${client.numero}   
    \n5️⃣ *Autorização LGPD* ${client.apoiolocal.toUpperCase()}
    \n0️⃣ *Tudo*
    \n#️⃣ *Excluir o meu cadastro*
    \n*️⃣ Retornar ao Menu`
      
      
      
      
      return response.json({
        followupEventInput: {
          name: "alteracadastro",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}`
           
          }
        }
      });
    }
  }

  if (queryResult.intent.displayName === "menu3") {
    return response.json({
      followupEventInput: {
        name: "cnpj-Cpf",
        languageCode: "pt-BR"
      }
    });
  }

  if (queryResult.intent.displayName === "checatelefonepjyes") {
    const celular = await arrumaCelular(session);
    const textoCnpj = String(queryResult.parameters.cnpjCpf);
    const client = await show(session);
    if (!client)
      return response.json({
        followupEventInput: {
          name: "cadastroempresa",
          languageCode: "pt-BR",
          parameters: { whats: `${celular.celular}`, cnpjCpf: `${textoCnpj}`,  fantasia: `${queryResult.parameters.fantasia}` }
        }
      });
    return response.json({
      followupEventInput: {
        name: "cadastroempresa",
        languageCode: "pt-BR",
        parameters: {
          responsavel: `${client.nome}`,
          whats: `${celular.celular}`,
          cnpjCpf: `${textoCnpj}`, fantasia: `${queryResult.parameters.fantasia}`
        }
      }
    });
  }

  if (queryResult.intent.displayName === "checatelefonepjno") {
    const celular = await arrumaCelular(session);
    const textoCnpj = String(queryResult.parameters.cnpjCpf);
    const client = await show(session);
    console.log("checatelefonepjno");
    console.log(textoCnpj);
    if (!client)
      return response.json({
        followupEventInput: {
          name: "cadastroempresa",
          languageCode: "pt-BR",
          parameters: { cnpjCpf: `${textoCnpj}`,  fantasia: `${queryResult.parameters.fantasia}` }
        }
      });
    return response.json({
      followupEventInput: {
        name: "cadastroempresa",
        languageCode: "pt-BR",
        parameters: { responsavel: `${client.nome}`, cnpjCpf: `${textoCnpj}`,  fantasia: `${queryResult.parameters.fantasia}` }
      }
    });
  }

//   if (queryResult.intent.displayName === "cadastroempresa - yes") {
//     return response.json({
//       followupEventInput: {
//         name: "contato",
//         languageCode: "pt-BR",
//         parameters: {
//           mensagem:
//             "Cadastro efetuado com Sucesso! \n \nAguarde uma mensagem de aprovação no WhatsApp informado."
//         }
//       }
//     });
//   }

//   if (queryResult.intent.displayName === "cadastroempresa - no") {
//     return response.json({
//       followupEventInput: { name: "contato", languageCode: "pt-BR" }
//     });
//   }

  if (queryResult.intent.displayName === "menu4") {
    return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem: "Quer falar com nosso time, segue nossos contatos:"
        }
      }
    });
  }

  if (queryResult.intent.displayName === "menu - sair") {
    return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `Espero ter ajudado 😊

Obrigado por utilizar *102paraWhats®* 🙏`
        }
      }
    });
  }
  if (queryResult.intent.displayName === "menu1") {
    const client = await show(session);

    if (!client)
      return response.json({
        followupEventInput: {
          name: "perguntacep",
          languageCode: "pt-BR"
        }
      });
    const mensagem = `Localidade: *${client.localidade}/${client.uf}*\n\nApoio local: *${client.apoiolocal.toUpperCase()}*`;
    return response.json({
      followupEventInput: {
        name: "pesquisa",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `${mensagem}`,
          nome: `${client.nome}`,
          cep: `${client.cep}`,
          localidade: `${client.localidade.toUpperCase()}`
        }
      }
    });
  }

   if (queryResult.intent.displayName === "perguntacep") {
   //const digitado = queryResult.parameters.atividade
   const cepnovo = String(queryResult.parameters.cep).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  const pesquisa = queryResult.parameters.pesquisa
  const client = await show(session);
  let nome = "Visitante"
  if (client) nome = client.nome;
  if (pesquisa){ if (cepnovo.length === 8){
  let textoAjustado 
  

        const parte1 = cepnovo.slice(0,5);
        const parte2 = cepnovo.slice(5,8);
      

        textoAjustado = `${parte1}-${parte2}`
        const cep = textoAjustado
   
    console.log("teste pergunta CEP")
    console.log(cep)
    const localidade = await viacep(cep);
     console.log(localidade)
    const mensagem = `Localidade: *${localidade.localidade}/${localidade.uf}*`;
   console.log(localidade.localidade)
     return response.json({
      followupEventInput: {
        name: "pesquisa",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `${mensagem}`,        
          localidade: `${localidade.localidade}`,
          atividade: `${pesquisa}`,
          
        }
      }
    });}
  const mensagem = `Localidade: *${cepnovo.toUpperCase()}*`;
    return response.json({
      followupEventInput: {
        name: "pesquisa",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `${mensagem}`,        
          localidade: `${cepnovo.toUpperCase()}`,
           atividade: `${pesquisa}`,
           
        }
      }
    });
   }
  else{ if (cepnovo.length === 8){
  let textoAjustado 
  

        const parte1 = cepnovo.slice(0,5);
        const parte2 = cepnovo.slice(5,8);
      

        textoAjustado = `${parte1}-${parte2}`
        const cep = textoAjustado
   
    console.log("teste pergunta CEP")
    console.log(cep)
    const localidade = await viacep(cep);
     console.log(localidade)
    const mensagem = `Localidade: *${localidade.localidade}/${localidade.uf}*`;
   console.log(localidade.localidade)
     return response.json({
      followupEventInput: {
        name: "pesquisa",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `${mensagem}`,        
          localidade: `${localidade.localidade}`,
          nome : `${nome}`
        }
      }
    });}
  const mensagem = `Localidade: *${cepnovo.toUpperCase()}*`;
    return response.json({
      followupEventInput: {
        name: "pesquisa",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `${mensagem}`,        
          localidade: `${cepnovo.toUpperCase()}`,
          nome : `${nome}`
        }
      }
    });
   }
   }
  
  if (queryResult.intent.displayName === "pesquisa") {
    const pesquisado = String(queryResult.parameters.atividade);
  console.log("teste CEP")
    console.log(queryResult.parameters.cep)
    const localidade = (queryResult.parameters.localidade)
    const resultas = await pesquisa(queryResult.parameters, localidade);
    
    console.log("teste CEP")
    console.log("teste resultas");
    let texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
    let text = "";
    let numero = "0";
    let rodape = `~${pesquisado.toUpperCase()}~ não foi encontrado em nossa base de dados 😞\nNão se preocupe, expandimos a pesquisa para *todos os resultados em ${localidade.toUpperCase()}.*\nEsperamos que possa encontrar o que deseja. 😊`;
    console.log(pesquisado);

    console.log("teste resultas");
    console.log(resultas);
    console.log(resultas.length);
    if ( resultas.length === 0){
             
      const resultas = await pesquisasimples(queryResult.parameters, localidade);
       await resultas.sort(function (a, b) {
	
	return (a.atividade > b.atividade) ? 1 : ((b.atividade > a.atividade) ? -1 : 0);

  
});
       
  
      
      texto =   `~${pesquisado.toUpperCase()}~ não foi encontrado em nossa base de dados 😞\nMas não se preocupe, expandimos a pesquisa para *todos os resultados em ${localidade.toUpperCase()}.*\nEsperamos que possa encontrar o que deseja. 😊`;
        
        
      let text = "";
 console.log("resultas tudo");
      console.log(resultas);

      resultas.forEach((search, index) => {
        text += `\n\n*${index+1} - ${search.nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${search.whats
          .match(/\d+/g)
          .join("")}\n*Atividade:* ${search.atividade.toLowerCase()}`;
      }); 
         console.log("retorno");
       console.log(`${texto}${text}`);
        return response.json({
        followupEventInput: {
          name: "respostaexpandidatudo",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}${text}`,
            atividade: `${pesquisado}`,
            localidade: `${localidade}`,
            rodape: "Esses são todos os resultados."
          }
        }
      });
    }
    
    resultas.forEach((search, index) => {
      if (index === 0) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "1";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text += `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}`;
     
      
      }
      if (index === 1) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "2";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}
                \n2️⃣ *${
                  resultas[1].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 2) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "3";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")} 
                \n2️⃣ *${
                  resultas[1].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}
                \n3️⃣ *${
                  resultas[2].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[2].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 3) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "4";
         rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *Nome:* ${
          resultas[0].nomeFantasia.toUpperCase()
        } \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}
                \n2️⃣ *Nome:* ${
                  resultas[1].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}
                \n3️⃣ *Nome:* ${
                  resultas[2].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[2].whats
          .match(/\d+/g)
          .join("")}
                \n4️⃣ *Nome:* ${
                  resultas[3].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[3].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 4) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "4";
      rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${resultas[0].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")} 
                \n2️⃣ *${resultas[1].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[1].whats.match(/\d+/g).join("")} 
                \n3️⃣ *${resultas[2].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[2].whats.match(/\d+/g).join("")}
                \n4️⃣ *${resultas[3].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[3].whats.match(/\d+/g).join("")}
                \n5️⃣ *Mais resultados*`;
      }
    });

    return response.json({
      followupEventInput: {
        name: "resposta",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `Exibindo *${numero}* de ${texto}\n${text}`,
          atividade: `${pesquisado}`,
          rodape: `${rodape}`,
          localidade: `${localidade}`
        }
      }
    });
  }

  if (queryResult.intent.displayName === "resposta") {
    const pesquisado = String(queryResult.parameters.atividade);
    const numero = String(queryResult.parameters.texto);
  const localidade = queryResult.parameters.localidade;
    console.log("resposta");
    // console.log(queryResult.parameters.texto);
    // console.log(pesquisado);
    // console.log(queryResult.parameters.atividade);
    // console.log(queryResult.parameters.cep);
    // console.log(queryResult);
    
    if (numero === "*") {
    const client = await show(session);
    if (!client) {    
    return response.json({followupEventInput: {
        name: "menu",}
    });}
    const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`
        }
      }
    });       
    } 
    if (numero === "5") {
      const resultas = await pesquisa(queryResult.parameters, localidade);

      const texto = `Exibindo *todos os ${resultas.length}* resultados encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
      let text = "";

      console.log(resultas);

      resultas.forEach((search, index) => {
        text += `\n\n*${index+1} - ${search.nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${search.whats
          .match(/\d+/g)
          .join("")}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostatudo",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "Esses são todos os resultados."
          }
        }
      });
    }

    if (numero === "0") {
      
        return response.json({
        followupEventInput: {
          name: "contato",
          languageCode: "pt-BR",
          parameters: {
            mensagem:  "Espero ter ajudado 😊\nObrigado por utilizar o 102 para whatsapp 🙏",
            
          }
        }
      });
      
    } 
    else {
      const resultas = await pesquisa(queryResult.parameters, localidade);
     const celular = resultas[numero - 1].whats;
      const idUser = String(celular)
        .match(/\d+/g)
        .join("");
      const whats = `https://wa.me/55${idUser}`;
    let cidadematriz = (resultas[numero - 1].cidadematriz).toUpperCase();      
      let localidades = localidade.toUpperCase();    
      let local = "";
      if (cidadematriz === localidades) local = `\n\n*Essa é uma empresa ou serviço de Empreendedores da sua cidade*`;      
      let text = "";

      resultas.forEach((search, index) => {
        text = `*${resultas[numero - 1].nomeFantasia.toUpperCase()}*
            \n*Verificação:* ${resultas[numero - 1].contaverificada}
            \n*Avaliação:* ${resultas[numero - 1].estrela}
            \n*Atividade:* ${resultas[numero - 1].atividade}
            \n*Telefone:* ${resultas[numero - 1].telefone}
            \n*Endereço:* ${resultas[numero - 1].rua} *N°:* ${resultas[numero - 1].numero}
            \n*Bairro:* ${resultas[numero - 1].bairro}
            \n*Cidade:* ${resultas[numero - 1].localidade}/${resultas[numero - 1].uf}
            \n*Modo de atendimento:* ${resultas[numero - 1].tipo}
            \n*Horario de atendimento:* ${resultas[numero - 1].horario}
            \n*Whats:* *${whats}*
            \n*Facebook:* *${resultas[numero - 1].facebook}*
            \n*Instagram:* *${resultas[numero - 1].instagram}*
            \n*Site:* *${resultas[numero - 1].site}*
            \n*Email:* *${resultas[numero - 1].email}*
            \n*Como Chegar:* *${resultas[numero - 1].comochegar}*${local}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostadetalhada",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "5️⃣ *Mais resultados*"
          }
        }
      });
    }
  }

  if (queryResult.intent.displayName === "respostatudo") {
    const pesquisado = String(queryResult.parameters.atividade);
  const localidade = queryResult.parameters.localidade;
    const numero = String(queryResult.parameters.texto);

             if (numero === "*") {
    const client = await show(session);
    if (!client) {    
    return response.json({followupEventInput: {
        name: "menu",}
    });}
    const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`
        }
      }
    });       
    } 
    if (numero === "0") {
      
        return response.json({
        followupEventInput: {
          name: "contato",
          languageCode: "pt-BR",
          parameters: {
            mensagem:  "Espero ter ajudado 😊\nObrigado por utilizar o 102 para whatsapp 🙏",
            
          }
        }
      });
    } else {
      const resultas = await pesquisa(queryResult.parameters, localidade);
      let celular = resultas[numero - 1].whats;
      const idUser = String(celular)
        .match(/\d+/g)
        .join("");
      const whats = `https://wa.me/55${idUser}`;
    let cidadematriz = (resultas[numero - 1].cidadematriz).toUpperCase();      
      let localidades = localidade.toUpperCase();    
      let local = "";
      if (cidadematriz === localidades) local = `\n\n*Essa é uma empresa ou serviço de Empreendedores da sua cidade*`;      
      let text = "";

      resultas.forEach((search, index) => {
        text = `*${resultas[numero - 1].nomeFantasia.toUpperCase()}*
            \n*Verificação:* ${resultas[numero - 1].contaverificada}
            \n*Avaliação:* ${resultas[numero - 1].estrela}
            \n*Atividade:* ${resultas[numero - 1].atividade}
            \n*Telefone:* ${resultas[numero - 1].telefone}
            \n*Endereço:* ${resultas[numero - 1].rua} *N°:* ${resultas[numero - 1].numero}
            \n*Bairro:* ${resultas[numero - 1].bairro}
            \n*Cidade:* ${resultas[numero - 1].localidade}/${resultas[numero - 1].uf}
            \n*Modo de atendimento:* ${resultas[numero - 1].tipo}
            \n*Horario de atendimento:* ${resultas[numero - 1].horario}
            \n*Whats:* *${whats}*
            \n*Facebook:* *${resultas[numero - 1].facebook}*
            \n*Instagram:* *${resultas[numero - 1].instagram}*
            \n*Site:* *${resultas[numero - 1].site}*
            \n*Email:* *${resultas[numero - 1].email}*
            \n*Como Chegar:* *${resultas[numero - 1].comochegar}*${local}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostadetalhada",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "5️⃣ *Mais resultados*"
          }
        }
      });
    }
  }

  //     let text = "";

  //     for (const result of resultas) {
  //       text += `Nome: ${result.nomeFantasia} Atividade: ${result.atividade}\n`;
  //     }

  //     return response.json({ fulfillmentText: `${text}` });
  //}

  //   if (queryResult.intent.displayName === "") {
  //     const resultas = await pesquisa(queryResult.parameters.atividade);
  //     const text1 = `Nome: ${resultas[0].nomeFantasia} Atividade: ${resultas[0].atividade}`;
  //     const text2 = `Nome: ${resultas[1].nomeFantasia} Atividade: ${resultas[1].atividade}`;
  //     const text3 = `Nome: ${resultas[2].nomeFantasia} Atividade: ${resultas[2].atividade}`;
  //     const text4 = `Nome: ${resultas[3].nomeFantasia} Atividade: ${resultas[3].atividade}`;
  //     const text5 = `Nome: ${resultas[4].nomeFantasia} Atividade: ${resultas[4].atividade}`;

  //     return response.json({ fulfillmentText:

  //     `${text1}\n`
  //     `${text2}\n`
  //     `${text3}\n`
  //     `${text4}\n`
  //     `${text5}\n`
  //                          });

  
   if (queryResult.intent.displayName === "respostaexpandidatudo") {
    const pesquisado = String(queryResult.parameters.atividade);
  const localidade = queryResult.parameters.localidade
    const numero = String(queryResult.parameters.texto);
console.log(pesquisado)
     console.log(pesquisado)
              if (numero === "*") {
    const client = await show(session);
    if (!client) {    
    return response.json({followupEventInput: {
        name: "menu",}
    });}
    const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`
        }
      }
    });       
    } 
    if (numero === "0") {
      
        return response.json({
        followupEventInput: {
          name: "contato",
          languageCode: "pt-BR",
          parameters: {
            mensagem:  "Espero ter ajudado 😊\nObrigado por utilizar o 102 para whatsapp 🙏",
            
          }
        }
      });
    } else {
      console.log("chegou aqui no else")
      const resultas = await pesquisasimples(queryResult.parameters, localidade);
        await resultas.sort(function (a, b) {
	
	return (a.atividade > b.atividade) ? 1 : ((b.atividade > a.atividade) ? -1 : 0);

  
});
     
      
      console.log(resultas)
      const celular = resultas[numero - 1].whats;
      const idUser = String(celular)
        .match(/\d+/g)
        .join("");
      const whats = `https://wa.me/55${idUser}`;
       
      let cidadematriz = (resultas[numero - 1].cidadematriz).toUpperCase();      
      let localidades = localidade.toUpperCase();    
      let local = "";
      if (cidadematriz === localidades) local = `\n\n*Essa é uma empresa ou serviço de Empreendedores da sua cidade*`;      
      let text = "";

      resultas.forEach((search, index) => {
        text = `*${resultas[numero - 1].nomeFantasia.toUpperCase()}*
            \n*Verificação:* ${resultas[numero - 1].contaverificada}
            \n*Avaliação:* ${resultas[numero - 1].estrela}
            \n*Atividade:* ${resultas[numero - 1].atividade}
            \n*Telefone:* ${resultas[numero - 1].telefone}
            \n*Endereço:* ${resultas[numero - 1].rua} *N°:* ${resultas[numero - 1].numero}
            \n*Bairro:* ${resultas[numero - 1].bairro}
            \n*Cidade:* ${resultas[numero - 1].localidade}/${resultas[numero - 1].uf}
            \n*Modo de atendimento:* ${resultas[numero - 1].tipo}
            \n*Horario de atendimento:* ${resultas[numero - 1].horario}
            \n*Whats:* *${whats}*
            \n*Facebook:* *${resultas[numero - 1].facebook}*
            \n*Instagram:* *${resultas[numero - 1].instagram}*
            \n*Site:* *${resultas[numero - 1].site}*
            \n*Email:* *${resultas[numero - 1].email}*
            \n*Como Chegar:* *${resultas[numero - 1].comochegar}*${local}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostaexpandidadetalhada",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "5️⃣ *Mais resultados*"
          }
        }
      });
    }
  }

 

  
   if (queryResult.intent.displayName === "respostadetalhada") {
    const pesquisado = String(queryResult.parameters.atividade);
  const localidade = queryResult.parameters.localidade
    const numero = String(queryResult.parameters.texto);
          if (numero === "*") {
    const client = await show(session);
    if (!client) {    
    return response.json({followupEventInput: {
        name: "menu",}
    });}
    const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`
        }
      }
    });       
    } 
       if (numero === "5") {
      const resultas = await pesquisa(queryResult.parameters, localidade);

      const texto = `Exibindo *todos os ${resultas.length}* resultados encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
      let text = "";

      console.log(resultas);

      resultas.forEach((search, index) => {
        text += `\n\n*${index+1} - ${search.nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${search.whats.
        match(/\d+/g)
        .join("")}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostatudo",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "Esses são todos os resultados."
          }
        }
      });
    }


    if (numero === "0") {
      
        return response.json({
        followupEventInput: {
          name: "contato",
          languageCode: "pt-BR",
          parameters: {
            mensagem:  "Espero ter ajudado 😊\nObrigado por utilizar o 102 para whatsapp 🙏",
            
          }
        }
      });
    } else {
      const resultas = await pesquisa(queryResult.parameters, localidade);
      let celular = resultas[numero - 1].whats;
      const idUser = String(celular)
        .match(/\d+/g)
        .join("");
      const whats = `https://wa.me/55${idUser}`;
    let cidadematriz = (resultas[numero - 1].cidadematriz).toUpperCase();      
      let localidades = localidade.toUpperCase();    
      let local = "";
      if (cidadematriz === localidades) local = `\n\n*Essa é uma empresa ou serviço de Empreendedores da sua cidade*`;      
      let text = "";

      resultas.forEach((search, index) => {
        text = `*${resultas[numero - 1].nomeFantasia.toUpperCase()}*
            \n*Verificação:* ${resultas[numero - 1].contaverificada}
            \n*Avaliação:* ${resultas[numero - 1].estrela}
            \n*Atividade:* ${resultas[numero - 1].atividade}
            \n*Telefone:* ${resultas[numero - 1].telefone}
            \n*Endereço:* ${resultas[numero - 1].rua} *N°:* ${resultas[numero - 1].numero}
            \n*Bairro:* ${resultas[numero - 1].bairro}
            \n*Cidade:* ${resultas[numero - 1].localidade}/${resultas[numero - 1].uf}
            \n*Modo de atendimento:* ${resultas[numero - 1].tipo}
            \n*Horario de atendimento:* ${resultas[numero - 1].horario}
            \n*Whats:* *${whats}*
            \n*Facebook:* *${resultas[numero - 1].facebook}*
            \n*Instagram:* *${resultas[numero - 1].instagram}*
            \n*Site:* *${resultas[numero - 1].site}*
            \n*Email:* *${resultas[numero - 1].email}*
            \n*Como Chegar:* *${resultas[numero - 1].comochegar}*${local}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostadetalhada",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "5️⃣ *Mais resultados*"
          }
        }
      });
    }
  }

 if (queryResult.intent.displayName === "respostaexpandidadetalhada") {
    const localidade = queryResult.parameters.localidade
   const pesquisado = String(queryResult.parameters.atividade);

    const numero = String(queryResult.parameters.texto);
         if (numero === "*") {
    const client = await show(session);
    if (!client) {    
    return response.json({followupEventInput: {
        name: "menu",}
    });}
    const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`
        }
      }
    });       
    } 
       if (numero === "5") {
      const resultas = await pesquisasimples(queryResult.parameters, localidade);
       await resultas.sort(function (a, b) {
	
	return (a.atividade > b.atividade) ? 1 : ((b.atividade > a.atividade) ? -1 : 0);

  
});
      const texto = `~${pesquisado.toUpperCase()}~ não foi encontrado em nossa base de dados 😞\nMas não se preocupe, expandimos a pesquisa para *todos os resultados em ${localidade.toUpperCase()}.*\nEsperamos que possa encontrar o que deseja. 😊`;
      let text = "";

      console.log(resultas);

      resultas.forEach((search, index) => {
        text += `\n\n*${index+1} - ${search.nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${search.whats.
        match(/\d+/g)
        .join("")}\n*Atividade:* ${search.atividade.toLowerCase()}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostaexpandidatudo",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "Esses são todos os resultados."
          }
        }
      });
    }


    if (numero === "0") {
      
        return response.json({
        followupEventInput: {
          name: "contato",
          languageCode: "pt-BR",
          parameters: {
            mensagem:  "Espero ter ajudado 😊\nObrigado por utilizar o 102 para whatsapp 🙏",
            
          }
        }
      });
    } else {
      //verificar para excluir aqui
      const resultas = await pesquisasimples(queryResult.parameters, localidade);
             await resultas.sort(function (a, b) {
	
	return (a.atividade > b.atividade) ? 1 : ((b.atividade > a.atividade) ? -1 : 0);

  
});
      let celular = resultas[numero - 1].whats;
      const idUser = String(celular)
        .match(/\d+/g)
        .join("");
      const whats = `https://wa.me/55${idUser}`;
    let cidadematriz = (resultas[numero - 1].cidadematriz).toUpperCase();      
      let localidades = localidade.toUpperCase();    
      let local = "";
      if (cidadematriz === localidades) local = `\n\n*Essa é uma empresa ou serviço de Empreendedores da sua cidade*`;      
      let text = "";

      resultas.forEach((search, index) => {
        text = `*${resultas[numero - 1].nomeFantasia.toUpperCase()}*
            \n*Verificação:* ${resultas[numero - 1].contaverificada}
            \n*Avaliação:* ${resultas[numero - 1].estrela}
            \n*Atividade:* ${resultas[numero - 1].atividade}
            \n*Telefone:* ${resultas[numero - 1].telefone}
            \n*Endereço:* ${resultas[numero - 1].rua} *N°:* ${resultas[numero - 1].numero}
            \n*Bairro:* ${resultas[numero - 1].bairro}
            \n*Cidade:* ${resultas[numero - 1].localidade}/${resultas[numero - 1].uf}
            \n*Modo de atendimento:* ${resultas[numero - 1].tipo}
            \n*Horario de atendimento:* ${resultas[numero - 1].horario}
            \n*Whats:* *${whats}*
            \n*Facebook:* *${resultas[numero - 1].facebook}*
            \n*Instagram:* *${resultas[numero - 1].instagram}*
            \n*Site:* *${resultas[numero - 1].site}*
            \n*Email:* *${resultas[numero - 1].email}*
            \n*Como Chegar:* *${resultas[numero - 1].comochegar}*${local}`;
      });

      return response.json({
        followupEventInput: {
          name: "respostaexpandidadetalhada",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${text}`,
            atividade: `${pesquisado}`,
            localidade: `${queryResult.parameters.localidade}`,
            rodape: "5️⃣ *Mais resultados*"
          }
        }
      });
    }
  }

  if (queryResult.intent.displayName === "cnpj-Cpf") {
    const textoCnpj = String(queryResult.parameters.cnpjCpf)
      .match(/\d+/g)
      .join("");
    const cnpj = await showpj(String(textoCnpj));
    const celular = arrumaCelular(session);
    const empresa = await cnpjCpf(textoCnpj);
    const data = session.split("/");
    const numero = data[data.length - 1];
    const idUser = String(numero)
      .match(/\d+/g)
      .join("");

    console.log("parte1");
    console.log(textoCnpj);
    //console.log(parseInt(textoCnpj))
    //  console.log(String(textoCnpj))

    // console.log(empresa);
    if (textoCnpj.length === 14) {
      if (cnpj) {
        let textoAjustado;

        const parte1 = textoCnpj.slice(0, 2);
        const parte2 = textoCnpj.slice(2, 5);
        const parte3 = textoCnpj.slice(5, 8);
        const parte4 = textoCnpj.slice(8, 12);
        const parte5 = textoCnpj.slice(12, 14);

        textoAjustado = `${parte1}.${parte2}.${parte3}/${parte4}-${parte5}`;
       return response.json({
        followupEventInput: {
          name: "menu",
          languageCode: "pt-BR",
          parameters: {
           nome:  `O CNPJ: *${textoAjustado}* já possui cadastro em nossa base de dados!\n \n Para duvidas acesse a opção 4 (Fale com nossa equipe)`}
            
        }});
        
      }

      if (empresa.status === "ERROR") {
         return response.json({
        followupEventInput: {
          name: "cnpj-Cpf",
          languageCode: "pt-BR",
          parameters: {
           mensagem:  "CNPJ invalido, por favor"}
            
        }}); 
        
        
      }
      console.log("parte2");
      console.log(textoCnpj);
     console.log(empresa.status); 
      
      console.log(empresa.fantasia);
      if (empresa.fantasia === '') {
       return response.json({
        followupEventInput: {
          name: "checatelefonepj",
          languageCode: "pt-BR",
          parameters: {
            whats: `${celular.celular}`,
            cnpjCpf: `${textoCnpj}`,
          fantasia: "sua empresa *não tem um nome fantasia publico*, digite o nome fantasia com qual seus clientes já estão acostumados a pesquisar."}
          }
        });
      }

      return response.json({
        followupEventInput: {
          name: "checatelefonepj",
          languageCode: "pt-BR",
          parameters: {
            whats: `${celular.celular}`,
            cnpjCpf: `${textoCnpj}`,
            fantasia: `seu nome fantasia publico está sendo : *${empresa.fantasia}*. Se estiver correto é só reescrevê-lo aqui, caso contrario digite o nome fantasia com qual seus clientes já estão acostumados a pesquisar. `
          }
        }
      });
    }

    if (TestaCPF(textoCnpj)) {
      const client = await show(session);

      if (cnpj) {
        let textoAjustado;

        const parte1 = textoCnpj.slice(0, 3);
        const parte2 = textoCnpj.slice(3, 6);
        const parte3 = textoCnpj.slice(6, 9);
        const parte4 = textoCnpj.slice(9, 11);

        textoAjustado = `${parte1}.${parte2}.${parte3}-${parte4}`;

         return response.json({
        followupEventInput: {
          name: "menu",
          languageCode: "pt-BR",
          parameters: {
           nome:  `O CPF: *${textoAjustado}* já possui cadastro em nossa base de dados!\n \n Para duvidas acesse a opção 4 (Fale com nossa equipe)`,
          usuario: "Acessar meu cadastro"}
            
        }});
      }

      if (!client) {
        return response.json({
          followupEventInput: {
            name: "cadastro",
            parameters: {
              /*"cnpjCpf": "falso", "atividade": "falso", "tipo": "falso", "horario": "falso", "whats": "falso", "responsavel": "falso",*/
              mensagem:
                "Antes de se cadastrar como autonomo você precisa se cadastrar como usuario, quando terminar, é só ir novamente no menu principal e se cadastrar como autonomo."
            }
          }
        });
      }

      return response.json({
        followupEventInput: {
          name: "cadastrocpf",
          languageCode: "pt-BR",
          parameters: {
            whats: `${celular.celular}`,
            cnpjCpf: `${textoCnpj}`
          }
        }
      });
    } else {
     return response.json({
        followupEventInput: {
          name: "cnpj-Cpf",
          languageCode: "pt-BR",
          parameters: {
           mensagem:  `Os dados digitados: *${textoCnpj}* são invalidos`}
            
        } });
      
    }
  }

  if (queryResult.intent.displayName === "checatelefonepj") {
    const textoCnpj = String(queryResult.parameters.cnpjCpf)
      .match(/\d+/g)
      .join("");
    const sim = queryResult.parameters.sim.toUpperCase();
    const nao = queryResult.parameters.sim.toUpperCase();
    const naum = queryResult.parameters.sim.toUpperCase();
    const celular = await arrumaCelular(session);

    const cnpj = await showpj(String(textoCnpj));

    console.log("queryResult.session");
    console.log(queryResult.session);

    if (sim === "SIM")
      return response.json({
        followupEventInput: {
          name: "checatelefonepjyes",
          languageCode: "pt-BR",
          parameters: {
            whats: `${celular.celular}`,
            cnpjCpf: `${textoCnpj}`,
            fantasia: `${queryResult.parameters.fantasia}`
          }
        }
      });

    console.log("checatelefonepjno");
    console.log(textoCnpj);

    if (nao === "NÃO")
      return response.json({
        followupEventInput: {
          name: "checatelefonepjno",
          languageCode: "pt-BR",
          parameters: { cnpjCpf: `${textoCnpj}`,
                       fantasia: `${queryResult.parameters.fantasia}`}
        }
      });
    if (naum === "NAO")
      return response.json({
        followupEventInput: {
          name: "checatelefonepjno",
          languageCode: "pt-BR",
          parameters: { cnpjCpf: `${textoCnpj}`,
                       fantasia: `${queryResult.parameters.fantasia}`}
        }
      });
  }

  if (queryResult.intent.displayName === "cadastrocpf") {
    const textoCnpj = String(queryResult.parameters.cnpjCpf);
    // const celular = arrumaCelular(session);
    const client = await show(session);
    const empresa = await createpf(
      queryResult.parameters,
      session,
      textoCnpj,
      client
    );
    console.log(queryResult);
    let textoAjustado;

    const parte1 = textoCnpj.slice(0, 3);
    const parte2 = textoCnpj.slice(3, 6);
    const parte3 = textoCnpj.slice(6, 9);
    const parte4 = textoCnpj.slice(9, 11);

    textoAjustado = `${parte1}.${parte2}.${parte3}-${parte4}`;

    const texto = await `*Seus dados estão corretos?*
    \n*Nome divilgado:* ${queryResult.parameters.nome.toUpperCase()}
    \n*Nome do profissional:* ${client.nomecompleto.toUpperCase()}
    \n*CPF:* ${textoAjustado} 
    \n*Atividade:* ${queryResult.parameters.servicos.toUpperCase()}
    \n*Modo de atendimento:* ${queryResult.parameters.tipo}
    \n*Horario de Atendimento:* ${queryResult.parameters.horario}
    \n*WhatsApp:* ${client.telefone}  
    \n*Rua:* ${client.rua}, *Nº:* ${client.numero}
    \n*Bairro:* ${client.bairro} - *CEP:* ${client.cep}
    \n*Localidade:* ${client.localidade}/${client.uf}
    \n*E-mail:* ${queryResult.parameters.email.toLowerCase()}
    \n*SIM* ou *NÃO* `
    console.log(texto)
    console.log(textoAjustado)
    console.log(client.telefone)
      return response.json({
      followupEventInput: {
        name: "exibecadastrocpf",
        languageCode: "pt-BR",
        parameters: {
          mensagem:`${texto}`,
          cnpj: `${textoAjustado}`, 
          whats: `${client.telefone}`
          
        }
      }
    });
    } 

//   if (queryResult.intent.displayName === "cadastrocpf - yes") {
//     return response.json({
//       followupEventInput: {
//         name: "contato",
//         languageCode: "pt-BR",
//         parameters: {
//           mensagem:
//             "Cadastro efetuado com Sucesso! \n \nAguarde uma mensagem de aprovação no WhatsApp informado."
//         }
//       }
//     });
//   }

//   if (queryResult.intent.displayName === "cadastrocpf - no") {
//     return response.json({
//       followupEventInput: { name: "contato", languageCode: "pt-BR" }
//     });
//   }

    
  
  
   if (queryResult.intent.displayName === "exibecadastroempresa") {
  const cnpj = queryResult.parameters.cnpj
 
  const cell = await arrumaCelular2(queryResult.parameters.whats);
  const celular = await arrumaCelular3(cell.celular);
  
   const numerosms = celular.celular
  
    const sim = queryResult.parameters.simounao;

    console.log(sim);
    console.log(numerosms);
  

    if (sim === "SIM"){
     sms(cnpj, numerosms)
       return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem:
           `*Cadastro efetuado com Sucesso!* \n \nAguarde uma mensagem de aprovação com sua senha de acesso no WhatsApp informado. Para acessar seu cadastro e incluir outras informações para deixar seu cadastro ainda mais completo clique aqui:\n👉 *https://api.whatsapp.com/send?phone=554391169015&text=cadastro*`
        }
      }
    });
    }

   else{ 
    sms(cnpj, numerosms)
     return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem:
            `*Cadastro efetuado com Sucesso!* \n \nAguarde uma mensagem de aprovação com sua senha de acesso no WhatsApp informado e clique aqui para fazer as alterações necessárias clique aqui:\nA👉 *https://api.whatsapp.com/send?phone=554391169015&text=cadastro*`
        }
      }
    });
   }
  }
 
    if (queryResult.intent.displayName === "exibecadastrocpf") {
  const cnpj = queryResult.parameters.cnpj
  const numerosms = queryResult.parameters.whats
  
    const sim = queryResult.parameters.simounao;

    console.log(sim);
    console.log(numerosms);
  

    if (sim === "SIM"){
     sms(cnpj, numerosms)
       return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem:
           `*Cadastro efetuado com Sucesso!* \n \nAguarde uma mensagem de aprovação com sua senha de acesso no WhatsApp informado. Para acessar seu cadastro e incluir outras informações para deixar seu cadastro ainda mais completo clique aqui:\n👉 *https://api.whatsapp.com/send?phone=554391169015&text=cadastro*`
        }
      }
    });
    }

   else{ 
    sms(cnpj, numerosms)
     return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem:
            `*Cadastro efetuado com Sucesso!* \n \nAguarde uma mensagem de aprovação com sua senha de acesso no WhatsApp informado e clique aqui para fazer as alterações necessárias clique aqui:\nA👉 *https://api.whatsapp.com/send?phone=554391169015&text=cadastro*`
        }
      }
    });
   }
  }
  
 if (queryResult.intent.displayName === "chamamenu") {
    const client = await show(session);
    return response.json({
      followupEventInput: {
        name: "menu",
        languageCode: "pt-BR",
        parameters: { nome: `Estou aqui *${client.nome}*`, usuario: "Acessar meu cadastro" }
      }
    });
  }
  
   
 if (queryResult.intent.displayName === "cadastropjpfsenha") {
   console.log("esta aqui")
   
    const textoCnpj = String(queryResult.parameters.cnpjCpf)
      .match(/\d+/g)
      .join("");
  
   console.log("testa cnpj")
     console.log(textoCnpj)
   console.log(String(queryResult.parameters.cnpjCpf).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""))
   const cnpj = await showpj(String(textoCnpj));
    
    console.log(cnpj)
  console.log("esta aqui")
   
    
      if (!cnpj) 
        
         return response.json({
        followupEventInput: {
          name: "cadastropjpfsenha",
          languageCode: "pt-BR",
          parameters: {
           mensagem:  `*CNPJ ou CPF invalidos, tente novamente*`}
            }});
          
       
     console.log(textoCnpj)
        return response.json({
        followupEventInput: {
          name: "alteracadastropfpj",
          languageCode: "pt-BR",
          parameters: {
           cnpjCpf: textoCnpj}
            
        }});
      


   
   
  }
  
  if (queryResult.intent.displayName === "alteracadastropfpj") {

    const textoCnpj = String(queryResult.parameters.cnpjCpf)
  
   const senha = String(queryResult.parameters.senha);
   
   const cnpj = await showpj(String(textoCnpj));
    console.log("senha")
    console.log(senha)
    console.log(cnpj)
    console.log(textoCnpj)
  if (cnpj.login === senha){

      const idUser = String(cnpj.whats)
        .match(/\d+/g)
        .join("");
      
let avaliacao =`${cnpj.estrela}`;

    if (avaliacao === "SEJA O PRIMEIRO A AVALIAR"){
      avaliacao = "NENHUMA AVALIAÇÃO"
    }
   
    const texto = `
  *O que você deseja alterar ou incluir no cadastro da sua Empresa ou do seu Serviço Prestado?*

*Verificação:* ${cnpj.contaverificada}
*Avaliação:* ${avaliacao}
*Local da Matriz:* ${cnpj.cidadematriz}

1️⃣ *Nome divulgado e Razão social:* 
Nome divulgado: ${cnpj.nomeFantasia}
Razão social: ${cnpj.razaoSocial}           

2️⃣ *Contatos telefônicos:*
Telefone Celular: ${cnpj.whats}
Whats: https://wa.me/55${idUser}
Telefone Fixo: ${cnpj.telefone}

3️⃣ *Endereço e Como Chegar:*
Rua: ${cnpj.rua} N°: ${cnpj.numero}            
Bairro: ${cnpj.bairro}            
Cidade: ${cnpj.localidade}/${cnpj.uf}
Como Chegar: ${cnpj.comochegar}

4️⃣ *Atividade e Sub-buscas:* 
Atividade: ${cnpj.atividade} 
Palavra chave 1: ${cnpj.subbusca1} 
Palavra chave 2: ${cnpj.subbusca2} 
Palavra chave 3: ${cnpj.subbusca3} 

5️⃣ *Horário e Modo de Atendimento:*    
Horário de atendimento: ${cnpj.horario}
Modo de atendimento: ${cnpj.tipo} 

6️⃣ *Mídias Sociais, Site e E-mail:*
Facebook: ${cnpj.facebook}          
Instagram: ${cnpj.instagram} 
Site: ${cnpj.site}            
E-mail: ${cnpj.email}

*️⃣ Menu

0️⃣ SAIR

  `
   
      return response.json({
        followupEventInput: {
          name: "alteracadastropfpjmenu",
          languageCode: "pt-BR",
           parameters: {
           mensagem:  texto,
           cnpjCpf: textoCnpj,
           senha: senha}
            
        }}); 
    }
    return response.json({
        followupEventInput: {
          name: "alteracadastropfpj",
          languageCode: "pt-BR",
          parameters: {
           mensagem:  `*Senha incorreta!* 🚨\n\n*Digite a senha corretamente.*`,
           cnpjCpf: textoCnpj}
            
        }});
  }
  
  
   if (queryResult.intent.displayName === "menurapido") {
    const pesquisado = String(queryResult.parameters.atividade);
    console.log("teste CEP")
    console.log(queryResult.parameters.localidade)
    const localidade = (queryResult.parameters.localidade)
    const menu = pesquisado.toUpperCase()
      if (menu === "M") {      
        const client = await show(session,);

        return response.json({
      followupEventInput: {
        name: "menucadastrado",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`
        }
      }
    });
    }  
     if (menu === "MENU") {      
        const client = await show(session,);

        return response.json({
      followupEventInput: {
        name: "menucadastrado",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`
        }
      }
    });
    } else {
    const resultas = await pesquisa(queryResult.parameters, localidade);
    let texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
    let text = "";
    let numero = "0";
    let rodape = `~${pesquisado.toUpperCase()}~ não foi encontrado em nossa base de dados 😞\nNão se preocupe teste, expandimos a pesquisa para *todos os resultados em ${localidade.toUpperCase()}.*\nEsperamos que possa encontrar o que deseja. 😊`;
    console.log(pesquisado);

    console.log("teste resultas");
    console.log(resultas);
    console.log(resultas.length);
   
     
     if ( resultas.length === 0){
       // resultas.forEach((search, index) => {
       //  if (index === 0) {}}  
       console.log("pesquisasimples MenuRapido")
      const resultas = await pesquisasimples(queryResult.parameters, localidade);
console.log(resultas)
       await resultas.sort(function (a, b) {
	
	return (a.atividade > b.atividade) ? 1 : ((b.atividade > a.atividade) ? -1 : 0);

  
});
     console.log("result abc") 
      console.log(resultas) 
      texto =   `~${pesquisado.toUpperCase()}~ não foi encontrado em nossa base de dados 😞\nMas não se preocupe, expandimos a pesquisa para *todos os resultados em ${localidade.toUpperCase()}.*\nEsperamos que possa encontrar o que deseja. 😊`;
        
        
        
      let text = "";
 console.log("resultas tudo");
      console.log(resultas);

      resultas.forEach((search, index) => {
        text += `\n\n*${index+1} - ${search.nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${search.whats
          .match(/\d+/g)
          .join("")}\n*Atividade:* ${search.atividade.toLowerCase()}`;
      }); 
         console.log("retorno");
       console.log(`${texto}${text}`);
        return response.json({
        followupEventInput: {
          name: "respostaexpandidatudo",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}${text}`,
            atividade: `${pesquisado}`,
            localidade: `${localidade}`,
            rodape: "Esses são todos os resultados."
          }
        }
      });
    }
    
    resultas.forEach((search, index) => {
        if (index === 0) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "1";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text += `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}`;
     
      
      }
      if (index === 1) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "2";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}
                \n2️⃣ *${
                  resultas[1].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 2) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "3";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")} 
                \n2️⃣ *${
                  resultas[1].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}
                \n3️⃣ *${
                  resultas[2].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[2].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 3) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "4";
         rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *Nome:* ${
          resultas[0].nomeFantasia.toUpperCase()
        } \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}
                \n2️⃣ *Nome:* ${
                  resultas[1].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}
                \n3️⃣ *Nome:* ${
                  resultas[2].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[2].whats
          .match(/\d+/g)
          .join("")}
                \n4️⃣ *Nome:* ${
                  resultas[3].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[3].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 4) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "4";
      rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${resultas[0].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")} 
                \n2️⃣ *${resultas[1].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[1].whats.match(/\d+/g).join("")} 
                \n3️⃣ *${resultas[2].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[2].whats.match(/\d+/g).join("")}
                \n4️⃣ *${resultas[3].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[3].whats.match(/\d+/g).join("")}
                \n5️⃣ *Mais resultados*`;
      }
    });

    return response.json({
      followupEventInput: {
        name: "resposta",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `Exibindo *${numero}* de ${texto}\n${text}`,
          atividade: `${pesquisado}`,
          rodape: `${rodape}`,
          localidade: `${localidade}`
        }
      }
    });
 
   
    }
   
   
   }
  
  
  
  if (queryResult.intent.displayName === "menucadastrado") {

  const localidade = queryResult.parameters.localidade;
    const numero = String(queryResult.parameters.texto);
    if (numero === "1") {      
     return response.json({
        followupEventInput: {
          name: "perguntacep",
          languageCode: "pt-BR"
        }});       
    } 
     if (numero === "2") {
       const client = await show(session,);
  
       const texto = await`🔢 Digite a opção que deseja *alterar*: 
    \n1️⃣ *Nome:* ${client.nomecompleto.toUpperCase()}
    \n2️⃣ *Telefone:* ${client.telefone}
    \n3️⃣ *Endereço:* ${client.rua}\n${client.localidade}/${client.uf}
    \n4️⃣ *N° da rua:* ${client.numero}   
    \n5️⃣ *Autorização LGPD* ${client.apoiolocal.toUpperCase()}
    \n0️⃣ *Tudo*
    \n#️⃣ *Excluir o meu cadastro*
    \n*️⃣ Retornar ao Menu`
      
      
      
      
      return response.json({
        followupEventInput: {
          name: "alteracadastro",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}`
           
          }
        }
      });
    }
  
     if (numero === "3") {      
      return response.json({
      followupEventInput: {
        name: "cnpj-Cpf",
        languageCode: "pt-BR"
      }
    });   
    } 
      if (numero === "4") {      
       return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem: "Quer falar com nosso time, segue nossos contatos:"
        }
      }
    });
    } 
       if (numero === "*") {      
        const client = await show(session,);
  
        const apoiolocal = `${client.apoiolocal.toUpperCase()}*`;
    const cidadeuf = `${client.localidade}/${client.uf}`
    return response.json({
      followupEventInput: {
        name: "menurapido",
        languageCode: "pt-BR",
        parameters: {
          nome: `${client.nome}`,
          localidade: `${client.localidade.toUpperCase()}`,
          apoiolocal: `${apoiolocal}`,
          cidadeuf: `${cidadeuf}`
        }
      }
    });   
    } 
       if (numero === "0") {      
      return response.json({
      followupEventInput: {
        name: "contato",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `Espero ter ajudado 😊

Obrigado por utilizar *102paraWhats®* 🙏`
        }
      }
    });
    }
 
  }
  
   if (queryResult.intent.displayName === "alteracadastropfpjmenu") {
  const numero = String(queryResult.parameters.texto)
  const cnpjCpf = queryResult.parameters.cnpjCpf
 const senha = String(queryResult.parameters.senha);
  console.log("alteracadastropfpjmenu")
    console.log(numero) 
    if (numero === "1"){
       console.log("chegou no numero 1")
      
    const texto = `*Que informações você deseja incluir ou alterar?*
    
1️⃣ *Nome divulgado:* 

2️⃣ *Razão social:* `
    
       return response.json({
      followupEventInput: {
        name: "alteracadastropfpjmenu1",
        languageCode: "pt-BR",
        parameters: {
          mensagem: texto,
          cnpjCpf: cnpjCpf,
          senha: senha
           
        }
      }
    });
    }

  }
     if (queryResult.intent.displayName === "alteracadastropfpjmenu1") {
 const numero = String(queryResult.parameters.texto)
  const cnpjCpf = queryResult.parameters.cnpjCpf
  const senha = String(queryResult.parameters.senha);
    if (numero === "1"){
    const texto = "*Qual o nome que você deseja divulgar?*"
    

       return response.json({
      followupEventInput: {
        name: "alteracadastropfpjmenupergunta",
        languageCode: "pt-BR",
        parameters: {
          mensagem: texto,
          cnpjCpf: cnpjCpf,
          coluna: "nomeFantasia", 
          senha: senha
        }
      }
    });
    }

  }
  
   if (queryResult.intent.displayName === "alteracadastropfpjmenupergunta") {
 const texto = String(queryResult.parameters.texto);
 const cnpjCpf = String(queryResult.parameters.cnpjCpf);
 const digitado = String(queryResult.parameters.coluna) ;
 const senha = String(queryResult.parameters.senha);
   
   if(digitado === "nomeFantasia") {
await axios.patch(`${process.env.URL_SHEET3}/cnpj/${cnpjCpf}`,{
        "data": {  nomeFantasia: texto }
    }).then( response => {
        console.log(response.data);
    });
       return response.json({
      followupEventInput: {
        name: "alteracadastropfpj",
        languageCode: "pt-BR",
        parameters: {
          senha: senha,
          cnpjCpf: cnpjCpf
           
        }
      }
    });
   }
     

  }
  
   if (queryResult.intent.displayName === "pesquisarapida") {
    const pesquisado = queryResult.parameters.atividade;
    console.log("teste pesquisa")
     console.log(pesquisado)
     const client = await show(session);
    
   if (client) {
     console.log("teste cidade")
     
     const localidade = client.localidade;
     console.log(localidade)
     const resultas = await pesquisa(queryResult.parameters, localidade);
    let texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
    let text = "";
    let numero = "0";
    let rodape = `~${pesquisado.toUpperCase()}~ não foi encontrado em nossa base de dados 😞\nNão se preocupe teste, expandimos a pesquisa para *todos os resultados em ${localidade.toUpperCase()}.*\nEsperamos que possa encontrar o que deseja. 😊`;
    console.log(pesquisado);

    console.log("teste resultas");
    console.log(resultas);
    console.log(resultas.length);
   
     
     if ( resultas.length === 0){
       // resultas.forEach((search, index) => {
       //  if (index === 0) {}}  
       console.log("pesquisasimples MenuRapido")
      const resultas = await pesquisasimples(queryResult.parameters, localidade);
console.log(resultas)
       await resultas.sort(function (a, b) {
	
	return (a.atividade > b.atividade) ? 1 : ((b.atividade > a.atividade) ? -1 : 0);

  
});
     console.log("result abc") 
      console.log(resultas) 
      texto =   `~${pesquisado.toUpperCase()}~ não foi encontrado em nossa base de dados 😞\nMas não se preocupe, expandimos a pesquisa para *todos os resultados em ${localidade.toUpperCase()}.*\nEsperamos que possa encontrar o que deseja. 😊`;
        
        
        
      let text = "";
 console.log("resultas tudo");
      console.log(resultas);

      resultas.forEach((search, index) => {
        text += `\n\n*${index+1} - ${search.nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${search.whats
          .match(/\d+/g)
          .join("")}\n*Atividade:* ${search.atividade.toLowerCase()}`;
      }); 
         console.log("retorno");
       console.log(`${texto}${text}`);
        return response.json({
        followupEventInput: {
          name: "respostaexpandidatudo",
          languageCode: "pt-BR",
          parameters: {
            mensagem: `${texto}${text}`,
            atividade: `${pesquisado}`,
            localidade: `${localidade}`,
            rodape: "Esses são todos os resultados."
          }
        }
      });
    }
    
    resultas.forEach((search, index) => {
        if (index === 0) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "1";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text += `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}`;
     
      
      }
      if (index === 1) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "2";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}
                \n2️⃣ *${
                  resultas[1].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 2) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "3";
          rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${
          resultas[0].nomeFantasia.toUpperCase()
        }* \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")} 
                \n2️⃣ *${
                  resultas[1].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}
                \n3️⃣ *${
                  resultas[2].nomeFantasia.toUpperCase()
                }* \n*Whats:* https://wa.me/55${resultas[2].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 3) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "4";
         rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *Nome:* ${
          resultas[0].nomeFantasia.toUpperCase()
        } \n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")}
                \n2️⃣ *Nome:* ${
                  resultas[1].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[1].whats
          .match(/\d+/g)
          .join("")}
                \n3️⃣ *Nome:* ${
                  resultas[2].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[2].whats
          .match(/\d+/g)
          .join("")}
                \n4️⃣ *Nome:* ${
                  resultas[3].nomeFantasia.toUpperCase()
                } \n*Whats:* https://wa.me/55${resultas[3].whats
          .match(/\d+/g)
          .join("")}`;
      }
      if (index === 4) {
        texto = `*${resultas.length}* resultado (s) encontrados para *${pesquisado.toUpperCase()}* em *${localidade.toUpperCase()}*.`;
        numero = "4";
      rodape = "🔢 Digite o *numero* da pesquisa para mais detalhes 😊"
        text = `\n1️⃣ *${resultas[0].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[0].whats.match(/\d+/g).join("")} 
                \n2️⃣ *${resultas[1].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[1].whats.match(/\d+/g).join("")} 
                \n3️⃣ *${resultas[2].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[2].whats.match(/\d+/g).join("")}
                \n4️⃣ *${resultas[3].nomeFantasia.toUpperCase()}*\n*Whats:* https://wa.me/55${resultas[3].whats.match(/\d+/g).join("")}
                \n5️⃣ *Mais resultados*`;
      }
    });

    return response.json({
      followupEventInput: {
        name: "resposta",
        languageCode: "pt-BR",
        parameters: {
          mensagem: `Exibindo *${numero}* de ${texto}\n${text}`,
          atividade: `${pesquisado}`,
          rodape: `${rodape}`,
          localidade: `${localidade}`
        }
      }
    });
 
   
    }else { return response.json({
        followupEventInput: {
          name: "perguntacep",
          languageCode: "pt-BR",
             parameters: {  
          pesquisa: `${pesquisado}`
        }
        }
      });}
   
   
   }
  
  
  
   if (queryResult.intent.displayName === "teste") {
   console.log(queryResult)
//   //const texto = String(queryResult.parameters.teste).match(/\d+/g).join('');
 
//  // const testoAjustado = String(queryResult.parameters.teste).normalize("NFD").replace(/[^a-zA-Zs]/g, "").toUpperCase();
//   // console.log(queryResult.parameters.teste)
//   //    const testoAjustado = queryResult.parameters.teste   
//   // const data = session.split('/');
//   // const numero = data[data.length - 1]
//   // const idUser = String(numero).match(/\d+/g).join('');
// // `${process.env.URL_SHEET}/id/${idUser}`,
    
  
//     // axios.delete('https://sheetdb.io/api/v1/58f61be4dda40/id/61')
//     // .then( response => {
//     //     console.log(response.data);
//     // });
// //       await axios.delete(`${process.env.URL_SHEET}/id/${idUser}`)
// //     .then( response => {
// //         console.log(response.data);
// //     });
    
     
// //        await axios.patch(`${process.env.URL_SHEET}/id/${idUser}`,{
// //         "data": {"nome": "joao"}
// //     }).then( response => {
// //         console.log(response.data);
// //     });
//       //console.log(queryResult);
//      //const texto = queryResult.parameters.location
//       console.log(queryResult.parameters.pesquisa);
   const telefone = queryResult.parameters.texto
     const cell = await arrumaCelular2(telefone);
     console.log(queryResult.parameters.texto)
     
     const celular = await arrumaCelular3(cell.celular);
    const numerosms = celular.celular
    
   await sms2 (numerosms)
     
     return response.json({fulfillmentText: `ok ${celular.celular}`});
  
   
   }
    
  
  
  
  
  
  
  
  
  
  
  
  
});

app.listen(process.env.PORT || 3000);
