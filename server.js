const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 服务静态文件

// AI对话接口
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_turbo/invoke',
      {
        prompt: message,
        temperature: 0.7,
        top_p: 0.9
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
        }
      }
    );

    console.log('Zhipu API 返回：', response.data);

    const data = response.data;
    let aiResponse = '';
    if (data.data && data.data.choices && data.data.choices.length > 0) {
      aiResponse = data.data.choices[0].content;
    }

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 