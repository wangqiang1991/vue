(function (e$, $) {
    var plugin = e$.createPlugin();
    plugin.name = "single_image";
    plugin.alias = "图片";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;
        this.uptoken = null;
        this.domain = null;
        this.html = $("<div></div>");
        this.edit = $("<div></div>")
        this.source = {name: plugin.name, props: {src: "", link: ""}};
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
            var imgDom = __this__.html.find(".single-image");
            var src = __this__.source.props.src;
            if (src) {
                imgDom.attr("src", src + "?imageView2/3/w/640/q/75");
            }

            var photoDesc = __this__.source.props.photoDesc;
            if (photoDesc) {
                __this__.html.find(".photoDescContainer").show();
                console.log(__this__.html.find(".photoDescValue"));
                __this__.html.find(".photoDescValue").html(photoDesc);
            } else {
                __this__.html.find(".photoDescContainer").hide();
            }

            if (editModel) {

            } else {
                // if (!url) {
                //     return;
                // }
                // todo add click event, page link
                __this__.html.find(".single-image").click(function () {
                    var url = __this__.source.props.link;
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
                // imgDom.addClass('single-image-button');
            }
        }

        function renderer() {
            __this__.html.empty();
            __this__.html.load("/static/libs/jye/plugins/singleImage/show.html", function () {
                __this__.refreshView();
            });
        };

        function rendererEditDisplay() {
            __this__.uptoken = sessionStorage['qn_token'];
            __this__.domain = sessionStorage['qn_domain'];
            var item = __this__.source.props;
            refreshEdit(item);
            bundEvent();
        };


        function rendererEdit() {
            __this__.edit.load("./app/plugins/singleImage/edit.html", function () {
                if (!sessionStorage['user']) {
                    sweetAlert("构巢", "当前未登录或者登录已经过期!", "error");
                    console.log("user is not exists!")
                    __this__.edit.find("当前未登录").hide();
                    return;
                }
                if (sessionStorage['qn_token']) {
                    rendererEditDisplay();
                } else {

                    $.ajax({
                        url: "api/api/system-user/upload/token",
                        method: "GET",
                        async: true,
                        success: function (data) {
                            console.log(data);
                            sessionStorage["qn_token"] = data.data.token;
                            sessionStorage["qn_domain"] = data.data.domain;
                            rendererEditDisplay();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            $.showAlert("获取上传token失败,请刷新重试", "danger");
                        }
                    });
                }

            });
        };

        /**
         * 给edit.html组件绑定事件属性
         */
        function bundEvent() {

            //绑定图片上传事件
            __this__.edit.find('.img-item').each(function () {
                initUpload(__this__.uptoken,__this__.domain,this);
            });
            //绑定跳转链接事件
            __this__.edit.find(".text2").article(function (link) {
                // var liParent = $(this).parents('li:first');
                var item = __this__.source.props;
                item.link = link;
                // refreshLiDom(liParent, item);
                refreshEdit(item);
            });
            //绑定图片描述
            __this__.edit.find('.text1').bind('input propertychange', function () {
                var item = __this__.source.props;
                item.photoDesc = $(this).val();
                __this__.refreshView();
            });

        };

        /**
         * 初始化上传组件,设置相关的回调函数
         * @param  {[type]} uptoken [description]
         * @return {[type]}         [description]
         */
        function initUpload(token,domain,button) {
            Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: button,
                max_file_size: '2mb',
                flash_swf_url: 'lib/qiniu/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '4mb',
                uptoken: token,
                domain: domain,
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
                    prevent_duplicates: !true
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
                        // var button = $(up.getOption("browse_button"));
                        // var liParent = button.parents('li');
                        var item = __this__.source.props;
                        item.src = url;
                        // refreshLiDom(liParent, item);
                        refreshEdit(item)
                        var imgDom = __this__.html.find(".single-image");
                        imgDom.attr("src", url);
                    },
                    'Error': function (up, err, errTip) {
                        alert(errTip);
                    }
                }
            });
        };

        /**
         *
         * @param item
         */
        function refreshEdit(item) {
            if (item.src) {  //展示图片
                //__this__.edit.find(".img").show().attr("src", item.src + "?imageView2/3/w/640/q/75");
                __this__.edit.find(".img").show().attr("src", item.src + "?imageView2/1/w/650/h/400");
                __this__.edit.find(".uploadDesc").hide();
            }
            __this__.edit.find(".text1").val(item.photoDesc);
            __this__.edit.find(".text2").val(item.link);
        };
        renderer();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
