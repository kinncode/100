// Gemini API 配置
const GEMINI_API_URL = '/netlify/functions/gemini';
// 全局變數
let tableData = [];
let editingRow = null;
let rowCounter = 1;

// 聊天訊息歷史（用於多輪對話）
let chatHistory = [];

// DOM 元素
const tableBody = document.getElementById('tableBody');
const addRowBtn = document.getElementById('addRowBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');

// 將側邊欄展開/收合合併為同一個按鈕
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const leftSidebar = document.getElementById('leftSidebar');
toggleSidebarBtn.onclick = function() {
    const isOpen = leftSidebar.classList.contains('active');
    if (isOpen) {
        leftSidebar.style.width = '0';
        leftSidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    } else {
        leftSidebar.style.width = '250px';
        leftSidebar.classList.add('active');
        document.body.classList.add('sidebar-open');
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeTable();
    initializeChat();
    loadSampleData();
    // 直接測試 serverless function 是否可用
    testGeminiAPI();
});

// 表格初始化
function initializeTable() {
    addRowBtn.addEventListener('click', addNewRow);
    exportBtn.addEventListener('click', exportToCSV);
    clearBtn.addEventListener('click', clearTable);
}

// 聊天初始化
function initializeChat() {
    chatToggle.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 為了在行動裝置上更可靠，同時監聽 touchstart 和 click
    minimizeBtn.addEventListener('click', minimizeChat);
    minimizeBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        minimizeChat();
    });

    closeBtn.addEventListener('click', closeChat);
    closeBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        closeChat();
    });

    makeDraggable(chatWidget, document.getElementById('chatHeader'));
}

// 載入範例資料
function loadSampleData() {
    const sampleData = [
        { id: 1, name: '張小明', email: 'zhang@example.com', phone: '0912-345-678', department: '資訊部', position: '軟體工程師', hireDate: '2023-01-15', salary: '45000' },
        { id: 2, name: '李小華', email: 'li@example.com', phone: '0923-456-789', department: '行銷部', position: '行銷專員', hireDate: '2023-03-20', salary: '38000' }
    ];
    sampleData.forEach(data => {
        tableData.push(data);
        renderTableRow(data);
    });
    rowCounter = 3;
}

// 新增行
function addNewRow() {
    const newRow = { id: rowCounter++, name: '', email: '', phone: '', department: '', position: '', hireDate: '', salary: '' };
    tableData.push(newRow);
    renderTableRow(newRow);
    addMessage('ai', '已新增一筆空白資料，您可以開始填寫或告訴我您想要填入什麼資料。');
}

// 渲染表格行
function renderTableRow(data) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', data.id);
    row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.phone}</td>
        <td>${data.department}</td>
        <td>${data.position}</td>
        <td>${data.hireDate}</td>
        <td>${data.salary}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editRow(${data.id})"><i class="fas fa-edit"></i> 編輯</button>
            <button class="action-btn delete-btn" onclick="deleteRow(${data.id})"><i class="fas fa-trash"></i> 刪除</button>
        </td>
    `;
    tableBody.appendChild(row);
}

// 編輯行
function editRow(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const data = tableData.find(item => item.id === id);
    if (!row || editingRow) return;
    editingRow = id;
    row.innerHTML = `
        <td>${data.id}</td>
        <td><input type="text" value="${data.name}" class="edit-input"></td>
        <td><input type="email" value="${data.email}" class="edit-input"></td>
        <td><input type="tel" value="${data.phone}" class="edit-input"></td>
        <td>
            <select class="edit-input">
                <option value="資訊部" ${data.department === '資訊部' ? 'selected' : ''}>資訊部</option>
                <option value="行銷部" ${data.department === '行銷部' ? 'selected' : ''}>行銷部</option>
                <option value="人事部" ${data.department === '人事部' ? 'selected' : ''}>人事部</option>
                <option value="財務部" ${data.department === '財務部' ? 'selected' : ''}>財務部</option>
                <option value="業務部" ${data.department === '業務部' ? 'selected' : ''}>業務部</option>
            </select>
        </td>
        <td><input type="text" value="${data.position}" class="edit-input"></td>
        <td><input type="date" value="${data.hireDate}" class="edit-input"></td>
        <td><input type="number" value="${data.salary}" class="edit-input"></td>
        <td>
            <button class="action-btn save-btn" onclick="saveRow(${id})"><i class="fas fa-save"></i> 儲存</button>
            <button class="action-btn cancel-btn" onclick="cancelEdit(${id})"><i class="fas fa-times"></i> 取消</button>
        </td>
    `;
}

// 儲存行
function saveRow(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const inputs = row.querySelectorAll('.edit-input');
    const data = tableData.find(item => item.id === id);
    data.name = inputs[0].value;
    data.email = inputs[1].value;
    data.phone = inputs[2].value;
    data.department = inputs[3].value;
    data.position = inputs[4].value;
    data.hireDate = inputs[5].value;
    data.salary = inputs[6].value;
    renderTableRow(data);
    row.remove();
    editingRow = null;
    addMessage('ai', '資料已成功儲存！');
}

// 取消編輯
function cancelEdit(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const data = tableData.find(item => item.id === id);
    renderTableRow(data);
    row.remove();
    editingRow = null;
}

// 刪除行
function deleteRow(id) {
    if (confirm('確定要刪除這筆資料嗎？')) {
        tableData = tableData.filter(item => item.id !== id);
        const row = document.querySelector(`tr[data-id="${id}"]`);
        row.remove();
        addMessage('ai', '資料已成功刪除！');
    }
}

// 匯出CSV
function exportToCSV() {
    if (tableData.length === 0) {
        alert('沒有資料可以匯出！');
        return;
    }
    const headers = ['序號', '姓名', '電子郵件', '電話', '部門', '職位', '入職日期', '薪資'];
    const csvContent = [
        headers.join(','),
        ...tableData.map(row => [row.id, row.name, row.email, row.phone, row.department, row.position, row.hireDate, row.salary].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `表格資料_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addMessage('ai', 'CSV檔案已成功匯出！');
}

// 清空表格
function clearTable() {
    if (confirm('確定要清空所有資料嗎？此操作無法復原！')) {
        tableData = [];
        tableBody.innerHTML = '';
        rowCounter = 1;
        addMessage('ai', '表格已清空，您可以重新開始新增資料。');
    }
}

// 聊天功能
    // 聊天功能
    function toggleChat() {
        chatWidget.classList.toggle('active');
        chatToggle.classList.toggle('hidden');
        
        // 如果聊天框被開啟，滾動到底部
        if (chatWidget.classList.contains('active')) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 300); // 等待動畫完成
        }
    }

function minimizeChat() {
    chatWidget.classList.remove('active');
    chatToggle.classList.remove('hidden');
}

function closeChat() {
    chatWidget.classList.remove('active');
    chatToggle.classList.remove('hidden');
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    addMessage('user', message);
    chatInput.value = '';
    chatHistory.push({role: 'user', text: message});
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading-message';
    loadingDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-robot"></i>
            <div class="text">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
    processAIResponse(message).then(() => {
        loadingDiv.remove();
    });
}

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="${icon}"></i>
            <div class="text">${text}</div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);

    if (sender === 'ai') {
        chatHistory.push({role: 'ai', text});
        // 綁定所有 AI 訊息中的 button
        setTimeout(() => {
            const buttons = messageDiv.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.classList.add('ai-quick-btn');
                btn.onclick = function() {
                    chatInput.value = btn.innerText;
                    chatInput.focus();
                };
            });
        }, 0);
    }
}

// Gemini API 調用
async function callGeminiAPI(userMessage) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: chatHistory, 
                tableData: tableData 
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.reply;

    } catch (error) {
        console.error('Error calling serverless function:', error);
        return '對不起，與伺服器連線時發生錯誤。請檢查後端函數的日誌。';
    }
}

// 測試API連接
async function testGeminiAPI() {
    try {
        const response = await fetch('/netlify/functions/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [],
                tableData: []
            })
        });
        if (!response.ok) throw new Error('API call failed');
        const data = await response.json();
        addMessage('ai', `✅ Gemini API已連接！${data.reply}`);
    } catch (error) {
        addMessage('ai', '⚠️ API連接測試失敗，使用本地模式。');
    }
}

// AI回應處理
async function processAIResponse(userMessage) {
    try {
        let aiResponse = await callGeminiAPI(userMessage);
        if (aiResponse) {
            const commandResult = await executeAICommands(aiResponse, userMessage);
            addMessage('ai', commandResult || aiResponse);
            return;
        }
        const localResult = await executeLocalCommands(userMessage);
        addMessage('ai', '🤖 (本地模式) ' + localResult);
    } catch (error) {
        console.error('處理AI回應時發生錯誤:', error);
        addMessage('ai', '抱歉，處理您的請求時發生錯誤。請稍後再試。');
    }
}

// 執行AI指令
async function executeAICommands(aiResponse, userMessage) {
    const message = userMessage.toLowerCase();
    if (message.includes('刪除') || message.includes('移除')) return handleDeleteCommand(userMessage);
    if (message.includes('編輯') || message.includes('修改') || message.includes('更新')) return handleEditCommand(userMessage);
    if (message.includes('新增') || message.includes('加入') || message.includes('添加')) return handleAddCommand(userMessage);
    if (message.includes('搜尋') || message.includes('找') || message.includes('查詢')) return handleSearchCommand(userMessage);
    if (message.includes('匯出') || message.includes('下載') || message.includes('導出')) {
        setTimeout(() => exportToCSV(), 1000);
        return '正在為您匯出CSV檔案...';
    }
    if (message.includes('清空') || message.includes('清除所有')) {
        if (confirm('確定要清空所有資料嗎？')) {
            clearTable();
            return '表格已清空！';
        }
        return '操作已取消。';
    }
    return null;
}

// 處理刪除指令
function handleDeleteCommand(message) {
    const idMatch = message.match(/序號\s*(\d+)|第\s*(\d+)\s*筆|編號\s*(\d+)/);
    if (idMatch) {
        const id = parseInt(idMatch[1] || idMatch[2] || idMatch[3]);
        const item = tableData.find(item => item.id === id);
        if (item) {
            if (confirm(`確定要刪除 ${item.name || '序號' + id} 的資料嗎？`)) {
                deleteRow(id);
                return `已成功刪除序號 ${id} 的資料。`;
            }
            return '刪除操作已取消。';
        }
        return `找不到序號 ${id} 的資料。`;
    }
    const nameMatch = message.match(/刪除\s*([^\s,，的]+)/);
    if (nameMatch) {
        const name = nameMatch[1];
        const item = tableData.find(item => item.name.includes(name));
        if (item) {
            if (confirm(`確定要刪除 ${item.name} 的資料嗎？`)) {
                deleteRow(item.id);
                return `已成功刪除 ${item.name} 的資料。`;
            }
            return '刪除操作已取消。';
        }
        return `找不到姓名包含 "${name}" 的資料。`;
    }
    return '請指定要刪除的資料，例如：「刪除序號3」或「刪除張小明」';
}

// 處理編輯指令
function handleEditCommand(message) {
    let targetItem = null, targetId = null;
    const idMatch = message.match(/序號\s*(\d+)|第\s*(\d+)\s*筆|編號\s*(\d+)/);
    if (idMatch) {
        targetId = parseInt(idMatch[1] || idMatch[2] || idMatch[3]);
        targetItem = tableData.find(item => item.id === targetId);
    }
    if (!targetItem) {
        const nameMatch = message.match(/編輯\s*([^\s,，的]+)|修改\s*([^\s,，的]+)/);
        if (nameMatch) {
            const name = nameMatch[1] || nameMatch[2];
            targetItem = tableData.find(item => item.name.includes(name));
            targetId = targetItem?.id;
        }
    }
    if (!targetItem) return '請指定要編輯的資料，例如：「編輯序號3」或「編輯張小明」';
    const updates = parseUpdateData(message);
    if (Object.keys(updates).length === 0) {
        editRow(targetId);
        return `已開啟 ${targetItem.name || '序號' + targetId} 的編輯模式，請直接在表格中修改。`;
    }
    Object.assign(targetItem, updates);
    const row = document.querySelector(`tr[data-id="${targetId}"]`);
    if (row) {
        row.remove();
        renderTableRow(targetItem);
    }
    const updateList = Object.entries(updates).map(([key, value]) => `${getFieldName(key)}: ${value}`).join('、');
    return `已成功更新 ${targetItem.name || '序號' + targetId} 的資料：${updateList}`;
}

// 處理新增指令
function handleAddCommand(message) {
    const newData = parseAddData(message);
    const newRow = {
        id: rowCounter++,
        name: newData.name || '',
        email: newData.email || '',
        phone: newData.phone || '',
        department: newData.department || '',
        position: newData.position || '',
        hireDate: newData.hireDate || new Date().toISOString().split('T')[0],
        salary: newData.salary || ''
    };
    tableData.push(newRow);
    renderTableRow(newRow);
    const addedFields = Object.entries(newData).filter(([_, value]) => value).map(([key, value]) => `${getFieldName(key)}: ${value}`).join('、');
    return addedFields ? `已成功新增資料：${addedFields}。您可以點擊編輯按鈕來完善其他資訊。` : '已新增一筆空白資料，請點擊編輯按鈕填寫詳細資訊。';
}

// 解析更新/新增資料
function parseUpdateData(message) {
    const updates = {};
    const nameMatch = message.match(/姓名[：:\s]*([^\s,，]+)|名字[：:\s]*([^\s,，]+)/);
    if (nameMatch) updates.name = nameMatch[1] || nameMatch[2];
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) updates.email = emailMatch[0];
    const phoneMatch = message.match(/電話[：:\s]*([0-9-]+)|手機[：:\s]*([0-9-]+)/);
    if (phoneMatch) updates.phone = phoneMatch[1] || phoneMatch[2];
    const departments = ['資訊部', '行銷部', '人事部', '財務部', '業務部'];
    for (let dept of departments) {
        if (message.includes(dept)) {
            updates.department = dept;
            break;
        }
    }
    const positionMatch = message.match(/職位[：:\s]*([^\s,，]+)|職稱[：:\s]*([^\s,，]+)/);
    if (positionMatch) updates.position = positionMatch[1] || positionMatch[2];
    const salaryMatch = message.match(/薪資[：:\s]*(\d+)|薪水[：:\s]*(\d+)|工資[：:\s]*(\d+)/);
    if (salaryMatch) updates.salary = salaryMatch[1] || salaryMatch[2] || salaryMatch[3];
    const dateMatch = message.match(/入職日期[：:\s]*(\d{4}-\d{2}-\d{2})|日期[：:\s]*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) updates.hireDate = dateMatch[1] || dateMatch[2];
    return updates;
}

function parseAddData(message) {
    return parseUpdateData(message);
}

// 處理搜尋指令
function handleSearchCommand(message) {
    let results = [];
    const nameMatch = message.match(/搜尋\s*([^\s,，]+)|找\s*([^\s,，]+)|查詢\s*([^\s,，]+)/);
    if (nameMatch) {
        const searchTerm = nameMatch[1] || nameMatch[2] || nameMatch[3];
        results = tableData.filter(item => item.name.includes(searchTerm) || item.department.includes(searchTerm) || item.position.includes(searchTerm));
    }
    const departments = ['資訊部', '行銷部', '人事部', '財務部', '業務部'];
    for (let dept of departments) {
        if (message.includes(dept)) {
            results = tableData.filter(item => item.department === dept);
            break;
        }
    }
    if (results.length > 0) {
        const resultText = results.map(item => `序號${item.id}: ${item.name} - ${item.department} - ${item.position}`).join('\n');
        return `找到 ${results.length} 筆符合的資料：\n${resultText}`;
    }
    return '沒有找到符合條件的資料。';
}

// 欄位中文名稱
function getFieldName(fieldKey) {
    const fieldNames = { name: '姓名', email: '電子郵件', phone: '電話', department: '部門', position: '職位', hireDate: '入職日期', salary: '薪資' };
    return fieldNames[fieldKey] || fieldKey;
}

// 本地指令處理
async function executeLocalCommands(userMessage) {
    const message = userMessage.toLowerCase();
    if (message.includes('刪除')) return handleDeleteCommand(userMessage);
    if (message.includes('編輯') || message.includes('修改')) return handleEditCommand(userMessage);
    if (message.includes('新增') || message.includes('加入')) return handleAddCommand(userMessage);
    if (message.includes('搜尋') || message.includes('找')) return handleSearchCommand(userMessage);
    if (message.includes('匯出')) {
        exportToCSV();
        return '正在為您匯出CSV檔案...';
    }
    if (message.includes('清空')) {
        if (confirm('確定要清空所有資料嗎？')) {
            clearTable();
            return '表格已清空！';
        }
        return '操作已取消。';
    }
    return '抱歉，我不太理解您的指令。請試試「編輯張小明」或「刪除序號3」。';
}

//
function makeDraggable(element, handle) {
    let isDragging = false, startX, startY, xOffset = 0, yOffset = 0, animationFrameId = null;

    handle.addEventListener('mousedown', dragStart);
    handle.addEventListener('touchstart', dragStart, { passive: false });

    function dragStart(e) {
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        
        isDragging = true;
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        startX = clientX - xOffset;
        startY = clientY - yOffset;

        document.body.style.userSelect = 'none';
        element.classList.add('dragging');

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }

    function drag(e) {
        if (!isDragging) return;

        if (e.type === 'touchmove') {
            e.preventDefault();
        }

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        // The position of the element without the current transform
        const rect = element.getBoundingClientRect();
        const originalX = rect.left - xOffset;
        const originalY = rect.top - yOffset;

        // The new transform values
        let newXOffset = clientX - startX;
        let newYOffset = clientY - startY;

        // The new absolute position
        let newAbsX = originalX + newXOffset;
        let newAbsY = originalY + newYOffset;

        // Constrain the absolute position
        if (newAbsX < 0) newAbsX = 0;
        if (newAbsY < 0) newAbsY = 0;
        if (newAbsX + rect.width > window.innerWidth) {
            newAbsX = window.innerWidth - rect.width;
        }
        if (newAbsY + rect.height > window.innerHeight) {
            newAbsY = window.innerHeight - rect.height;
        }

        // Convert the constrained absolute position back to a transform offset
        xOffset = newAbsX - originalX;
        yOffset = newAbsY - originalY;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        animationFrameId = requestAnimationFrame(() => {
            element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        document.body.style.userSelect = '';
        element.classList.remove('dragging');

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
    }

    window.addEventListener('resize', () => {
        const rect = element.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        let correctedXOffset = xOffset;
        let correctedYOffset = yOffset;

        if (rect.left < 0) correctedXOffset -= rect.left;
        if (rect.top < 0) correctedYOffset -= rect.top;
        if (rect.right > winW) correctedXOffset -= (rect.right - winW);
        if (rect.bottom > winH) correctedYOffset -= (rect.bottom - winH);
        
        if(correctedXOffset !== xOffset || correctedYOffset !== yOffset) {
            xOffset = correctedXOffset;
            yOffset = correctedYOffset;
            element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
    });
}

const clearChatBtn = document.getElementById('clearChatBtn');
clearChatBtn.onclick = function() {
    chatMessages.innerHTML = '';
    chatHistory = [];
    addMessage('ai', '對話已清空，請問有什麼可以幫您？');
};