 
 var wrapper=document.querySelector('.app-wraper');
 var scroll= new BScroll(wrapper,{
     probeType: 3,
     click:true,
     tap:'click'
     });
 function getBanners(){
    var postData={
        port:port,
        app_version:app_version,
        type:4
    }
    fetchData("/banner_list",postData,fetchBannerSuccess);
 }

 function getNotice(){
    getMockDatas("/systemmsg/SystemMsglist",fetchNoticeSuccess);
 }



 function fetchBannerSuccess(res){
    if(res.code==200){
        var banners=res.data;
        var html="";
        if(banners.length==1){
            $(".swiper-container").hide();
            $(".banner-wraps").show();
            html='<div class="banner-pic-wraper" bannerId="'+banners[0].banner_id+'" type="'+banners[0].type+'" picUrl="'+banners[0].pic_url+'" onClick="lookInfo(this)"><img src="'+banners[0].pic_url+'"/></div>';
            $(".banner-wraps").html(html);
        }else{
            $(".swiper-container").show();
            $(".banner-wraps").hide();
            for(var i=0;i<banners.length;i++){
                html+='<div class="swiper-slide" onClick="lookInfo(this)" bannerId="'+banners[i].banner_id+'" type="'+banners[i].type+'" picUrl="'+banners[i].pic_url+'">'+
                '<div class="banner-icon"><img src="'+banners[i].pic_url+'" alt=""></div></div>'
            }
            $(".swiper-wrapper").append(html);
            var mySwiper = new Swiper('.swiper-container',{
                      autoplay: {
                        delay:3000,
                        },
                      loop:true,
                      pagination: {
                        el:'.swiper-pagination'
                    }
            })
        }
        scroll.refresh();
    }else{
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
 }

 function  getViews(id){
    $.ajax({
      type:"post",
      url:`${api}/view/BannerRead`,
      data:{banner_id:id},
      dataType:"json",
      success:((data)=>{
          console.log("浏览成功")
      })
    })
}

/**轮播图跳转 */
function lookInfo(obj){
    var type=$(obj).attr("type");
    var bannerId=$(obj).attr("bannerId");
    var picUrl=$(obj).attr("picUrl");
    switch(type){
        case '1':
            break;
        case '2':
          getViews(bannerId);
          window.location.href=picUrl;
          break;
        case '3':
          getViews(bannerId);
          window.location.href=api+'/view/SystemMsglistInfo?id='+bannerId+'&b_type=1';
          break;
    }
}

/**获取通知列表 */

function fetchNoticeSuccess(res){
    if(res.code==200){
        var noticeList=res.data;
        var html="";
        for(var i=0;i<noticeList.length;i++){
            html+='<li><span type="'+noticeList[i].type+'" noticeId="'+noticeList[i].bulletin_id+'" url="'+noticeList[i].title_url+'" onClick="seekInfo(this)" >'+
            noticeList[i].title+'</span></li>'
        }
        $(".notice-list").append(html);
        var h=parseInt($(".notice-list li").height());
        setInterval(()=>{
            $(".notice-list-wraper").find(".notice-list").animate({ 
                marginTop : -h+"px" 
            },500,function(){ 
                $(this).css({marginTop : "0px"}).find("li:first").appendTo(this); 
            }) 
        },3000);
        scroll.refresh();
    }else{
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}

/**通知跳转 */
function seekInfo(obj){
    var type=$(obj).attr("type");
    var id=$(obj).attr("noticeId");
    var url=$(obj).attr("url");

    switch(type){
        case '1':
            break;
        case '2':
            window.location.href=api+'/view/SystemMsglistInfo?id='+id+'&b_type=2';
            break;
        case '3':
            window.location.href=url;
            break;
    }
}

getBanners();
getNotice();

setTimeout(function(){
    var alerts = document.querySelector('.alert-hook');
    var topTip = document.querySelector('.refresh-hook');
    var imgArr=[];
    var imgObj=document.getElementsByTagName("img");
    var isPic=/.(gif|jpg|jpeg|png|gif|jpg|png)$/;
      
    var tags=false;
    var loadeImage = 0;
    var newImages = [];
  
    function preloadImages(arr){
      
        return new Promise((resolve,reject)=>{
            for(var i=0;i<arr.length;i++){
                if(isPic.test(arr[i].src)){
                    newImages[i]= new Image();
                    newImages[i].src=arr[i].src;
                    imgArr.push(newImages[i]);
                    newImages[i].onload=()=>{
                        loadeImage++;
                    if(loadeImage==imgArr.length){
                        resolve();
                    }   
                }
                newImages[i].onerror=(data)=>{
                        reject();
                    }
                }
            }
        }).then(()=>{
            setTimeout(()=>{
            scroll.on('scroll', function (position) {
                if(position.y > 30) {
                topTip.innerText = '释放立即刷新';
                }
            });
            // 滑动结束
            scroll.on('touchend', function (position) {
                if (position.y > 30) {
                    tags=true;
                    setTimeout(function () {
                    topTip.innerText = '下拉刷新';
                    if(tags){
                        refreshAlert('刷新成功');
                    }
                    scroll.refresh();
                }, 1000);
                }else if(position.y < (this.maxScrollY - 30)) {
                        
                
                }
                function refreshAlert(text) {
                    text = text || '操作成功';
                    alerts.innerHtml = text;
                    alerts.style.display = 'block';
                    setTimeout(function(){
                        alerts.style.display = 'none';
                        // window.location.reload();
                        $(".swiper-wrapper").html("");
                        $(".notice-list").html("");
                        getBanners();
                        getNotice();
                    },1000);
                }
                });
            },1000);
                    
        })
    }
    preloadImages(imgObj);

},400)