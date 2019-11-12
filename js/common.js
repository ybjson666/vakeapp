var api="http://vkhtest.cdvanke.com/api";
var port=1;
var app_version="5.0.0";

//手机正则
var reg_phone = /^(1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8})$/;

function fetchData(urls,data,callBack){
    $.ajax({
        url:api+urls,
        data:data,
        type:"post",
        dataType:"json",
        success:callBack
    })
}

function getMockDatas(urls,callBack){
    $.ajax({
        url:api+urls,
        type:"get",
        dataType:"json",
        success:callBack
    })
}

function getRequest(){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }

    }
    return theRequest;
}

function formatTime(date) {
    //将参数 date * 1000 变为毫秒数，并new 一个日期对象 time
    var time = new Date(date * 1000);
    var month = time.getMonth() + 1;
    var strDate = time.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //获取日期对象 time 的年、月、日，并拼接为字符串 yyyy-mm-dd ,再返回
    return time.getFullYear() + "年" + month + "月" + strDate+"日";
}

function formatTime2(date) {
    //将参数 date * 1000 变为毫秒数，并new 一个日期对象 time
    var time = new Date(date * 1000);
    var month = time.getMonth() + 1;
    var strDate = time.getDate();
    var hour=time.getHours();
    var mins=time.getMinutes();
    var secs=time.getSeconds();
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (mins >= 0 && mins <= 9) {
        mins = "0" + mins;
    }
    if (secs >= 0 && secs <= 9) {
        secs = "0" + secs;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //获取日期对象 time 的年、月、日，并拼接为字符串 yyyy-mm-dd ,再返回
    return time.getFullYear() + "年" + month + "月" + strDate+"日"+"  "+hour+":"+mins+":"+secs;
}

function showModel(msg){
    $(".alert-block").fadeIn(300);
    $(".alert-infos").text(msg);
}
function hideModel(){
    $(".alert-block").fadeOut(300);
    $(".alert-infos").text("");
}

function bindHouse (){
    var u = navigator.userAgent;
    var  app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        window.jsObj.checkBinding();
    }
    if (isIOS) {
        checkBinding();
    }
}

function activityNeedLogin() {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        window.jsObj.needLogin();
    }
    if (isIOS) {
        needLogin();
    }
}
function getAPPProjectID(){
    var u = navigator.userAgent,
    app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; 
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
        window.jsObj.shareInfo(str);
    }
    if (isIOS) {
        shareInfo(str);
    }
}

function reCalHeight(){
    setTimeout(function (){
       var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
       window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
}