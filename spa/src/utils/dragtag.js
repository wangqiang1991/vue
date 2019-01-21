var dragtag = {
  tagType: 'gm',  // dz: 点赞 gm: 购买
  tagCallback: null,
  itemClick: null,
  clear() {
    $("#canvas").find(".my_goods").remove();
  },
  recover: function(dotInfos) {
    if (!dotInfos) {
      return;
    }
    // {left:10, top:20, tagType:'gm', goods:goods}
    let canvas = $("#canvas");
    let that = this;
    dotInfos.forEach((item) => {
      var text =
          '<div class="my_goods" style="left:' + item.left + '%;top: ' + item.top + '%;" data-left="'+ item.left +'" data-top="'+ item.top +'">' +
          '<span class="del_span">x</span>' +
          '</div>';
      var dot = $(text);
      console.log(item.tagType)
      if (item.tagType == 'gm') {
        dot.addClass('gm_tag');
      } else {
        dot.addClass('dz_tag');
      }
      dot.data('tagType', item.tagType);
      if (item.data) {
        for (var k in item.data) {
          dot.data(k, item.data[k]);
        }
      }
      dot.click(function() {
        if (that.itemClick) {
          that.itemClick($(this));
        }
      });
      dot.find(".del_span").click(function() {
        $(this).parent().remove();
      });
      canvas.append(dot);
    });
  },
  startClick: function() {
    var that = this;
    $("#canvas").click(function() {
      var ev = window.event || arguments.callee.caller.arguments[0];
      var x = ev.offsetX;
      var y = ev.offsetY;
      var a = "x:" + x + ",Y:" + y;

      if (ev.target.id != "content" && ev.target.id != "canvas") {
        // console.log("sss")
        return;
      }

      var w = parseInt($(this).css('width'));
      var h = parseInt($(this).css('height'));

      // console.log(w, h)

      var left = parseInt((x / w) * 100);
      var top = parseInt((y / h) * 100);

      // console.log(left, top)

      var text =
          '<div class="my_goods" style="left:' + left + '%;top: ' + top + '%;" data-left="'+left+'" data-top="'+top+'">' +
          '<span class="del_span">x</span>' +
          '</div>';

      var dot = $(text);
      console.log(that.tagType)
      if (that.tagType == 'gm') {
        dot.addClass('gm_tag');
      } else {
        dot.addClass('dz_tag');
      }
      dot.data('tagType', that.tagType);
      dot.find(".del_span").click(function() {
        $(this).parent().remove();
      });
      dot.click(function() {
        if (that.itemClick) {
          that.itemClick($(this));
        }
      });
      $(this).append(dot);
      if (that.tagCallback) {
        that.tagCallback(dot);
      }
    });
  },
  stopClick: function() {
    $("#canvas").off("click");
  },
  doDrag: function(event, canvas, dragging, draggingE) {
    var sTop = document.documentElement.scrollTop || document.body.scrollTop; //当有滚动条的时候卷去页面的高度
    var left = (event.clientX - canvas.offset().left - dragging.offsetWidth/2);
    var top = (event.clientY + sTop - canvas.offset().top  - dragging.offsetHeight/2 );

    if(left < 0){
        left = 0;
    }
    if(top < 0){
        top = 0;
    }

    let maxLeft = canvas.width() - dragging.offsetWidth;

    if (left > maxLeft) {
        left = (maxLeft - 2);
    }

    let maxTop = canvas.height() - dragging.offsetHeight;
    if (top > maxTop) {
        top = maxTop - 2;
    }

    var w = parseInt(canvas.css('width'));
    var h = parseInt(canvas.css('height'));

    var leftP = (left / w) * 100;
    var topP = (top / h) * 100;

    draggingE.css("left", leftP + "%");
    draggingE.css("top", topP + "%");
    draggingE.data("left", leftP);
    draggingE.data("top", topP);
  },
  startDrag: function() {
    var that = dragtag;
    var canvas = $("#canvas");
    var dragging = null;
    var draggingE = null;
    function drag(e) {
      e = e ? e : window.event;
      var target = e.target;
      // console.log(target)
      switch (event.type) {
        case "mousedown":
          // console.log("down")
          if($(target).hasClass('my_goods')){
            dragging = target;
            let dragEl = draggingE = $(dragging);
            let tagType = dragEl.data("tagType");
            if (tagType === "gm") {
              canvas.find(".gm_s_tag").removeClass("gm_s_tag");
              canvas.find(".dz_s_tag").removeClass("dz_s_tag");
              dragEl.addClass("gm_s_tag");
            } else {
              canvas.find(".gm_s_tag").removeClass("gm_s_tag");
              canvas.find(".dz_s_tag").removeClass("dz_s_tag");
              dragEl.addClass("dz_s_tag");
            }
            that.stopClick();
          }
          break;
        case "mousemove":
          if (dragging) {
            that.doDrag(e, canvas, dragging, draggingE);
          }
          break;
        case "mouseup":
          // console.log("up")
          if (dragging) {
            setTimeout(() => {
              that.startClick.call(that);
            }, 500);
          }
          dragging = null;
          draggingE = null;
          break;
      }
    }
    canvas.mouseup(drag);
    canvas.mousemove(drag);
    canvas.mousedown(drag);
  },
  getDots: function() {
    return $("#canvas .my_goods");
  }
}
export default dragtag
