// 1. 初始化數據
let conversations = JSON.parse(localStorage.getItem('myConversations')) || [
    { input: "Hello", output: "Hi! How can I help you today?" },
    { input: "How are you", output: "I am doing great!" }
];

// 2. 頁面切換邏輯
const pageChat = document.getElementById('page-chat');
const pageManage = document.getElementById('page-manage');

document.getElementById('go-to-manage').onclick = () => {
    pageChat.style.display = 'none';
    pageManage.style.display = 'block';
    renderCards();
};

document.getElementById('back-to-chat').onclick = () => {
    pageManage.style.display = 'none';
    pageChat.style.display = 'block';
};

// 3. 【修正版】渲染卡片與刪除功能
function renderCards() {
    const container = document.getElementById('card-container');
    container.innerHTML = '';
    
    conversations.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        // 加入一個明確的刪除 X 圖標
        card.innerHTML = `
            <div style="pointer-events: none;">
                <b>Q: ${item.input}</b><br>
                <small>A: ${item.output}</small>
            </div>
            <div class="delete-btn" data-index="${index}" style="position:absolute; top:5px; right:5px; background:#ff4757; color:white; border-radius:50%; width:20px; height:20px; text-align:center; line-height:20px; font-size:12px;">✕</div>
        `;

        // 優化手機點擊事件
        const handleCardClick = (e) => {
            // 如果點到的是刪除按鈕
            if (e.target.className === 'delete-btn') {
                const idx = e.target.getAttribute('data-index');
                if(confirm('確定要刪除這張卡片嗎？')) {
                    conversations.splice(idx, 1);
                    saveData();
                    renderCards();
                }
                return;
            }
            // 否則就是點到卡片（可以用來讀出聲音）
            speak(item.output);
        };

        card.onclick = handleCardClick;
        container.appendChild(card);
    });
}

// 4. 簡易新增功能
document.getElementById('quick-add-btn').onclick = () => {
    const q = document.getElementById('new-q').value.trim();
    const a = document.getElementById('new-a').value.trim();
    if (q && a) {
        conversations.push({ input: q, output: a });
        saveData();
        document.getElementById('new-q').value = '';
        document.getElementById('new-a').value = '';
        alert('已成功加入！');
        renderCards();
    } else {
        alert('問題和回答都要填寫喔！');
    }
};

function saveData() {
    localStorage.setItem('myConversations', JSON.stringify(conversations));
}

// 5. 語音輸出
function speak(text) {
    if (!text) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    synth.cancel(); 
    synth.speak(utterance);
}

// 6. 對話邏輯
function handleResponse(userInput) {
    const chatBox = document.getElementById('chat-box');
    const cleanInput = userInput.toLowerCase().replace(/[?.!,]/g, "");
    
    chatBox.innerHTML += `<p class="user-msg">你說：${userInput}</p>`;
    
    const match = conversations.find(c => cleanInput.includes(c.input.toLowerCase().replace(/[?.!,]/g, "")));
    
    if (match) {
        setTimeout(() => {
            chatBox.innerHTML += `<p class="ai-msg">電腦：${match.output}</p>`;
            speak(match.output);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 500);
    } else {
        chatBox.innerHTML += `<p class="ai-msg" style="color:red;">電腦：我不明白這句話。</p>`;
        speak("I don't understand.");
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 7. 手動輸入
document.getElementById('send-btn').onclick = () => {
    const input = document.getElementById('text-input');
    if (input.value) {
        handleResponse(input.value);
        input.value = '';
    }
};

// 8. 語音辨識
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    document.getElementById('start-btn').onclick = () => {
        speak(""); 
        try {
            recognition.start();
            document.getElementById('chat-box').innerHTML += `<p style="color:blue">正在聽...</p>`;
        } catch (e) {}
    };

    recognition.onresult = (event) => {
        handleResponse(event.results[0][0].transcript);
    };
}
