Page({
  data:{
  mode:"widthFix",
  //style:"width:520px;height:1230px"
  context:"计时中",
  timenum:{min:"00",sec:"00"},
  timername:"",
},
  onLoad(){
    let nowdata = new Date().getTime()
    nowdata = nowdata + 1800500;
    var that = this;
    that.gettime(nowdata);  
  },
  gettime:function(nowdata){
    //var:全局 let:局部const:常量（块级）
    let that = this;
    console.log("进入函数")
    console.log(nowdata)
    //setData:把函数变量渲染到视图层
    that.setData({
      //setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。setInterval() 方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。由 setInterval() 返回的 ID 值可用作 clearInterval() 方法的参数。
      timername:setInterval(function(){
        //全局剩余时间
        var restime = parseInt((nowdata-new Date().getTime()))
        if(restime<=0){
          that.setData({
            timenum:{min:"00",sec:"00"}
          })
          clearInterval(that.data.timername);
          return;
        }
        var mintemp = parseInt(restime/1000/60 % 60)
        var sectemp = parseInt(restime/1000 % 60)
        that.setData({
          timenum:{min: mintemp,sec:sectemp}
        })
      },1000)
    })
  }
})
