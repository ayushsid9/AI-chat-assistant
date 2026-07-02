// ======================================
// AI Assistant
// Author: Sid
// ======================================

// Backend URL
const API_URL = "https://ai-chat-assistant-backend.onrender.com";

// DOM Elements
const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const clearChatBtn = document.getElementById("clearChatBtn");
const newChatBtn = document.getElementById("newChatBtn");

// Store messages
let chatHistory = [];

/* =====================================
      INITIALIZE
===================================== */

window.onload = () => {

    loadChat();

    autoResize();

}

/* =====================================
      AUTO RESIZE TEXTAREA
===================================== */

userInput.addEventListener("input", autoResize);

function autoResize(){

    userInput.style.height = "55px";

    userInput.style.height = userInput.scrollHeight + "px";

}

/* =====================================
      ENTER TO SEND
===================================== */

userInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});

/* =====================================
      BUTTON CLICK
===================================== */

sendBtn.addEventListener("click",sendMessage);

/* =====================================
      SEND MESSAGE
===================================== */

async function sendMessage(){

    const message = userInput.value.trim();

    if(message==="") return;

    removeWelcome();

    createMessage(message,"user");

    chatHistory.push({

        sender:"user",

        text:message

    });

    saveChat();

    userInput.value="";

    autoResize();

    showTyping();

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message

            })

        });

        const data = await response.json();

        hideTyping();

        createMessage(data.reply,"bot");

        chatHistory.push({

            sender:"bot",

            text:data.reply

        });

        saveChat();

    }

    catch(err){

        hideTyping();

        createMessage(

            "❌ Unable to connect to AI server.",

            "bot"

        );

    }

}

/* =====================================
      CREATE MESSAGE
===================================== */

function createMessage(text,sender){

    const div=document.createElement("div");

    div.classList.add("message");

    div.classList.add(sender);

    // Markdown Rendering
    div.innerHTML = marked.parse(text);

    chatContainer.appendChild(div);

    Prism.highlightAll();

    scrollBottom();

}

/* =====================================
      REMOVE WELCOME SCREEN
===================================== */

function removeWelcome(){

    const welcome=document.querySelector(".welcome");

    if(welcome){

        welcome.remove();

    }

}

/* =====================================
      SCROLL
===================================== */

function scrollBottom(){

    chatContainer.scrollTop=chatContainer.scrollHeight;

}

/* =====================================
      TYPING
===================================== */

function showTyping(){

    typingIndicator.classList.remove("hidden");

    scrollBottom();

}

function hideTyping(){

    typingIndicator.classList.add("hidden");

}

/* =====================================
      SAVE CHAT
===================================== */

function saveChat(){

    localStorage.setItem(

        "chatHistory",

        JSON.stringify(chatHistory)

    );

}

/* =====================================
      LOAD CHAT
===================================== */

function loadChat(){

    const saved = localStorage.getItem("chatHistory");

    if(!saved) return;

    chatHistory = JSON.parse(saved);

    if(chatHistory.length>0){

        removeWelcome();

    }

    chatHistory.forEach(msg=>{

        createMessage(

            msg.text,

            msg.sender

        );

    });

}

/* =====================================
      CLEAR CHAT
===================================== */

clearChatBtn.addEventListener("click",()=>{

    if(!confirm("Clear all chats?")) return;

    localStorage.removeItem("chatHistory");

    chatHistory=[];

    location.reload();

});

/* =====================================
      NEW CHAT
===================================== */

newChatBtn.addEventListener("click",()=>{

    chatHistory=[];

    localStorage.removeItem("chatHistory");

    chatContainer.innerHTML=`

        <div class="welcome">

            <div class="robot">

                🤖

            </div>

            <h2>Hello!</h2>

            <p>

                I'm your AI Assistant.

                Ask me anything.

            </p>

        </div>

    `;

});

/* =====================================
      COPY CODE BUTTON
===================================== */

document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("copy-btn")){

        navigator.clipboard.writeText(

            e.target.previousElementSibling.innerText

        );

        e.target.innerText="Copied!";

        setTimeout(()=>{

            e.target.innerText="Copy";

        },1500);

    }

});
