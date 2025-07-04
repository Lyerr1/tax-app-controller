// 您的密钥“数据库”。当您要给新客户时，在这里添加一个新密钥。
// 这里的密钥本身不包含时间信息。
const VALID_KEYS = [
  'CLIENT_A_UNIQUE_ACCESS_KEY', // 客户A的密钥
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', // 客户B的密钥
  'another-new-key-for-client-c' // 客户C的密钥
];

// 24小时的毫秒数
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

// 获取本次部署的时间戳。Netlify在构建时会自动设置这个环境变量。
// 如果在本地测试，就使用当前时间。
const DEPLOY_TIME = process.env.CONTEXT === 'production' 
  ? Date.parse(process.env.BUILD_ID) 
  : Date.now();

exports.handler = async function(event, context) {
    // 处理CORS预检请求
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }, body: '' };
    }
    
    // 只允许POST请求
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const receivedKey = body.key;

        // 1. 检查密钥是否存在于我们的列表中
        if (!VALID_KEYS.includes(receivedKey)) {
            return {
                statusCode: 200, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ status: 'denied', message: '无效的密钥。' })
            };
        }

        // 2. 检查是否已过期
        const now = Date.now();
        if (now - DEPLOY_TIME > TWENTY_FOUR_HOURS_IN_MS) {
            return {
                statusCode: 200, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ status: 'denied', message: '访问已过期。' })
            };
        }

        // 3. 如果密钥有效且未过期，则授予访问权限
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ status: 'ok', message: 'Access Granted' })
        };

    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ status: 'error', message: 'Bad request.' }) };
    }
};