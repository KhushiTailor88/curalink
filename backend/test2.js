require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');

async function test() {
    try {
        const url = 'https://api-inference.huggingface.co/v1/chat/completions';
        const response = await axios.post(url, {
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            messages: [{ role: "user", content: "Say hello!" }],
            max_tokens: 50
        }, {
            headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` }
        });
        fs.writeFileSync('test2.log', "SUCCESS: " + JSON.stringify(response.data));
    } catch (e) {
        fs.writeFileSync('test2.log', "ERROR: " + (e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message));
    }
}
test();
