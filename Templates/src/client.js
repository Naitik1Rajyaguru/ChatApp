const socket = io();

let clientID = document.getElementById('clientName').value.trim();

document.getElementById("nameSubmitButton").addEventListener('click', ()=>{
    clientID = document.getElementById('clientName').value.trim();
    if(clientID){
        socket.emit('setName', clientID);
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendButton').disabled = false;
        document.getElementById('clientName').disabled = true;
        document.getElementById('nameSubmitButton').disabled = true;
        console.log(`Name set to: ${clientID}`);
    }
});


document.getElementById("sendButton").addEventListener('click', ()=>{
    const receiver = prompt("enter receiver id")
    const message = document.getElementById("messageInput").value.trim();
    if(receiver && message){
        const messageToSent = `${clientID}: ${message}`;
        socket.emit('ChatMessage', {receiver: receiver, msg : messageToSent});
        document.getElementById("messageInput").value = "";
    }
    
})

socket.on('ChatMessageFromServer', (msg)=>{
    const chatWindow = document.getElementById('chatWindow');
    const messageElement = document.createElement('p');
    messageElement.textContent = msg;
    chatWindow.appendChild(messageElement);
})


console.log('Connected to the server!');