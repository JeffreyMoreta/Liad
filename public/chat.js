const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const username = document.querySelector(".userName").innerHTML;
const userList = document.getElementById('users');

socket.emit("join", { username });

socket.on('roomUsers', ({ users }) => {
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function chatBubble(message){
  if(message.username === username){
    return `
    <div class="message-right ms1">
      <div class="messageinner-ms1">
        <p class="message-text">
          <span style="
            display: inline-block; 
            font-size: 10px;
            color: lightgrey;">${message.username} ${message.time}</span>
          <span style="display: block;">${message.text}</span>
        </p>
      </div>
    </div>
    `
  } else {
    return `
    <div class="message-left ms2">
      <div class="messageinner-ms2">
        <p class="message-text">
          <span style="
            display: inline-block; 
            font-size: 10px;
            color: grey;">${message.username} ${message.time}</span>
          <span style="display: block;">${message.text}</span>
        </p>
      </div>
    </div>
    `
  }
}

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = chatBubble(message);
  document.querySelector(".chat-messages").appendChild(div);
}

function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }