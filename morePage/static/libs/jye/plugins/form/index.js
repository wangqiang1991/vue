(function(e$, $) {
	var plugin = e$.createPlugin();
	plugin.name = "form";
	plugin.alias = "表单";
	plugin.class = function(editModel, rootDom, editDom) {
		var __this__ = this;
		this.html = $("<div></div>");
		this.edit = $("<div></div>")
		this.source = {name:plugin.name, props:{}};
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
			return this.edit;
		};

		this.activate = function() {
			
		};

		this.validate = function() {
			return null;
		}

		this.refreshView = function() {
			if (editModel) {
				__this__.html.find('input[type!="submit"]').attr("readonly", true);
				__this__.html.find('select').attr("disabled", true);
				__this__.html.find('input[type="submit"]').attr("disabled", true);

			} else {
				// debugger;
				var cid = getUrlParam('a');
				var source = getUrlParam('s');
				var userId = (source == 'ext') ? getUrlParam('extu') : getUrlParam('user_id');
        var projectId = getUrlParam('project_id');
        if (!cid || !source) {
          console.log("公司ID和来源不能为空");
          __this__.html.find('.loginbox').prepend('<span style="color:red;">公司ID和来源不能为空<span>');
        } else {
          __this__.html.find('#c').val(cid);
          __this__.html.find('#s').val(source);
          __this__.html.find('#u').val(userId);
          __this__.html.find('#p').val(projectId);
        }
			}
		}

		//获取url中的参数
	    function getUrlParam(name) {
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	        if (r != null) return unescape(r[2]); return null; //返回参数值
	    }

		function renderer() {
			__this__.html.empty();
			__this__.html.load("./app/plugins/form/show.html", function() {
				__this__.refreshView();
			});
		};

		function rendererEdit() {
			__this__.edit.load("./app/plugins/form/edit.html", function() {
				
			});
		};

		renderer();
		editModel && rendererEdit();
		
	};
	e$.installPlugin(plugin);
})(jye, jQuery);
