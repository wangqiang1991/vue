(function (e$, $) {
    var plugin = e$.createPlugin();
    plugin.name = "nav_banner";
    plugin.alias = "导航栏";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;
        this.html = $("<div></div>");
        this.edit = $("<div></div>")
        this.source = {
            name: plugin.name,
            props: [{icon: "icon-bangongyongpinguanli", label: "菜单1", color: '', link: ""},
                {icon: "icon-baomingdehuodong", label: "菜单2", color: '', link: ""},
                {icon: "icon-tupian1", label: "菜单3", color: '', link: ""},
                {icon: "icon-zuopin", label: "菜单4", color: '', link: ""}]
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
            $.each(__this__.source.props, function (index, item) {
                var divDom = __this__.html.find(".nav-banner > div").eq(index);
                divDom.find(">span:first").attr("class", "iconfont icon-size " + item.icon).css('color', item.color);
                divDom.find(">span:last").text(item.label);
            });

            if (editModel) {

            } else {
                // todo add click event, page link
                this.html.find(".nav-banner > div").css("cursor", "pointer").click(function () {
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
            __this__.html.load("./app/plugins/navBanner/show.html", function () {
                __this__.refreshView();
            });
        };

        /**
         * 功能:渲染编辑区域
         */
        function rendererEdit() {
            __this__.edit.load("./app/plugins/navBanner/edit.html", function () {
                initEditPage();
                bundEvent();
            });
        };

        /**
         * 功能:初始化编辑区域
         */
        function initEditPage() {
            $.each(__this__.source.props, function (index, item) {
                var liDom = __this__.edit.find(".nav-banner-edit > .nav-banner-item").eq(index);
                liDom.find(".btn-group > button > span:first").attr("class", "iconfont icon-size " + item.icon);
                liDom.find(".menuName").val(item.label);
                liDom.find(".nav-link").val(item.link);
                liDom.find(".menuColor").minicolors({
                    control: 'hue',
                    defaultValue: item.color,
                    inline: false,
                    letterCase: 'lowercase',
                    opacity: false,
                    position: 'bottom right',
                    change: function(hex, opacity) {
                        if( !hex ) return;
                        if( opacity ) hex += ', ' + opacity;
                    },
                    theme: 'bootstrap'
                });
            });
        };

        /**
         * 给编辑区域各个组件绑定事件
         * @param edit
         */
        function bundEvent() {
            __this__.edit.find(".dropdown-menu > li").click(function () {
                var liDom = $(this);
                var className = liDom.find("span").attr("class").split(" ")[1];
                var disDom = liDom.parents("div:eq(0)").find("span:first");
                // 设置下拉框的图片
                disDom.attr("class", "iconfont icon-size " + className);
                // 得到下拉框是第几个位置,相对于最外层的ul li
                var index = disDom.parents(".nav-banner-item").index() - 1;

                // 更新数据源,更新显示页面的图片
                __this__.source.props[index].icon = className;
                __this__.html.find(".nav-banner > div").eq(index).find("span:first").attr("class", "iconfont icon-size " + className);
            });

            __this__.edit.find(".menuColor").bind('input propertychange',function () {
                var inputDom = $(this);
                var liDom = inputDom.parents(".nav-banner-item");
                var index = liDom.index() - 1;
                var color = inputDom.val();
                __this__.source.props[index].color = color;
                __this__.html.find(".nav-banner > div").eq(index).find("span:first").css('color', color);
            });

            __this__.edit.find(".menuName").bind('input propertychange',function () {
                var inputDom = $(this);
                var liDom = inputDom.parents(".nav-banner-item");
                var index = liDom.index() - 1;
                // 更新数据源,更新显示Label
                var label = inputDom.val();
                __this__.source.props[index].label = label;
                __this__.html.find(".nav-banner > div").eq(index).find("span:last").text(label);
            });

            __this__.edit.find('.nav-link').article(function (link) {
                var inputDom = $(this);
                var liDom = inputDom.parents(".nav-banner-item");
                var index = liDom.index() - 1;
                // 更新数据源
                // var link = inputDom.val();
                __this__.source.props[index].link = link;
            });
        };

        renderer();
        // editModel && rendererEdit();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
