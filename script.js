// --- 1. 詞典數據初始化 ---
const defaultData = [
    { input: "Hello", output: "Hi! How can I help you?" },
    { input: "你好", output: "Hello! Nice to meet you." },
    { input: "What is your name", output: "I am your AI tutor." },
    { input: "謝謝", output: "You are welcome!" }
    // 你可以在這裡繼續手動增加到 100 句
];

let conversations = JSON.parse(localStorage.getItem('myConversations')) || defaultData;
let selectedIndex = -1;
let longPressTimer;

// --- 2. 導航功能 ---
function showPage(pageId) {
    document.querySelectorAll('.page-container').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';
    if (pageId === 'manage') renderCards();
}

// --- 3. 詞典管理與長按編輯 ---
function renderCards() {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    conversations.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<b>Q: ${item.input}</b><br><small>A: ${item.output}</small>`;
        
        // 長按邏輯 (相容手機與電腦)
        const startPress = () => longPressTimer = setTimeout(() => openEditModal(index), 800);
        const endPress = () => clearTimeout(longPressTimer);
        
        card.ontouchstart = startPress;
        card.ontouchend = endPress;
        card.onmousedown = startPress;
        card.onmouseup = endPress;
        
        card.onclick = () => speak(item.output);
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

function saveEdit() {
    conversations[selectedIndex].input = document.getElementById('edit-q').value;
    conversations[selectedIndex].output = document.getElementById('edit-a').value;
    saveAndRefresh();
    closeModal();
}

function deleteCard() {
    if(confirm('確定要刪除嗎？')) {
        conversations.splice(selectedIndex, 1);
        saveAndRefresh();
        closeModal();
    }
}

function addNewCard() {
    const q = document.getElementById('new-q').value;
    const a = document.getElementById('new-a').value;
    if(q && a) {
        conversations.push({input: q, output: a});
        saveAndRefresh();
        document.getElementById('new-q').value = '';
        document.getElementById('new-a').value = '';
    }
}

function saveAndRefresh() {
    localStorage.setItem('myConversations', JSON.stringify(conversations));
    renderCards();
}

// --- 4. 語音系統 ---
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = Recognition ? new Recognition() : null;

function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SynthesisUtterance(text);
    utter.lang = 'en-US';
    synth.cancel();
    synth.speak(utter);
}

// --- 5. 對話邏輯 ---
if (rec) {
    document.getElementById('mic-btn').onclick = () => {
        const mode = document.querySelector('input[name="chat-mode"]:checked').value;
        rec.lang = (mode === 'cn') ? 'zh-CN' : 'en-US';
        rec.start();
        document.getElementById('chat-box').innerHTML += `<p style="color:blue">正在聽...</p>`;
    };
    rec.onresult = (e) => processChat(e.results[0][0].transcript);
}

function processChat(text) {
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div style="text-align:right; margin:5px;"><span style="background:#007aff; color:white; padding:8px; border-radius:10px;">${text}</span></div>`;
    
    const clean = text.toLowerCase().replace(/[?.!,]/g, "");
    const match = conversations.find(c => clean.includes(c.input.toLowerCase().replace(/[?.!,]/g, "")));
    
    if (match) {
        box.innerHTML += `<div style="text-align:left; margin:5px;"><span style="background:#e9e9eb; padding:8px; border-radius:10px;">${match.output}</span></div>`;
        speak(match.output);
    }
    box.scrollTop = box.scrollHeight;
}

// --- 6. 測驗模組 (核心修改) ---
let currentExamTarget = "";

function nextExam() {
    if (conversations.length === 0) return alert('請先在詞典加入卡片');
    const item = conversations[Math.floor(Math.random() * conversations.length)];
    document.getElementById('exam-question').innerText = item.input;
    document.getElementById('exam-feedback').innerText = "";
    currentExamTarget = item.output.toLowerCase().replace(/[?.!,]/g, "");
    speak(item.input); // 提示音
}

if (rec) {
    document.getElementById('exam-mic-btn').onclick = () => {
        rec.lang = 'en-US'; // 測驗回答必須是英文
        rec.start();
        document.getElementById('exam-feedback').innerText = "正在聽你的答案...";
    };

    rec.onresult = (e) => {
        const userReply = e.results[0][0].transcript.toLowerCase().replace(/[?.!,]/g, "");
        if (userReply.includes(currentExamTarget) || currentExamTarget.includes(userReply)) {
            document.getElementById('exam-feedback').innerHTML = "<span style='color:green'>✅ 正確！</span>";
            speak("Correct!");
        } else {
            document.getElementById('exam-feedback').innerHTML = `<span style='color:red'>❌ 再試一次 (你說: ${userReply})</span>`;
            speak("Try again.");
        }
    };
}
