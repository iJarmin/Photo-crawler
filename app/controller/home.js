'use strict';
var request = require('request');
var fs = require('fs');

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    var text=await this.ctx.service.download.encode(this.ctx.query.query);
    var url='https://pic.sogou.com/pics?query='+text+'&mode=1&start=48&reqType=ajax&reqFrom=result&tn=0';
    console.log(url);
    const result = await this.app.curl(url, {
      dataType: 'json',
    });
    this.ctx.body=result.data.items
    var index=0;
    var that=this;
    var timer=setInterval(function () {
      var img_src = result.data.items[index].ori_pic_url; //获取图片的url
      let opts = {
        url: img_src,
      };
      let path = "./app/public/"+img_src.split('/')[img_src.split('/').length - 1];
      let r1 = that.ctx.service.download.download(opts,path)
      console.log('下载第'+(index+1)+'张');

      index++;
      if(index>=result.data.items.length-1){
        clearInterval(timer)
        console.log('下载完毕');
      }
    },1500)

  }
}

module.exports = HomeController;
