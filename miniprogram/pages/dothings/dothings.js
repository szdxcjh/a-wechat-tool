const app = getApp()
Page({
  data: {
    inputValue:"",
    todoitems:[],
    //设置下开始的坐标
    startX: 0, 
    startY: 0,
    counterId: '',
    openid: '',
    count: null,
    addthing:'',
    queryResult: '',
    todelRes:'',
    flag:0
  },
  onLoad:function(e){
    var that = this
    //获得用户的openid
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    console.log("openid:",this.data.openid)
    //从数据库中读取内容
    const db = wx.cloud.database()
    //先找到要删除记录的counterId（主键，唯一标识）
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
        })
        console.log('[数据库] [查询记录] 成功:',that.data.queryResult)
        for(var i = 0;i<res.data.length;i++){
          console.log(res.data[i]["addthing"])
          that.setData({
            inputValue: res.data[i]["addthing"]
          })
          that.data.todoitems.push({
            content: that.data.inputValue,   
            isTouchMove: false 
            })
          that.setData({
            todoitems: that.data.todoitems
            })
          this.setData({
            inputValue: ""
          })
          wx.showToast({
            title: '读取记录成功'
        })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    if(that.data.queryResult){
      console.log(that.data.queryResult.length)
    }
  },
  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('counters').add({
      data: {
        count: 1,
        addthing: this.data.inputValue
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1,
          addthing: this.data.inputValue
        })
          wx.showToast({
            title: '增加记录成功'
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onQuery: function(e) {
    const db = wx.cloud.database()
    //先找到要删除记录的counterId（主键，唯一标识）
    console.log(this.data.openid)
    console.log(this.data.todoitems[0].content)
    db.collection('counters').where({
      _openid: this.data.openid,
      addthing: this.data.todoitems[e.currentTarget.dataset.index].content
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
          todelRes:res.data[0]["_id"]
        })
        console.log('[数据库] [查询记录] 成功: ')
        console.log('查询的id为：',this.data.todelRes)
        this.onRemove()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onRemove: function(){
    const db = wx.cloud.database()
    if (this.data.todelRes) {
      console.log(this.data.todelRes)
      console.log(this.data.todelRes)
      db.collection('counters').doc(this.data.todelRes).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          console.log("删除成功")
          this.setData({
            todelRes: '',
            count: null,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请创建一个记录',
      })
    }
  },
  touchstart:function(e){
    var that = this
    //处理为true的
    that.data.todoitems.forEach(function(v,i){
      if(v.isTouchMove){
        v.isTouchMove = false;
      }
    })
    that.setData({
      ////涉及当前事件的手指的列表，尽量使用这个代替touches,这些列表里的每次触摸由touch对象组成，touch对象里包含着触摸信息
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      todoitems: that.data.todoitems
    })
  },
  touchmove: function(e) {
    var that = this,
    //目前的索引
    index = e.currentTarget.dataset.index,
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    console.log(angle)
    console.log(index)
    //v指示事件，i指示
    that.data.todoitems.forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过35度角 返回
    if (Math.abs(angle) > 35) return;
    if (i == index) {
      if (touchMoveX > startX) //右滑
        v.isTouchMove = false
      else //左滑
        v.isTouchMove = true
      }})
    //更新数据
    that.setData({
    todoitems: that.data.todoitems
    })
    },
  angle:function(start,end){
    var _X = end.X - start.X
    var _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  del: function (e) {
    console.log("进入del函数")
    console.log(e.currentTarget.dataset.index)
    this.onQuery(e)
    
    this.data.todoitems.splice(e.currentTarget.dataset.index, 1)
    //删除的同时，如果_openid和字段相同的话，删掉数据库的内容
    this.setData({
    todoitems: this.data.todoitems 
    })
    },
  /*
  bindinput:键盘输入时触发，处理函数可以直接 return 一个字符串，将替换输入框的内容。(输入了就有)
  bindconfirm:点击完成按钮时触发，event.detail = {value: value}
  */
  record:function(e){
    var that = this
    that.setData({
      inputValue: e.detail.value
    })
    console.log(that.data.inputValue)
    that.data.todoitems.push({
      content: that.data.inputValue,   
      isTouchMove: false 
      })
    that.setData({
      todoitems: that.data.todoitems,
      flag:1
      });
    that.onAdd()
    this.clearInput(e)
  },
  clearInput(e){
    console.log("进入了清除函数")
    this.setData({
      inputValue: ""
    })
  }
})