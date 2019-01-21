(function (e$, $) {
    var selectedImages = [];
    var uploader;
    var defaultImageUrl = "./assets/image/multi_image_default.jpg";
    var plugin = e$.createPlugin();
    plugin.name = "multi_image";
    plugin.alias = "相册";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;

        this.uptoken = null;
        this.html = $("<div></div>");
        this.edit = $("<div></div>");

        this.source = {
            name: plugin.name, props: {
                lines: 3, review: 1,
                images: [

                ]
            }
        };
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
            // return new plugin.error("选择图片", this.source.props, plugin);
            return null;
        }

        this.refreshView = function () {

            //遍历中间内容区域
            //判断是否有图片
            if (this.source.props.images.length > 0) {
                var ulDom = __this__.html.find('ul');
                var noneImage = ulDom.find(".noneImage");
                noneImage.hide();
                $.each(this.source.props.images, function (index, item) {
                    var src = item.src ? item.src : defaultImageUrl;
                    var liDom = $('<li><img data-src="' + src + '?imageView2/0/w/1000/h/1000" src="' + src + '?imageView2/4/w/200/h/200/q/75" /></li>');
                    addShowLiDom(liDom);
                });
            } else {
                var ulDom = __this__.html.find('ul');
                var noneImage = ulDom.find(".noneImage");
                noneImage.show();
            }


            if (editModel) {

            } else {
                // todo add click event, page link
                __this__.html.find("li").addClass("button").click(function () {
                    var index = $(this).index() - 1;
                    var url = __this__.source.props.images[index].link;

                    if (__this__.source.props.review == 2) {
                        if (!url) {
                            console.warn("url is empty");
                            return;
                        }
                        // add referer's params before the link jump out
                        if (url.indexOf('/show.html') != -1) {
                            url = url + '&' + window.location.search.substring(1).replace(/&?f=homepage/, "").replace(/b=\w+&?/, "");
                        }
                        window.open(url);
                    } else {
                        initPhotoSwipe(__this__.html.find(".multi_image img"), index);
                    }
                });
            }
        }

        function initPhotoSwipe(imgDoms, index) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            // build items array
            // var items = [
            //     {
            //         src: 'https://img1.360buyimg.com/da/jfs/t3334/45/556662519/133183/f935c5c7/580dc4e5Ndeee06b0.jpg',
            //         w: 600,
            //         h: 400,
            //         //msrc: 'path/to/small-image.jpg',
            //      			//title: 'MediumLightbox是一款支持移动端的仿medium图片放大预览js插件。该插件可以在用户点击页面中的图片时，将图片平滑过渡放大到'
            //     },
            //     {
            //         src: 'https://img1.360buyimg.com/da/jfs/t3334/45/556662519/133183/f935c5c7/580dc4e5Ndeee06b0.jpg',
            //         w: 1200,
            //         h: 900
            //     }
            // ];
            // define options (if needed)
            var items = [];
            imgDoms.each(function (index, dom) {
                var src = $(dom).data("src");
                var msrc = dom.src;
                items.push({
                    src: src,
                    msrc: msrc,
                    w: 1000,
                    h: 1000
                });
            });
            var options = {
                // optionName: 'option value'
                // for example:
                index: index, // start at first slide
                mouseUsed: true,
                showHideOpacity: true
            };
            // Initializes and opens PhotoSwipe
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();

            gallery.listen('mouseUsed', function () {
                alert("123")
            });
        }

        function addShowLiDom(liDom) {
            var className = "col-xs-" + (12 / __this__.source.props.lines);
            liDom.addClass(className);
            __this__.html.find('ul').append(liDom);
        }

        function renderer() {
            __this__.html.empty();
            __this__.html.load("./app/plugins/multiImage/show.html", function () {
                __this__.refreshView();
            });
        };

        function rendererEditDisplay() {
            __this__.uptoken = $.parseJSON(sessionStorage['upToken']);
            // 绑定批量上传按钮
            initBatchUpload(__this__.uptoken, __this__.edit.find(".div-add").get(0));

            // 遍历已经上传的图片
            var imagesContainerDom = __this__.edit.find(".imagesContainer");
            imagesContainerDom.empty();
            $.each(__this__.source.props.images, function (index, item) {
                var src = item.src ? item.src : defaultImageUrl;
                var imageItemDom = $('<div class="imageItem" style="display: inline-block;margin-left: 0px;"> <img class="showImage" style="width: 85px;height: 85px;margin-top: 0px;float: left;"> <button type="button" class="close" style="opacity: 1;margin-top: -5px;margin-left: -8px;z-index: 100;"> <img src="./assets/image/close.png" style="opacity: 1;width: 13px;height: 13px;display: block;"/> </button> </div>');
                var imageViewDom = imageItemDom.find(".showImage");
                imageViewDom.attr("src",src);
                imagesContainerDom.append(imageItemDom);
                //绑定删除事件
                var btnClose = imageItemDom.find(".close");
                btnClose.click(function () {
                    __this__.source.props.images.splice(index, 1);
                    renderer();
                    rendererEdit();
                });
            });
        };
        
        function rendererEdit() {
            __this__.edit.load("./app/plugins/multiImage/edit.html", function () {
                __this__.edit.find("select:eq(0)").val(__this__.source.props.lines);
                __this__.edit.find("select:eq(1)").val(__this__.source.props.review);
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
         * 初始化上传组件,设置相关的回调函数
         * @param  {[type]} uptoken [description]
         * @return {[type]}         [description]
         */
        function initBatchUpload(uptoken, button) {
            Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: button,
                max_file_size: '2mb',
                flash_swf_url: 'lib/qiniu/plupload/Moxie.swf',
                dragdrop: true,
                drop_element: button,
                chunk_size: '4mb',
                uptoken: uptoken.uptoken,
                domain: uptoken.domain,
                get_new_uptoken: false,
                unique_names: true,
                auto_start: false,
                // 多选文件
                multi_selection: true,
                // 过滤选择的文件类型
                filters: {
                    mime_types: [
                        //只允许上传图片和zip文件
                        {title: "所有图片", extensions: "jpg,gif,png,jpeg"},
                    ],
                    // 最大只能上传2MB的文件
                    max_file_size: '2048kb',
                    // 不允许选取重复文件
                    prevent_duplicates: false
                },
                init: {
                    'FilesAdded': function (up, files) {
                        $.each(files,function (index,element) {
                            var reader = new FileReader();
                            reader.onload = (function (file) {
                                element.result = this.result;
                                showUpload();
                            });
                            reader.readAsDataURL(element.getNative());
                        });
                        selectedImages = files;
                        uploader = up;
                        showUpload();
                    },
                    'BeforeUpload': function (up, file) {
                    },
                    'UploadProgress': function (up, file) {
                        var index = selectedImages.indexOf(file);
                        //获取当前索引上的dom对象
                        var dom = __this__.edit.find(".selectImage").eq(index);
                        var spanProgress = dom.find(".span_progress");
                        var spanFail = dom.find(".span_fail");
                        var spanSuccess = dom.find(".span_success");
                        var spanWait = dom.find(".span_wait");
                        spanProgress.show();
                        spanFail.hide();
                        spanSuccess.hide();
                        spanWait.hide();

                        spanProgress.html("上传中:" + file.percent + "%");

                        console.log("当前正在上传第" + selectedImages.indexOf(file) + "张图片,进度为:" + file.percent);
                    },
                    'UploadComplete': function (up, files) {
                        // 循环添加dom
                        $.each(files, function (index, file) {
                            var item = {src: file.remoteUrl, link: ""};
                            __this__.source.props.images.push(item);
                            var showLiDom = $('<li><img src="' + (item.src ? item.src : defaultImageUrl) + '" /></li>');
                            addShowLiDom(showLiDom);
                        });
                        //关闭上传页面
                        closeUpload();
                        //刷新页面
                        renderer();
                        rendererEdit();
                    },
                    'FileUploaded': function (up, file, info) {
                        console.log("上传成功一个:", info);
                        var url = up.getOption('domain') + $.parseJSON(info).key;
                        file.remoteUrl = url;

                        var index = selectedImages.indexOf(file);
                        //获取当前索引上的dom对象
                        var dom = __this__.edit.find(".selectImage").eq(index);
                        var spanProgress = dom.find(".span_progress");
                        var spanFail = dom.find(".span_fail");
                        var spanSuccess = dom.find(".span_success");
                        var spanWait = dom.find(".span_wait");
                        spanProgress.hide();
                        spanFail.hide();
                        spanSuccess.show();
                        spanWait.hide();

                    },
                    'Error': function (up, err, errTip) {
                        alert(errTip);
                    }
                }
            });
        };

        /**
         * 功能:显示上传弹出框
         */
        function showUpload() {
            $("#addPhotoModal").modal("hide");
            $("#addPhotoModal").modal({backdrop: "static"});
            __this__.edit.find(".closeBtn").click(function () {
                closeUpload();
            });
            __this__.edit.find(".cancelBtn").click(function () {
                closeUpload();
            });
            __this__.edit.find(".beginBtn").click(function () {
                //开始上传
                uploader.start();
            });
            
            //展示选择的图片文件
            var selectImagesContainer = __this__.edit.find(".selectImagesContainer");
            selectImagesContainer.empty();

            $.each(selectedImages,function (index,file) {
                var selectImage = $('<div class="col-sm-3 col-md-3 selectImage"> <div style="margin-top: 10px;margin-bottom: 0px;" class="thumbnail"> <img class="showImage" src="" style="width: 150px; height: 150px;"> <div class="caption" style="display: table; "> <span class="span_success" style="font-size: small;color: #00a65a;display: none;">上传成功</span> <span class="span_wait" style="font-size: small;">等待上传</span> <span class="span_fail" style="font-size: small;color: red;display: none;">上传失败</span> <span class="span_progress" style="font-size: small;display: none;">上传中</span> </div> </div> </div>');
                var showImage = selectImage.find(".showImage");
                var src = file.result;
                showImage.attr("src",src);
                selectImagesContainer.append(selectImage);
            });
        }


        /**
         * 关闭上传弹出框
         * @return {[type]} [description]
         */
        function closeUpload () {
            $("#addPhotoModal").modal("hide");
            selectedImages = [];

            $.each(selectedImages,function (index,file) {
                uploader.removeFile(file);
            });
        };

        function refreshLiDom(liDom) {
            var item = liDom.data('prop');
            if (item.src) {
                liDom.find(".img-item > span").hide();
                liDom.find(".img-item > img").show().attr("src", item.src + "?imageView2/1/w/100/h/100/q/75");
            }
            var inputDom = liDom.find(">div>input[type='text']");
            if (inputDom.size() > 0) {
                inputDom.val(item.link);
            }
        };
        renderer();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
