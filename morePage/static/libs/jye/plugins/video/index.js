(function(e$, $) {
	var plugin = e$.createPlugin();
	plugin.name = "video";
	plugin.alias = "视频";
	plugin.class = function(editModel, rootDom, editDom) {
		var __this__ = this;
		this.html = $("<div></div>");
		this.edit = $("<div></div>")
		this.source = {name:plugin.name, props:{content:""}};
		this.getJsonContent = function() {
			return source;
		};
		this.getHtmlContent = function() {
			return this.html;
		};
		this.setJsonContent = function(json) {
			this.source = json;
		};
		this.getEditHtml = function() {
			bundEvent();
			return this.edit;
		};

		this.activate = function() {
			
		};

		this.validate = function() {
			return null;
		}

		this.refreshView = function() {
			refreshShow();
		}

		function renderer() {
			__this__.html.empty();
			__this__.html.load("./app/plugins/video/show.html", function() {
				__this__.refreshView();
			});
		};

		function rendererEdit() {
			__this__.edit.load("./app/plugins/video/edit.html", function() {
				refreshEdit();
				bundEvent();
			});
		};

		function bundEvent() {
			//文本内容发生变化
			__this__.edit.find('textarea').bind('input propertychange',function () {
				__this__.source.props.content = $(this).val();
				refreshShow();
			});

		};

        function refreshEdit() {
			var item = __this__.source.props;
			__this__.edit.find("textarea").val(item.content);
        };

        function refreshShow() {
        	var videoDom = __this__.html.find(".video");
			var item = __this__.source.props;
        	if (editModel) {
				if (item.content) {
					videoDom.empty();
					videoDom.append(item.content);
					__this__.html.find("iframe").css("width","80%");
					__this__.html.find("iframe").css("height","250");

				} else {
					videoDom.empty();
					videoDom.append($("<span style='color: white;'>请输入视频代码</span>").addClass("video-edit-show"));
				}

        	} else {
				var content = item.content;
				videoDom.append(content);
				__this__.html.find("iframe").css("width","100%");
				__this__.html.find("iframe").css("height","250");
			}
        };

		renderer();
		editModel && rendererEdit();
		
	};
	e$.installPlugin(plugin);
})(jye, jQuery);