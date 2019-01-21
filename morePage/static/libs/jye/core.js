///	展示模式执行步骤
/// 1.注册rootDom id
/// 2.通过数据源还原doms
/// 3.生成rootDom
/// 4.渲染rootDom
/// 5.激活rootDom
/// 编辑模式执行步骤
/// 1.注册rootDom id, editDom id
/// 2.生成rootDom
/// 3.渲染rootDom
/// 4.点击插件,渲染editDom
/// 5.操作editDom中的实例属性
/// 6.获取JSON数据源
(function($){
	const jye = {};
	const e$ = jye;
	var $rootDom = null;
	var $editDom = null;
	var $editModel = false;
	var $insertInstanceAfter = null;
	var $source = {};
	jye.getPlugins = function() {
		return this.plugins;
	};

	/**
	 * 初始化
	 * @param  {[type]} rootDom [description]
	 * @param  {[type]} editDom [description]
	 * @return {[type]}         [description]
	 */
	jye.initByJson = function(params) {
		var defaultParams = {
			rootDom:"#rootDom",
			editDom:"#editDom",
			editModel:true,
			insertInstanceAfter:function(rowdom, instanceObject) {

			}
		};

		params = jQuery.extend(defaultParams, params);
		this.init(params.editModel, params.rootDom, params.editDom);
		$insertInstanceAfter = params.insertInstanceAfter;
	};

	/**
	 * 初始化
	 * @param  {[type]} rootDom [description]
	 * @param  {[type]} editDom [description]
	 * @return {[type]}         [description]
	 */
	jye.init = function(editModel, rootDom, editDom) {
		if (!rootDom) {
			throw "rootDom is null";
		}
		if (typeof rootDom === "string") {
			rootDom = $(rootDom);
		}
		$rootDom = rootDom;
		$rootDom.addClass("jye-dom-root");
		// 编辑模式
		if (editModel) {
			if (!editDom) {
				throw "editDom is null";
			}
			if (typeof editDom === "string") {
				editDom = $(editDom);
			}
			$editDom = editDom;
		}
		$editModel = editModel;
	};
	
	jye.createPlugin = function() {
		return {
			name: "default",
			alias: "default",
			/**
			 * 错误异常
			 * @param {[type]} error [description]
			 * @param {[type]} props [description]
			 */
			error: function(error, props, plugin) {
				this.error = error;
				this.props = props;
				this.plugin = plugin;
			},
			class: function(editModel, rootDom, editDom) {
				// 获取JSON
				this.getJsonContent = function() {};
				// 获取HTML
				this.getHtmlContent = function(editModel) {};
				// 设置JSON数据也	
				this.setJsonContent = function(json) {};
				// 获取编辑的HTML
				this.getEditHtml = function() {};
				// 激活
				this.activate = function() {};
				// 验证数据源是否完整
				this.validate = function() {};
			}
		};
	};

	jye.getJsonContent = function() {
		var jsonArray = [];
		for (var i = 0; i < this.instances.length; i++) {
			jsonArray.push(this.instances[i].instance.source);
		}
		$source.content = jsonArray;
		return $source;
	};

	// /**
	//  * 功能:还原属性编辑
	//  * @param jsonArray
 //     */
	// jye.revertPage = function(jsonArray) {
	// 	for (var i = 0; i < jsonArray.length; i++) {
	// 		var instanceJson = jsonArray[i];
	// 		var instanceObject = this.insertInstance(instanceJson.name);
	// 		instanceObject.instance.setJsonContent(instanceJson);
	// 	}
	// };

	/**
	 * 功能:还原属性编辑
	 * @param jsonArray
     */
	jye.revertPage = function(source) {
		$source = source || {content:[]};
		var jsonArray = $source.content;
		for (var i = 0; i < jsonArray.length; i++) {
			var instanceJson = jsonArray[i];
			var instanceObject = this.insertInstance(instanceJson.name);
			instanceObject.instance.setJsonContent(instanceJson);
		}

		if ($source.backgroundColor) {
			refreshBackgroundColor($source.backgroundColor);
		}

		if ($source.margin) {
			refreshMargin($source.margin);
		}
	};

	jye.installPlugin = function(plugin) {
		this.plugins.push(plugin);
	};

	/**
	 * 插入插件的实例
	 * @param  {[type]} name  [插件名称]
	 * @param  {[type]} index [位置]
	 * @return {[type]}       [description]
	 */
	jye.insertInstance = function(name, index) {
		var instanceObject = createInstance(name);
		if (index === undefined) {
			this.instances.push(instanceObject);
		} else {
			this.instances.splice(index, 0, instanceObject);
		}
		renderer(instanceObject);
		if ($source.backgroundColor) {
			refreshBackgroundColor($source.backgroundColor);
		}
		return instanceObject;
	};

	jye.clear = function() {
		this.instances = [];
		$rootDom.children().remove();
	};

	/**
	 * 交换位置
	 * @param  {[type]} oldIndex [description]
	 * @param  {[type]} newIndex [description]
	 * @return {[type]}     	 [description]
	 */
	jye.swapPosition = function(oldIndex, newIndex, refreshRootDom) {
		if (oldIndex == newIndex) {
			return;
		}
		if (Math.abs(newIndex - oldIndex) == 1) {
			jye.changePosition(oldIndex, newIndex, refreshRootDom);
			return;
		}
		if (oldIndex > newIndex) {
			oldIndex = oldIndex ^ newIndex;
			newIndex = oldIndex ^ newIndex;
			oldIndex = oldIndex ^ newIndex;
		}
		var oldInstance = this.instances[oldIndex];
		var newInstance = this.instances[newIndex];
		this.instances.splice(newIndex, 1, oldInstance);
		this.instances.splice(oldIndex, 1, newInstance);
		if (refreshRootDom) {
			var oldDom = $rootDom.children().eq(oldIndex); 
			var oldNDom = oldDom.next();					
			var newDom = $rootDom.children().eq(newIndex);	
			var newPDom = newDom.prev();					
			oldDom.insertAfter(newPDom);                   
			newDom.insertBefore(oldNDom);
		}
	};

	/**
	 * 改变位置
	 * @param  {[type]} oldIndex [description]
	 * @param  {[type]} newIndex [description]
	 * @return {[type]}     	 [description]
	 */
	jye.changePosition = function(oldIndex, newIndex, refreshRootDom) {
		if (oldIndex == newIndex) {
			return;
		}
		var oldInstance = this.instances[oldIndex];
		this.instances.splice(oldIndex, 1);
		this.instances.splice(newIndex, 0, oldInstance);
		if (refreshRootDom) {
			var oldDom = $rootDom.children().eq(oldIndex);
			var newDom = $rootDom.children().eq(newIndex);
			if (oldIndex > newIndex) {
				oldDom.insertBefore(newDom);
			} else {
				oldDom.insertAfter(newDom);
			}
			
		}
	};

	jye.next = function(instanceObject) {
		var index = this.instances.indexOf(instanceObject);
		if (index == this.instances.length - 1) {
			return false;
		}
		this.changePosition(index, index + 1, true);
		return true;
	};

	jye.prve = function(instanceObject) {
		var index = this.instances.indexOf(instanceObject);
		if (index == 0) {
			return false;
		}
		this.changePosition(index, index - 1, true);
		return true;
	};

	jye.deleteInstance = function(instanceObject) {
		if (instanceObject === undefined) {
			return;
		}
		var index = -1;
		if (typeof instanceObject === "object") {
			index = this.instances.indexOf(instanceObject);
		} else {
			index = parseInt(instanceObject);
		}
		this.instances.splice(index, 1);
		$rootDom.children().eq(index).remove();
		$editDom.empty();
		this.currentInstanceObject = null;
	};

	jye.activate = function() {
		for (var i = 0; i < this.instances.length; i++) {
			this.instances[i].instance.activate();
		}
	};

	jye.validate = function() {
		var errors = [];//plugin.error
		for (var i = 0; i < this.instances.length; i++) {
			if (this.instances[i].instance.validate) {
				var error = this.instances[i].instance.validate();
				if (error) {
					errors.push(error);
				}
			}
		}
		return errors;
	};

	// // 设置背景音乐
	// jye.setBackgroundMusic = function(musicUrl) {
	// 	$source.backgroundMusic = musicUrl;
	// };

	// 设置背景颜色
	jye.setBackgroundColor = function(color) {
		$source.backgroundColor = color;
		refreshBackgroundColor(color);
	};

	// 设置边距
	jye.setMargin = function(margin) {
		margin = $.extend({lm:0, rm:0, tm:0, bm:0}, margin);
		$source.margin = margin;
		refreshMargin(margin);
	};

	// 扩展属性
	jye.setExtend = function(extend) {
		$source.extend = extend;
	};

	jye.putExtend = function(extend) {
		if ($source.extend) {
			$source.extend = $.extend($source.extend, extend);
		} else {
			$source.extend = extend;
		}
	}

	jye.instances = [];
	jye.plugins = [];
	jye.currentInstanceObject = null;

	if (typeof window !== 'undefined') {
		window.jye = jye;
		window.e$ = jye;
	}

	// internal functions
	/**
	 * 渲染dom
	 * @param  {[type]} dom [description]
	 * @return {[type]}     [description]
	 */
	function renderer(instanceObject) {
		var dom = instanceObject.instance.getHtmlContent();
		$rootDom.append(dom);
		dom.addClass("jye-dom-row");
		if ($insertInstanceAfter) {
			$insertInstanceAfter(dom, instanceObject);
		}
		// 如果是编辑模式
		if ($editModel) {
			dom.click(function() {
				$(".jye-dom-selected").removeClass("jye-dom-selected");
				$(this).addClass("jye-dom-selected");
				jye.currentInstanceObject = instanceObject;
				$editDom.empty();
				$editDom.append(instanceObject.instance.getEditHtml());
			});
		}
	};

	/**
	 * 创建插件的实例
	 * @param  {[type]} name [插件名]
	 * @return {[type]}      [instanceObject]
	 */
	function createInstance(name) {
		var plugin = findPluginByName(name);
		var instance = new plugin.class($editModel, $rootDom, $editDom);		
		var instanceObject = {name:name, instance:instance, plugin:plugin};
		return instanceObject;
	};

	function findPluginByName(name) {
		for (var i = 0; i < jye.plugins.length; i++) {
			var plugin = jye.plugins[i];
			if (name == plugin.name) {
				return plugin;
			}
		}
		return null;
	};

	function refreshBackgroundColor(color) {
		$rootDom.css("background-color", color);
		$rootDom.find(".jye-dom-row").css("background-color", color);
	};

	function refreshMargin(margin) {
		$rootDom.css("padding-left", margin.lm + "px");
		$rootDom.css("padding-right", margin.rm + "px");
		$rootDom.css("padding-top", margin.tm + "px");
		$rootDom.css("padding-bottom", margin.bm + "px");
	};

})(jQuery);
