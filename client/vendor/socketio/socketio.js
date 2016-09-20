'use strict';
angular.module('app')

//Here LoopBackAuth service must be provided as argument for authenticating the user
.factory('socket', function(){
    //Creating connection with server
    var socket = io.connect('http://0.0.0.0:3000');

    socket.on('connect', function(){
        console.log("conectado al servidor socket.io");
    });

  return socket;
});
