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

// 3. 渲染卡片與刪除功能
function renderCards() {
    const container = document.getElementById('card-container');
    container.innerHTML = '';
    conversations.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<b>Q: ${item.input}</b><br><small>A: ${item.output}</small>`;
        card.onclick = () => {
            if(confirm('確定要刪除這張卡片嗎？')) {
                conversations.splice(index, 1);
                saveData();
                renderCards();
            }
        };
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

// 5. 語音輸出 (修復 iOS 靜音問題)
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    // 解決部分安卓/iOS語音中斷問題
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

// 8. 語音辨識 (優化安卓相容性)
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    document.getElementById('start-btn').onclick = () => {
        // iOS 必須在點擊瞬間啟動一次空的語音，來「解鎖」聲音播放
        speak(""); 
        try {
            recognition.start();
            document.getElementById('chat-box').innerHTML += `<p style="color:blue">正在聽...</p>`;
        } catch (e) {}
    };

    recognition.onresult = (event) => {
        handleResponse(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
        if(event.error === 'not-allowed') {
            alert('請檢查手機設定：\n1. 系統設定 > 隱私 > 麥克風 (開啟)\n2. 瀏覽器設定 > 權限 > 麥克風 (開啟)');
        }
    };
}
