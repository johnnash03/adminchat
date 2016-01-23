var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



io.on('connection', function(socket){

  socket.on('join', function (data) {
    socket.join( data.userName + '_' + data.userId ); // We are using room of socket io
    console.log( 'Someone joined' );
    console.log( data );
    // refresh left view when a client joins.
    var allUsers = [];
    for( var key in io.sockets.adapter.rooms ) {
        if( key.indexOf( '/') !=0)
        allUsers.push( key )
    }
    io.sockets.in('mobisyadmin_1').emit('client_joined', {userName: data.userName, userId: data.userId, allUsers: allUsers});
  });


  socket.on('client_msg', function( data ) {
  	console.log( data.userName + ': ' + data.message + '   '+data.userId);
    io.sockets.in('mobisyadmin_1').emit('client_msg', {userName: data.userName, message: data.message, userId: data.userId});
  });

  socket.on('admin_msg', function( data ) {
    console.log( data );
    io.sockets.in( data.userName + '_' + data.userId).emit('admin_msg', { userName: 'admin', message: data.message})
  });

  socket.on('disconnect', function ( data ) {
    console.log( 'disconnected' );
    var allUsers = [];
    for( var key in io.sockets.adapter.rooms ) {
        if( key.indexOf( '/') !=0)
        allUsers.push( key )
    }

    io.sockets.in('mobisyadmin_1').emit('disconnected', allUsers);
  });
});





http.listen( 8080, function() {
	console.log( 'listening on port 8080' );
});