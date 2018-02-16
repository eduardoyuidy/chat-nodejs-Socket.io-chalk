var socket = require('socket.io-client')('http://localhost:3000');
var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var chalk = require('chalk');

var currentUser;

socket.on('connect', function() {

    console.log('New Client connected');

    readline.question('Entre com o seu nome de usuário: ', function(name){
        name = name || '!<ANÔNIMO>!';
        currentUser = name;
        socket.emit('registro', name);

        console.log('==== Bem vindo ao bate-papo Coffee&Code JOI ====');
        console.log('==== Para enviar mensagem direcionada: ">>>" + NOME_USUARIO + <ESPAÇO> + <SUA MENSAGEM> ===');
    })

    readline.on('line', function(line){

        socket.emit('mensagem', line);
    })

    socket.on('broadcast', function(user, color, message){

        if(currentUser != user) {
            console.log(chalk.hex(color)(`${user.toUpperCase()} : ${message}`));
        }
    })
})