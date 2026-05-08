// --- 1. 數據與變數 ---
const defaultData = [
    { input: "Hello", output: "Hi! How can I help you?" },
    { input: "你好", output: "Hello! Nice to meet you." },
    { input: "Thank you", output: "You are welcome!" }
];

let conversations = JSON.parse(localStorage.getItem('myConversations')) || defaultData;
let selectedIndex = -1;
let longPressTimer;
let currentExamTarget = "";

// --- 2. 基礎功能 ---
function showPage(pageId) {
    document.querySelectorAll('.page-container').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';
    if (pageId === 'manage') renderCards();
}

function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
}

function saveData() {
    localStorage.setItem('myConversations', JSON.stringify(conversations));
}

// --- 3. 對話功能 ---
const sendBtn = document.getElementById('send-btn');
const textInput = document.getElementById('text-input');
const chatBox = document.getElementById('chat-box');

function processChat(text) {
    if (!text) return;
    chatBox.innerHTML += `<div style="align-self:flex-end; background:#007aff; color:white; padding:8px 12px; border-radius:15px; margin:5px; max-width:80%;">${text}</div>`;
    
    const clean = text.toLowerCase().trim().replace(/[?.!,]/g, "");
    const match = conversations.find(c => clean.includes(c.input.toLowerCase().replace(/[?.!,]/g, "")));
    
    if (match) {
        setTimeout(() => {
            chatBox.innerHTML += `<div style="align-self:flex-start; background:#e9e9eb; color:black; padding:8px 12px; border-radius:15px; margin:5px; max-width:80%;">電腦：${match.output}</div>`;
            speak(match.output);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 500);
    } else {
        chatBox.innerHTML += `<div style="align-self:flex-start; color:orange; font-size:12px; margin:5px;">(無匹配對話)</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = () => {
    processChat(textInput.value);
    textInput.value = '';
};

// --- 4. 語音辨識 (修復版) ---
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = Recognition ? new Recognition() : null;

if (rec) {
    rec.continuous = false;
    rec.interimResults = false;

    document.getElementById('mic-btn').onclick = () => {
        const mode = document.querySelector('input[name="chat-mode"]:checked').value;
        rec.lang = (mode === 'cn') ? 'zh-CN' : 'en-US';
        speak(" "); // iOS 激活聲音
        try { rec.start(); } catch(e) {}
        document.getElementById('mic-btn').innerText = "🎤 正在聽...";
    };

    rec.onresult = (e) => {
        const result = e.results[0][0].transcript;
        processChat(result);
    };

    rec.onend = () => { document.getElementById('mic-btn').innerText = "🎤 語音輸入"; };
}

// --- 5. 詞典與卡片管理 ---
function renderCards() {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    conversations.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<b>${item.input}</b><br><small>${item.output}</small>`;
        
        // 點擊讀音，長按編輯
        card.onclick = () => speak(item.output);
        card.onmousedown = () => longPressTimer = setTimeout(() => openEditModal(index), 800);
        card.onmouseup = () => clearTimeout(longPressTimer);
        card.ontouchstart = () => longPressTimer = setTimeout(() => openEditModal(index), 800);
        card.ontouchend = () => clearTimeout(longPressTimer);
        
        grid.appendChild(card);
    });
}

function openEditModal(index) {
    selectedIndex = index;
    document.getElementById('edit-q').value = conversations[index].input;
    document.getElementById('edit-a').value = conversations[index].output;
    document.getElementById('edit-modal').style.display = 'block';
}

function closeModal() { document.getElementById('edit-modal').style.display = 'none'; }

document.getElementById('save-edit-btn').onclick = () => {
    conversations[selectedIndex].input = document.getElementById('edit-q').value;
    conversations[selectedIndex].output = document.getElementById('edit-a').value;
    saveData(); renderCards(); closeModal();
};

document.getElementById('delete-card-btn').onclick = () => {
    conversations.splice(selectedIndex, 1);
    saveData(); renderCards(); closeModal();
};

document.getElementById('add-card-btn').onclick = () => {
    const q = document.getElementById('new-q').value;
    const a = document.getElementById('new-a').value;
    if(q && a) {
        conversations.push({input:q, output:a});
        saveData(); renderCards();
        document.getElementById('new-q').value = '';
        document.getElementById('new-a').value = '';
    }
};

// --- 6. 測驗模組 (精確判定版) ---
const examFeedback = document.getElementById('exam-feedback');

document.getElementById('next-exam-btn').onclick = () => {
    if(conversations.length === 0) return alert('詞典是空的');
    const item = conversations[Math.floor(Math.random() * conversations.length)];
    document.getElementById('exam-question').innerText = item.input;
    currentExamTarget = item.output.toLowerCase().trim().replace(/[?.!,]/g, "");
    examFeedback.innerText = "請說出對應的英文...";
};

document.getElementById('exam-mic-btn').onclick = () => {
    if(!rec) return;
    rec.lang = 'en-US';
    speak(" "); 
    rec.start();
    examFeedback.innerText = "正在聽...";
};

// 測驗結果判定
if (rec) {
    rec.addEventListener('result', (e) => {
        // 如果現在是在測驗頁面
        if (document.getElementById('page-exam').style.display === 'block') {
            const userReply = e.results[0][0].transcript.toLowerCase().trim().replace(/[?.!,]/g, "");
            // 判定邏輯：如果使用者說的內容包含正確答案，或者正確答案包含使用者說的
            if (userReply === currentExamTarget || userReply.includes(currentExamTarget)) {
                examFeedback.innerHTML = "<span style='color:green'>✅ 正確！</span>";
                speak("Excellent! Correct.");
            } else {
                examFeedback.innerHTML = `<span style='color:red'>❌ 不對，你說的是: ${userReply}</span>`;
                speak("Try again.");
            }
        }
    });
}
