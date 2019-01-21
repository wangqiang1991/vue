(function (e$, $) {
    var plugin = e$.createPlugin();
    plugin.name = "scene_picture";
    plugin.alias = "场景图";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;
        this.uptoken = null;
        this.domain = null;
        this.html = $("<div></div>");
        this.edit = $("<div></div>")
        this.source = {name: plugin.name, props: {
            name: null,
            tagType: null,
            roomNames: null,
            styleNames: null,
            cover: null,
            sceneId: null,
            praiseCount: 0,
            goodsCount: 0
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

            if (!__this__.source.props.sceneId) {
                __this__.html.find(".no_seleced").show();
                __this__.html.find(".scene-picture, .tag_div").hide();
                return;
            }

            __this__.html.find(".no_seleced").hide();
            __this__.html.find(".scene-picture, .tag_div").show();

            __this__.html.find(".scene-picture").attr("src", __this__.source.props.cover);

            if (!__this__.source.props.praiseCount || __this__.source.props.praiseCount == 0) {
                __this__.html.find(".dz_s_tag").hide();
            } else {
                __this__.html.find(".dz_s_tag").show().find("span").text(__this__.source.props.praiseCount);
            }

            if (!__this__.source.props.goodsCount || __this__.source.props.goodsCount == 0) {
                __this__.html.find(".gm_s_tag").hide();
            } else {
                __this__.html.find(".gm_s_tag").show().find("span").text(__this__.source.props.goodsCount);
            }

            if (!editModel) {
                __this__.html.find(".scene-picture").click(function () {
                    if (window.showScene) {
                      window.showScene(__this__.source.props);
                    }
                });
            }
        }

        function renderer() {
            __this__.html.empty();
            __this__.html.load("/static/libs/jye/plugins/scenePicture/show.html", function () {
                __this__.refreshView();
            });
        };


        function getTagTypeName(tagType) {
            if (tagType == 1) {
                return "无";
            } else if (tagType == 2) {
                return "点赞";
            } else if (tagType == 3) {
                return "混合";
            } else if (tagType == 4) {
                return "购买";
            }
            return "无";
        }

        function rendererEdit() {
            __this__.edit.load("./app/plugins/scenePicture/edit.html", function () {
                __this__.edit.find(".btn").click(function() {
                    window.toggleSceneSelector(function(picture) {
                        console.log(picture);
                        __this__.source.props.sceneId = picture.sceneId;
                        __this__.source.props.name = picture.name;
                        __this__.source.props.tagType = picture.tagType;
                        __this__.source.props.cover = picture.cover;
                        __this__.source.props.roomNames = picture.roomNames;
                        __this__.source.props.styleNames = picture.styleNames;
                        __this__.source.props.praiseCount = picture.praiseCount;
                        __this__.source.props.goodsCount = picture.goodsCount;
                        refreshEdit(__this__.source.props);
                        __this__.refreshView();
                    });
                });
                refreshEdit(__this__.source.props);
            });
        };

        /**
         * 给edit.html组件绑定事件属性
         */
        function bundEvent() {

        };

        /**
         *
         * @param item
         */
        function refreshEdit(item) {
            __this__.edit.find(".name").text(item.name);
            __this__.edit.find(".cover").attr("src", item.cover);
            __this__.edit.find(".tagType").text(getTagTypeName(item.tagType));
            __this__.edit.find(".roomNames").text(item.roomNames);
            __this__.edit.find(".styleNames").text(item.styleNames);
            __this__.edit.find(".praiseCount").text(item.praiseCount);
            __this__.edit.find(".goodsCount").text(item.goodsCount);
        };
        renderer();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
