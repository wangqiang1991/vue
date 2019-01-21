(function (e$, $) {
    var plugin = e$.createPlugin();
    var buttonIdCounter = 0;
    plugin.name = "double_image";
    plugin.alias = "多图栏目";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;
        this.uptoken = null;
        this.html = $("<div></div>");
        this.edit = $("<div></div>")
        this.source = {name: plugin.name, props: [{src: "", link: "", name: ""}, {src: "", link: "", name: ""}]};
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
            rendererEdit();
            return this.edit;
        };

        this.activate = function () {

        };

        this.validate = function () {
            return null;
        }

        this.refreshView = function () {
            var liClassName;
            //判断当前一共有多少个选项
            if (__this__.source.props.length == 2) {
                __this__.html.find(".double_image").show();
                __this__.html.find(".three_image").hide();
                __this__.html.find(".four_image").hide();
                liClassName = ".col-xs-6";
            } else if (__this__.source.props.length == 3) {
                __this__.html.find(".double_image").hide();
                __this__.html.find(".three_image").show();
                __this__.html.find(".four_image").hide();
                liClassName = ".col-xs-4";
            } else if (__this__.source.props.length == 4) {
                __this__.html.find(".double_image").hide();
                __this__.html.find(".three_image").hide();
                __this__.html.find(".four_image").show();
                liClassName = ".col-xs-3";
            }


            __this__.html.find(liClassName).each(function () {
                var liDom = $(this);
                //判断是否上传了图片
                var src = __this__.source.props[liDom.index()].src;
                if (src) {
                    var imgDom = liDom.find("img");
                    imgDom.attr("src", src + "?imageView2/2/w/320/h/160/q/75");
                }
                //判断是否设置了栏目名称
                var name = __this__.source.props[liDom.index()].name;
                var divName = liDom.find(".divName");
                if (name) {
                    divName.show();
                    divName.html(name);
                } else {
                    divName.hide();
                }
            });

            if (editModel) {

            } else {
                // todo add click event, page link
                __this__.html.find("li").addClass("button").click(function () {
                    var url = __this__.source.props[$(this).index()].link;
                    if (!url) {
                        console.warn("url is empty");
                        return;
                    }
                    // add referer's params before the link jump out
                    if (url.indexOf('/show.html') != -1) {
                        url = url + '&' + window.location.search.substring(1).replace(/&?f=homepage/, "").replace(/b=\w+&?/, "");
                    }
                    window.open(url);
                });
            }
        }

        function renderer() {
            __this__.html.empty();
            __this__.html.load("./app/plugins/doubleImage/show.html", function () {
                __this__.refreshView();
            });
        };

        
        function rendererEditDisplay() {
            __this__.uptoken = $.parseJSON(sessionStorage['upToken']);
            var ulDom = __this__.edit.find('.img-items-container');
            //先移除所有组件
            ulDom.empty();
            //遍历当前元素
            $.each(__this__.source.props, function (index, item) {
                addLiDom(ulDom, item);
            });
            //绑定添加选线按钮事件
            bindAddEvent();
        };
        
        
        function rendererEdit() {
            __this__.edit.load("./app/plugins/doubleImage/edit.html", function () {
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
            var liDom = $('<div class="img-item"> <button type="button" class="close" style="opacity: 10;margin-top: -8px;margin-right: -8px;"> <img src="./assets/image/close.png" style="width: 16px;height: 16px;display: block;"/> </button> <div style="line-height: 30px;text-align: left;float:right;margin-right: 10px;width: 58%;height: 80px;margin-left: 10px;margin-top: 10px;"> <div> <input placeholder="栏目名称(选填)" style="width: 97%;margin-left: 5px;" type="text" class="form-control nameInput"> </div> <div class="input-group" style="margin-top: 5px;margin-left: 5px;"> <input placeholder="跳转链接地址(选填)" type="text" class="form-control linkInput"></div> </div> <div class="image-upload" style="width: 33%;text-align: center;line-height: 80px;height: 80px;border: 1px #999 dashed;margin-left: 10px;margin-top: 10px;"> <span style="color: #aaaaaa;">点击上传图片</span> <img style="display: none;width: 93%;height: 90%;"> </div> </div>');
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
                if (__this__.source.props.length == 2) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
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
                var liParent = $(this).parents('.img-item');
                var item = liParent.data('prop');
                item.link = link;
            });

            //遍历名称输入框
            liDom.find(".nameInput").bind('input propertychange', function () {
                var liParent = $(this).parents('.img-item');
                var item = liParent.data('prop');
                item.name = $(this).val();
                //刷新show.html中的内容
                renderer();
            });

            //遍历上传图片控件
            var buttonId = "img-item-" + buttonIdCounter++;
            var button = liDom.find('.image-upload');
            button.attr("id", buttonId);
            initUpload(__this__.uptoken, buttonId);
        };


        /**
         * 功能:绑定添加按钮事件
         */
        function bindAddEvent() {
            //绑定添加按钮
            __this__.edit.find('.div-add').click(function () {
                if (__this__.source.props.length == 4) {
                    alert("最多只能添加四个栏目");
                    return;
                }
                var item = {src: "", link: "", name: ""};
                __this__.source.props.push(item);
                addLiDom(__this__.edit.find('.img-items-container'), item);
                renderer();
            });
        };

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
                        var item = __this__.source.props[liParent.index()];
                        item.src = url;
                        refreshLiDom(liParent, item);
                        var imgDom = __this__.html.find("li").eq(liParent.index()).find("img");
                        imgDom.attr("src", url);
                        renderer();
                        up.removeFile(file);
                    },
                    'Error': function (up, err, errTip) {
                        alert(errTip);
                    }
                }
            });
        };

        function refreshLiDom(liDom) {
            var item = liDom.data('prop');
            if (item.src) {
                liDom.find(".image-upload > span").hide();
                liDom.find(".image-upload > img").show().attr("src", item.src + "?imageView2/2/w/320/h/160/q/75");
            }
            var inputDom = liDom.find(".linkInput");
            if (inputDom.size() > 0) {
                inputDom.val(item.link);
            }

            var inputName = liDom.find(".nameInput");
            if (inputName.size() > 0) {
                inputName.val(item.name);
            }
        };

        renderer();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
