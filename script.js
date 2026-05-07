let conversations = JSON.parse(localStorage.getItem('myConversations')) || [
    { input: "Hello", output: "Hi there! How can I help you today?" },
    { input: "How are you", output: "I am doing great, thank you for asking!" },
    { input: "What is your name", output: "I am your English learning assistant." }
];

const chatBox = document.getElementById('chat-box');
const cardContainer = document.getElementById('card-container');

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

// --- 優化後的語音部分 ---
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!Recognition) {
    chatBox.innerHTML = "<p style='color:red;'>您的瀏覽器不支援語音辨識，請換用 Chrome (Android) 或 Safari (iPhone)。</p>";
} else {
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.continuous = false; // 每次辨識一句話就結束
    recognition.interimResults = false; // 只取最終結果

    document.getElementById('start-btn').onclick = () => {
        try {
            recognition.start();
            chatBox.innerHTML = "<p style='color:blue;'>正在聽你說話...（請說英文）</p>";
        } catch (e) {
            console.log("辨識已在運行中");
        }
    };

    recognition.onresult = (event) => {
        const userInput = event.results[0][0].transcript.toLowerCase();
        handleResponse(userInput);
    };

    // 增加錯誤捕捉，這能告訴我們為什麼沒反應
    recognition.onerror = (event) => {
        chatBox.innerHTML = `<p style='color:red;'>出錯了：${event.error} (建議檢查麥克風權限或網路)</p>`;
    };

    recognition.onnomatch = () => {
        chatBox.innerHTML = "<p>沒聽清楚，請再試一次。</p>";
    };
}

function handleResponse(userInput) {
    chatBox.innerHTML = `<p>你說：<b>${userInput}</b></p>`;
    const match = conversations.find(c => userInput.includes(c.input.toLowerCase()));
    
    if (match) {
        speak(match.output);
        chatBox.innerHTML += `<p>電腦回答：${match.output}</p>`;
    } else {
        speak("I don't understand that sentence yet.");
        chatBox.innerHTML += `<p>電腦：我不明白這句話，請到編輯區加入它。</p>`;
    }
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

// 編輯功能保持不變...
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
    } catch (e) { alert("格式錯誤！"); }
};
document.getElementById('close-btn').onclick = () => modal.style.display = 'none';
