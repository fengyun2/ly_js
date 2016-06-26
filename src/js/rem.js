//自适应REM设置
!function(){
    var isChange= false, oldScreenWidth= 375, oldRem= 50;   // 默认iPhone6为基准[屏款375，默认根字体大小50px]
    var html= document.getElementsByTagName('html')[0];
    var getStyle = function (element,attr) {
        if(typeof window.getComputedStyle!='undefined'){
            return parseFloat(window.getComputedStyle(element,null)[attr]);
        }else if(element.currentStyle){
            return parseFloat(element.currentStyle[attr]);
        }
    };
    function initRem(){
        console.log(document.body.clientWidth, getStyle(html, 'font-size'));
        html.style.fontSize= document.body.clientWidth*oldRem/oldScreenWidth+'px';
        oldScreenWidth= document.body.clientWidth;
        oldRem= getStyle(html, 'font-size');
        isChange= false;
    }
    document.addEventListener('DOMContentLoaded', function(){
        initRem();
    });
    window.addEventListener('resize', function(){
        if(!isChange){
            isChange= true;
            setTimeout(initRem, 700);
        }
    })
}();
