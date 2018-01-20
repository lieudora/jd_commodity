/*
 1. 鼠标移入显示,移出隐藏
    目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
 3. 输入搜索关键字, 列表显示匹配的结果
 4. 点击显示或者隐藏更多的分享图标
 5. 鼠标移入移出切换地址的显示隐藏
 6. 点击切换地址tab

 7. 鼠标移入移出切换显示迷你购物车
 8. 点击切换产品选项 (商品详情等显示出来)
 9. 当鼠标悬停在某个小图上,在上方显示对应的中图
 10. 点击向右/左, 移动当前展示商品的小图片
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */

$(function () {
   showHide()
     subMenu()
    search()
     share()
     address()
     minicart()
     products()
    mediumImg()
    movePic()
    showBig()

    // 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
    function showBig() {
       //小黄块
        var $mask = $('#mask');
    //绑定事件用的透明遮罩
        var $maskTop = $('#maskTop');
    // 中图
        var $mediumImg = $('#mediumImg');
    // 大图  大图容器
        var $largeImgContainer = $('#largeImgContainer');
        var $largeImg = $('#largeImg');
    //小黄块的宽高
        var maskWidth = $mask.width();
        var maskHeight = $mask.height();
    // 中图的宽高
        var mImgWidth = $mediumImg.width();
        var mImgHeight = $mediumImg.height();

        $maskTop.hover(function () {
          //进入事件区域显示小黄块
            $mask.show();
            $largeImgContainer.show();
            $largeImg.show();

            //获取中图的src  拼接大图的src
            var srcM = $mediumImg.attr('src');
            var srcL = srcM.replace('m.jpg','l.jpg');
            $largeImg.attr('src',srcL);
            //定义大图容器的宽高
            $largeImgContainer.css({
                width:$largeImg.width()/2,
                height:$largeImg.height()/2
            })
            //绑定滑动中的事件  动态的修改小黄块的位置
            $maskTop.mousemove(function (event) {
                var left = 0;
                var top = 0;
                //获取事件对象的坐标
                var offsetX = event.offsetX;
                var offsetY = event.offsetY;
                left = offsetX-(maskWidth/2);
                top = offsetY-(maskHeight/2);
                //小黄块边界值判断
                //横向判断
                if (left < 0){
                    left = 0;
                }else if (left>mImgWidth-maskWidth){
                    left = mImgWidth-maskWidth;
                }
                //纵向判断
                if (top < 0){
                    top = 0;
                }else if (top > mImgHeight - maskHeight){
                    top = mImgHeight - maskHeight;
                }
                //最终的目的 是给小黄块赋值 left top
                $mask.css({
                    left:left,
                    top:top
                })
                //中图的位置/中图的宽高*大图的宽高
                left = -left/mImgWidth*$largeImg.width();
                top = -top/mImgHeight*$largeImg.height();
                //最终目的 是修改大图的left top 显示中图的对应位置
                $largeImg.css({
                    left:left,
                    top:top
                })
            })
        },function () {
            $mask.hide();
            $largeImgContainer.hide();
            $largeImg.hide();
        })
    }

    // 10. 点击向右/左, 移动当前展示商品的小图片
    function movePic() {
      //左右两个按钮
        var $backward = $('#preview h1 a:first');
        var $forward = $('#preview h1 a:last');
    //  图片的容器
        var $list = $('#icon_list');
    //图片总数  8
        var pics = $list.children().length;
    //显示区域的图片张数
        var show_img = 5;
    // li的宽度  每次的偏移量
        var itemWidth = 62;
    //左侧有几张图片
        var imgCount = 0;
        //初始化右侧按钮的状态
        if(imgCount<pics-show_img){
            $forward.attr('class','forward')
        }
        //给左右两个按钮绑定单击事件 并处理回调的逻辑
        $forward.click(function () {
            //获取当前点击按钮的class
            var nowClass = $(this).attr('class');
            if(nowClass !== 'forward_disabled'){
                if (imgCount !== pics-show_img){
                    imgCount++;
                    $list.css('left',imgCount*-itemWidth);
                    $backward.attr('class','backward');
                    if(imgCount === pics-show_img){
                        $forward.attr('class','forward_disabled')
                    }
                }
            }
        })
        $backward.click(function () {
          var nowClass = $(this).attr('class');
          if(nowClass !== 'backward_disabled'){
            //判断左侧是否还有图片
              if (imgCount !== 0){
                  imgCount--;
                  $list.css('left',imgCount*-itemWidth);
                  $forward.attr('class','forward');
                  //判断当前左侧是否还有图片
                  if (imgCount === 0){
                      $backward.attr('class','backward_disabled');
                  }
              }
          }
        })
    }
    
    // 9. 当鼠标悬停在某个小图上,在上方显示对应的中图
    function mediumImg() {
      $('#icon_list li').hover(function () {
          //中图标签
          var $mediumImg = $('#mediumImg');
        $(this).children().addClass('hoveredThumb');
        //想办法得到中图的src
          //小图的src
          var srcS = $(this).children().attr('src');
         //拼接中图src
          //images/products/product-s1-m.jpg
          //images\products\product-s1.jpg
          var srcM = srcS.replace('.jpg','-m.jpg');
          $mediumImg.attr('src',srcM);


      },function () {
          $(this).children().removeClass('hoveredThumb');
      })
    }
    // 8. 点击切换产品选项 (商品详情等显示出来)
    function products() {
      $('#product_detail .main_tabs li').click(function () {
          $(this).siblings().removeClass('current');
        $(this).addClass('current');
        //获取当前index
        var index = $(this).index();
        var $divs = $('#product_detail>div:not(:first)');
        $divs.hide();
          $divs[index].style.display = 'block';
      })
    }
    
    // 7. 鼠标移入移出切换显示迷你购物车
    function minicart() {
      $('#minicart').hover(function () {
        $(this).addClass('minicart');
        $(this).children('div').show();
      },function () {
          $(this).removeClass('minicart');
          $(this).children('div').hide();
      })
    }
    //5. 鼠标移入移出切换地址的显示隐藏
    // 6. 点击切换地址tab
    function address() {
      $('#store_select').hover(function () {
        $('#store_content,#store_close').show();
      },function () {
          $('#store_content,#store_close').hide();
      })
        $('#store_tabs li').click(function () {
          $(this).siblings().removeClass('hover');
          $(this).addClass('hover');
        });
      $('#store_close').click(function () {
          $('#store_content,#store_close').hide();
      })
    }



   //  4. 点击显示或者隐藏更多的分享图标
    function share() {
        var isOpen = false;
      $('#shareMore').click(function () {
          if(isOpen){
              $('#dd').css('width',155);
              $(this).find('b').removeClass('backword');
              $(this).prevAll(':lt(2)').hide();
          }else {
              $('#dd').css('width',200);
              $(this).find('b').addClass('backword');
              $(this).prevAll(':lt(2)').show();
          }
          isOpen = !isOpen;
      })
    }

   //  3. 输入搜索关键字, 列表显示匹配的结果
    //当元素获得焦点时，触发 focus 事件。
    //当按钮被松开时，发生 keyup 事件。它发生在当前获得焦点的元素上。
    //当元素失去焦点时触发 blur 事件。
    function search() {
        $('#txtSearch').on('focus keyup',function () {
          var val = $.trim($(this).val());
          if (val){
              $('#search_helper').show();
          }
        }).blur(function () {
            $('#search_helper').hide();

        })
    }
   //  2. 鼠标移动切换二级导航菜单的切换显示和隐藏
    function subMenu() {
      $('.cate_item').hover(function () {
        $(this).children('div').show();
      },function () {
          $(this).children('div').hide();
      })
    }
   //  1. 鼠标移入显示,移出隐藏
   //  目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
    function showHide() {
      $('[name=show_hide]').hover(function () {
        var id = $(this).attr('id');
        $('#'+id+'_items').show();
      },function () {
          var id = $(this).attr('id');
          $('#'+id+'_items').hide();
      })
    }

})




