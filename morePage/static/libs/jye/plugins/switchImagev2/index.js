(function (e$, $) {
    var buttonIdCounter = 0;
    var plugin = e$.createPlugin();
    plugin.name = "switch_image";
    plugin.alias = "图片轮播";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;
        this.uptoken = null;
        this.html = $("<div></div>");
        this.edit = $("<div></div>")
        // props:[{src:"", link:""},{src:"", link:""}]
        this.source = {name: plugin.name, props: [{src: "", link: ""}, {src: "", link: ""}, {src: "", link: ""}]};
        this.getJsonContent = function () {
            return source;
        };
        this.getHtmlContent = function () {
            return this.html;
        };
        this.setJsonContent = function (json) {
            this.source = json;
        };
        this.getEditHtml = function () {
            // 这里选择edit是因为七牛必须在可见元素的时候去初始化,不然初始化没有用,点了没上传框
            rendererEdit();
            return this.edit;
        };

        this.activate = function () {

        };

        this.validate = function () {
            //return new plugin.error("选择图片", this.source.props, plugin);
            return null;
        }

        this.jssor_1_slider_init = function () {

            var arrowNav = null;
            if (window.juDevice && window.juDevice.type == 'desktop') {
                arrowNav = { $Class: $JssorArrowNavigator$ };
            }
            var jssor_1_options = {
                $AutoPlay: true,
                $SlideDuration: 800,
                $SlideEasing: $Jease$.$OutQuint,
                // $ArrowNavigatorOptions: arrowNav,
                $BulletNavigatorOptions: {
                    $Class: $JssorBulletNavigator$
                }
            };

            var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

            /*responsive code begin*/
            /*you can remove responsive code if you don't want the slider scales while window resizing*/
            function ScaleSlider() {
                var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
                if (refSize) {
                    refSize = Math.min(refSize, 1920);
                    jssor_1_slider.$ScaleWidth(refSize);
                }
                else {
                    window.setTimeout(ScaleSlider, 30);
                }
            }

            ScaleSlider();
            $Jssor$.$AddEvent(window, "load", ScaleSlider);
            $Jssor$.$AddEvent(window, "resize", ScaleSlider);
            $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
            /*responsive code end*/
        };

        this.refreshView = function () {
            if (editModel) {
                $("#jssor_1_edit").hide();
                $("#jssor_1").show();
                $.each(this.source.props, function (index, item) {
                    if (!item.src) {
                        item.src = "./assets/image/multi_image_default.jpg";
                    }
                    var imgViewParam = '?imageView2/1/w/640/h/336/q/75" style="height: 336px;"';
                    $("#jssor_1_slides").append("<div><img data-u=\"image\" src=\"" + item.src + imgViewParam + " /></div>");
                });
                this.jssor_1_slider_init();
            } else {
                $("#jssor_1_edit").hide();
                $("#jssor_1").show();
                $.each(this.source.props, function (index, item) {
                    var url = item.link;
                    // add referer's params before the link jump out
                    if (item.link.indexOf('/show.html') != -1) {
                        url = item.link + '&' + window.location.search.substring(1).replace(/&?f=homepage/, "").replace(/b=\w+&?/, "");
                    }

                    if (!url) {
                        url = "javascript:void(0)";
                    }
                    var imgViewParam = '?imageView2/4/h/200/q/75" style="height: 200px;"';
                    if (window.juDevice.type == 'desktop') {
                        imgViewParam = '?imageView2/1/w/640/h/336/q/75" style="height: 336px;"';
                    }
                    $("#jssor_1_slides").append("<div><a href=\"" + url + "\" target=\"_blank\"><img data-u=\"image\" src=\"" + item.src + imgViewParam + " /></a></div>");
                });

                this.jssor_1_slider_init();
            }
        }

        function renderer() {
            __this__.html.empty();
            __this__.html.load("./app/plugins/switchImagev2/show.html", function () {
                __this__.refreshView();
            });
        };
        
        function rendererEditDisplay() {
            __this__.uptoken = $.parseJSON(sessionStorage['upToken']);
            var ulDom = __this__.edit.find('.switch-img-items-container');
            //先移除所有组件
            ulDom.empty();
            //遍历当前元素
            $.each(__this__.source.props, function (index, item) {
                addLiDom(ulDom, item);
            });
            //绑定添加选线按钮事件
            bindAddEvent();
        };
        

        /**
         * 功能:渲染组件编辑区域
         */
        function rendererEdit() {
            __this__.edit.load("./app/plugins/switchImagev2/edit.html", function () {
                if (!sessionStorage['user']) {
                    sweetAlert("构巢", "当前未登录或者登录已经过期!", "error");
                    console.log("user is not exists!")
                    __this__.edit.find("当前未登录").hide();
                    return;
                }

                if (sessionStorage['upToken']) {
                    rendererEditDisplay();
                } else {
                    //获取上传图片的Token
                    var token = $.parseJSON(sessionStorage['user']).token;
                    $.ajax({
                        url: "api/v1/uptoken",
                        method: "get",
                        async: true,
                        headers: {Authorization: 'Token token=' + token},
                        success: function (data) {
                            sessionStorage["upToken"] = JSON.stringify(data);
                            rendererEditDisplay();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("获取上传token失败,请刷新重试");
                        }
                    });
                }

            });
        };

        /**
         * 功能:添加轮播图子元素
         * @param ulDom
         * @param item
         */
        function addLiDom(ulDom, item) {
            var liDom = $('<div class="img-item"><button type="button" class="close" style="opacity: 10;margin-top: -8px;margin-right: -8px;"> <img src="./assets/image/close.png" style="width: 16px;height: 16px;display: block;"/> </button> <div style="line-height: 30px;text-align: left;float:right;margin-right: 10px;width: 58%;height: 80px;margin-left: 10px;margin-top: 10px;"> <div> <span class="span-title" style="margin-left: 10px;">链接地址</span> </div> <div class="input-group" style="margin-top: 5px;margin-left: 5px;"> <input placeholder="跳转链接地址(选填)" type="text" class="form-control linkInput"> </div> </div> <div class="image-upload" style="width: 33%;text-align: center;line-height: 80px;height: 80px;border: 1px #999 dashed;margin-left: 10px;margin-top: 10px;"> <span style="color: #aaaaaa;">点击上传图片</span> <img style="display: none;width: 93%;height: 100%;"> </div> </div>');
            console.log(ulDom);
            liDom.data('prop', item);
            ulDom.append(liDom);

            refreshButtons();
            refreshLiDom(liDom);
            bundEvent(liDom);
        };

        /**
         * 刷新删除按钮  根据__this__.source.props的长度来判断是否显示删除按钮
         */
        function refreshButtons() {
            __this__.edit.find('.close').each(function () {
                if (__this__.source.props.length == 1) {
                    $(this).hide();
                }
            });
        };

        /**
         * 功能:绑定添加按钮事件
         */
        function bindAddEvent() {
            //绑定添加按钮
            __this__.edit.find('.div-add').click(function () {
                var item = {src: "", link: ""};
                __this__.source.props.push(item);
                addLiDom(__this__.edit.find('.switch-img-items-container'), item);
                renderer();
            });
        };

        /**
         * 给按钮绑定点击事件
         * @param liDom
         */
        function bundEvent(liDom) {
            //绑定删除按钮
            liDom.find('.close').click(function () {
                var liParent = $(this).parents('.img-item');
                var item = liParent.data('prop');
                var index = __this__.source.props.indexOf(item);
                __this__.source.props.splice(index, 1);
                liParent.remove();
                refreshButtons();
                renderer();
            });

            //遍历链接输入框
            liDom.find('.linkInput').article(function (link) {
                console.log(this)
                var liParent = $(this).parents('.img-item');
                var item = liParent.data('prop');
                item.link = link;
            });

            //遍历上传图片控件
            var buttonId = "img-item-" + buttonIdCounter++;
            var button = liDom.find('.image-upload');
            button.attr("id", buttonId);
            initUpload(__this__.uptoken, buttonId);
        }

        /**
         * 初始化上传组件,设置相关的回调函数
         * @param  {[type]} uptoken [description]
         * @return {[type]}         [description]
         */
        function initUpload(uptoken, button) {
            Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: button,
                max_file_size: '2mb',
                flash_swf_url: 'lib/qiniu/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '4mb',
                uptoken: uptoken.uptoken,
                domain: uptoken.domain,
                get_new_uptoken: false,
                unique_names: true,
                auto_start: false,
                // 单选文件
                multi_selection: false,
                // 过滤选择的文件类型
                filters: {
                    mime_types: [
                        //只允许上传图片和zip文件
                        {title: "所有图片", extensions: "jpg,gif,png,jpeg"},
                    ],
                    // 最大只能上传2MB的文件
                    max_file_size: '2048kb',
                    // 不允许选取重复文件
                    prevent_duplicates: true
                },
                init: {
                    'FilesAdded': function (up, files) {
                        up.start();
                    },
                    'BeforeUpload': function (up, file) {
                    },
                    'UploadProgress': function (up, file) {
                        console.log(file.percent);
                    },
                    'UploadComplete': function () {

                    },
                    'FileUploaded': function (up, file, info) {
                        console.log("上传成功一个:", info);
                        var url = up.getOption('domain') + $.parseJSON(info).key;
                        var button = $(up.getOption("browse_button"));
                        var liParent = button.parents('.img-item');
                        var item = liParent.data('prop');
                        item.src = url;
                        refreshLiDom(liParent);
                        renderer();
                        up.removeFile(file);
                    },
                    'Error': function (up, err, errTip) {
                        alert(errTip);
                    }
                }
            });
        };

        //刷新界面显示
        function refreshLiDom(liDom) {
            var item = liDom.data('prop');
            if (item.src && item.src !== './assets/image/multi_image_default.jpg') {
                liDom.find(".image-upload > span").hide();
                liDom.find(".image-upload > img").show().attr("src", item.src + "?imageView2/3/w/640/q/75");
            }
            var inputDom = liDom.find(".linkInput");
            if (inputDom.size() > 0) {
                inputDom.val(item.link);
            } 
        }

        renderer();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
