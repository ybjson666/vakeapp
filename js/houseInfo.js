var params=getRequest();
var uid=params.uid;
var token=params.token;
var houseId=params.houseId;

function fetchHouse(){
    var postData={
        type:"1",
        port:port,
        app_version:app_version,
        uid:uid,
        token:token,
        estate_id:houseId
    }
    fetchData("/userHouse/houseInfo",postData,fetchSuccess);
}

fetchHouse();

function fetchSuccess(res){
    if(res.code==200){
        $(".loading-block").hide();
        var house=res.data;
        $(".house-name").text(house.house_info);
        $(".card-items").text(house.id_card);
        if(house.buydate){
            $(".sign-items").text(house.buydate);
        }else{
            $(".sign-rows").hide();
        }

        if(house.buydate){
            $(".sign-items").text(house.buydate);
        }else{
            $(".sign-rows").hide();
        }

        if(house.housearea){
            $(".area-items").text(house.housearea);
        }else{
            $(".area-rows").hide();
        }

        if(house.housetype){
            $(".type-items").text(house.housetype);
        }else{
            $(".type-rows").hide();
        }

        if(house.housetotal){
            $(".total-items").text(house.housetotal);
        }else{
            $(".total-rows").hide();
        }

        if(house.launchDate){
            $(".pay-items").text(formatTime(house.launchDate));
        }else{
            $(".pay-rows").hide();
        }

    }else{
        $(".loading-block").hide();
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }

}
$(".errors").click(function(){
    window.location.href='houseError.html?token='+token+'+&uid='+uid+'&houseId='+houseId;
})