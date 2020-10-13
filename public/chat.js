const socket = io();
const chatMessages = document.querySelector(".chatMessages");
const chatForm = document.getElementById("chat-form");
const username = document.querySelector(".userName").innerHTML;

socket.emit("join", { username });

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

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">${message.username}
    <span>${message.time}</span>
    <span class='text'>${message.text} </span>
  </p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}
