// 这是您的有效密钥列表。
// 要给新客户授权，就把他的密钥加到这里。
// 要吊销某个客户的权限，就从这里删除他的密钥。
const VALID_KEYS = [
    'CLIENT_A_UNIQUE_ACCESS_KEY', // 这是一个示例密钥，请确保它和您HTML文件里的一致
    'ANOTHER_CLIENT_KEY_12348',
    // 根据需要在这里添加更多密钥
];

exports.handler = async function(event, context) {
    // --- 新增：处理浏览器的预检请求 (OPTIONS request) ---
    // 这是 CORS 规范的一部分，对于复杂的请求是必需的
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }
    
    // 只允许 POST 请求
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const receivedKey = body.key;

        if (VALID_KEYS.includes(receivedKey)) {
            // Key is valid, grant access.
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // <-- 关键修改：允许所有来源访问
                },
                body: JSON.stringify({ status: 'ok', message: 'Access Granted' })
            };
        } else {
            // Key is NOT valid, deny access.
            return {
                statusCode: 200, 
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // <-- 关键修改：允许所有来源访问
                },
                body: JSON.stringify({ status: 'denied', message: '无效或已过期。' })
            };
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status: 'error', message: 'Bad request.' })
        };
    }
};