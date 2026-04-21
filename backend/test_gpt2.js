require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');

async function test() {
    try {
        const url = 'https://api-inference.huggingface.co/models/gpt2';
        const response = await axios.post(url, {
            inputs: "Say hello!"
        }, {
            headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` }
        });
        fs.writeFileSync('test_gpt2.log', "SUCCESS: " + JSON.stringify(response.data));
    } catch (e) {
        fs.writeFileSync('test_gpt2.log', "ERROR: " + (e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message));
    }
}
test();
