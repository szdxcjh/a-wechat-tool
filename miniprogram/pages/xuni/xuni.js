// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var inputv = '';

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '您好，最有有什么烦心事吗？'
    },
    {
      speaker: 'customer',
      contentType: 'text',
      content: '没有，滚'
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    initData(this);
    console.log("进入callback函数")
    
  },

  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function(e) {
    console.log("inputVal",e.detail.value)
    inputv = e.detail.value.toString()
    wx.cloud.callFunction({
	    name: 'nlp',    // 需调用的云函数名,注意名称要相同
	    // 传给云函数的参数 也就是上边的event对象
	    data: {
        inputv:inputv
	    },
	    // 成功回调
	    success: res => {
        console.log("结果为：",res.result.content);
        msgList.push({
          speaker: 'server',
          contentType: 'text',
          content: res.result.content
        })
        inputVal = '';
        this.setData({
          msgList,
          inputVal,
          toView: 'msg-' + (msgList.length - 1)
        });
	    },
	    fail: err => {
	      console.error('云函数调用失败', err)
	    }
	  })
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });


  },

  /**
   * 退回上一页
   */
  toBackClick: function() {
    wx.navigateBack({})
  }

})
