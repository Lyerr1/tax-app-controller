// 这是您的有效密钥列表。
// 要给新客户授权，就把他的密钥加到这里。
// 要吊销某个客户的权限，就从这里删除他的密钥。
const VALID_KEYS = [
    'CLIENT_A_UNIQUE_ACCESS_KEY', // 这是您第一个客户的密钥
    'ANOTHER_CLIENT_KEY_12345',   // 这是另一个客户的密钥
    // 根据需要在这里添加更多密钥
];

exports.handler = async function(event, context) {
    // 只允许 POST 请求
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const receivedKey = body.key;

        if (VALID_KEYS.includes(receivedKey)) {
            // 密钥有效，授予访问权限。
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ok', message: 'Access Granted' })
            };
        } else {
            // 密钥无效，拒绝访问。
            return {
                statusCode: 200, // 我们同样返回200状态码，但在内容里告知访问被拒绝
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'denied', message: '密钥无效或已过期。' })
            };
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status: 'error', message: '错误的请求。' })
        };
    }
};