# Javascript aplikácie

- brain - neural networks 
- socket.io - real-time engine

## Brain
https://github.com/harthur-org/brain.js/
https://www.npmjs.com/package/brain.js

### Ukážka
Jednoduchá aproximácia XOR

    const config = {
        binaryThresh: 0.5,
        hiddenLayers: [3],
        activation: 'sigmoid',
        leakyReluAlpha: 0.01
    };
    
    const net = new brain.NeuralNetwork(config);
    
    net.train([{input: [0, 0], output: [0]},
               {input: [0, 1], output: [1]},
               {input: [1, 0], output: [1]},
               {input: [1, 1], output: [0]}]);
    
    const output = net.run([1, 0]);  // [0.987]

### Popis

## Socket.io

### Ukážka
Jednoduchý Chat Client, ktorý by sa dal veľmi pekne vylepšiť.

    $(function () {
	    var socket = io();
	    $('form').submit(function(){
		    socket.emit('chat message', $('#m').val());
		    $('#m').val('');
		    return false;
	    });
    
	    socket.on('chat message', function(msg){
		    $('#messages').append($('<li>').text(msg));
		    window.scrollTo(0, document.body.scrollHeight);
	    });
    });

### Popis


