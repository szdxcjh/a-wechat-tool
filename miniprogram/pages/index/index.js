//index.js
const app = getApp()
//var bgam = wx.getBackgroundAudioManager()
var bgam = wx.createInnerAudioContext()
var videoshow = true
var num = 0
var ramnum = 0
Page({
  data: {
    audioSeek: 0, //音频当前时间
    audioDuration: 0, //音频总时间
    audioTime: 0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    recomimg:[{img:'/images/recom1.jpg',text:'word2vec方法'},{img:'/images/recom2.jpg',text:'因子分解机'},{img:'/images/recom3.jpg',text:'DNN深度学习方法'},{img:'/images/recom4.jpg',text:'实例转移模型'},],
    musicimg:[{img:'/images/music1.jpg',text:'经典中文歌'},{img:'/images/music2.jpg',text:'쉬운한국어노래'},{img:'/images/music3.jpg',text:'素敵な日本の歌'},{img:'/images/music4.jpg',text:'English Music'},],
    musiclist:[[],[],[],[]],
    hasUserInfo: false,
    videoplaying: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'),
     // 如需尝试获取用户信息可改为false
    motto:"",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    rollphotos: ['/images/1.jpg', '/images/2.jpg','/images/3.jpg','/images/4.jpg'],
    circular:true,
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    nextmargin: "0px",
    
  },
  bxClick:function(){
    wx.navigateTo({
      url: '../timer/timer'
    })
  },
  newsClick:function(){
    wx.navigateTo({
      url: '../news/news'
    })
  },
  showUploadClick:function(){
    wx.navigateTo({
      url: '../photowall/photowall'
    })
  },
  portraitClick:function(){
    wx.navigateTo({
      url: '../portrait/portrait'
    })
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  doClick:function(){
    wx.navigateTo({
      url: '../dothings/dothings'
    })
  },
  uploadClick:function(){
    wx.navigateTo({
      url: '../uploadlife/uploadlife'
    })
  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
    else{
      console.log("拒绝获得")
    }
    this.onGetOpenid()
    const db = wx.cloud.database()
    db.collection('music').where({
      "country":"Japan"
    }).get({
      success: res => {
        console.log("music查询成功")
        for(var i = 0;i<res.data.length;i++){
          wx.cloud.downloadFile({
            fileID:res.data[i].Fileid,
            success:res=>{
              console.log("下载成功")
              console.log(res.tempFilePath) 
              this.data.musiclist[2].push(res.tempFilePath)
            },
            fail: console.error
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
  }
})
    db.collection('music').where({
      "country":"China"
    }).get({
      success: res => {
        console.log("music查询成功")
        for(var i = 0;i<res.data.length;i++){
          wx.cloud.downloadFile({
            fileID:res.data[i].Fileid,
            success:res=>{
              console.log("下载成功")
              console.log(res.tempFilePath) 
              this.data.musiclist[0].push(res.tempFilePath)
            },
            fail: console.error
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
    }
    })
    db.collection('music').where({
      "country":"England"
    }).get({
      success: res => {
        console.log("music查询成功")
        for(var i = 0;i<res.data.length;i++){
          wx.cloud.downloadFile({
            fileID:res.data[i].Fileid,
            success:res=>{
              console.log("下载成功")
              console.log(res.tempFilePath) 
              this.data.musiclist[3].push(res.tempFilePath)
            },
            fail: console.error
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
  }
})
    db.collection('music').where({
      "country":"Korean"
    }).get({
      success: res => {
        console.log("music查询成功")
        for(var i = 0;i<res.data.length;i++){
          wx.cloud.downloadFile({
            fileID:res.data[i].Fileid,
            success:res=>{
              console.log("下载成功")
              console.log(res.tempFilePath) 
              this.data.musiclist[1].push(res.tempFilePath)
            },
            fail: err =>{console.log(err)}
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
  }
})
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  playvideo:function(e){
    var that = this
    var index = e.currentTarget;
    num = parseInt(index.offsetLeft/90)
      if (this.data.videoplaying == false){
        ramnum = this.randomNum(0,this.data.musiclist[num].length-1)
        console.log(this.data.musiclist[num][ramnum])
        bgam.src = this.data.musiclist[num][ramnum]
        console.log(bgam)
        bgam.play()
        bgam.onPlay(function() {
          console.log("======onPlay======");
          that.countTimeDown(that, bgam);
         })
        bgam.onEnded(function() {
          console.log("======onEnded======");
          that.nextmusic()
          console.log("进入了下一首")
        })
        bgam.onPause(function() {
          console.log("======onPause======");
        })
        this.data.videoplaying = true
        console.log(bgam.duration)
        this.setData({
          videoshow: true,
          stop:true
        })
      }
      else if(this.data.videoplaying == true){
        bgam.pause()
        this.data.videoplaying = false
        ramnum = this.randomNum(0,this.data.musiclist[num].length-1)
        console.log(this.data.musiclist[num][ramnum])
        bgam.src = this.data.musiclist[num][ramnum]
        bgam.play()
        this.data.videoplaying = true
        console.log(bgam.duration)
      }
  },
  //时长格式化
  formatTime: function(s) {
    let t = '';
    s = Math.floor(s);
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },
  countTimeDown: function(that, manager) {
    if (that.data.videoplaying) {
      setTimeout(function() {
        if (that.data.videoplaying) {
          // console.log("duration: " + manager.duration);
          // console.log(manager.currentTime);
          that.setData({
            progress: Math.ceil(manager.currentTime),
            progressText: that.formatTime(Math.ceil(manager.currentTime)),
            duration: Math.ceil(manager.duration),
            durationText: that.formatTime(Math.ceil(manager.duration))
          })
          that.countTimeDown(that, manager);
        }
      }, 1000)
    }
  },
  //slider拖拽事件
  sliderChange: function(e){
    bgam.pause();
    bgam.seek(e.detail.value);
    this.setData({
      progressText: this.formatTime(e.detail.value)
    })
    setTimeout(function() {
      bgam.play();
    }, 1000);
  },

  changevideostatus:function(){
    if(this.data.videoplaying == true){
      bgam.pause()
      this.data.videoplaying = false
      this.setData({
        stop:this.data.videoplaying
      })
  }
    else{
      bgam.play()
      this.data.videoplaying = true
      this.setData({
        stop:this.data.videoplaying
      })
    }
  },
  nextmusic:function(){
    bgam.pause()
    this.data.videoplaying = false
    if(ramnum<this.data.musiclist[num].length-1){
      ramnum+=1
    }
    else{
      ramnum = 0
    }
    bgam.src = this.data.musiclist[num][ramnum]
    bgam.play()
    this.data.videoplaying = true
  },
  lastmusic:function(){
    bgam.pause()
    this.data.videoplaying = false
    if(ramnum>0){
      ramnum-=1
    }
    else{
      ramnum = this.data.musiclist[num].length-1
    }
    bgam.src = this.data.musiclist[num][ramnum]
    bgam.play()
    this.data.videoplaying = true
  },
  randomNum: function(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 
})
