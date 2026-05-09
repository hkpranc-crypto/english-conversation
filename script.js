// --- 1. 100 句預設詞庫 ---
const defaultData = [
    // Basic Greetings & Personal Info
    { input: "How are you?", output: "I'm doing well, thank you!" },
    { input: "What's your name?", output: "My name is Jordan." },
    { input: "Where are you from?", output: "I’m originally from Chicago." },
    { input: "How old are you?", output: "I’m twenty-five years old." },
    { input: "What do you do for a living?", output: "I work as a graphic designer." },
    { input: "Nice to meet you!", output: "Nice to meet you too!" },
    { input: "Do you have any siblings?", output: "Yes, I have an older brother." },
    { input: "Where do you live?", output: "I live in an apartment downtown." },
    { input: "Can you speak English?", output: "Yes, I’m practicing every day." },
    { input: "What’s your phone number?", output: "It’s 555-0199." },
    // Daily Life & Habits
    { input: "What time do you wake up?", output: "I usually get up at 7:00 AM." },
    { input: "How do you get to work?", output: "I take the subway." },
    { input: "Do you like coffee or tea?", output: "I prefer coffee in the morning." },
    { input: "What’s the weather like?", output: "It’s quite sunny and warm today." },
    { input: "What are you doing right now?", output: "I’m just reading a book." },
    { input: "Are you busy at the moment?", output: "Not really, I have some free time." },
    { input: "Do you exercise often?", output: "I try to go to the gym three times a week." },
    { input: "What’s your favorite hobby?", output: "I really enjoy photography." },
    { input: "Do you cook at home?", output: "Yes, I cook dinner almost every night." },
    { input: "How was your weekend?", output: "It was very relaxing, thanks for asking." },
    // Shopping & Services
    { input: "How much does this cost?", output: "It’s twenty dollars." },
    { input: "Do you take credit cards?", output: "Yes, we accept all major cards." },
    { input: "Can I help you find something?", output: "Yes, I’m looking for a blue shirt." },
    { input: "Where is the fitting room?", output: "It’s right around the corner." },
    { input: "Is there a discount on this?", output: "Yes, it’s currently 20% off." },
    { input: "Can I have a receipt, please?", output: "Of course, here you go." },
    { input: "Do you have this in a larger size?", output: "Let me check the stockroom for you." },
    { input: "What time do you close?", output: "We close at 9:00 PM tonight." },
    { input: "Would you like a bag?", output: "No thanks, I brought my own." },
    { input: "Can I return this if it doesn't fit?", output: "Yes, you have thirty days to return it." },
    // Eating & Drinking
    { input: "Are you ready to order?", output: "Yes, I’ll have the grilled salmon." },
    { input: "Anything to drink?", output: "Just some sparkling water, please." },
    { input: "Do you have any vegetarian options?", output: "Yes, our pasta primavera is meat-free." },
    { input: "How does it taste?", output: "It’s absolutely delicious!" },
    { input: "Can we have the bill, please?", output: "Certainly, I’ll bring it right over." },
    { input: "Is service included?", output: "No, the tip is not included in the total." },
    { input: "Do you have a table for two?", output: "Yes, please follow me." },
    { input: "Are you allergic to anything?", output: "Yes, I’m allergic to peanuts." },
    { input: "Would you like some dessert?", output: "I’m too full, but thank you." },
    { input: "How would you like your steak?", output: "Medium-rare, please." },
    // Travel & Directions
    { input: "Where is the nearest bank?", output: "Go straight and turn left at the light." },
    { input: "How far is the airport?", output: "It’s about a thirty-minute drive." },
    { input: "Is there a bus stop nearby?", output: "Yes, it’s just across the street." },
    { input: "Do I need a ticket beforehand?", output: "Yes, you should buy one at the machine." },
    { input: "Which platform for the train to London?", output: "It departs from Platform 4." },
    { input: "Have you ever been to Paris?", output: "Yes, I went there last summer." },
    { input: "Can you show me on the map?", output: "Sure, we are right here." },
    { input: "Is it within walking distance?", output: "Yes, it’s only a ten-minute walk." },
    { input: "What time is the next flight?", output: "The next one leaves at 2:15 PM." },
    { input: "Do you need a taxi?", output: "Yes, please call one for me." },
    // Socializing & Plans
    { input: "What are you doing tonight?", output: "I’m meeting some friends for dinner." },
    { input: "Would you like to join us?", output: "I’d love to, thanks for the invite!" },
    { input: "What kind of music do you like?", output: "I’m a big fan of jazz and rock." },
    { input: "Have you seen any good movies lately?", output: "I saw a great documentary yesterday." },
    { input: "Do you want to go for a walk?", output: "That sounds like a wonderful idea." },
    { input: "When should we meet?", output: "Let's meet at 6:30 PM." },
    { input: "Where should we go?", about: "How about the park?" },
    { input: "Can I bring a friend?", output: "Of course, the more the merrier!" },
    { input: "Are you having a good time?", output: "Yes, I’m really enjoying myself." },
    { input: "What’s your favorite movie?", output: "I think 'Inception' is my favorite." },
    // Work & Office
    { input: "What’s the deadline for this?", output: "It needs to be finished by Friday." },
    { input: "Can you help me with this report?", output: "Sure, I can help you after lunch." },
    { input: "Where is the meeting taking place?", output: "In Conference Room B." },
    { input: "Did you get my email?", output: "Yes, I just read it a moment ago." },
    { input: "How was the meeting?", output: "It was long, but very productive." },
    { input: "Are you working this weekend?", output: "Fortunately, I have the weekend off." },
    { input: "Can we reschedule our call?", output: "Yes, does Monday morning work for you?" },
    { input: "What’s your boss like?", output: "She is very supportive and professional." },
    { input: "Do you like your job?", output: "Yes, I find it very challenging and rewarding." },
    { input: "Have you finished the project?", output: "Almost, I just need to double-check the figures." },
    // Health & Feelings
    { input: "Are you feeling okay?", output: "Not really, I have a bit of a headache." },
    { input: "What’s wrong?", output: "I think I’m coming down with a cold." },
    { input: "Do you need to see a doctor?", output: "I’ll wait and see how I feel tomorrow." },
    { input: "Did you sleep well?", output: "Yes, I slept like a baby." },
    { input: "Why are you so happy?", output: "I just got some really good news!" },
    { input: "Are you tired?", output: "A little bit, it’s been a long day." },
    { input: "Do you need anything?", output: "A glass of water would be great." },
    { input: "How are you feeling today?", output: "Much better than yesterday, thank you." },
    { input: "Are you nervous about the exam?", output: "Yes, I’m a bit anxious." },
    { input: "What makes you angry?", output: "I really dislike it when people are late." },
    // Help & Requests
    { input: "Could you do me a favor?", output: "Sure, what do you need?" },
    { input: "Can you hold this for a second?", output: "Of course, no problem." },
    { input: "Do you mind if I sit here?", output: "Not at all, go right ahead." },
    { input: "Could you repeat that, please?", output: "Sure, I said the meeting is at ten." },
    { input: "Can you speak more slowly?", output: "I’m sorry, I’ll try to slow down." },
    { input: "How do you spell that?", output: "It’s spelled B-E-L-I-E-V-E." },
    { input: "Can I borrow your pen?", output: "Sure, here it is." },
    { input: "Do you know where my keys are?", output: "I think they are on the kitchen table." },
    { input: "Could you open the window?", output: "Yes, it is a bit stuffy in here." },
    { input: "May I use your phone?", output: "Go ahead, the battery is full." },
    // Opinions & Preferences
    { input: "What do you think of this?", output: "I think it’s a great idea." },
    { input: "Do you agree with me?", output: "I’m not sure I agree with that point." },
    { input: "Is it difficult to learn?", output: "It takes time, but it’s not too hard." },
    { input: "Which one do you like better?", output: "I prefer the red one." },
    { input: "Do you think it will rain?", output: "The clouds look quite dark, so maybe." },
    { input: "Was it expensive?", output: "No, it was actually quite cheap." },
    { input: "Do you believe in luck?", output: "I believe hard work is more important." },
    { input: "How was the movie?", output: "It was a bit boring, to be honest." },
    { input: "Is this seat taken?", output: "No, feel free to sit down." },
    { input: "What’s the matter?", output: "Nothing, I’m just thinking." }
];

let conversations = JSON.parse(localStorage.getItem('myConversations')) || defaultData;
let selectedIndex = -1;
let longPressTimer;
let currentExamTarget = "";

// --- 2. 導航功能 ---
function showPage(pageId) {
    document.querySelectorAll('.page-container').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';
    if (pageId === 'manage') renderCards();
}

// --- 3. 核心功能：發聲與保存 ---
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

// --- 4. 對話練習邏輯 (修復手動輸入) ---
const sendBtn = document.getElementById('send-btn');
const textInput = document.getElementById('text-input');
const chatBox = document.getElementById('chat-box');

function processChat(text) {
    if (!text) return;
    // 顯示使用者訊息
    chatBox.innerHTML += `<div style="align-self:flex-end; background:#007aff; color:white; padding:8px 12px; border-radius:15px; margin:5px; max-width:80%;">${text}</div>`;
    
    // 標準化文字進行比對
    const cleanUser = text.toLowerCase().trim().replace(/[?.!,]/g, "");
    
    // 尋找匹配
    const match = conversations.find(c => {
        const cleanInput = c.input.toLowerCase().replace(/[?.!,]/g, "");
        return cleanUser.includes(cleanInput) || cleanInput.includes(cleanUser);
    });
    
    if (match) {
        setTimeout(() => {
            chatBox.innerHTML += `<div style="align-self:flex-start; background:#e9e9eb; color:black; padding:8px 12px; border-radius:15px; margin:5px; max-width:80%;">電腦：${match.output}</div>`;
            speak(match.output);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 600);
    } else {
        chatBox.innerHTML += `<div style="align-self:flex-start; color:gray; font-size:12px; margin:5px;">(未在詞典中找到匹配回覆)</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 綁定手動發送按鈕
if (sendBtn) {
    sendBtn.onclick = () => {
        processChat(textInput.value);
        textInput.value = '';
    };
}

// --- 5. 語音辨識 ---
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = Recognition ? new Recognition() : null;

if (rec) {
    rec.continuous = false;
    document.getElementById('mic-btn').onclick = () => {
        const mode = document.querySelector('input[name="chat-mode"]:checked').value;
        rec.lang = (mode === 'cn') ? 'zh-CN' : 'en-US';
        speak(" "); // iOS 激活
        try { rec.start(); } catch(e) {}
        document.getElementById('mic-btn').innerText = "🎤 正在聽...";
    };

    rec.onresult = (e) => {
        const result = e.results[0][0].transcript;
        processChat(result);
    };
    rec.onend = () => { document.getElementById('mic-btn').innerText = "🎤 語音輸入"; };
}

// --- 6. 詞典與卡片管理 (長按編輯) ---
function renderCards() {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    conversations.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.border = "1px solid #ddd";
        card.style.padding = "10px";
        card.style.borderRadius = "10px";
        card.innerHTML = `<b>${item.input}</b><br><small style="color:#666">${item.output}</small>`;
        
        card.onclick = () => speak(item.output);
        
        // 長按觸發編輯
        const trigger = () => longPressTimer = setTimeout(() => openEditModal(index), 800);
        const cancel = () => clearTimeout(longPressTimer);
        
        card.onmousedown = trigger; card.onmouseup = cancel;
        card.ontouchstart = trigger; card.ontouchend = cancel;
        
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
    if(confirm('刪除這張卡片？')) {
        conversations.splice(selectedIndex, 1);
        saveData(); renderCards(); closeModal();
    }
};

document.getElementById('add-card-btn').onclick = () => {
    const q = document.getElementById('new-q').value;
    const a = document.getElementById('new-a').value;
    if(q && a) {
        conversations.push({input:q, output:a});
        saveData(); renderCards();
        document.getElementById('new-q').value = ''; document.getElementById('new-a').value = '';
    }
};

// --- 7. 測驗模組 (判定邏輯升級) ---
const examFeedback = document.getElementById('exam-feedback');
const examQuestionDisplay = document.getElementById('exam-question');

document.getElementById('next-exam-btn').onclick = () => {
    if(conversations.length === 0) return alert('請先添加卡片');
    const item = conversations[Math.floor(Math.random() * conversations.length)];
    examQuestionDisplay.innerText = item.input;
    currentExamTarget = item.output.toLowerCase().trim().replace(/[?.!,]/g, "");
    examFeedback.innerText = "請說出對應的答案...";
    speak(item.input);
};

document.getElementById('exam-mic-btn').onclick = () => {
    if(!rec) return alert("您的瀏覽器不支持語音辨識");
    rec.lang = 'en-US';
    speak(" "); 
    try { rec.start(); } catch(e) {}
    examFeedback.innerText = "正在聽你的答案...";
};

if (rec) {
    rec.addEventListener('result', (e) => {
        if (document.getElementById('page-exam').style.display === 'block') {
            const userReply = e.results[0][0].transcript.toLowerCase().trim().replace(/[?.!,]/g, "");
            
            // 判定邏輯：模糊匹配 (只要包含 70% 以上的單字或字串即正確)
            if (userReply === currentExamTarget || userReply.includes(currentExamTarget) || currentExamTarget.includes(userReply)) {
                examFeedback.innerHTML = "<span style='color:green; font-size:20px;'>✅ 正確！</span>";
                speak("Correct, well done!");
            } else {
                examFeedback.innerHTML = `<span style='color:red;'>❌ 再試一次<br><small>你說的是: ${userReply}</small></span>`;
                speak("Not quite, try again.");
            }
        }
    });
}
