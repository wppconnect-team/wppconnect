const express = require('express');
const app = express();
const wppconnect = require('@wppconnect-team/wppconnect');
var Instancia; //variável que receberá o cliente para ser chamada em outras funções da lib
                //variable that the client will receive to be called in other lib functions


app.use(express.json());//parser utizado para requisições via post,....parser used for requests via post,
app.use(express.urlencoded({ extended : true }));


app.get('/getconnectionstatus', async function (req, res) {

    console.log("Solicitou status de conexao");
    console.log("Requested connection status");

    var mensagemretorno =''; //mensagem de retorno da requisição ... request return message
    var sucesso = false; //Se houve sucesso na requisição ... If the request was successful
    var return_object;

    const executa = async()=>{

            if (typeof(Instancia) === "object"){ // Validando se a lib está iniciada .... Validating if lib is started
                mensagemretorno = await Instancia.getConnectionState(); // validadado o estado da conexão com o whats 
                                                                //whats connection status validated
                sucesso = true;
            }else{
                mensagemretorno = 'A instancia não foi inicializada - The instance was not initialized';               
            }
            return_object = {
                status : sucesso,
                message :mensagemretorno,           
            };
            res.send(return_object); 
    };
    executa();

  });

app.post('/sendmessage', async function (req, res) {

    console.log("Solicitou envio de mensagem VIA POST");
    console.log("Requested sending VIA POST message");

    //parametros vindos na requisição ... parameters coming in the request
    var telnumber = req.body.telnumber;
    var mensagemparaenvio = req.body.message;
    //***********/

    var mensagemretorno =''; //mensagem de retorno da requisição ... request return message
    var sucesso = false; //Se houve sucesso na requisição ... If the request was successful
    var return_object;

    const executa = async()=>{

            if (typeof(Instancia) === "object"){ // Validando se a lib está iniciada .... Validating if lib is started
                status = await Instancia.getConnectionState(); // validadado o estado da conexão com o whats 
                                                                //whats connection status validated
                if(status === 'CONNECTED'){
                    let numeroexiste = await Instancia.checkNumberStatus(telnumber+'@c.us');  //Validando se o número existe ... Validating if the number exists
                    if(numeroexiste.canReceiveMessage===true){
                       await Instancia
                            .sendText(numeroexiste.id._serialized, mensagemparaenvio)
                            .then((result) => {
                                console.log('Result: ', result); //return object success
                                sucesso=true;
                                mensagemretorno=result.id;
                            })
                            .catch((erro) => {
                                console.error('Error when sending: ', erro); //return object error
                            });
                    }else{
                        mensagemretorno='O numero não está disponível ou está bloqueado - The number is not available or is blocked.';
                    }
                }else{                          
                    mensagemretorno = 'Valide sua conexao com a internet ou QRCODE - Validate your internet connection or QRCODE';
                }
            }else{
                mensagemretorno = 'A instancia não foi inicializada - The instance was not initialized';               
            }
            return_object = {
                status : sucesso,
                message :mensagemretorno,           
            };
            res.send(return_object); 
    };
    executa();

  });

  
startWPP(); //chama a função para inicializar a lib...... call function to initialize the lib

async function startWPP (){ 
    await wppconnect.create({session: 'teste',
        catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
    },  
    statusFind: (statusSession, session) => {
        console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || disconnectedMobile || deleteToken
        //Create session wss return "serverClose" case server for close
        console.log('Session name: ', session);
    },
        headless: true, // Headless chrome
        devtools: false, // Open devtools by default
        useChrome: true, // If false will use Chromium instance
        debug: false, // Opens a debug session
        logQR: true, // Logs QR automatically in terminal
        browserWS: '', // If u want to use browserWSEndpoint
        browserArgs: [''], // Parameters to be added into the chrome browser instance
        puppeteerOptions: {}, // Will be passed to puppeteer.launch
        disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
        updatesLog: true, // Logs info updates automatically in terminal
        autoClose: 60000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
        tokenStore: 'file', // Define how work with tokens, that can be a custom interface
        folderNameToken: './tokens', //folder name when saving tokens
    }).then((client) => {
            start(client);
    }).catch((erro) => console.log(erro));

}

async function start(client) {
    Instancia = client; //Será utilizado nas requisições REST ..... It will be used in REST requests

    client.onMessage( async (message) => {

    }); 
    client.onAck(ack => {

    });
    client.onStateChange( async (state) => {

    });

}



const porta = '3000'; 
var server = app.listen(porta);
console.log('Servidor iniciado na porta %s', server.address().port);