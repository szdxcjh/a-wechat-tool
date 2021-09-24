// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request')
var inputSentence = ''
var url
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event的值为：")
  console.log(event)
  console.log("inputvalue",event.inputv)
  inputSentence = event.inputv
  url = encodeURI("http://api.qingyunke.com/api.php?key=free&appid=0&msg="+inputSentence)
  console.log("url",url)
  return new Promise((resolve,reject)=>{
    request({
      url:url,
      method:"GET",
      json:true,
    },function(error,response,body){
      console.log("进入了body")
      console.log("response",response)
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      if(response.statusCode==200){
        try{
          console.log("response",response)
          console.log('error:', error);
          console.log('statusCode:', response && response.statusCode);
          console.log('body:', body);
          resolve(body)
          return response
        }catch(e){
          reject()
        }
      }
    })
    })
  }

  // cloud.init({
  //   env: cloud.DYNAMIC_CURRENT_ENV,
  // })
  // const axios = require('axios')
  // const url = "http://api.qingyunke.com/api.php?key=free&appid=0&msg=hello"
  // try {
  //   var res = await axios.get(url)
  //   res.then(function (response){
  //     console.log(response)
  //   }).catch(function (error)
  //    {
  //        console.log(error)
  //    });
  // } catch (e) {
  //   console.error(e);
  // }
  // console.log("调用nlp云函数")
//} 

