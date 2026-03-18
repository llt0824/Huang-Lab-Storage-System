import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // 创建用户表
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        register_date DATE
      )
    `;

    // 创建引物表
    await sql`
      CREATE TABLE IF NOT EXISTS primers (
        id BIGINT PRIMARY KEY,
        gene_name VARCHAR(100) NOT NULL,
        species VARCHAR(100) NOT NULL,
        usage TEXT NOT NULL,
        f_seq TEXT NOT NULL,
        r_seq TEXT NOT NULL,
        source VARCHAR(100) NOT NULL,
        company VARCHAR(100) NOT NULL,
        synthesizer VARCHAR(100) NOT NULL,
        synthesizer_id INT,
        date DATE NOT NULL,
        location VARCHAR(100),
        notes TEXT
      )
    `;

    // 创建质粒表
    await sql`
      CREATE TABLE IF NOT EXISTS plasmids (
        id BIGINT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        size INT NOT NULL,
        resistance VARCHAR(100) NOT NULL,
        feature TEXT NOT NULL,
        holder VARCHAR(100) NOT NULL,
        holder_id INT,
        date DATE NOT NULL,
        addgene VARCHAR(100),
        location VARCHAR(100),
        notes TEXT
      )
    `;

    // 创建siRNA表
    await sql`
      CREATE TABLE IF NOT EXISTS sirnas (
        id BIGINT PRIMARY KEY,
        gene_name VARCHAR(100) NOT NULL,
        sense TEXT NOT NULL,
        antisense TEXT NOT NULL,
        source VARCHAR(100) NOT NULL,
        modification VARCHAR(50) NOT NULL,
        company VARCHAR(100) NOT NULL,
        synthesizer VARCHAR(100) NOT NULL,
        synthesizer_id INT,
        date DATE NOT NULL,
        stock DECIMAL(10,2) NOT NULL,
        notes TEXT
      )
    `;

    // 创建抗体表
    await sql`
      CREATE TABLE IF NOT EXISTS antibodies (
        id BIGINT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        company VARCHAR(100) NOT NULL,
        catalog VARCHAR(100) NOT NULL,
        species VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        usage TEXT NOT NULL,
        location VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        uploader VARCHAR(100) NOT NULL,
        uploader_id INT
      )
    `;

    // 创建特殊试剂表
    await sql`
      CREATE TABLE IF NOT EXISTS reagents (
        id BIGINT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        usage TEXT NOT NULL,
        company VARCHAR(100) NOT NULL,
        catalog VARCHAR(100) NOT NULL,
        expiry DATE NOT NULL,
        date DATE NOT NULL,
        location VARCHAR(100) NOT NULL,
        notes TEXT,
        uploader VARCHAR(100) NOT NULL,
        uploader_id INT
      )
    `;

    // 插入默认用户
    await sql`
      INSERT INTO users (username, password, name, email, role, register_date)
      VALUES 
        ('luliting', '123456', '卢丽婷', 'luliting0824@163.com', 'admin', '2026-01-01'),
        ('wangxiaoming', '123456', '王小明', 'wangxm@lab.com', 'user', '2026-02-15')
      ON CONFLICT (username) DO NOTHING
    `;

    res.json({ success: true, message: '数据库初始化成功' });
  } catch (error) {
    console.error('初始化错误:', error);
    res.status(500).json({ error: error.message });
  }
}
