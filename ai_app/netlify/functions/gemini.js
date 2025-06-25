const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { messages, tableData } = JSON.parse(event.body);
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return { statusCode: 500, body: 'API key is not configured.' };
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = `你是一個智能表格管理助手。當前表格資料如下：\n${JSON.stringify(tableData, null, 2)}\n\n請根據用戶的需求提供幫助...（此處省略部分提示詞）...讓使用者可以直接複製或點擊範例來提問。`;
    
    const historyParts = messages.map(msg => ({ text: (msg.role === 'user' ? '用戶：' : 'AI：') + msg.text }));

    const requestBody = {
        contents: [{ parts: [{ text: systemPrompt }, ...historyParts] }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { statusCode: response.status, body: errorText };
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: aiResponse })
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
}; 