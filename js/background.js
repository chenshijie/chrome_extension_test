var requestLimit = {}

function httpRequest(url,headers){
    var key = md5(url)
    var time = new Date().getTime()
    //请求间隔为5分钟
    if(requestLimit[key] != undefined && time - requestLimit[key] < 5 * 60  * 1000) {
        return;
    }
    console.log(url)
    console.log(new Date().toLocaleTimeString())
    var requestHeaders = []
    for(let i = 0; i < headers.length; i++) {
        if(headers[i].name === 'X-LANG') {
            return;
        }
        if(headers[i].name === 'User-Agent') {
            continue;
        }
        if(headers[i].name === 'Accept-Encoding') {
            continue;
        }
        if(headers[i].name === 'Origin') {
            continue;
        }
        if(headers[i].name === 'Referer') {
            continue;
        }
        if(headers[i].name === 'Access-Control-Request-Method') {
            continue;
        }
        if(headers[i].name === 'Access-Control-Request-Headers') {
            continue;
        }
        if(headers[i].name === 'Cookie') {
            continue;
        }
        requestHeaders.push({'name':headers[i].name, 'value':headers[i].value})
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get',url);
    for(let i = 0; i < requestHeaders.length; i++) {
        xhr.setRequestHeader(requestHeaders[i].name,requestHeaders[i].value);
    }
    xhr.setRequestHeader('X-LANG','zh_CN');
    
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            //console.log('data received '+ new Date().toLocaleString())
            sendData(url, xhr.responseText)
        }
    }
}

function sendData(url, data) {
    var xhr = new XMLHttpRequest();
    var requestURL = 'http://127.0.0.1:9527/data'
    xhr.open('post',requestURL);
    var body = JSON.stringify({'url':url, 'data':data});
    xhr.send(body)
    var key = md5(url)
    requestLimit[key] = new Date().getTime()
}

chrome.webRequest.onBeforeSendHeaders.addListener(function(detail){
    if(detail.method == 'GET') {
        console.log(detail)
        httpRequest(detail.url, detail.requestHeaders)
    }
},
{
    urls:["http://*.searchain.io/*"],
    types:["xmlhttprequest"]
},
["requestHeaders", "blocking"]
)