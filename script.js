// 1. 預設的 100 句對話數據 (這裡先放 3 句範例，你可以自行增加)
let conversations = JSON.parse(localStorage.getItem('myConversations')) || [
    { input: "Hello", output: "Hi there! How can I help you today?" },
    { input: "How are you", output: "I am doing great, thank you for asking!" },
    { input: "What is your name", output: "I am your English learning assistant." }
];

const chatBox = document.getElementById('chat-box');
const cardContainer = document.getElementById('card-container');

// 2. 初始化：生成複習卡片
function renderCards() {
    cardContainer.innerHTML = '';
    conversations.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<strong>${item.input}</strong><br><small>${item.output}</small>`;
        cardContainer.appendChild(card);
    });
}
renderCards();

// 3. 語音辨識設定
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new Recognition();
recognition.lang = 'en-US'; // 設定辨識英文

document.getElementById('start-btn').onclick = () => {
    recognition.start();
    chatBox.innerHTML = "<p style='color:blue;'>正在聽你說話...</p>";
};

recognition.onresult = (event) => {
    const userInput = event.results[0][0].transcript.toLowerCase();
    chatBox.innerHTML = `<p>你說：<b>${userInput}</b></p>`;
    
    // 尋找匹配的答案
    const match = conversations.find(c => userInput.includes(c.input.toLowerCase()));
    
    if (match) {
        speak(match.output);
        chatBox.innerHTML += `<p>電腦：${match.output}</p>`;
    } else {
        speak("I am sorry, I don't have an answer for that yet.");
    }
};

// 4. 電腦語音輸出
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

// 5. 編輯功能
const modal = document.getElementById('edit-modal');
document.getElementById('edit-btn').onclick = () => {
    modal.style.display = 'block';
    document.getElementById('conversation-json').value = JSON.stringify(conversations, null, 2);
};

document.getElementById('save-btn').onclick = () => {
    try {
        conversations = JSON.parse(document.getElementById('conversation-json').value);
        localStorage.setItem('myConversations', JSON.stringify(conversations));
        renderCards();
        modal.style.display = 'none';
        alert("儲存成功！");
    } catch (e) {
        alert("格式錯誤，請檢查 JSON 格式");
    }
};

document.getElementById('close-btn').onclick = () => modal.style.display = 'none';