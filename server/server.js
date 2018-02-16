var app = require('http').createServer();
var io = require('socket.io')(app);
var chalk = require('chalk');

var colorList = ['#77b82c','#437fab','#f8ff8c','#e57cf9','#7cff71','#a21fc6','#82aa85','#32adbd','#bf57e4','#10b0c7','#f07b50','#354b87','#dca3ae'];
let userList = [];

app.listen(3000, function(){

    console.log('==== Bem vindo ao bate-papo Coffee&Code JOI ====');
})

io.on('connect', function(socket){

    socket.on('registro', function(name){

        let randomNumber = Math.floor((Math.random() * (colorList.length - 1)) + 1);

        socket.user = name;
        socket.colorChat = colorList[randomNumber];
        // Retira a cor da lista
        colorList.splice(randomNumber,1);

        console.log(chalk.hex(socket.colorChat)(`<${socket.id}> - ${name} entrou no chat.`));

        userList.push({
            id: socket.id,
            name: socket.user,
            colorChat: socket.colorChat
        });        
    })

    socket.on('mensagem', function(message){

        console.log(`Mensagem recebida: ${message} -- ${message.substring(0,3)}`);

        if (message.substring(0,3) === ">>>") {

            let userDestiny = message.split(' ')[0].substring(3,message.split(' ')[0].length);

            console.log(`Esta mensagem deve ser direcionada para ${userDestiny}`);

            let erroEntrega = true;

            userList.forEach(function (usuario) { 

                if (usuario.name.toLowerCase() == userDestiny.toLowerCase()) {

                    console.log(`Usuário ${usuario.name} - ID: ${usuario.id} - Color: ${usuario.colorChat}`);

                    erroEntrega = false;

                    io.to(usuario.id).emit('broadcast', socket.user, socket.colorChat, message);                    
                }
            });

            if (erroEntrega == true){
                console.log(`ERRO:: Mensagem não foi entregue, o usuário ${userDestiny} não está mais logado.`);
            }
        } else {
            io.emit('broadcast', socket.user, socket.colorChat, message);
        }        
    })
});
