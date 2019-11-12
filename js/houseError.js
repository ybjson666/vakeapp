var params=getRequest();
var uid=params.uid;
var token=params.token;
var houseId=params.houseId;

function fetchList(){
    var postData={
        port:port,
        app_version:app_version,
        type:"1",
        uid:uid,
        token:token
    }
    fetchData("/userHouse/userHouseCorrect",postData,fetchSuccess);
}

fetchList();

function fetchSuccess(res){
    if(res.code==200){
        $(".loading-block").hide();
        var list=res.data;
        var html="";
        if(!list.length){
            $(".noneData").show();
        }else{
            for(var i=0;i<list.length;i++){
                var handleHtml="";
                if(list[i].is_dispose=="暂未处理"){
                    handleHtml='<span class="unHaddle fr">'+list[i].is_dispose+'</span>';
                }else if(list[i].is_dispose=="已处理"){
                    handleHtml='<span class="haddled fr">'+list[i].is_dispose+'</span>';
                }
                var addTime=formatTime(list[i].addtime)
                html+=' <li><p class="error-name">'+list[i].content+'</p><div class="error-data">'+
                    '<span class="error-time fl">'+addTime+'</span>'+handleHtml+'<div class="cl"></div></div></li>'
            }
            $(".error-list").append(html);
        }
       
    }else{
        $(".loading-block").hide();
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}

$(".add-error").click(function(){
    window.location.href='addError.html?houseId='+houseId+'&uid='+uid+'&token='+token;
})