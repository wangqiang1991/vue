(function(e$, $) {
	var plugin = e$.createPlugin();
	plugin.name = "text";
	plugin.alias = "文字";
	plugin.class = function(editModel, rootDom, editDom) {
		var __this__ = this;
		this.html = $("<div></div>");
		this.edit = $("<div></div>")
		this.source = {name:plugin.name, props:{text:"请输入文字内容.", fontSize:"16px", align:"left"}};
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
			__this__.html.load("./app/plugins/text/show.html", function() {
				__this__.refreshView();
			});

		};

		function rendererEdit() {
			__this__.edit.load("./app/plugins/text/edit.html", function() {
				refreshEdit();
				bundEvent();
			});
		};


		/**
		 * 功能:给属性编辑区域的相关组件绑定事件
		 */
		function bundEvent() {
			//文本内容发生变化
			__this__.edit.find('textarea').bind('input propertychange',function () {
				__this__.source.props.text = $(this).val() + "<br>";
				refreshShow();
			});
			//字体大小发生了变化
			__this__.edit.find("select:first").change(function() {
				__this__.source.props.fontSize = $(this).val();
				refreshShow();
			});
			//文本对齐方式发生了变化
			__this__.edit.find("select:last").change(function() {
				__this__.source.props.align = $(this).val();
				refreshShow();
			});
			//字体颜色发生了变化
			__this__.edit.find('.demo').bind('input propertychange',function () {
				__this__.source.props.textColor = $(this).val();
				__this__.edit.find('.minicolors-swatch-color').css("background-color",$(this).val());
				refreshShow();
			});

			__this__.edit.find('.demo').each( function() {
				//
				// Dear reader, it's actually very easy to initialize MiniColors. For example:
				//
				//  $(selector).minicolors();
				//
				// The way I've done it below is just for the demo, so don't get confused
				// by it. Also, data- attributes aren't supported at this time...they're
				// only used for this demo.
				//
				$(this).minicolors({
					control: $(this).attr('data-control') || 'hue',
					defaultValue: $(this).attr('data-defaultValue') || '',
					inline: $(this).attr('data-inline') === 'true',
					letterCase: $(this).attr('data-letterCase') || 'lowercase',
					opacity: $(this).attr('data-opacity'),
					position: $(this).attr('data-position') || 'bottom left',
					change: function(hex, opacity) {
						if( !hex ) return;
						if( opacity ) hex += ', ' + opacity;
						try {
							console.log(hex);
						} catch(e) {}
					},
					theme: 'bootstrap'
				});
			});
		};

		/**
		 * 功能:刷新属性编辑区域
		 */
        function refreshEdit() {
			var item = __this__.source.props;
			__this__.edit.find("textarea").val(item.text.replace("<br>",""));
			__this__.edit.find("select:first").val(item.fontSize);
			__this__.edit.find("select:last").val(item.align);

        };

		/**
		 * 功能:刷新组件展示区域
		 */
        function refreshShow() {
        	var spanDom = __this__.html.find(".text-text > span");
			var item = __this__.source.props;
			var text = item.text;
			var fontColor = item.textColor;
			if (!fontColor) {
				fontColor = '#000000';
			}
			text = text.replace(/\n|\r/g, '<br>');
            text = text.replace(/ /g, '&nbsp;');
			spanDom.html(text);
			spanDom.css("font-size", item.fontSize);
			spanDom.parent().css("text-align", item.align);
			spanDom.css("color",fontColor);
        };

		renderer();
		editModel && rendererEdit();
		
	};
	e$.installPlugin(plugin);
})(jye, jQuery);