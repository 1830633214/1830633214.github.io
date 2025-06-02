const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: '只支持POST请求' });
    return;
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    // 用 axios 调用智谱AI官方API
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

    const data = response.data;
    let aiResponse = '';
    if (data.data && data.data.choices && data.data.choices.length > 0) {
      aiResponse = data.data.choices[0].content;
    }

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
};
