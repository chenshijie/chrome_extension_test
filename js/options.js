//加载数据，显示目前的配置
window.onload=function(){
    chrome.storage.local.get("isenable", function(obj) {
        document.getElementById('isenable').checked=obj.isenable
    });
}

//保存
document.getElementById('save').onclick = function(){
    var isenable = document.getElementById('isenable').checked;
    var p = {
        isenable:isenable
    }
    chrome.storage.local.set(p,function(){
        alert('设置已保存');
        }
    );
}