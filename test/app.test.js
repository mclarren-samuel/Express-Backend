const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/app');

function request(path, method, body) {
    return new Promise((resolve, reject) => {
        const server = app.listen(0, () => {
            const { port } = server.address();
            const request = http.request({
                port,
                path,
                method,
                headers: { 'Content-Type': 'application/json' }
            }, (response) => {
                let data = '';
                response.on('data', (chunk) => { data += chunk; });
                response.on('end', () => {
                    server.close();
                    resolve({ statusCode: response.statusCode, body: JSON.parse(data) });
                });
            });
            request.on('error', reject);
            request.end(body ? JSON.stringify(body) : undefined);
        });
        server.on('error', reject);
    });
}

test('health check reports the service is running', async () => {
    const response = await request('/health', 'GET');
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.status, 'ok');
});

test('registration rejects incomplete input', async () => {
    const response = await request('/api/register', 'POST', {});
    assert.equal(response.statusCode, 400);
    assert.equal(response.body.error, 'Missing required fields');
});

test('profile endpoint rejects anonymous requests', async () => {
    const response = await request('/api/me', 'GET');
    assert.equal(response.statusCode, 401);
    assert.equal(response.body.error, 'Authentication required');
});