const axios = require('axios');
const fs = require('fs');

async function test() {
    try {
        const response = await axios.post('https://google.com/post_test', { test: 1 });
        fs.writeFileSync('test_google.log', "SUCCESS: " + response.status);
    } catch (e) {
        fs.writeFileSync('test_google.log', "ERROR: " + (e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message));
    }
}
test();
