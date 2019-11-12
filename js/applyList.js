    var apply_type=1;
    var page=1;
    var applyList=[];
    var params=getRequest();
    var actvId=params.actvId;
    var wrapper=document.querySelector('.wrapper');
    var alerts = document.querySelector('.alert-hook');
    var topTip = document.querySelector('.refresh-hook');
    var bottomTip = document.querySelector('.loading-hook');
    var scroll=null;
    function getData(type,page) {
      var postData={
            port:port,
            app_version:app_version,
            activity_id:actvId,
            apply_type:type,
            page:page
        }
        $.ajax({
            type:"post",
            url:api+'/active_apply_info',
            data:postData,
            dataType:"json",
            success:function(data){
                if(data.code==200){
                    $(".loading-block").hide();
                        if(!scroll){
                            scroll= new BScroll(wrapper,{
                                probeType: 2,
                                click:false,
                                tap:'click'
                            });
                         }
                    var html="";
                    if(apply_type==1){
                        applyList=data.data.apply_enlist;
                        if(!applyList.length){
                            $(".noneData").show();
                        }else{
                            $(".noneData").hide();
                        }
                    }else if(apply_type==2){
                        applyList=data.data.apply_wait;
                        if(!applyList.length){
                            $(".noneData").show();
                        }else{
                            $(".noneData").hide();
                        }
                    }
                    if(!data.data.apply_enlist_num){
                        $(".applyed-nums").text(0);
                    }else{
                        $(".applyed-nums").text(data.data.apply_enlist_num);
                    }
                    if(!data.data.apply_wait_num){
                        $(".nav-hou").hide();
                    }else{
                        $(".nav-hou").show();
                        $(".hou-nums").text(data.data.apply_wait_num);
                    }
                    for(var i=0;i<applyList.length;i++){
                        var time=formatTime2(applyList[i].addtime);
                        var bitHtml="";

                        if(applyList[i].is_bit=='1'){
                             bitHtml='<span class="bit"><img src="'+applyList[i].bit+'"/><span>';
                        }else if(applyList[i].is_bit=='0'){
                            bitHtml='<span class="bit noneBit"><img src="'+applyList[i].bit+'"/><span>';
                        }
                        html+='<li><div class="applyer-icon"><span class="avta-icon"><img src="'+applyList[i].pic_head+'" alt=""></span>'+bitHtml+'</div>'+
                               '<div class="applyer-info-wrap"><p class="applyer-name">'+applyList[i].uname+'</p>'+
                        '<p class="applyer-info">等'+applyList[i].num+'人</p></div><div class="apply-date">'+time+'</div></li>'
                    }
                    $(".apply-list").append(html);
                    scroll.refresh();
                    }else{
                        $(".loading-block").hide();
                        $(".alert-block").fadeIn(300);
                        $(".alert-infos").text(data.message);
                        
                        setTimeout(function(){
                            $(".alert-block").fadeOut(300);
                            $(".alert-infos").text("");
                    },2000);
                    // $(".bottom-tip").hide();
                    scroll.refresh();
                    
                }
            }
        })
    }
    
    
   
    $(".nav-list li").click(function() {
        $(this).addClass("on").siblings().removeClass("on");
        var index=$(this).index();
        apply_type=index+1;
        applyList=[];
        $(".apply-list").html("");
        page=1;
        getData(apply_type,page);
    })
    
    getData(apply_type,page);
    setTimeout(function(){
        load();
        var l=$(".apply-list li").length;
        if(l==0){
            $(".noneData").show();
        }
    },500)
    function load() {
        scroll.on('scroll', function (position) {
            if(position.y > 30) {
            // topTip.innerText = '释放立即刷新';
            }
        });
        // 滑动结束
        scroll.on('touchend', function (position) {
            if (position.y > 30) {
            //     tags=true;
            //     setTimeout(function () {
            //     topTip.innerText = '下拉刷新';
            //     if(tags){
            //         refreshAlert('刷新成功');
            //     }
            //     scroll.refresh();
            // }, 1000);
            }else if(position.y < (this.maxScrollY - 30)) {
                bottomTip.innerText = '加载中...';
                setTimeout(function () {
                    bottomTip.innerText = '查看更多';
                    page++;
                    getData(apply_type,page);
                    scroll.refresh();
                }, 1000);
            }
            function refreshAlert(text) {
                text = text || '操作成功';
                alerts.innerHtml = text;
                alerts.style.display = 'block';
                setTimeout(function(){
                    alerts.style.display = 'none';
                    page=1;
                    applyList=[];
                    $(".apply-list").html("");
                    getData(apply_type,page);
                },1000);
            }
            
        });
    }

   