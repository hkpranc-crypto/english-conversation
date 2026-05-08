// --- 1. 預設 100 句數據 (先放部分範例，你可以自己按格式加滿) ---
const defaultData = [
    { input: "Hello", output: "Hi! How are you?" },
    { input: "你好", output: "Hello! How can I help you?" },
    { input: "What is your name", output: "I am your AI assistant." },
    { input: "我叫什麼名字", output: "You haven't told me your name yet." },
    { input: "Where are you from", output: "I live in your computer." },
    { input: "謝謝", output: "You are welcome!" }
    // ... 可以繼續添加至 100 句
];

let conversations = JSON.parse(localStorage.getItem('myConversations')) || defaultData;
let longPressTimer;
let selectedIndex = -1;

// --- 2. 頁面切換 ---
function switchPage(pageId) {
    document.querySelectorAll('.container').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';
    if (pageId === 'manage') renderCards();
}

// --- 3. 卡片渲染與長按判定 ---
function renderCards() {
    const container = document.getElementById('card-container');
    container.innerHTML = '';
    conversations.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<b>Q: ${item.input}</b><br><small>A: ${item.output}</small>`;
        
        // 手機長按邏輯
        card.ontouchstart = () => {
            longPressTimer = setTimeout(() => showMenu(index), 800);
        };
        card.ontouchend = () => clearTimeout(longPressTimer);
        
        // 電腦右鍵邏輯
        card.oncontextmenu = (e) => {
            e.preventDefault();
            showMenu(index);
        };

        card.onclick = () => speak(item.output);
        container.appendChild(card);
    });
}

function showMenu(index) {
    selectedIndex = index;
    document.getElementById('action-menu').style.display = 'block';
    document.getElementById('menu-title').innerText = `編輯: ${conversations[index].input}`;
}

function closeMenu() {
    document.getElementById('action-menu').style.display = 'none';
}

document.getElementById('delete-card-btn').onclick = () => {
    if(confirm('確定刪除這張卡片？')) {
        conversations.splice(selectedIndex, 1);
        saveData();
        renderCards();
        closeMenu();
    }
};

// --- 4. 語音辨識與發聲 ---
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
    const rec = new Recognition();
    rec.continuous = false;
    
    document.getElementById('start-btn').onclick = () => {
        const mode = document.querySelector('input[name="mode"]:checked').value;
        rec.lang = (mode === 'cn') ? 'zh-CN' : 'en-US';
        rec.start();
        document.getElementById('chat-box').innerHTML += `<p style="color:blue">正在聽...(${rec.lang})</p>`;
    };

    rec.onresult = (e) => handleResponse(e.results[0][0].transcript);
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    synth.cancel();
    synth.speak(utter);
}

function handleResponse(text) {
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div class="user-msg">${text}</div>`;
    
    const clean = text.toLowerCase().replace(/[?.!,]/g, "");
    const match = conversations.find(c => clean.includes(c.input.toLowerCase().replace(/[?.!,]/g, "")));
    
    if (match) {
        setTimeout(() => {
            box.innerHTML += `<div class="ai-msg">${match.output}</div>`;
            speak(match.output);
            box.scrollTop = box.scrollHeight;
        }, 500);
    } else {
        box.innerHTML += `<div class="ai-msg">No match in cards.</div>`;
    }
}

// --- 5. 測驗模組 ---
document.getElementById('exam-next-btn').onclick = () => {
    if (conversations.length === 0) return alert('請先增加卡片');
    const rand = conversations[Math.floor(Math.random() * conversations.length)];
    document.getElementById('exam-question').innerText = rand.input;
    speak(rand.input); // 抽問時也讀出來
};

// --- 6. 其他基礎功能 ---
document.getElementById('quick-add-btn').onclick = () => {
    const q = document.getElementById('new-q').value;
    const a = document.getElementById('new-a').value;
    if(q && a) {
        conversations.push({input:q, output:a});
        saveData();
        renderCards();
        document.getElementById('new-q').value = '';
        document.getElementById('new-a').value = '';
    }
};

function saveData() { localStorage.setItem('myConversations', JSON.stringify(conversations)); }

document.getElementById('send-btn').onclick = () => {
    const val = document.getElementById('text-input').value;
    if(val) { handleResponse(val); document.getElementById('text-input').value = ''; }
};
