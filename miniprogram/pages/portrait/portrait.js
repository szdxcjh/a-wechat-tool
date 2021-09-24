const app = getApp()
Page({
  data: {
    pics : [],
    filePath:[],
    cloudPath:[],
    openid:'',
    flag:1,
    file:[],
    file_:[]
  },
  onLoad:function(e){
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },
  addImg:function(){
    //需要注意的是，上传成功获得的是唯一的文件ID，要把它写进数据库！
    var that = this
    wx.chooseImage({
      count: 1,
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
          pics:that.data.pics,
          flag:0
        })
        },
        fail: e => {
          console.log(e)
        }
    })
  },
  onAdd: function (fileid) {
    const db = wx.cloud.database()
    db.collection('portrait').add({
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
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  uploadClick: function () {
    // 上传
    var CloudPath = this.data.cloudPath
    var FilePath = this.data.filePath
    wx.showLoading({
      title: '生成中...',
    })
    for(var i = 0;i < CloudPath.length; i++){
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
          this.data.file_.push(res.fileID)
          console.log(this.data.file_)
          wx.cloud.getTempFileURL({
            fileList: this.data.file_,
            success: res => {
              //拿url
              console.log("res.fileList[tempFileURL]")
              console.log(res.fileList[0]["tempFileURL"])
              this.onTransmission(res.fileList[0]["tempFileURL"])
            },
            fail: console.error
          })
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
      })
        fail: e => {
          console.error(e)
        }
    } 
  },
  onTransmission: function (url) {
    var that = this
    wx.request({
      url: "http://172.31.102.77:8998/getUrl", //仅为示例，并非真实的接口地址
      data: {
        url: url
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        //console.log(res.data["res"])
        var str= res.data["res"]
        // var k = wx.base64ToArrayBuffer(str)
        // console.log(k)
        var nowdata = new Date().getTime()+'tmp_img_src'
        const FILE_PATH =`${wx.env.USER_DATA_PATH}/${nowdata}.jpg`;
        console.log(FILE_PATH)
        that.onFileWrite(str,FILE_PATH)
  },
})
},
  onFileWrite:function(str,FILE_PATH){
    const FILE = wx.getFileSystemManager()
    FILE.writeFile({
    filePath:FILE_PATH,
    encoding:'base64',
    data:str,
    success (resu) {
      console.log("resu:")
      console.log(resu)
  }
  })
  console.log("这部分完全写好了")
  this.onGetPhoto(FILE_PATH)
  },
  onGetPhoto: function(FILE_PATH){
    var filePath = FILE_PATH
    console.log(filePath)
    //先把临时文件上传到数据库，再把它读出来试试
    let nowdata = new Date().getTime()
    var temp = filePath.match(/\.[^.]+?$/)[0]
    const cloudPath = this.data.openid+nowdata+temp
    console.log("测试点")
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
        this.data.file.push(res.fileID)
        console.log(this.data.file)
        wx.cloud.getTempFileURL({
          fileList: this.data.file,
          success: res => {
            //拿url
            console.log("拿到的url")
            console.log("res.fileList[tempFileURL]")
            console.log(res.fileList[0]["tempFileURL"])
            var urltosave = res.fileList[0]["tempFileURL"]
            wx.downloadFile({
            url:urltosave,
            success: function(res) {
              console.log("下载成功")
              console.log(res); 
              wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function(data) {
              console.log("保存文件到图库成功")
              wx.showToast({
                title: '生成成功',
              })
              },
              fail: function(err) {
                //加入询问权限请求
                console.log(err);
                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                  console.log("当初用户拒绝，再次发起授权")
                  wx.showModal({
                    title: '提示',
                    content: '需要您授权保存相册',
                    showCancel: false,
                    success: modalSuccess => {
                      wx.openSetting({
                        success(settingdata) {
                          console.log("settingdata", settingdata)
                          if (settingdata.authSetting['scope.writePhotosAlbum']) {
                            wx.showModal({
                              title: '提示',
                              content: '获取权限成功,再次点击图片即可保存',
                              showCancel: false,
                            })
                          } else {
                            wx.showModal({
                              title: '提示',
                              content: '获取权限失败，将无法保存到相册哦~',
                              showCancel: false,
                            })
                          }
                        },
                        fail(failData) {
                          console.log("failData", failData)
                        },
                        complete(finishData) {
                          console.log("finishData", finishData)
                        }
                      })
                    }
                  })
                }
              }
        })
      },
      fail: function(err_){
        console.log(err_)
      }
    })
  },
          fail: console.error
        })
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      }
    })
  },
})