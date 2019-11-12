var params=getRequest();
var uid=params.uid;
var token=params.token;
function fetchList(){
    var postData={
        port:port,
        app_version:app_version,
        token:token,
        type:"1",
        uid:uid
    }
    fetchData("/userHouse/userHouseList",postData,fetchSuccess);
}

fetchList();

function fetchSuccess(res){
    if(res.code==200){
        $(".loading-block").hide();
        var html="";
        var houseList=res.data.owner.concat(res.data.sib);
        for(var i=0;i<houseList.length;i++){
            html+='<li houseId="'+houseList[i].estate_id+'" onClick="seekHouse(this)" ><div class="house-info-block"><h3 class="house-name">'+
            houseList[i].project+'</h3><p class="houseInfo"><span>'+houseList[i].buildingname+'</span><span>'+
            houseList[i].housetype+'</span>'+houseList[i].houseArea+' ㎡<span></span></p></div>'+
            '<div class="icon-block"><img src="images/icon_back.png" alt=""></div></li>'
        }
        $(".houseList").append(html);
    }else{
        $(".loading-block").hide();
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}

function seekHouse(item){
    var houseId=$(item).attr("houseId");
    window.location.href='houseInfo_inner.html?houseId='+houseId+'&uid='+uid+'&token='+token;
}