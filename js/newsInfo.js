var params=getRequest();
var newsId=params.id;
var uid=params.uid;
var token=params.token;
var page=1;
var wrapper=document.querySelector('.app-wraper');
var scroll= new BScroll(wrapper,{
    probeType: 3,
    click:false,
    tap:'click'
    });

function getDatas(){
    var postData={
        port:port,
        app_version:app_version,
        news_id:newsId
    }
    fetchData("/news_detail",postData,fetchSuccess);
}

function getMessage(pages){
    var postData={
        port:port,
        app_version:app_version,
        news:newsId,
        token:token,
        page:pages,
        type:"1"
    }
    fetchData("/news_message_wait_list",postData,fetchMsgSuccess);
}


function fetchSuccess(res){
    if(res.code==200){
        var news=res.data;
        if(news.is_more_pic=='0'){
            $(".oneBanner").show();
            $(".moreBanner").hide();
            $(".banner-icon").attr("src",news.cover_pic);
        }else if(news.is_more_pic=='1'){
            $(".oneBanner").hide();
            $(".moreBanner").show();
            var bannerHtml="";
            for(var i=0;i<news.cover_pic.length;i++){
                bannerHtml+='<div class="swiper-slide" >'+
                            '<div class="banner-pic"><img src="'+news.cover_pic[i]+'" alt=""></div></div>'
            }
            $(".swiper-wrapper").append(bannerHtml);
            var mySwiper = new Swiper('.swiper-container',{
                autoplay: true,
                loop:true,
                pagination: {
                    el:'.swiper-pagination'
                }
            });  
        }

        $(".news-title").text(news.title);
        $(".addTime").text(news.Publish_time);
        $(".read-num").text("阅读量"+news.browses);
        $(".news-infos").html(news.content);
        scroll.refresh();
    }else{
        $(".loading-block").hide();
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}

function fetchMsgSuccess(res){
    if(res.code==200){
       var msgList=res.data.content_list;
       var msgCount=res.data.total;
       var html="";
        if(page==1){
            if(!msgList.length){
                $(".new-msg-block").hide();
                $(".bottom-tip").hide();
            }else{
                $(".new-msg-block").show();
                $(".bottom-tip").show();
            }
        }
        for(var i=0;i<msgList.length;i++){
            var imgHead_html="";
            var likeHtml="";
            var reply_html="";
            var bitHtml="";
            if(msgList[i].pic_head){
                imgHead_html='<span class="avta-icon"><img src="'+msgList[i].pic_head+'"/></span>'
            }else{
                imgHead_html='<span class="avta-icon"><img src="images/logo.png"/></span>'
            }
            if(msgList[i].is_like=='1'){
                likeHtml=' <div class="like-wraper liking fr"><span class="like-icon"></span>'+
                '<span class="like-nums">'+msgList[i].nice_num+'</span></div>'
            }else{
                likeHtml=' <div class="like-wraper unLike fr" onClick="likes(this)" commentId="'+msgList[i].id+'"><span class="like-icon"></span>'+
                '<span class="like-nums">'+msgList[i].nice_num+'</span></div>'
            }
            if(msgList[i].is_bit=='1'){
                 bitHtml='<span class="bit"><img src="'+msgList[i].bit+'"/><span>';
            }else if(msgList[i].is_bit=='0'){
                bitHtml='<span class="bit noneBit"><img src="'+msgList[i].bit+'"/><span>';
            }
            var commen_date=formatTime2(msgList[i].comment_time);
            var reply_date=formatTime2(msgList[i].reply_time);
            if(msgList[i].reply==""){
                reply_html="";
            }else{
                reply_html='<div class="reply-block"><span class="reply-txt">小可：</span>'+
                '<ul class="reply-list"><li><p>'+msgList[i].reply+'</p><span class="triangle"></span>'+
                '<p>'+reply_date+'</p></li></ul></div>';
            }
           
            html+='<li><div class="msg-section"><div class="avtas">'+imgHead_html+bitHtml+'</div>'+
                    '<div class="hot-msg-contents"><div class="msg-top">'+
                    '<span class="leaver fl">'+msgList[i].nickname+'</span>'+likeHtml+'<div class="cl"></div></div>'+
                    '<div class="msg-infos">'+msgList[i].comment+'</div><p class="msg-date">'+commen_date+'</p></div></div>'+reply_html+'</li>';
        }
        $(".hot-list").append(html);
        $(".apply-btn-wrap").text("("+msgCount+")");
        page++;
        scroll.refresh();
        
    }else{
        
        var l=$(".hot-list li").length;
        if(l==0){
            $(".new-msg-block").hide();
            $(".bottom-tip").hide();
        }
        
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}


/**评论框显示/隐藏 */
$(".apply-btn").click(function(){
    if(!token){
        activityNeedLogin();
    }else if(token=='(null)'){
        activityNeedLogin();
    }else{
      $(".apply-sections").fadeOut(300);
      $(".comment-wraper").fadeIn(200);
    }
    
});

$(".contents").click(function(){
    $(".apply-sections").fadeIn(200);
    $(".comment-wraper").fadeOut(300);
});
$(".comments-input").focus(function(){
   setTimeout(function(){
        document.body.scrollTop=document.body.scrollHeight+150;
     },400)
});
$(".comments-input").blur(function(){
    setTimeout(function(){
        document.body.scrollTop=0
     },20);

})
/**发表评论 */
$(".publish-btn").click(function(){
    
    var comments=$(".comments-input").val();
    if(comments==""){
        showModel("请输入评论内容");
        setTimeout(function(){
            hideModel();
        },2000);
        return false;
    }else if(comments.length>85){
        showModel("留言内容最多85个字");
        setTimeout(function(){
            hideModel();
        },2000);
        return false;
    }
    var postData={
        port:port,
        app_version:app_version,
        token:token,
        news:newsId,
        content:comments,
        type:"1"
    }
    $(this).attr("disabled",true);

    fetchData("/news_message_wait",postData,publishSuccess);
    
   
})

function publishSuccess(res){
    if(res.code==200){
        showModel(res.message);
        setTimeout(function(){
            $(".publish-btn").attr("disabled",false);
            $(".comments-input").val("");
            hideModel();
            $(".apply-sections").fadeIn(200);
            $(".comment-wraper").fadeOut(300);
            $(".hot-list").html("");
            page=1;
            getMessage(page);
        },2000);
    }else{
        showModel(res.message);
        setTimeout(function(){
            $(".publish-btn").attr("disabled",false);
            // $(".comments-input").val("");
            hideModel();
        },2000);
    }
}

/**点赞 */
function likes(item){
    if(!token){
        activityNeedLogin();
    }else if(token=='(null)'){
        activityNeedLogin();
    }else{
        var commentId=$(item).attr("commentId");
        var postData={
            port:port,
            app_version:app_version,
            token:token,
            type:"1",
            comment_id:commentId
        }
        fetchData("/news_message_nice",postData,likeSuccess);
    }
   
}

function likeSuccess(res){
    if(res.code==200){
        $(".hot-list").html("");
        page=1;
        getMessage(page);
    }else{
        showModel(res.message);
        setTimeout(function(){
            hideModel();
        },2000);
    }
}

if(token){
    getMessage(page);
}else{
    $(".new-msg-block").hide();
    $(".bottom-tip").hide();
}
getDatas();

setTimeout(function(){
    $(".loading-block").hide();
    var alerts = document.querySelector('.alert-hook');
    var topTip = document.querySelector('.refresh-hook');
    var bottomTip = document.querySelector('.loading-hook');
    var lines=document.querySelector('.apply-sections');
    var target=document.querySelector('#message-section');

    var imgArr=[];
    var imgObj=document.getElementsByTagName("img");
    var isPic=/.(gif|jpg|jpeg|png|gif|jpg|png)$/;
      
    var tags=false;
    var loadeImage = 0;
    var newImages = [];
    var skip_target=document.querySelector('.news-infos p a');
    
    function preloadImages(arr){
        return new Promise(function(resolve,reject){
            for(var i=0;i<arr.length;i++){
                if(isPic.test(arr[i].src)){
                    newImages[i]= new Image();
                    newImages[i].src=arr[i].src;
                    imgArr.push(newImages[i]);
                    newImages[i].onload=function(){
                        loadeImage++;
                    if(loadeImage==imgArr.length){
                        resolve();
                    }   
                }
                newImages[i].onerror=function(data){
                        reject();
                    }
                }
            }
        }).then(function(){
            setTimeout(function(){
             scroll.refresh();
             lines.addEventListener('click',function(){
                scroll.scrollToElement(target,500,0,0,'easing');
             })
             
             if(skip_target){
                 skip_target.addEventListener('click',function(){
                var url=$(this).attr("href");
                window.location.href=url;
                });
             }
            scroll.on('scroll', function (position) {
                if(position.y > 30) {
                topTip.innerText = '释放立即刷新';
                }
            });
            // 滑动结束
            scroll.on('touchend', function (position) {
                if (position.y > 30) {
                    tags=true;
                     $(".loading-block").show();
                    setTimeout(function () {
                    topTip.innerText = '下拉刷新';
                    if(tags){
                        refreshAlert('刷新成功');
                    }
                    scroll.refresh();
                }, 1000);
                }else if(position.y < (this.maxScrollY - 30)) {
                    bottomTip.innerText = '加载中...';
                    $(".loading-block").show();
                setTimeout(function () {
                    bottomTip.innerText = '查看更多';
                    if(token){
                        getMessage(page);
                    }
                    scroll.refresh();
                    $(".loading-block").hide();
                }, 1000);
                
                }
                function refreshAlert(text) {
                    text = text || '操作成功';
                    alerts.innerHtml = text;
                    alerts.style.display = 'block';
                    $(".loading-block").hide();
                    setTimeout(function(){
                        alerts.style.display = 'none';
                        getDatas();
                        page=1;
                        $(".hot-list").html("");
                        if(token){
                            getMessage(page);
                        }
                    },1000);
                }
                });
            },1000);
                    
        })
    }
    preloadImages(imgObj);

},400)