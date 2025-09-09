// 全局变量
let translationHistory = [];
let settings = {
    enginePreference: 'auto',
    autoTranslate: false,
    saveHistory: true,
    geminiApiKey: '',
    deepseekApiKey: ''
};

// DOM元素
const elements = {
    // 输入输出
    inputText: document.getElementById('inputText'),
    outputText: document.getElementById('outputText'),
    sourceLanguage: document.getElementById('sourceLanguage'),
    targetLanguage: document.getElementById('targetLanguage'),
    
    // 按钮
    translateBtn: document.getElementById('translateBtn'),
    geminiBtn: document.getElementById('geminiBtn'),
    deepseekBtn: document.getElementById('deepseekBtn'),
    swapLanguages: document.getElementById('swapLanguages'),
    clearInput: document.getElementById('clearInput'),
    copyResult: document.getElementById('copyResult'),
    pasteBtn: document.getElementById('pasteBtn'),
    
    // 历史记录
    historyBtn: document.getElementById('historyBtn'),
    historySidebar: document.getElementById('historySidebar'),
    closeHistory: document.getElementById('closeHistory'),
    historyList: document.getElementById('historyList'),
    historySearch: document.getElementById('historySearch'),
    clearHistory: document.getElementById('clearHistory'),
    
    // 设置
    settingsBtn: document.getElementById('settingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettings: document.getElementById('closeSettings'),
    geminiApiKey: document.getElementById('geminiApiKey'),
    deepseekApiKey: document.getElementById('deepseekApiKey'),
    enginePreference: document.getElementById('enginePreference'),
    autoTranslate: document.getElementById('autoTranslate'),
    saveHistory: document.getElementById('saveHistory'),
    resetSettings: document.getElementById('resetSettings'),
    saveSettings: document.getElementById('saveSettings'),
    
    // 状态显示
    charCount: document.getElementById('charCount'),
    detectedLanguage: document.getElementById('detectedLanguage'),
    translationEngine: document.getElementById('translationEngine'),
    translationTime: document.getElementById('translationTime'),
    
    // 加载和通知
    loadingOverlay: document.getElementById('loadingOverlay'),
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notificationText')
};

// 语言映射
const languageNames = {
    'auto': '自动检测',
    'zh': '中文',
    'en': 'English',
    'ja': '日本語',
    'ko': '한국어',
    'fr': 'Français',
    'de': 'Deutsch',
    'es': 'Español',
    'ru': 'Русский'
};

// 初始化
function init() {
    loadSettings();
    loadHistory();
    bindEvents();
    updateCharCount();
    console.log('PaulKS Translator initialized');
}

// 绑定事件
function bindEvents() {
    // 翻译相关
    elements.translateBtn.addEventListener('click', () => handleTranslate('auto'));
    elements.geminiBtn.addEventListener('click', () => handleTranslate('gemini'));
    elements.deepseekBtn.addEventListener('click', () => handleTranslate('deepseek'));
    elements.inputText.addEventListener('input', handleInputChange);
    elements.inputText.addEventListener('keydown', handleKeyDown);
    
    // 语言选择
    elements.swapLanguages.addEventListener('click', swapLanguages);
    elements.sourceLanguage.addEventListener('change', handleLanguageChange);
    elements.targetLanguage.addEventListener('change', handleLanguageChange);
    
    // 工具按钮
    elements.clearInput.addEventListener('click', clearInput);
    elements.copyResult.addEventListener('click', copyResult);
    elements.pasteBtn.addEventListener('click', pasteText);
    
    // 历史记录
    elements.historyBtn.addEventListener('click', toggleHistory);
    elements.closeHistory.addEventListener('click', closeHistory);
    elements.historySearch.addEventListener('input', searchHistory);
    elements.clearHistory.addEventListener('click', clearAllHistory);
    
    // 设置
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettings.addEventListener('click', closeSettings);
    elements.resetSettings.addEventListener('click', resetSettings);
    elements.saveSettings.addEventListener('click', saveSettings);
    
    // 模态框外部点击关闭
    elements.settingsModal.addEventListener('click', function(e) {
        if (e.target === elements.settingsModal) {
            closeSettings();
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', handleGlobalKeyDown);
}

// 处理输入变化
function handleInputChange() {
    updateCharCount();
    updateFontSize();
    
    // 自动翻译
    if (settings.autoTranslate && elements.inputText.value.trim()) {
        clearTimeout(window.autoTranslateTimer);
        window.autoTranslateTimer = setTimeout(() => {
            handleTranslate();
        }, 1000);
    }
}

// 处理键盘事件
function handleKeyDown(e) {
    // Ctrl+Enter 翻译
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleTranslate();
    }
}

// 全局键盘快捷键
function handleGlobalKeyDown(e) {
    // Ctrl+H 打开历史记录
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        toggleHistory();
    }
    
    // Escape 关闭弹窗
    if (e.key === 'Escape') {
        closeSettings();
        closeHistory();
    }
}

// 更新字符计数
function updateCharCount() {
    const count = elements.inputText.value.length;
    elements.charCount.textContent = count;
    
    // 字符数接近限制时改变颜色
    if (count > 4500) {
        elements.charCount.style.color = '#f44336';
    } else if (count > 4000) {
        elements.charCount.style.color = '#ff9800';
    } else {
        elements.charCount.style.color = '#666';
    }
}

// 更新字体大小（自适应）
function updateFontSize() {
    const textLength = elements.inputText.value.length;
    const textarea = elements.inputText;
    
    // 移除所有字体大小类
    textarea.classList.remove('font-small', 'font-smaller', 'font-smallest');
    
    // 根据文本长度调整字体大小
    if (textLength > 2000) {
        textarea.classList.add('font-smallest');
    } else if (textLength > 1000) {
        textarea.classList.add('font-smaller');
    } else if (textLength > 500) {
        textarea.classList.add('font-small');
    }
}

// 翻译处理
async function handleTranslate(enginePreference = 'auto') {
    const text = elements.inputText.value.trim();
    if (!text) {
        showNotification('请输入要翻译的文本', 'warning');
        return;
    }
    
    const sourceLang = elements.sourceLanguage.value;
    const targetLang = elements.targetLanguage.value;
    
    if (sourceLang === targetLang && sourceLang !== 'auto') {
        showNotification('源语言和目标语言不能相同', 'warning');
        return;
    }
    
    // 检查API密钥
    if (enginePreference === 'gemini' && !settings.geminiApiKey) {
        showNotification('请先在设置中配置Gemini API密钥', 'warning');
        openSettings();
        return;
    }
    
    if (enginePreference === 'deepseek' && !settings.deepseekApiKey) {
        showNotification('请先在设置中配置DeepSeek API密钥', 'warning');
        openSettings();
        return;
    }
    
    try {
        showLoading(true);
        
        // 禁用所有翻译按钮
        elements.translateBtn.disabled = true;
        elements.geminiBtn.disabled = true;
        elements.deepseekBtn.disabled = true;
        
        // 高亮当前使用的引擎按钮
        updateEngineButtonState(enginePreference);
        
        const startTime = Date.now();
        
        console.log('Starting translation with engine:', enginePreference);
        console.log('Text:', text);
        console.log('From:', sourceLang, 'To:', targetLang);
        
        // 调用翻译API
        const result = await translateText(text, sourceLang, targetLang, enginePreference);
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        
        console.log('Translation result:', result);
        
        // 显示结果
        displayTranslationResult(result, duration);
        
        // 保存到历史记录
        if (settings.saveHistory) {
            saveToHistory(text, result.translatedText, sourceLang, targetLang, result.engine);
        }
        
        showNotification('翻译完成');
        
    } catch (error) {
        console.error('Translation error:', error);
        showNotification('翻译失败：' + error.message, 'error');
        elements.outputText.innerHTML = '<div class="placeholder error">翻译失败，请稍后重试</div>';
    } finally {
        showLoading(false);
        
        // 重新启用所有翻译按钮
        elements.translateBtn.disabled = false;
        elements.geminiBtn.disabled = false;
        elements.deepseekBtn.disabled = false;
        
        // 重置按钮状态
        resetEngineButtonState();
    }
}

// 调用翻译API（最终修复版）
async function translateText(text, sourceLang, targetLang, enginePreference = 'auto') {
    console.log('translateText called with:', { text, sourceLang, targetLang, enginePreference });
    
    let engine = enginePreference;
    
    // 确定使用哪个引擎
    if (engine === 'auto') {
        if (settings.geminiApiKey) {
            engine = 'gemini';
        } else if (settings.deepseekApiKey) {
            engine = 'deepseek';
        } else {
            // 没有配置任何API密钥，使用模拟翻译
            return {
                translatedText: `[模拟翻译 ${sourceLang}→${targetLang}] ${text}`,
                detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
                engine: 'Fallback'
            };
        }
    }
    
    try {
        if (engine === 'gemini') {
            return await callGeminiAPI(text, sourceLang, targetLang);
        } else if (engine === 'deepseek') {
            return await callDeepSeekAPI(text, sourceLang, targetLang);
        }
    } catch (error) {
        console.error(`${engine} API failed:`, error);
        // 如果指定引擎失败，尝试另一个引擎
        if (engine === 'gemini' && settings.deepseekApiKey) {
            console.log('Falling back to DeepSeek');
            return await callDeepSeekAPI(text, sourceLang, targetLang);
        } else if (engine === 'deepseek' && settings.geminiApiKey) {
            console.log('Falling back to Gemini');
            return await callGeminiAPI(text, sourceLang, targetLang);
        }
        throw error;
    }
}

// Gemini API调用（使用最新API格式）
async function callGeminiAPI(text, sourceLang, targetLang) {
    const apiKey = settings.geminiApiKey.trim();
    if (!apiKey) {
        throw new Error('Gemini API密钥未配置');
    }
    
    console.log('Calling Gemini API with latest format...');
    
    // 构建翻译提示
    const sourceLanguageName = sourceLang === 'auto' ? 'detected language' : languageNames[sourceLang];
    const targetLanguageName = languageNames[targetLang];
    
    const prompt = `Translate this text from ${sourceLanguageName} to ${targetLanguageName}. Only return the translation:\n\n${text}`;
    
    // 使用最新的Gemini 1.5 Flash模型
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
            topP: 0.8,
            topK: 10
        }
    };
    
    console.log('Gemini request body:', requestBody);
    
    // 使用最新的API端点和模型
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    console.log('Gemini API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    console.log('Gemini response status:', response.status);
    console.log('Gemini response headers:', response.headers);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API错误: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Gemini response data:', data);
    
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!translatedText) {
        console.error('No translation text in response:', data);
        throw new Error('Gemini API返回了空的翻译结果');
    }
    
    return {
        translatedText: translatedText.trim(),
        detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
        engine: 'Gemini'
    };
}

// DeepSeek API调用（优化版）
async function callDeepSeekAPI(text, sourceLang, targetLang) {
    const apiKey = settings.deepseekApiKey.trim();
    if (!apiKey) {
        throw new Error('DeepSeek API密钥未配置');
    }
    
    console.log('Calling DeepSeek API...');
    
    // 构建翻译提示
    const sourceLanguageName = sourceLang === 'auto' ? 'detected language' : languageNames[sourceLang];
    const targetLanguageName = languageNames[targetLang];
    
    const prompt = `Translate this text from ${sourceLanguageName} to ${targetLanguageName}. Only return the translation:\n\n${text}`;
    
    const requestBody = {
        model: 'deepseek-chat',
        messages: [{
            role: 'user',
            content: prompt
        }],
        temperature: 0.1,
        max_tokens: 2048,
        stream: false
    };
    
    console.log('DeepSeek request body:', requestBody);
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });
    
    console.log('DeepSeek response status:', response.status);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error response:', errorText);
        throw new Error(`DeepSeek API错误: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('DeepSeek response data:', data);
    
    const translatedText = data.choices?.[0]?.message?.content;
    
    if (!translatedText) {
        console.error('No translation text in response:', data);
        throw new Error('DeepSeek API返回了空的翻译结果');
    }
    
    return {
        translatedText: translatedText.trim(),
        detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
        engine: 'DeepSeek'
    };
}

// 显示翻译结果
function displayTranslationResult(result, duration) {
    elements.outputText.innerHTML = result.translatedText;
    
    // 更新检测到的语言
    if (result.detectedLanguage) {
        elements.detectedLanguage.textContent = languageNames[result.detectedLanguage] || result.detectedLanguage;
    }
    
    // 更新翻译引擎信息
    elements.translationEngine.textContent = `${result.engine} 翻译`;
    
    // 更新翻译时间
    elements.translationTime.textContent = `${duration}秒`;
}

// 更新引擎按钮状态
function updateEngineButtonState(activeEngine) {
    // 移除所有active状态
    elements.geminiBtn.classList.remove('active');
    elements.deepseekBtn.classList.remove('active');
    elements.translateBtn.classList.remove('active');
    
    // 添加当前引擎的active状态
    if (activeEngine === 'gemini') {
        elements.geminiBtn.classList.add('active');
    } else if (activeEngine === 'deepseek') {
        elements.deepseekBtn.classList.add('active');
    } else {
        elements.translateBtn.classList.add('active');
    }
}

// 重置引擎按钮状态
function resetEngineButtonState() {
    elements.geminiBtn.classList.remove('active');
    elements.deepseekBtn.classList.remove('active');
    elements.translateBtn.classList.remove('active');
}

// 交换语言
function swapLanguages() {
    const sourceLang = elements.sourceLanguage.value;
    const targetLang = elements.targetLanguage.value;
    
    if (sourceLang === 'auto') {
        showNotification('无法交换自动检测语言', 'warning');
        return;
    }
    
    elements.sourceLanguage.value = targetLang;
    elements.targetLanguage.value = sourceLang;
    
    // 交换文本内容
    const inputText = elements.inputText.value;
    const outputText = elements.outputText.textContent;
    
    if (outputText && outputText !== '翻译结果将显示在这里') {
        elements.inputText.value = outputText;
        elements.outputText.innerHTML = inputText;
        updateCharCount();
        updateFontSize();
    }
}

// 清空输入
function clearInput() {
    elements.inputText.value = '';
    elements.outputText.innerHTML = '<div class="placeholder">翻译结果将显示在这里</div>';
    elements.detectedLanguage.textContent = '';
    elements.translationEngine.textContent = '';
    elements.translationTime.textContent = '';
    updateCharCount();
    updateFontSize();
    elements.inputText.focus();
}

// 复制结果
async function copyResult() {
    const text = elements.outputText.textContent;
    if (!text || text === '翻译结果将显示在这里') {
        showNotification('没有可复制的内容', 'warning');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        showNotification('已复制到剪贴板');
    } catch (error) {
        showNotification('复制失败', 'error');
    }
}

// 粘贴文本
async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        elements.inputText.value = text;
        updateCharCount();
        updateFontSize();
        elements.inputText.focus();
    } catch (error) {
        showNotification('粘贴失败', 'error');
    }
}

// 历史记录相关函数
function toggleHistory() {
    elements.historySidebar.classList.toggle('open');
    if (elements.historySidebar.classList.contains('open')) {
        renderHistory();
    }
}

function closeHistory() {
    elements.historySidebar.classList.remove('open');
}

function saveToHistory(originalText, translatedText, sourceLang, targetLang, engine) {
    const historyItem = {
        id: Date.now(),
        originalText,
        translatedText,
        sourceLang,
        targetLang,
        engine,
        timestamp: new Date().toISOString()
    };
    
    translationHistory.unshift(historyItem);
    
    // 限制历史记录数量
    if (translationHistory.length > 100) {
        translationHistory = translationHistory.slice(0, 100);
    }
    
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
}

function loadHistory() {
    const saved = localStorage.getItem('translationHistory');
    if (saved) {
        try {
            translationHistory = JSON.parse(saved);
        } catch (error) {
            console.error('Failed to load history:', error);
            translationHistory = [];
        }
    }
}

function renderHistory() {
    const searchTerm = elements.historySearch.value.toLowerCase();
    const filteredHistory = translationHistory.filter(item => 
        item.originalText.toLowerCase().includes(searchTerm) ||
        item.translatedText.toLowerCase().includes(searchTerm)
    );
    
    if (filteredHistory.length === 0) {
        elements.historyList.innerHTML = '<div class="placeholder">暂无历史记录</div>';
        return;
    }
    
    elements.historyList.innerHTML = filteredHistory.map(item => {
        const time = formatTime(item.timestamp);
        const langPair = `${languageNames[item.sourceLang]} → ${languageNames[item.targetLang]}`;
        
        return `
            <div class="history-item" onclick="loadHistoryItem(${item.id})">
                <div class="history-item-header">
                    <span class="history-languages">${langPair}</span>
                    <span class="history-time">${time}</span>
                </div>
                <div class="history-text">
                    <div class="history-original">${truncateText(item.originalText, 50)}</div>
                    <div class="history-translation">${truncateText(item.translatedText, 50)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function loadHistoryItem(id) {
    const item = translationHistory.find(h => h.id === id);
    if (item) {
        elements.inputText.value = item.originalText;
        elements.outputText.innerHTML = item.translatedText;
        elements.sourceLanguage.value = item.sourceLang;
        elements.targetLanguage.value = item.targetLang;
        elements.detectedLanguage.textContent = languageNames[item.sourceLang];
        elements.translationEngine.textContent = `${item.engine} 翻译`;
        
        updateCharCount();
        updateFontSize();
        closeHistory();
    }
}

function searchHistory() {
    renderHistory();
}

function clearAllHistory() {
    if (confirm('确定要清空所有翻译历史吗？')) {
        translationHistory = [];
        localStorage.removeItem('translationHistory');
        renderHistory();
        showNotification('历史记录已清空');
    }
}

// 设置相关函数
function openSettings() {
    elements.settingsModal.classList.add('open');
    
    // 加载当前设置
    elements.geminiApiKey.value = settings.geminiApiKey;
    elements.deepseekApiKey.value = settings.deepseekApiKey;
    elements.enginePreference.value = settings.enginePreference;
    elements.autoTranslate.checked = settings.autoTranslate;
    elements.saveHistory.checked = settings.saveHistory;
}

function closeSettings() {
    elements.settingsModal.classList.remove('open');
}

function saveSettings() {
    settings.geminiApiKey = elements.geminiApiKey.value.trim();
    settings.deepseekApiKey = elements.deepseekApiKey.value.trim();
    settings.enginePreference = elements.enginePreference.value;
    settings.autoTranslate = elements.autoTranslate.checked;
    settings.saveHistory = elements.saveHistory.checked;
    
    localStorage.setItem('translatorSettings', JSON.stringify(settings));
    closeSettings();
    showNotification('设置已保存');
    
    console.log('Settings saved:', settings);
}

function resetSettings() {
    if (confirm('确定要重置所有设置吗？')) {
        settings = {
            enginePreference: 'auto',
            autoTranslate: false,
            saveHistory: true,
            geminiApiKey: '',
            deepseekApiKey: ''
        };
        
        localStorage.removeItem('translatorSettings');
        openSettings(); // 重新打开设置窗口以显示重置后的值
        showNotification('设置已重置');
    }
}

function loadSettings() {
    const saved = localStorage.getItem('translatorSettings');
    if (saved) {
        try {
            settings = { ...settings, ...JSON.parse(saved) };
            console.log('Settings loaded:', settings);
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }
}

// 工具函数
function showLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.add('show');
    } else {
        elements.loadingOverlay.classList.remove('show');
    }
}

function showNotification(message, type = 'success') {
    elements.notificationText.textContent = message;
    elements.notification.className = 'notification show';
    
    if (type === 'error') {
        elements.notification.classList.add('error');
    } else if (type === 'warning') {
        elements.notification.classList.add('warning');
    }
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
        setTimeout(() => {
            elements.notification.className = 'notification';
        }, 300);
    }, 3000);
}

function formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) {
        return '刚刚';
    } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
    } else {
        return time.toLocaleDateString();
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

function handleLanguageChange() {
    // 语言改变时的处理逻辑
    const sourceLang = elements.sourceLanguage.value;
    const targetLang = elements.targetLanguage.value;
    
    // 更新检测到的语言显示
    if (sourceLang !== 'auto') {
        elements.detectedLanguage.textContent = languageNames[sourceLang];
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
