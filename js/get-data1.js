timeStart="";
timeEnd="";
timeEnd_collect=""; //采集结束时间，程序到这时间终止

//encode要发送到OA系统的数据
function encodeFormData(data){
    if(!data) return '';
    var pairs = [];
    for(var name in data){
        if(!data.hasOwnProperty(name)) continue;
        if(typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name.replace('%20','+'));
        value = encodeURIComponent(value.replace('%20','+'));
        pairs.push(name+'='+value);
    }
    return pairs.join('&');
}
//获取，处理页面数据
function  get_data(){
    var trs = window.frames["MainIframe"].document.getElementById("table_data_tbody").children;
    var datas=[];
    for(var i=0;i<trs.length;i++){
        var tds =trs[i].childNodes;    
        var data_tmp= {
            STARTTIME:tds[1].innerText,
            ENDTIME:tds[2].innerText,
            ZUOXI:tds[3].innerText,
            ZUOXI_ID:tds[4].innerText,
            FROM_NUM:tds[5].innerText,
            TO_NUM:tds[6].innerText,
            CALL_TYPE:tds[7].innerText,
            DURATION:tds[8].innerText,
            SATISFACTION:tds[9].innerText,
            ACID:tds[10].innerText
        };        
        datas[i]=data_tmp;
    }
    var s = JSON.stringify(datas);
    var data2sent={
        data:s
    }
    httpRequest('http://127.0.0.1:8080/invCloudOA/appuser/calllog2db',encodeFormData(data2sent),function(result){
        html = result;
        console.log(html);
    });
}

//模拟用户操作，发送请求给acc
function sent_req(){
    chrome.storage.local.set({"log":"模拟用户操作，修改时间参数"});

    var timestamp_end = Date.parse(new Date(timeEnd));
    window.frames["MainIframe"].document.getElementById("type_duration").click();
    window.frames["MainIframe"].document.getElementById("timeStart").value=timeStart;
    window.frames["MainIframe"].document.getElementById("timeEnd").value=timeEnd;
    window.frames["MainIframe"].document.getElementById("btnOk").click();

    chrome.storage.local.set({"log":"发送请求，延时处理返回数据"});
    //延时数据处理
    setTimeout(get_data,12000);
    //设置新的时间
    chrome.storage.local.set({"log":"时间参数修改"});
    timeStart=timeEnd;
    var end_timestamp = Date.parse(new Date(timeEnd));
    var new_end_date = new Date();
    new_end_date.setTime(end_timestamp+60*60*1000); 
    timeEnd=new_end_date.format('yyyy-MM-dd hh:mm:ss');
    var p = {
        timeStart:timeStart,
        timeEnd:timeEnd,
    }
    chrome.storage.local.set(p,function(){});
    chrome.storage.local.set({"log":"数据处理完成，准备发给OA"});
    setTimeout(sent_req, 10000);
}

//构造请求，发给OA
function httpRequest(url,data, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('post',url);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    chrome.storage.local.set({"log":"发送数据给OA，OA处理中"});
    xhr.send(data);
}

//时间格式化工具
Date.prototype.format = function(format) {
    var date = {
           "M+": this.getMonth() + 1,
           "d+": this.getDate(),
           "h+": this.getHours(),
           "m+": this.getMinutes(),
           "s+": this.getSeconds(),
           "q+": Math.floor((this.getMonth() + 3) / 3),
           "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
}

//程序入口
chrome.storage.local.get("isenable", function(obj) {

    chrome.storage.local.get("timeStart", function(obj) {
        timeStart=obj.timeStart;
    });
    chrome.storage.local.get("timeEnd", function(obj) {
        timeEnd=obj.timeEnd;
    });

    if(obj.isenable){
        setTimeout(sent_req,6000);
        chrome.storage.local.set({"log":"插件已经正常开启!"});
    }
});