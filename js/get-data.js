timeStart="";
timeEnd="";
timeEnd_collect=""; //采集结束时间，程序到这时间终止
//获取，处理页面数据
function  get_data(){
    httpRequest('http://127.0.0.1:8080/invCloudOA/appuser/calllog2db',encodeFormData(data2sent),function(result){
        html = result;
        console.log(html);
    });
}

function httpRequest(url,data, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('post',url);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhr.send(data);
}

//程序入口
   /*
chrome.storage.local.get("isenable", function(obj) {
 
    console.log('begin to get data from page')
    var tbodies = $('.ivu-table-tbody');
    console.log(tbodies)
    if(tbodies) {
        $.each(tbodies, function(index, tbody){
            console.log(index)
            console.log(tbody.textContent)
        })
    }
  
});
  */
