const app = getApp()
Page({
  data: {
    pics : [],
    filePath:[],
    cloudPath:[],
    openid:''
  },
  onLoad:function(e){
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    this.setData({
      pics:this.data.pics
    })
    console.log("B步骤")
  },
  addImg:function(){
    //需要注意的是，上传成功获得的是唯一的文件ID，要把它写进数据库！
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths
        //http数组地址
        console.log(res.tempFilePaths)
        that.data.filePath = filePath
        var cloudPath = []
        for(var i = 0;i < filePath.length;i++){
          cloudPath.push(that.data.openid+"/"+filePath[i])
        }
        that.data.cloudPath = cloudPath
        console.log(that.data.cloudPath)
        //把src拿到手
        var allSrc = res.tempFilePaths
        for(var i = 0;i < allSrc.length; i++){
          that.data.pics.push(allSrc[i]);
        }
        that.setData({
          pics:that.data.pics
        })
        },
        fail: e => {
          console.log(e)
        }
    })
  },
  onAdd: function (fileid) {
    const db = wx.cloud.database()
    db.collection('photos').add({
      data: {
        fileID:fileid
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res.openid)
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  previewImg1: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    console.log(index)
    //所有图片
    var pics = this.data.pics;
    console.log(pics)
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  uploadClick: async function () {
    var checkcode = false
    checkcode = await this.doupload()
    console.log(checkcode)
    
    if(checkcode){
    }

  },
  doupload:async function(){
    var that = this
    var CloudPath = this.data.cloudPath
    var FilePath = this.data.filePath
    var i = 0
    for(i = 0;i < CloudPath.length; i++){
      const filePath = FilePath[i]
      let nowdata = new Date().getTime()
      var temp = filePath.match(/\.[^.]+?$/)[0]
      const cloudPath = this.data.openid+nowdata+(i).toString()+temp
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res)
          console.log(res.fileID)
          this.onAdd(res.fileID)
          app.globalData.fileID = res.fileID
          app.globalData.cloudPath = cloudPath
          app.globalData.imagePath = filePath
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading()
          console.log("i",i)
          console.log("CloudPath.length",CloudPath.length)
          if(i == CloudPath.length){
            console.log("清空数组",i)
            this.data.pics = []
            this.data.filePath = []
            this.data.cloudPath = []
            this.onLoad()
          }
        }
      })
        fail: e => {
          console.error(e)
        }
    } 
    wx.showToast({
      title: '上传成功',
    })
  }
})