// 云函数入口文件
const cloud = require('wx-server-sdk')
var res = []
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var path = "/music/"
  //初始化fso对象;
	var fso	= new ActiveXObject("Scripting.FileSystemObject");
	//根据路径获取文件夹;
  var fldr = fso.GetFolder(path);
  //获取目录下的所有文件;
  var fc = new Enumerator(fldr.files);
  console.log(fc)
  return(fc)
}