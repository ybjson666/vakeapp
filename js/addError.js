var params=getRequest();
var uid=params.uid;
var token=params.token;
var houseId=params.houseId;

function fetchList(){
    var postData={
        port:port,
        app_version:app_version
    }
    fetchData("/basicMessage/houseCorrectionContent",postData,fetchSuccess);
}

fetchList();

function fetchSuccess(res){
    if(res.code==200){
        $(".loading-block").hide();
        var list=res.data;
        var html="";
        for(var i=0;i<list.length;i++){
            html+='<li><input type="radio"name="reason" value="'+list[i].reason_id+'" class="reason-item" />'+
            '<span class="tags">'+list[i].content+'</span></li>'
        }
        $(".select-list").append(html);
    }else{
        $(".loading-block").hide();
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}

/**提交信息 */

$(".sub-btn").on("click",function(){
    var errInfo=$(".error-info").val();
    var reasonId=$("input[name='reason']:checked").val();
    if(errInfo==""){
        showModel("请输入请输入业主的相关信息");
        setTimeout(function(){
            hideModel();
        },2000);
        return;
    }else if(!reasonId){
        showModel("请选择原因");
        setTimeout(function(){
            hideModel();
        },2000);
        return;
    }

    var postData={
        port:port,
        app_version:app_version,
        type:"1",
        token:token,
        uid:uid,
        content:errInfo,
        estate_id:houseId,
        reason_id:reasonId
    }
    $(this).attr("disabled",true);
    fetchData("/userHouse/houseCorrection",postData,subSuccess);
});

function subSuccess(res){
    if(res.code==200){
        $(".sub-btn").attr("disabled",false);
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }else{
        $(".sub-btn").attr("disabled",false);
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}