
//�������ϽǷ���ť
function onBridgeReady(){
    WeixinJSBridge.call('showOptionMenu');
}
if(typeof WeixinJSBridge == "undefined"){
    if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
}else{
    onBridgeReady();
}
//΢�ŷ�����Ϣ����
function _WXShare(obj){
    //��ʼ������
    var img,width,height,title,desc,url,appid;
    img=obj.img || 'http://wechat.wboll.com/static/customization/hotel/images/ico-share.png';
    width=obj.width||100;
    height=obj.height||100;
    title=obj.title||document.title;
    desc=obj.desc||document.title;
    url=obj.url||document.location.href;
    appid=obj.appid||'';
    //΢�����÷���
    function _ShareFriend() {
        WeixinJSBridge.invoke('sendAppMessage',{
            'appid': appid,
            'img_url': img,
            'img_width': width,
            'img_height': height,
            'link': url,
            'desc': desc,
            'title': title
        }, function(res){
            _report('send_msg', res.err_msg);
        })
    }
    function _ShareTL() {
        WeixinJSBridge.invoke('shareTimeline',{
            'img_url': img,
            'img_width': width,
            'img_height': height,
            'link': url,
            'desc': desc,
            'title': title
        }, function(res) {
            _report('timeline', res.err_msg);
        });
    }
    function _ShareWB() {
        WeixinJSBridge.invoke('shareWeibo',{
            'content': desc,
            'url': url,
        }, function(res) {
            _report('weibo', res.err_msg);
        });
    }
    // ��΢�������������ʼ����ᴥ��WeixinJSBridgeReady�¼���
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // ���͸�����
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            _ShareFriend();
        });
        // ��������Ȧ
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            _ShareTL();
        });

        // ����΢��
        WeixinJSBridge.on('menu:share:weibo', function(argv){
            _ShareWB();
        });
    }, false);
}

/**
 *  ����Ư�����
 */
;(function($, undefined){
    var prefix = '', eventPrefix, endEventName, endAnimationName,
        vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
        document = window.document, testEl = document.createElement('div'),
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform,
        transitionProperty, transitionDuration, transitionTiming, transitionDelay,
        animationName, animationDuration, animationTiming, animationDelay,
        cssReset = {}

    function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

    $.each(vendors, function(vendor, event){
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + vendor.toLowerCase() + '-'
            eventPrefix = event
            return false
        }
    })

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] =
        cssReset[transitionDuration = prefix + 'transition-duration'] =
            cssReset[transitionDelay    = prefix + 'transition-delay'] =
                cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
                    cssReset[animationName      = prefix + 'animation-name'] =
                        cssReset[animationDuration  = prefix + 'animation-duration'] =
                            cssReset[animationDelay     = prefix + 'animation-delay'] =
                                cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

    $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        speeds: { _default: 400, fast: 200, slow: 600 },
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function(properties, duration, ease, callback, delay){
        if ($.isFunction(duration))
            callback = duration, ease = undefined, duration = undefined
        if ($.isFunction(ease))
            callback = ease, ease = undefined
        if ($.isPlainObject(duration))
            ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
        if (duration) duration = (typeof duration == 'number' ? duration :
                ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
        if (delay) delay = parseFloat(delay) / 1000
        return this.anim(properties, duration, ease, callback, delay)
    }

    $.fn.anim = function(properties, duration, ease, callback, delay){
        var key, cssValues = {}, cssProperties, transforms = '',
            that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
            fired = false

        if (duration === undefined) duration = $.fx.speeds._default / 1000
        if (delay === undefined) delay = 0
        if ($.fx.off) duration = 0

        if (typeof properties == 'string') {
            // keyframe animation
            cssValues[animationName] = properties
            cssValues[animationDuration] = duration + 's'
            cssValues[animationDelay] = delay + 's'
            cssValues[animationTiming] = (ease || 'linear')
            endEvent = $.fx.animationEnd
        } else {
            cssProperties = []
            // CSS transitions
            for (key in properties)
                if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
                else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

            if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
            if (duration > 0 && typeof properties === 'object') {
                cssValues[transitionProperty] = cssProperties.join(', ')
                cssValues[transitionDuration] = duration + 's'
                cssValues[transitionDelay] = delay + 's'
                cssValues[transitionTiming] = (ease || 'linear')
            }
        }

        wrappedCallback = function(event){
            if (typeof event !== 'undefined') {
                if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                $(event.target).unbind(endEvent, wrappedCallback)
            } else
                $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

            fired = true
            $(this).css(cssReset)
            callback && callback.call(this)
        }
        if (duration > 0){
            this.bind(endEvent, wrappedCallback)
            // transitionEnd is not always firing on older Android phones
            // so make sure it gets fired
            setTimeout(function(){
                if (fired) return
                wrappedCallback.call(that)
            }, (duration * 1000) + 25)
        }

        // trigger page reflow so new elements can animate
        this.size() && this.get(0).clientLeft

        this.css(cssValues)

        if (duration <= 0) setTimeout(function() {
            that.each(function(){ wrappedCallback.call(this) })
        }, 0)

        return this
    }

    testEl = null
})(Zepto)
Zepto(function($){
    function LoadImages(sources, callback){
        var count = 0,
            images ={},
            imgNum = 0;
        for(src in sources){
            imgNum++;
        }
        for(src in sources){
            images[src] = new Image();
            images[src].onload = function(){
                if(++count >= imgNum){
                    callback(images);
                }
            }
            images[src].src = sources[src];
        }
    }
    LoadImages(['http://wechat.wboll.com/static/customization/hotel/images/arrowblue.png',
    ],function(){
        setTimeout(function(){
            $('.loader').addClass('fadeOut').hide();
            $('#M').addClass('fadeIn').show();
        },1000);
    });
    var Msize = $('.m-page').size(), 	//ҳ�����Ŀ
        page_n			= 1,			//��ʼҳ��λ��
        initP			= null,			//��ֵ����ֵ
        moveP			= null,			//ÿ�λ�ȡ����ֵ
        firstP			= null,			//��һ�λ�ȡ��ֵ
        newM			= null,			//���¼��صĸ���
        p_b				= null,			//�������ֵ
        indexP			= null, 		//������ҳ����ֱ����ת�����һҳ
        move			= null,			//�����ܻ���ҳ��
        start			= true, 		//���ƶ�����ʼ
        startM			= null,			//��ʼ�ƶ�
        position		= null,			//����ֵ
        DNmove			= false,		//������������ҳ���л�
        mapS			= null,			//��ͼ����ֵ
        canmove			= false,		//��ҳ�������һҳ

        textNode		= [],			//�ı�����
        textInt			= 1;			//�ı�����˳��

    /*
     ** ��ҳ�л� ����Ԫ��fixed ����body�߶�
     */
    var v_h	= null;		//��¼�豸�ĸ߶�

    function init_pageH(){
        var fn_h = function() {
            if(document.compatMode == 'BackCompat')
                var Node = document.body;
            else
                var Node = document.documentElement;
            return Math.max(Node.scrollHeight,Node.clientHeight);
        }
        var page_h = fn_h();
        var m_h = $('.m-page').height();
        page_h >= m_h ? v_h = page_h : v_h = m_h ;

        //���ø���ģ��ҳ��ĸ߶ȣ���չ��������Ļ�߶�
        $('.m-page').height(v_h);
        $('.p-index').height(v_h);

    };
    init_pageH();

    /*
     **ģ���л�ҳ���Ч��
     */
    //���¼�
    function changeOpen(e){
        $('.m-page').on('mousedown touchstart',page_touchstart);
        $('.m-page').on('mousemove touchmove',page_touchmove);
        $('.m-page').on('mouseup touchend mouseout',page_touchend);
    };

    //ȡ�����¼�
    function changeClose(e){
        $('.m-page').off('mousedown touchstart');
        $('.m-page').off('mousemove touchmove');
        $('.m-page').off('mouseup touchend mouseout');
    };

    //�����¼��󶨻���
    changeOpen();

    /* ���� */
    var musicHandle=$('.m-music');
    var audio=document.getElementById('J_audio');
    var audioFlag=0;
    // musicHandle.coffee({
    // 	steams : ['<img src="static/../../../../static/customization/projhm/img/music.png"/>'
    // 			,'<img src="static/../../../../static/customization/projhm/img/music.png"/>'
    // 			,'<img src="static/../../../../static/customization/projhm/img/music.png"/>'
    // 			,'<img src="static/../../../../static/customization/projhm/img/music.png"/>'
    // 			,'<img src="static/../../../../static/customization/projhm/img/music.png"/>'
    // 			,'<img src="static/../../../../static/customization/projhm/img/music.png"/>'],
    // 	steamHeight : 100,
    // 	steamWidth : 100
    // });
    musicHandle.on('click',function(){
        audioFlag=1;
        if($(this).hasClass('m-play')){
            audio.pause();
            $(this).removeClass('m-play');
            // $.fn.coffee.stop();
        }else{
            audio.play();
            $(this).addClass('m-play');
            // $.fn.coffee.start();
        }
    });
    //�ſ���Ƶ
    var videoLayer=$('.video-layer');
    var videoLayerClose=$('.vl-close');
    var vlVideo=$('.vl-video');
    var m15tips=$('.m-page15 .m-tips');
    var videoAudio=false;
    var videoHtml='<iframe width="100%" height="360" src="http://player.youku.com/embed/XNzM3MjM2MDMy" frameborder=0 allowfullscreen></iframe>';
    $('.m15-video').on('click',function(){
        vlVideo.html(videoHtml);
        videoLayer.show();
        //�����ж�
        if(musicHandle.hasClass('m-play')){
            audio.pause();
            musicHandle.removeClass('m-play');
            videoAudio=true;
        }else{
            videoAudio=false;
        }
        //��ʶ����
        m15tips.hide();
    });
    //�ر���Ƶ
    videoLayerClose.on('click',function(){
        videoLayer.hide();
        vlVideo.html('');
        //������ʱ�����ǲ���״̬�����²���
        if(videoAudio){
            audio.play();
            musicHandle.addClass('m-play');
        }
        //��ʶ��ʾ
        m15tips.show();
    });

    //��������갴�£���ʼ����
    function page_touchstart(e){
        //��������
        if(audioFlag==0){
            musicHandle.addClass('m-play');
            audio.play();
            // $.fn.coffee.start();
        }
        if (e.type == 'touchstart') {
            initP = window.event.touches[0].pageY;
        } else {
            initP = e.y || e.pageY;
            mousedown = true;
        }
        firstP = initP;
    };
    //�����ƶ�������ƶ�����ʼ����
    function page_touchmove(e){
        e.preventDefault();
        e.stopPropagation();
        //�ж��Ƿ�ʼ�������ƶ��л�ȡֵ
        if(start||startM){
            startM = true;
            if (e.type == 'touchmove') {
                moveP = window.event.touches[0].pageY;
            } else {
                if(mousedown) moveP = e.y || e.pageY;
            }
            page_n == 1 ? indexP = false : indexP = true ;	//true Ϊ���ǵ�һҳ falseΪ��һҳ
        }

        //����һ��ҳ�濪ʼ�ƶ�
        if(moveP&&startM){

            //�жϷ�����һ��ҳ����ֿ�ʼ�ƶ�
            if(!p_b){
                p_b = true;
                position = moveP - initP > 0 ? true : false;	//true Ϊ���»��� false Ϊ���ϻ���
                if(position){

                    //�����ƶ�
                    if(indexP){
                        newM = page_n - 1 ;
                        $('.m-page').eq(newM-1).addClass('active').css('top',-v_h);
                        move = true ;
                    }else{
                        if(canmove){
                            move = true;
                            newM = Msize;
                            $('.m-page').eq(newM-1).addClass('active').css('top',-v_h);
                        }
                        else move = false;
                    }

                }else{
                    //�����ƶ�
                    if(page_n != Msize){
                        newM = page_n + 1 ;
                        $('.m-page').eq(newM-1).addClass('active').css('top',v_h);
                        move = true ;
                    }
                    else{
                        newM = 1 ;
                        $('.m-page').eq(newM-1).addClass('active').css('top',v_h);
                        move = false ;
                    }
                }
            }

            //�����ƶ�����ҳ���ֵ
            if(!DNmove){
                //��������ҳ�滬��
                if(move){
                    //�ƶ�������ҳ���ֵ��top��
                    start = false;
                    var topV = parseInt($('.m-page').eq(newM-1).css('top'));
                    $('.m-page').eq(newM-1).css({'top':topV+moveP-initP});
                    initP = moveP;
                }else{
                    moveP = null;
                }
            }else{
                moveP = null;
            }
        }
    };

    //����������������������뿪Ԫ�أ���ʼ����
    function page_touchend(e){
        //��������ҳ��
        startM =null;
        p_b = false;
        //�ж��ƶ��ķ���
        var move_p;
        position ? move_p = moveP - firstP > 100 : move_p = firstP - moveP > 100 ;
        if(move){
            //�л�ҳ��(�ƶ��ɹ�)
            if( move_p && Math.abs(moveP) >5 ){
                $('.m-page').eq(newM-1).animate({'top':0},300,'easeOutSine',function(){
                    /*
                     ** �л��ɹ��ص��ĺ���
                     */
                    success();
                })
                //����ҳ��(�ƶ�ʧ��)
            }else if (Math.abs(moveP) >=5){	//ҳ���˻�ȥ
                position ? $('.m-page').eq(newM-1).animate({'top':-v_h},100,'easeOutSine') : $('.m-page').eq(newM-1).animate({'top':v_h},100,'easeOutSine');
                $('.m-page').eq(newM-1).removeClass('active');
                start = true;
            }
        }
        /* ��ʼ��ֵ */
        initP		= null,			//��ֵ����ֵ
            moveP		= null,			//ÿ�λ�ȡ����ֵ
            firstP		= null,			//��һ�λ�ȡ��ֵ
            mousedown	= null;			//ȡ����갴�µĿ���ֵ
    };
    /*
     ** �л��ɹ��ĺ���
     */
    function success(){
        /*
         ** �л��ɹ��ص��ĺ���
         */
        var thisPage=$('.m-page').eq(newM-1);
        //����ҳ��ĳ���
        $('.m-page').eq(page_n-1).removeClass('show active').addClass('hide');
        thisPage.removeClass('active hide').addClass('show');
        setTimeout(function(){
            thisPage.find('.m-circle').show();
        },10);
        setTimeout(function(){
            thisPage.find('.J_hook').show();
        },200);
        //��������ҳ���ƶ��Ŀ���ֵ
        page_n = newM;
        start = true;
        //��������ҳ��Բ��Ԫ��
        $('.m-page').each(function(k,v){
            if(k!==page_n-1){
                $(this).find('.J_hook').hide();
                $(this).find('.m-circle').hide();
            }
        });
    }

    /*
     ** ҳ����س�ʼ��
     */
    function initPage(){
        //��ʼ��һ��ҳ��
        $('.m-page').addClass('hide').eq(page_n-1).addClass('show').removeClass('hide');
        setTimeout(function(){
            $('.m-page').eq(page_n-1).find('.J_hook').show();
        },800)
        //PC��ͼƬ�����������ק
        $(document.body).find('img').on('mousedown',function(e){
            e.preventDefault();
        })
        //����ͼƬ�ĳߴ�
        if(RegExp('iPhone').test(navigator.userAgent)||RegExp('iPod').test(navigator.userAgent)||RegExp('iPad').test(navigator.userAgent)) $('.m-page').css('height','100%');
    }(initPage());
});