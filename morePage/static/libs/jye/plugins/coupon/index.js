(function (e$, $) {
    var plugin = e$.createPlugin();
    plugin.name = "coupon";
    plugin.alias = "优惠券";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;
        this.uptoken = null;
        this.domain = null;
        this.html = $("<div></div>");
        this.edit = $("<div></div>")
        this.source = {name: plugin.name, props: {
        	src: "",
        	couponId: null,
        	name: null,
        	type: null,
        	inDate: null,
        	beginDate: null,
        	endDate: null,
        	totalCount: null,
        	disCount: null,
        	amount: null,
        	toAmount: null
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

            if (!editModel) {
            	__this__.html.find(".single-image").click(function () {
                    //alert(__this__.source.props);
                    if (window.receiveCouponMessage) {
                      window.receiveCouponMessage(__this__.source.props);
                    }
                });
                // imgDom.addClass('single-image-button');
            }
        }

        function renderer() {
            __this__.html.empty();
            __this__.html.load("/static/libs/jye/plugins/coupon/show.html", function () {
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

        function getTypeName(type) {
        	switch(type) {
        		case 1: return "包邮";
        		case 2: return "折扣";
        		case 3: return "金额";
        		default: return "";
        	}
        }

        function rendererEdit() {
            __this__.edit.load("./app/plugins/coupon/edit.html", function () {
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

            __this__.edit.find(".btn").click(function() {
        		window.toggleCouponSelector(function(coupon) {
        			console.log(coupon);
        			__this__.source.props.couponId = coupon.couponId;
		        	__this__.source.props.name = coupon.name;
		        	__this__.source.props.type = coupon.type;
		        	__this__.source.props.inDate = coupon.inDate;
		        	__this__.source.props.beginDate = coupon.beginDate;
		        	__this__.source.props.endDate = coupon.endDate;
		        	__this__.source.props.totalCount = coupon.totalCount;
		        	__this__.source.props.disCount = coupon.disCount;
		        	__this__.source.props.amount = coupon.amount;
		        	__this__.source.props.toAmount = coupon.toAmount;
		        	refreshEdit(__this__.source.props);
        		});
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

        function fmtDate(obj){
		    var date =  new Date(obj);
		    var y = 1900 + date.getYear();
		    var m = "0" + (date.getMonth() + 1);
		    var d = "0" + date.getDate();
		    return y + "." + m.substring(m.length - 2, m.length) + "." + d.substring(d.length - 2, d.length);
		}

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

            __this__.edit.find(".name").text(item.name);
            __this__.edit.find(".type").text(getTypeName(item.type));
            __this__.edit.find(".totalCount").text(item.totalCount);

            if (item.type == 2) {
            	__this__.edit.find(".amount_div").hide();
            	__this__.edit.find(".disCount_div").show();

            	__this__.edit.find(".disCount").text(item.disCount + "折");
            } else if (item.type == 3) {
            	__this__.edit.find(".amount_div").show();
            	__this__.edit.find(".disCount_div").hide();

            	__this__.edit.find(".amount").text(item.amount);
            	__this__.edit.find(".toAmount").text(item.toAmount);
            } else {
            	__this__.edit.find(".disCount_div, .amount_div").hide();
            }

            if (item.inDate) {
            	__this__.edit.find(".useDate").text(item.inDate + "天");
            } else if (item.beginDate && item.endDate) {
            	__this__.edit.find(".useDate").text(fmtDate(item.beginDate) + "-" + fmtDate(item.endDate));
            } else {
            	__this__.edit.find(".useDate").text("");
            }
        };
        renderer();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
