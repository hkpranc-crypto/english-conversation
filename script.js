// 1. 對話數據 (會保存在手機瀏覽器裡)
let defaultConversations = [
    { input: "Hello", output: "Hi! Nice to meet you." },
    { input: "How are you", output: "I am doing well, how about you?" },
    { input: "What time is it", output: "I am not a watch, but I can help you learn English!" }
];

let conversations = JSON.parse(localStorage.getItem('myConversations')) || defaultConversations;

const chatBox = document.getElementById('chat-box');
const cardContainer = document.getElementById('card-container');
const textInput = document.getElementById('text-input');
const sendBtn = document.getElementById('send-btn');

// 2. 顯示卡片
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

// 3. 處理對話邏輯
function handleResponse(userInput) {
    userInput = userInput.toLowerCase().replace(/[?.!,]/g, ""); // 轉小寫並去掉標點
    chatBox.innerHTML = `<p style="color:#666">你說：${userInput}</p>`;
    
    const match = conversations.find(c => userInput.includes(c.input.toLowerCase().replace(/[?.!,]/g, "")));
    
    if (match) {
        chatBox.innerHTML += `<p style="color:#333"><b>電腦：${match.output}</b></p>`;
        speak(match.output);
    } else {
        chatBox.innerHTML += `<p style="color:orange">電腦：我不明白這句話，請到編輯區加入它。</p>`;
        speak("I don't understand that yet.");
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. 電腦發聲
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

// 5. 手動輸入按鈕
sendBtn.onclick = () => {
    if (textInput.value.trim()) {
        handleResponse(textInput.value);
        textInput.value = '';
    }
};
textInput.onkeypress = (e) => { if (e.key === 'Enter') sendBtn.click(); };

// 6. 語音辨識部分
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!Recognition) {
    document.getElementById('start-btn').innerText = "不支援語音";
} else {
    const recognition = new Recognition();
    recognition.lang = 'en-US';

    document.getElementById('start-btn').onclick = () => {
        try {
            recognition.start();
            chatBox.innerHTML = "<p style='color:blue;'>正在聽...請說英文</p>";
        } catch (e) { console.log("Already started"); }
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        handleResponse(result);
    };

    recognition.onerror = (event) => {
        chatBox.innerHTML = `<p style='color:red;'>錯誤: ${event.error} (請檢查權限)</p>`;
    };
}

// 7. 編輯與儲存
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
    } catch (e) { alert("格式錯誤，請確保是正確的 JSON"); }
};
document.getElementById('close-btn').onclick = () => modal.style.display = 'none';
