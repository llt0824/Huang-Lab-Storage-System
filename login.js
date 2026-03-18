import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // 设置CORS头，允许前端访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // 查询用户
    const { rows } = await sql`
      SELECT id, username, name, email, role 
      FROM users 
      WHERE username = ${username} AND password = ${password}
    `;

    if (rows.length > 0) {
      // 登录成功，返回用户信息（不返回密码）
      res.json({ 
        success: true, 
        user: rows[0] 
      });
    } else {
      // 登录失败
      res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后重试' 
    });
  }
}