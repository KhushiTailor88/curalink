require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');

async function test() {
    try {
        const url = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
        const response = await axios.post(url, {
            inputs: "Respond with Hello World",
        }, {
            headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` }
        });
        fs.writeFileSync('test.log', JSON.stringify(response.data));
    } catch (e) {
        fs.writeFileSync('test.log', "ERROR: " + (e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message));
    }
}
test();
