#项目简介

本项目开发了一款小程序工具，功能包括计时器，todo-list，图片的上传和预览，图像到线条画的功能，虚拟聊天室以及音乐播放器，用于学习和交流使用。

## github仓库

您可以将该代码克隆到本地```git clone https://github.com/szdxcjh/a-wechat-tool.git```

##开发环境

下面将展示该项目使用的环境：

- 云开发：数据库+文件存储+云函数
- 线条画：   
	Python 3.6  
	numpy 1.15.2  
	scikit-image 0.14.0  
	python-opencv
	PIL 5.2.0  
	PyTorch 0.4.0  
	torchvision 0.2.1  
	glob  

##使用的技术

- 前端三剑客：js+wxml+wxss
- Pytorch深度学习，cv

##知识点

- 预览，音乐播放器的异步到同步处理
- CS通信(get，post方法)
- 外部网站api调用![](C:\Users\76315\WeChatProjects\miniprogram-2\miniprogram\images)
- 云函数的使用
- flex布局的使用等...

##外部支持

1.肖像画部分开源代码支持：[https://github.com/NathanUA/U-2-Net.git](https://github.com/NathanUA/U-2-Net.git)  
2.聊天机器人：http://api.qingyunke.com

##使用方法

1.由于微信小程序**不允许**和本机通信，使用者需要在其他机器配置线条画环境并将../U-2-Net-master/U-2-Net-master/url以及../miniprogram/pages/portrait下的url和端口号修改为自己的url和端口号；

2.音乐播放器部分使用了云存储，需要导入自己的音乐；

##演示部分

该部分保存在/miniprogram/images/video1.mp4中
