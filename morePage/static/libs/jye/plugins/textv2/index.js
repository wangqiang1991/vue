(function(e$, $) {
	var plugin = e$.createPlugin();
	plugin.name = "text_v2";
	plugin.alias = "文字";
	plugin.class = function(editModel, rootDom, editDom) {
		var __this__ = this;
		this.html = $("<div></div>");
		this.edit = $("<div></div>");
		this.timestamp;
		this.source = {name:plugin.name, props:{text:"请输入文字内容."}};
		this.getJsonContent = function() {
			return this.source;
		};
		this.getHtmlContent = function() {
			return this.html;
		};
		this.setJsonContent = function(json) {
			this.source = json;
		};
		this.getEditHtml = function() {
			bundEvent();
			refreshEdit();
			setTimeout(this.renderEditor, 500);
			return this.edit;
		};

		this.renderEditor = function() {
			var firstLoad = $("textarea#" + __this__.timestamp).size() > 0;
			__this__.edit.find('#' + __this__.timestamp).show();
			var editor = UE.getEditor(__this__.timestamp,{
	        	serverUrl: '/server/ueditor/controller.php',
	            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
	            toolbars:[['Bold','italic', 'underline', 'strikethrough', 'fontfamily', 'fontsize','forecolor', 'backcolor','emotion'],
	            ['justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'lineheight', 'rowspacingtop', 'rowspacingbottom', 'link', 'horizontal']],
	            //focus时自动清空初始化时的内容
	            autoClearinitialContent:true,
	            //关闭字数统计
	            wordCount:false,
	            'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36, 48, 60, 72, 88, 100],
	            //关闭elementPath
	            elementPathEnabled:false,
	            //默认的编辑区域高度
	            initialFrameHeight:300,
	            lang:"zh-cn",
	            //更多其他参数，请参考ueditor.config.js中的配置项
	            initialFrameWidth:$("#edit_dom").width() * 0.95,  //初始化编辑器宽度,默认1000
        		initialFrameHeight:400,  //初始化编辑器高度,默认320
        		autoHeightEnabled:false,
        		enableAutoSave:false,
        		saveInterval:999999999,
        		initialContent:"请输入文字内容."
	        });
	        editor.addListener('selectionchange', function() {
	        	var text = editor.getContent();
	        	if (text === "" || text === "<p>请输入文字内容.</p>") {
	        		return;
	        	}
	            __this__.source.props.text = text;
				refreshShow();
	        });

	        if(firstLoad) {
	        	setTimeout(function() {
	        		__this__.refreshContent(editor);
	        	}, 500);
	        } else {
	        	__this__.refreshContent(editor);
	        }

		}

		this.refreshContent = function(editor) {
			try {
	        	editor.setContent(__this__.source.props.text);
	        } catch(err) {

	        }
		}

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
			__this__.html.load("/static/libs/jye/plugins/textv2/show.html", function() {
				__this__.refreshView();
			});

		};

		function rendererEdit() {
			__this__.edit.load("./app/plugins/textv2/edit.html", function() {
				__this__.timestamp = new Date().valueOf() + "";
				__this__.edit.find("textarea").attr("id", __this__.timestamp);
				refreshEdit();
				bundEvent();
			});
		};


		/**
		 * 功能:给属性编辑区域的相关组件绑定事件
		 */
		function bundEvent() {

		};

		/**
		 * 功能:刷新属性编辑区域
		 */
        function refreshEdit() {
			// var item = __this__.source.props;
			// __this__.edit.find("textarea").val(item.text);
        };

		/**
		 * 功能:刷新组件展示区域
		 */
        function refreshShow() {
        	var spanDom = __this__.html.find(".text-text-2 > span");
			var item = __this__.source.props;
			var text = item.text;
			spanDom.html(text);
        };

		renderer();
		editModel && rendererEdit();

	};
	e$.installPlugin(plugin);
})(jye, jQuery);
