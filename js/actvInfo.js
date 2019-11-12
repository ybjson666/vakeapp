
    var params=getRequest();
    var actvId=params.id;
    var uid=params.uid;
    var token=params.token;
    var user_nature=params.user_nature;
    var page=1;
    var sign_nums=1;
    var activity_power="";
    var signer_houseId="";
    var applyCount=0;
    var deduct_score=0;
    var total_score=0;
    var overDue=0;
    var wrapper=document.querySelector('.app-wraper');
    var scroll= new BScroll(wrapper,{
        probeType: 3,
        click:false,
        tap:'click'
        });
    
    function getMainData(){
        var postData={
            port:port,
            app_version:app_version,
            activity_id:actvId,
            type:'1',
            token:token
        }
        fetchData("/active_detail",postData,fetchSuccess);
    }
    
    function fetchSuccess(res){
       if(res.code==200){
           var response=res.data;
           $("#banner").attr("src",response.active.pic_urls[0]);
           $(".actv-small-title").text(response.active.title);
           $(".actv-title").text(response.active.activity_name);
           

           applyCount=response.active.apply_big_num;
           activity_power=response.active.activity_power;
           var actv_type=response.active.add_type;
           if(actv_type=='1'){
               $(".actv_type").text("线下活动");
               $(".limit-actv").hide();
               $(".person-nums").show();
           }else{
               $(".actv_type").text("线上活动");
               $(".limit-actv").show();
               $(".person-nums").hide();
               sign_nums=1;
           }
            deduct_score=response.active.join_mark;
            overDue=response.active.u_mark;
            total_score=response.active.u_mark;
          
           if(deduct_score==0 || deduct_score=='0'){

               $(".free-tags").show();
               $(".deduct-tags").hide();
               $(".reduice-score").hide();
               $(".join-free").show();
           }else{
                 if(response.active.activity_name.length<=8){
                    $(".actv-title").css({display:"inline"});
                }else{
                    $(".actv-title").css({display:"block",marginBottom:"5px"});
                }
                $(".free-tags").hide();
                $(".deduct-tags").show();
                $(".reduice-score").show();
                $(".join-free").hide();
                $(".deduct-score").text(deduct_score);
                $(".actv-score").text(deduct_score);
           }
           if(response.active.activity_power=='3'){
               $(".vips").show();
           }else{
                $(".vips").hide();
           }
           $(".scan-nums").html(response.active.look_num+"人已浏览");
           $(".apply-start-times").text(response.active.sign_day+response.active.sign_start_day+response.active.sign_day_h);
           $(".actv-start-times").text(response.active.day+response.active.start_day+response.active.day_h);

            switch (response.active.activity_power){
                case 1:
                $(".all").show();
                $(".blue").hide();
                $(".golden").hide();
                $(".jin").hide();
                break;
                case 2:
                $(".all").hide();
                $(".blue").show();
                $(".golden").hide();
                $(".jin").hide();
                break;
                case 3:
                $(".all").hide();
                $(".blue").hide();
                $(".golden").show();
                $(".jin").show();
                break;
            }

            $(".address-info").text(response.active.address);
            $(".joined").text(response.active.apply_count);
            $(".apply-total").text(response.active.enlist_num);
            var applyHtml="";
            var applyArr=[];
            if(!response.apply.data.length){
                $(".join-list-wraper").hide();
            }else if(response.apply.data.length<=8){
                applyArr=response.apply.data;
                $(".join-list-wraper").show();
            }else{
                applyArr=response.apply.data.slice(0,7);
                $(".join-list-wraper").show();
            }

            for(var i=0;i<applyArr.length;i++){
                applyHtml+='<li><span class="header-icon"><img src="'+applyArr[i].pic_head+'" alt=""></span></li>'
            }
            $(".join-list").append(applyHtml);
            if(response.apply.data.length){
                var oUl=document.getElementsByClassName("join-list")[0];
                var oLi=oUl.getElementsByTagName("li");
                var oIndex=8;
                var liW=oLi[0].offsetWidth;
                for(var i=0;i<oLi.length;i++){
                    oLi[i].style.left=liW*i+'px';
                    oLi[i].style.zIndex=oIndex-i;
                };
            }
           
            $(".join-list-wraper").on("click",function(){
                window.location.href='applyList.html?actvId='+actvId;
            });
            $(".intro-contents").html(response.active.content);
            scroll.refresh();

            var btnHtml="";

            if(response.active.active_status_code==1){
                var apply_time;
                var resuDay=0;
                startSell(response.active.limit_apply_time);
                function startSell(times){
                    var resultTime = times;  //两个时间相减,得到的是毫秒ms,变成秒
                    var intervalStartSell = '';
                    clearInterval(intervalStartSell);
                    intervalStartSell = setInterval(function(){ //倒计时
                        if (resultTime>0) {
                            resultTime--; 
                            var second = Math.floor(resultTime % 60);     
                            var minite = Math.floor((resultTime / 60) % 60); 
                            var hour = Math.floor((resultTime / 3600) % 24); 
                            resuDay=Math.ceil(resultTime/86400);
                            second = second<10?("0"+second):second;
                            minite = minite<10?("0"+minite):minite;
                            hour = hour<10?("0"+hour):hour;
                            apply_time=hour+':'+minite+':'+second;
                           
                            if(resultTime<86400){
                                btnHtml='<div class="apply-btn-wrap unApply">即将报名      '+apply_time+'</div>';
                                $(".apply-btn").html(btnHtml);
                            }else{
                                btnHtml='<div class="apply-btn-wrap unApply">即将报名      '+resuDay+'天</div>';
                                $(".apply-btn").html(btnHtml);
                            }
                            if(resultTime<=0){
                                window.location.reload(); 
                            }

                        } else if(resultTime <0){
                            clearInterval(intervalStartSell);
                        }
                    },1000);
                }
            }else{
                switch(response.active.chinese_status){
                    case "立即报名":
                        if(deduct_score>0){
                            btnHtml='<div class="apply-btn-wrap unApply" onClick="applys()"> '+deduct_score+'积分&nbsp; 立即报名</div>';
                        }else{
                            btnHtml='<div class="apply-btn-wrap unApply" onClick="applys()">立即报名</div>';
                        }
                    
                    break;
                    case "候补报名":
                        if(deduct_score>0){
                            btnHtml='<div class="apply-btn-wrap unApply" onClick="applys()">'+deduct_score+'积分&nbsp; 候补报名</div>';
                        }else{
                            btnHtml='<div class="apply-btn-wrap unApply" onClick="applys()"> 候补报名</div>';
                        }
                    
                    break;
                    case "活动已结束":
                    btnHtml='<div class="apply-btn-wrap over">活动已结束</div>';
                    break;
                    case "报名结束":
                    btnHtml='<div class="apply-btn-wrap over">报名结束</div>';
                    break;
                    default:
                        if(deduct_score>0){
                            btnHtml='<div class="apply-btn-wrap over">'+deduct_score+'&nbsp;'+response.active.chinese_status+'</div>';
                        }else{
                            btnHtml='<div class="apply-btn-wrap over">'+response.active.chinese_status+'</div>';
                        }
                    
                }
            }
            $(".apply-btn").html(btnHtml);

            /**报名弹框内容获取 */

            $(".actv-pic-banners").attr("src",response.active.pic_url_m);
            $(".activity-names").text(response.active.activity_name);
            var actv_start_time=formatTime(response.active.enlist_start);
            var actv_end_time=formatTime(response.active.enlist_end);
            $(".activity-host-times").html("活动报名时间：<br/>"+actv_start_time+"起<br/>"+actv_end_time+"止");
           $(".activity-addr").text("地址:"+response.active.address);
            if(response.active.activity_power=='3'){
                $(".house-rows").show();
            }else{
                $(".house-rows").hide();
            }

            /**报名form表单获取*/

            $(".form-list").html("");

            var form_html="";

            var formArr=[];

            if(response.active.form_json.length){
                formArr=response.active.form_json;

               formArr.map(function(item){
                    if(item.type=='1'){
                        form_html+='<li><div class="item-content" type="one">'+
                            '<div class="item-inner"><div class="item-title label" style="line-height:1.5rem"><span class="label-str">'+item.title+'</span>:</div>'+
                            '<div class="item-input"><input type="text" name="'+item.englishName+'" placeholder="'+item.placeholder+'" width="100%" class="apply-input">'+
                            '</div></div></div></li>'
                    }else if(item.type=='2'){
                        var child_html="";
                        item.data.map(function(subData){
                            var radio_html='';
                            if(subData.isChecked=='1'){
                                radio_html='<label class="theme-radio"><input type="radio" name="'+item.englishName+'" value="'+subData.value+'" checked class="apply-radio"><i class="icon-radio"></i></label>';
                            }else{
                                radio_html='<label class="theme-radio"><input type="radio" name="'+item.englishName+'" value="'+subData.value+'" checked class="apply-radio"><i class="icon-radio"></i></label>';
                            }
                            child_html+='<li><div class="label-checkbox">'+radio_html+
                               
                                '<span class="item-inner-name">'+subData.name+'</span></div></li>';
                        })
                        form_html+='<li><div class="item-content" type="two">'+
                                    '<div class="item-inner"><div class="item-title label"><span class="label-str">'+item.title+'</span>:</div><div class="item-input">'+
                                    '<ul class="group-list">'+child_html+'</ul></div></div></div></li>';
                    }else if(item.type=='3'){
                        var child_html="";
                        item.data.map(function(subData){
                            var radio_html='';
                            if(subData.isChecked=='1'){
                                radio_html='<label class="theme-checkbox"><input type="checkbox" name="'+item.englishName+'" value="'+subData.value+'" checked class="apply-check"><i class="icon-check"></i></label>';
                            }else{
                                radio_html='<label class="theme-checkbox"><input type="checkbox" name="'+item.englishName+'" value="'+subData.value+'" class="apply-check"><i class="icon-check"></i></label>';
                            }
                            child_html+='<li><div class="label-checkbox ">'+radio_html+
                                '<span class="item-inner-name">'+subData.name+'</span></div></li>';
                        })
                        form_html+='<li><div class="item-content" type="three">'+
                                    '<div class="item-inner"><div class="item-title label"><span class="label-str">'+item.title+'</span>:</div><div class="item-input">'+
                                    '<ul class="group-list">'+child_html+'</ul></div></div></div></li>';
                    }
               })
               $(".form-list").append(form_html);
            }


            /*计算报名弹框高度**/
            setTimeout(function () {
                var doc_h=document.body.clientHeight;
                var wrap_h=$(".sign-block").outerHeight();
                var cliWidth = (window.screen.width)*20/375;
                if(wrap_h>=(doc_h-6*cliWidth)){
                    wrap_h=doc_h-10*cliWidth;
                    $(".sign-block").css({height:wrap_h+'px',overflowY:"scroll"});
                }else{
                    $(".sign-block").css({height:wrap_h+'px'});
                }
            },500);

        }else{
            showModel(res.message);
            setTimeout(function(){
                hideModel();
            },2000);
        }
       
    }
    $(".reduce-btn").click(function(){
        if(sign_nums>1){
            sign_nums--;
        }
        $(".sign_nums").text(sign_nums);
    });

    $(".add-btn").click(function(){
        if(sign_nums<applyCount){
            sign_nums++;
        }
        
        $(".sign_nums").text(sign_nums);
    })
    /**获取房产列表 */
    
    function getHouses(){
        var postData={
            port:port,
            app_version:app_version,
            type:"1",
            uid:uid,
            token:token
        }

        fetchData("/userHouse/UserHouseLists",postData,fetchHouseSuccess);
    }
   
    function fetchHouseSuccess(res){
        if(res.code==200){
            $(".sele-house-list").html("");
            var html="";
            var houseList=res.data.owner.concat(res.data.sib);
            for(var i=0;i<houseList.length;i++){
                html+='<li onClick="seleHouse(this)" houseId="'+houseList[i].house_id+'" houseInfo="'+houseList[i].houseinfo+'">'+
                '<span class="house-item">'+houseList[i].houseinfo+'</span></li>';
            }
            $(".sele-house-list").append(html);
            $(".apply-block-wraper").css({opacity:'1',zIndex:'200'});
             // $(".apply-block-wraper").css({transform:"translateY(0)",display:'block'});
            $('body,html').addClass('notScroll');

        }else if(res.code==401){
            activityNeedLogin();
        }else{
            showModel(res.message);
            setTimeout(function(){
                hideModel();
            },2000);

        }
    }

        /**显示报名弹框 */
    function applys(){
        if(!uid ){
            activityNeedLogin();
        }else if(uid=='(null)'){
            activityNeedLogin();
        }else if(overDue=='-401' || overDue==-401){
            activityNeedLogin();
        }else if(total_score<deduct_score){
            showModel("您的积分不足");
            setTimeout(function(){
                hideModel();
            },2000);
            return;
        }else if(activity_power=='3'){
            if(user_nature=='2' || user_nature==2){
                showModel("你还没有绑定房产");
                setTimeout(function(){
                    hideModel();
                    bindHouse();
                    },2000);
            }else{
                getHouses();

            }
        }else{
            getHouses();
        }
    }

    $(".house-input").click(function(){
        var l=$(".sele-house-list li").length;
        if(l==0){
            showModel("您暂无房产");
            setTimeout(function(){
                hideModel();
            },2000);
        }else{
            $(".house-block").fadeIn(200);
        }
    });


    $(".close-btn2").click(function(){
        $(".house-block").fadeOut(200);
    });
     function seleHouse(item){
        signer_houseId=$(item).attr("houseId");
        var signer_name=$(item).attr("houseInfo");
        $(".house-input").val(signer_name);
        $(".house-block").fadeOut(200);
     }




    /**获取留言列表信息 */
    
    function getMessage(page){
        var messageData={
            port:port,
            app_version:app_version,
            activity_id:actvId,
            uid:uid,
            page:page  
        }
        fetchData("/active_message_list",messageData,fetchMsgSuccess);
    }

    function fetchMsgSuccess(res){
        if(res.code==200){
            var msgList=res.data.message_data;
            var msgCount=res.data.count;
            $(".comment-num").text(msgCount);
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
                var imgHtml="";
                var likeHtml="";
                var reply_html="";
                var bitHtml="";
                var comment_time=formatTime2(msgList[i].comment_time);
                var reply_time=formatTime2(msgList[i].reply_time);
                if(msgList[i].pic_head.length>10){
                    imgHtml='<span class="avta-icon"><img  src="'+msgList[i].pic_head+'" alt="" class="pic-head"/></span>'
                }else{
                    imgHtml='<span class="avta-icon"><img src="images/logo.png"></span>'
                }
                if(msgList[i].is_bit=='1'){

                    bitHtml='<span class="bit"><img src="'+msgList[i].bit+'"/><span>';
                }else if(msgList[i].is_bit=='0'){
                    bitHtml='<span class="bit noneBit"><img src="'+msgList[i].bit+'"/><span>';
                }
                if(msgList[i].is_nice=='1'){
                    likeHtml='<div class="like-wraper liking fr"><span class="like-icon"></span>'+
                    '<span class="like-nums">'+msgList[i].nice_num+'</span></div>'
                }else{
                    likeHtml='<div class="like-wraper unLike fr" onClick="like(this)" messageId="'+msgList[i].message_id+'"><span class="like-icon"></span>'+
                    '<span class="like-nums">'+msgList[i].nice_num+'</span></div>'
                }

                if(msgList[i].reply==""){
                    reply_html="";
                }else{
                    reply_html='<div class="reply-block"><span class="reply-txt">小可：</span>'+
                    '<ul class="reply-list"><li><p>'+msgList[i].reply+'</p><span class="triangle"></span>'+
                    '<p>'+reply_time+'</p></li></ul></div>';
                }
                

                html+='<li><div class="msg-section"><div class="avtas">'+imgHtml+bitHtml+'</div><div class="hot-msg-contents">'+
                        '<div class="msg-top"><span class="leaver fl">'+msgList[i].nickname+'</span>'+likeHtml+'<div class="cl"></div></div>'+
                        '<div class="msg-infos">'+msgList[i].comment+'</div><p class="msg-date">'+comment_time+'</p></div></div>'+reply_html+'</li>';
            }
            $(".hot-list").append(html);
            page++;
            scroll.refresh();
        }else{
            if(page==1){
                $(".comment-num").text(res.data.count);
            }
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
    


/**点赞 */
function like(item){
    if(!uid){
        activityNeedLogin();
    }else if(uid=='(null)'){
        activityNeedLogin();
    }else{
        var message_id=$(item).attr("messageId");
        var postData={
            port:port,
            app_version:app_version,
            uid:uid,
            token:token,
            type:"1",
            comment_id:message_id
        }
        fetchData("/active_set_nice",postData,likeSuccess);
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

$(".contents").click(function(){
    $(".apply-sections").fadeIn(200);
    $(".comment-wraper").fadeOut(300);
});

$(".line-msg-block").click(function(){
    if(!uid){
        activityNeedLogin();
    }else if(uid=='(null)'){
        activityNeedLogin();
    }else{
        $(".apply-sections").fadeOut(300);
        $(".comment-wraper").fadeIn(200);
    }
});
$(".comments-input").focus(function(){
   setTimeout(function(){
        document.body.scrollTop=document.body.scrollHeight+500;
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
        uid:uid,
        activity_id:actvId,
        content:comments,
        type:"1"
    }
    $(this).attr("disabled",true);

    fetchData("/active_message",postData,publishSuccess);
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
            hideModel();
        },2000);
    }
}



$(".close-btn").click(function(){
    // $(".apply-block-wraper").css({display:'none',transform:"translateY(100%)"});
    $(".apply-block-wraper").css({opacity:'0',zIndex:'-5'});
    $('body,html').removeClass('notScroll');
});

$(".apply-wrap").click(function(e){
    if(e.target.classList[0]==='wrap'){
        // $(".apply-block-wraper").css({transform:"translateY(100%)"});
        $(".apply-block-wraper").css({opacity:'0',zIndex:'-5'});
        $('body,html').removeClass('notScroll');
    }
    
})

/**报名 */

$(".sign-btn").click(function(){
    var formDatas={};
    var signer_name=$(".name-input").val();
    var signer_phone=$(".phone-input").val();
    var labels=$(".item-content");
    var formInfo={};
    labels.each(function(){
      var that=$(this);
      var type=that.attr("type");
      var seleKey="";
      var seleValue="";
      var tags="";
       if(type=='one'){
            tags=that.find(".label-str").text();
            seleKey=that.find(".apply-input").attr("name");
            inputKey=seleKey;
            seleValue=that.find(".apply-input").val();
            formDatas[tags]=seleValue;
            formInfo[seleKey]=seleValue;
           
       }else if(type=="two"){
            tags=that.find(".label-str").text();
            var objs=that.find(".apply-radio");
            seleKey=that.find(".apply-radio").attr("name");
            objs.each(function(item){
                if($(this).context.checked==true){
                    seleValue=$(this).val();
                    formDatas[tags]=seleValue;
                    formInfo[seleKey]=seleValue;
                }
            });
       }else if(type=='three'){
        tags=that.find(".label-str").text();
        var objs=that.find(".apply-check");
        seleKey=that.find(".apply-check").attr("name");
        var checkArr=[];
        objs.each(function(item){
            if($(this).context.checked==true){
                seleValue=$(this).val();
                checkArr.push(seleValue)
            }
        });
            formDatas[tags]=checkArr;
            formInfo[seleKey]=checkArr;
       }
      
    })
    formInfo=JSON.stringify(formInfo);
    if(activity_power!='3'){
        signer_houseId="0";
    }
    if(signer_name==""){
        showModel("请输入姓名");
        setTimeout(function(){
            hideModel();
        },2000);
        return false;
    }else if(signer_phone==""){
        showModel("请输入电话");
        setTimeout(function(){
            hideModel();
        },2000);
        return false;
    }else if(!reg_phone.test(signer_phone)){
        showModel("请输入正确的电话");
        setTimeout(function(){
            hideModel();
        },2000);
        return false;
    }else{
        for(var key in formDatas){
            if(formDatas[key]==""||formDatas[key]==[]){
                showModel("请填写或选择"+key);
                setTimeout(function(){
                    hideModel();
                },2000);
                return false;
            }
        }
    }

    var postData={
        port:port,
        type:"1",
        app_version:app_version,
        uid:uid,
        token:token,
        activity_id:actvId,
        num:sign_nums,
        user_name:signer_name,
        phone:signer_phone,
        house_id:signer_houseId,
        form_info:formInfo
    }
    $(this).attr("disabled",true);
    fetchData("/active_apply",postData,applySuccess);

})

function applySuccess(res){
    if(res.code==200){
        if(res.message=='2'){
              $(".sign-btn").attr("disabled",false);
                $(".apply-block-wraper").css({transform:"translateY(100%)"});
                $('body,html').removeClass('notScroll');
                $(".join-list").html("");
                getMainData();
                setTimeout(function(){
                    $(".hou-alert-block").fadeIn(300);
                },2000);
        }else{
            $(".hou-alert-block").fadeOut();
            showModel(res.message);
            setTimeout(function(){
                hideModel();
                $(".sign-btn").attr("disabled",false);
                $(".apply-block-wraper").css({transform:"translateY(100%)"});
                $('body,html').removeClass('notScroll');
                $(".join-list").html("");
                getMainData();
            },2000);
        }
       
    }else{
        showModel(res.message);
        setTimeout(function(){
            hideModel();
            $(".sign-btn").attr("disabled",false);
        },2000);
    }
}
$(".sure-button").click(function(){
    $(".hou-alert-block").fadeOut(300);
})

getMainData();
getMessage();

setTimeout(function(){
    $(".loading-block").hide();
    var alerts = document.querySelector('.alert-hook');
    var topTip = document.querySelector('.refresh-hook');
    var bottomTip = document.querySelector('.loading-hook');
    var lines=document.querySelector('.line-msg-block');
    var target=document.querySelector('#message-section');

    var imgArr=[];
    var imgObj=document.getElementsByTagName("img");
    var isPic=/.(gif|jpg|jpeg|png|gif|jpg|png)$/;
      
    var tags=false;
    var loadeImage = 0;
    var newImages = [];
    var skip_target=document.querySelector('.intro-contents p a');
  
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
                    if(uid){
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
                        $(".join-list").html("");
                        getMainData();
                        page=1;
                        $(".hot-list").html("");
                        getMessage(page);
                    },1000);
                }
                });
            },1000);
                    
        })
    }
    preloadImages(imgObj);

},500)