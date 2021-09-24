const app = getApp()
Page({
  data:{
    openid:'',
    photos:[],
    photoshttp:[],
    arr:[]
  },
  //首先还是要得到openid
  onLoad: function() {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    console.log("openid:",this.data.openid)
    this.onQuery()
  },
  previewImg1: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    var num = index;
    console.log(num)
    // if(index["offsetLeft"] <= 50){
    //   var num = 2*parseInt(index["offsetTop"]/138)
    //   console.log(num);
    // }
    // if(index["offsetLeft"] >=  51)   {
    //   var num = 2*parseInt(index["offsetTop"]/138)+1
    //   console.log(num);
    // }
    //所有图片
    var photos = this.data.photos;
    wx.previewImage({
      //当前显示图片
      current: this.data.arr[num],
      //所有图片
      urls: this.data.arr
     })
    },
  onQuery:function() {
    const db = wx.cloud.database()
    //先找到要删除记录的counterId（主键，唯一标识）
    console.log(this.data.openid)
    db.collection('photos').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        console.log(res.data)
        for(var i=0;i<res.data.length;i++){
          if(this.data.photos.length < res.data.length){
            this.data.photos.push(res.data[i])
          }
        }
        this.setData({
          photos:this.data.photos
        })
        wx.showToast({
          title: '查询成功'
        })

        //var arr = new Array();
        //console.log(this.data.arr)
        this.onDownload(0)
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
  onDownload:function(i){
      wx.cloud.downloadFile({
        fileID:this.data.photos[i].fileID, // 文件 ID
        success: res => {
          if(this.data.arr.length<this.data.photos.length){
            this.data.arr.push(res["tempFilePath"])      
            if(i+1<this.data.photos.length){
              this.onDownload(i+1)
            }
          }
          // 返回临时文件路径
          //console.log(res)
        },
        fail: console.error
        })
    },
  deleteImage:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index)
    wx.showModal({
      title: 'tips',
      content: '删除此图片吗？',
      success: function (res) {
       if (res.confirm) {
        //删文件
        wx.cloud.deleteFile({
          fileList: [that.data.photos[index]["fileID"]], //云文件 ID
          success: res => {
            console.log("删除了文件")
            //删记录
            const db = wx.cloud.database()
            var delnum = that.data.photos[index]["_id"]
            console.log("that.data.photos[index]",that.data.photos[index])
            console.log("delnum",delnum)
            if (delnum) {
              console.log("delnum",delnum)
              db.collection('photos').doc(delnum).remove({
                success: res => {
                  wx.showToast({
                    title: '删除成功',
                  })
                  console.log("删除成功")
                  that.onLoad()
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
            that.data.arr.splice(index, 1)
            that.data.photos.splice(index, 1)
          },
          fail: console.error
        })
       } else if (res.cancel) {
         return false; 
        }
  }
})
  }
  })
