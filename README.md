# PaulKS Translator - 纯前端版本

一个基于AI的智能翻译工具，支持Gemini和DeepSeek双引擎，纯前端实现，部署简单。

## 🚀 Vercel一键部署

### 1. 上传到GitHub
1. 将此文件夹内容上传到您的GitHub仓库
2. 确保包含以下文件：
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

### 2. 在Vercel部署
1. 访问 [vercel.com](https://vercel.com)
2. 用GitHub账号登录
3. 点击 "New Project"
4. 选择您的GitHub仓库
5. Framework Preset 选择 **"Other"**
6. 点击 "Deploy"

### 3. 配置API密钥
部署成功后：
1. 访问您的网站
2. 点击右上角的设置按钮 ⚙️
3. 在"API密钥配置"中输入您的密钥：
   - **Gemini API Key**: 从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取
   - **DeepSeek API Key**: 从 [DeepSeek Platform](https://platform.deepseek.com/api_keys) 获取

## ✨ 功能特色

### 🧠 双AI引擎
- **Gemini**: Google的先进AI模型，海外访问优化
- **DeepSeek**: 国产优秀AI模型，国内访问友好
- **Auto**: 智能选择最佳可用引擎

### 🎨 现代化界面
- 完全仿照Google翻译的设计
- 美观的渐变背景和毛玻璃效果
- 完全响应式，支持手机、平板、电脑

### 📚 智能功能
- **历史记录**: 自动保存翻译历史到浏览器本地
- **字体自适应**: 长文本自动调整字体大小
- **快捷键支持**: Ctrl+Enter翻译，Ctrl+H打开历史
- **一键操作**: 复制、粘贴、清空、交换语言

### 🔧 个性化设置
- 翻译引擎偏好设置
- 自动翻译开关
- 历史记录保存控制
- API密钥安全存储（仅保存在您的浏览器中）

## 🛡️ 隐私安全

- **完全前端**: 所有代码运行在您的浏览器中
- **API直连**: 直接调用AI服务商API，无中间服务器
- **本地存储**: 历史记录和设置仅保存在您的浏览器中
- **开源透明**: 所有代码完全可见，无隐藏功能

## 📱 使用说明

### 基本翻译
1. 在左侧输入框输入要翻译的文本
2. 选择源语言和目标语言
3. 点击底部的翻译按钮：
   - **Gemini**: 使用Gemini引擎翻译
   - **DeepSeek**: 使用DeepSeek引擎翻译
   - **Auto**: 自动选择最佳引擎

### 引擎对比
- 对同一段文字分别点击Gemini和DeepSeek按钮
- 可以对比两个AI的翻译结果
- 选择您认为更好的翻译

### 历史记录
- 点击右上角历史按钮查看翻译历史
- 支持搜索历史记录
- 点击历史记录可重新加载到翻译界面

## 🔑 API密钥获取

### Gemini API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登录Google账号
3. 点击"Create API Key"
4. 复制生成的API密钥

### DeepSeek API Key
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/api_keys)
2. 注册并登录账号
3. 在API Keys页面创建新密钥
4. 复制生成的API密钥

## 💡 使用技巧

1. **首次使用**: 建议先配置一个API密钥进行测试
2. **引擎选择**: Gemini适合海外用户，DeepSeek适合国内用户
3. **长文本**: 系统会自动调整字体大小，方便查看长文档
4. **快捷键**: 使用Ctrl+Enter快速翻译，提高效率
5. **历史记录**: 利用历史记录功能回顾和重用之前的翻译

## 🌐 部署优势

- ✅ **零服务器成本**: 纯静态网站，完全免费
- ✅ **部署简单**: 上传文件即可，无需配置
- ✅ **访问稳定**: 静态网站访问速度快，稳定性高
- ✅ **全球可用**: Vercel全球CDN，世界各地都能快速访问

## 🔧 故障排除

### 翻译失败
1. 检查API密钥是否正确配置
2. 确认网络连接正常
3. 尝试切换不同的翻译引擎

### 无法访问
1. 检查Vercel部署状态
2. 确认域名解析正常
3. 尝试使用不同网络环境

## 📞 技术支持

如果遇到问题：
1. 检查浏览器控制台是否有错误信息
2. 确认API密钥配置正确
3. 尝试清除浏览器缓存和本地存储

---

**享受您的专属PaulKS Translator！** 🎉

