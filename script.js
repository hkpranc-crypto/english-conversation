// --- 1. 核心數據結構 (部分 100 句範例) ---
const defaultData = [
    { cat: "Greetings", q_en: "How are you?", q_cn: "你好嗎？", a_en: "I'm doing well, thank you!", a_cn: "我很好，謝謝你！" },
    { cat: "Greetings", q_en: "What's your name?", q_cn: "你叫什麼名字？", a_en: "My name is Jordan.", a_cn: "我的名字是 Jordan。" },
    { cat: "Daily", q_en: "What time do you wake up?", q_cn: "你幾點起床？", a_en: "I usually get up at 7:00 AM.", a_cn: "我通常早上 7 點起床。" },
    { cat: "Shopping", q_en: "How much does this cost?", q_cn: "這個多少錢？", a_en: "It’s twenty dollars.", a_cn: "二十美金。" },
    { cat: "Travel", q_en: "Where is the nearest bank?", q_cn: "最近的銀行在哪裡？", a_en: "Go straight and turn left at the light.", a_cn: "直走後在紅綠燈左轉。" }
    // ... (此處可依格式補全 100 句)
];

let conversations = JSON.parse(localStorage.getItem('myConversations')) || defaultData;
let selectedIndex = -1;
let longPressTimer;

// --- 2. 通用功能 ---
function showPage(pageId) {
    document.querySelectorAll('.page-container').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';
    if (pageId === 'manage') renderCards();
}

function speak(text, lang = 'en-US') {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
}

// --- 3. 對話核心 (三種模式邏輯) ---
function processChat(userInput) {
    const chatBox = document.getElementById('chat-box');
    const mode = document.getElementById('practice-mode').value;
    
    // 顯示使用者訊息
    chatBox.innerHTML += `<div style="align-self:flex-end; background:#007aff; color:white; padding:8px 12px; border-radius:15px; margin:5px;">${userInput}</div>`;
    
    const cleanUser = userInput.toLowerCase().trim().replace(/[?.!,]/g, "");
    
    // 尋找匹配卡片
    const match = conversations.find(c => {
        const q_en = c.q_en.toLowerCase().replace(/[?.!,]/g, "");
        const q_cn = c.q_cn.toLowerCase().replace(/[?.!,]/g, "");
        const a_en = c.a_en.toLowerCase().replace(/[?.!,]/g, "");
        const a_cn = c.a_cn.toLowerCase().replace(/[?.!,]/g, "");
        
        if (mode === 'cn_to_en') return cleanUser.includes(q_cn) || cleanUser.includes(a_cn);
        return cleanUser.includes(q_en);
    });

    if (match) {
        let replyText = "";
        let replyLang = "en-US";

        if (mode === 'cn_to_en') {
            replyText = match.q_en + " / " + match.a_en;
        } else if (mode === 'en_q_to_cn_a') {
            replyText = match.a_cn;
            replyLang = "zh-CN";
        } else {
            replyText = match.a_en;
        }

        setTimeout(() => {
            chatBox.innerHTML += `<div style="align-self:flex-start; background:#e9e9eb; padding:8px 12px; border-radius:15px; margin:5px;">電腦：${replyText}</div>`;
            speak(replyText, replyLang);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 600);
    } else {
        chatBox.innerHTML += `<div style="color:gray; font-size:12px; margin:5px;">(未找到匹配卡片)</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 4. 語音辨識修復 ---
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = Recognition ? new Recognition() : null;

if (rec) {
    document.getElementById('mic-btn').onclick = () => {
        const mode = document.getElementById('practice-mode').value;
        rec.lang = (mode === 'cn_to_en') ? 'zh-CN' : 'en-US';
        speak(" "); 
        try { rec.start(); } catch(e){}
        document.getElementById('mic-btn').innerText = "🎤 正在聽...";
    };
    rec.onresult = (e) => processChat(e.results[0][0].transcript);
    rec.onend = () => document.getElementById('mic-btn').innerText = "🎤 開始說話";
}

document.getElementById('send-btn').onclick = () => {
    const input = document.getElementById('text-input');
    processChat(input.value);
    input.value = '';
};

// --- 5. 詞典渲染與分類 ---
function renderCards() {
    const grid = document.getElementById('card-grid');
    const filter = document.getElementById('category-filter').value;
    grid.innerHTML = '';
    
    conversations.forEach((item, index) => {
        if (filter !== 'All' && item.cat !== filter) return;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="tag">${item.cat}</span>
            <b>Q: ${item.q_en}</b>
            <div class="translation">問: ${item.q_cn}</div>
            <b style="margin-top:10px;">A: ${item.a_en}</b>
            <div class="translation">答: ${item.a_cn}</div>
        `;
        
        card.onclick = () => speak(item.a_en);
        card.onmousedown = () => longPressTimer = setTimeout(() => openModal(index), 800);
        card.onmouseup = () => clearTimeout(longPressTimer);
        card.ontouchstart = () => longPressTimer = setTimeout(() => openModal(index), 800);
        card.ontouchend = () => clearTimeout(longPressTimer);
        
        grid.appendChild(card);
    });
}

function openModal(index) {
    selectedIndex = index;
    const item = conversations[index];
    document.getElementById('edit-cat').value = item.cat;
    document.getElementById('edit-q-en').value = item.q_en;
    document.getElementById('edit-q-cn').value = item.q_cn;
    document.getElementById('edit-a-en').value = item.a_en;
    document.getElementById('edit-a-cn').value = item.a_cn;
    document.getElementById('edit-modal').style.display = 'block';
}

function closeModal() { document.getElementById('edit-modal').style.display = 'none'; }

document.getElementById('save-edit-btn').onclick = () => {
    const newItem = {
        cat: document.getElementById('edit-cat').value,
        q_en: document.getElementById('edit-q-en').value,
        q_cn: document.getElementById('edit-q-cn').value,
        a_en: document.getElementById('edit-a-en').value,
        a_cn: document.getElementById('edit-a-cn').value
    };
    conversations[selectedIndex] = newItem;
    localStorage.setItem('myConversations', JSON.stringify(conversations));
    renderCards(); closeModal();
};

// --- 6. 測驗保持精簡 ---
document.getElementById('next-exam-btn').onclick = () => {
    const item = conversations[Math.floor(Math.random() * conversations.length)];
    document.getElementById('exam-question').innerText = item.q_cn; // 考中文翻譯英
    currentExamTarget = item.a_en.toLowerCase().replace(/[?.!,]/g, "");
    speak(item.q_cn, 'zh-CN');
};
