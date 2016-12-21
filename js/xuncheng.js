/* 基本类型拓展，别冲突了哦  */
Date.prototype.taDateFormat = function(format) {
	// --格式化时间
	// 抽离时间的各个单位
	var obj = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	// --替换表达式
	if(/(y+)/.test(format)) { // 由于年份是四位，所以单独抽离
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var key in obj) { // 提取时间的其他单位，并组装
		if(new RegExp("(" + key + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? obj[key] : ("00" + obj[key]).substr(("" + obj[key]).length));
		}
	}
	return format;
}

/* 寻城项目工具js */
$.xuncheng = {
	session: {
		goodsSize: 'XC-Goods-Data-Size',
		goodsPosition: 'XC-Goods-Position',
	},
	load: function(msg) { // 页面加载开始
		var msgTxt = msg || '数据加载中...';
		var $load = $('#xc-modal-loading');
		if(!$load.length) {
			var html = [];
			html.push('<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="xc-modal-loading">');
			html.push('<div class="am-modal-dialog">')
			html.push('<div class="am-modal-hd">' + msgTxt + '</div>')
			html.push('<div class="am-modal-bd">')
			html.push('<span class="am-icon-spinner am-icon-spin"></span>')
			html.push('</div>')
			html.push('</div>')
			html.push('</div>')
			$load = $(html.join('')).appendTo('body');
		}
		$load.modal();
	},
	loadEnd: function() { // 页面加载完毕
		$('#xc-modal-loading').modal('close')
	},
	back: function() {	// 返回上一页
		window.history.go(-1)
	},
	backTop: function(scroll) { // 返回顶部
		var $backTop = $('#xc-back-top');
		if(scroll > 500) {
			if(!$backTop.length) {
				$backTop = $('<a href="javascript: $.xuncheng.scrollTop();" title="回到顶部" class="animated fadeInUp xc-back-top xc-b" id="xc-back-top"><i class="iconfont icon-fanhuidingbu "></i></a>').appendTo('body');
			}
			$backTop.show();
		} else {
			$backTop.hide();
		}
	},
	scrollTop: function() {
		$('html, body').scrollTop(0)
	},
	share: function() {
		$.DialogFx.alert({
			content: '点击微信右上角菜单功能进行分享'
		})
	},
	toDecimal2: function(x) { // 始终保存2位小数
		var f = parseFloat(x);
		if(isNaN(f)) {
			return false;
		}
		var f = Math.round(x * 100) / 100;
		var s = f.toString();
		var rs = s.indexOf('.');
		if(rs < 0) {
			rs = s.length;
			s += '.';
		}
		while(s.length <= rs + 2) {
			s += '0';
		}
		return s;
	},
	isLogin: function(){
		var loginStore = $.AMUI.store.get('XCLOGIN');
		if(loginStore) {
			return true;
		}else{
			$.DialogFx.alert({content: '您还未登录，请先登录', end: function(){
				window.location.href = './login.html'
			}})
			setTimeout(function(){
				window.location.href = './login.html'
			}, 2000)
			
			return false;
		}
	}
}

// 获取系统信息
$.xuncheng.getSystem = function() {
	var agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
	var system = 'PC';
	agents.forEach(function(value) {
		if(navigator.userAgent.indexOf(value) > 0) {
			system = value;
		}
	})
	return system.trim();
}

// 获取随机数
$.xuncheng.getRandom = function(min, max) {
	/*
	 * 不传参返回随机数
	 * 传递一个数字返回当前位数的随机数
	 * 		$.getRandom(3) = nnn
	 * 传递二个数字返回范围内的随机数
	 * */
	if(min && !max) {
		var str = '9';
		var str1 = '1'
		$.each(new Array(min), function(i) {
			str += '9';
			str1 += '0';
		});
		str = parseInt(str) / 10;
		str1 = parseInt(str1) / 10;
		return parseInt(Math.random() * (str - str1 + 1) + str1)
	} else if(min || min == 0 && max) {
		return parseInt(Math.random() * (max - min + 1) + min)
	} else {
		return parseInt(Math.ceil(Math.random() * (new Date).getTime()))
	}
}

// 时间格式
$.xuncheng.getTime = function(options) {
	/* option == 
	 * option 		type		value
	 * 	timestamp	Boolean		时间戳参数
	 * 	timeFormat	String		时间格式
	 * 	
	 * 	传入type 后则是获取时间间隔值
	 * 	type		after		后 (默认)
	 * 				before		前
	 * 
	 * 	value 		number 		时间间隔
	 * 
	 * 	select		minute		分钟
	 * 				day			天
	 * */

	var option = options || false;
	var time = false;
	if(typeof option == 'object') {
		if(option.hasOwnProperty("type")) {
			// 如果具备 type 参数则是获取时间间隔值
			var newOption = $.extend(true, {
				value: 5,
				select: 'minute',
				type: 'after'
			}, option);
			var interTimes = parseInt(newOption.value) * 60 * 1000;
			var newDate;

			// TODO 暂未处理获取传参后的时间间隔
			if(newOption.type == 'after') {
				newDate = new Date(Date.parse(new Date()) + interTimes);
			} else {
				newDate = new Date(Date.parse(new Date()) - interTimes);
			}
			time = newDate.taDateFormat(option.timeFormat || "yyyy-MM-dd hh:mm:ss");
		} else if(option.hasOwnProperty("timestamp")) {
			// 参数包含时间戳参数时
			time = new Date(parseInt(option.timestamp)).taDateFormat(option.timeFormat || "yyyy-MM-dd hh:mm:ss");
		} else if(option.hasOwnProperty("timeFormat")) {
			// 参数只具备时间格式参数时
			time = new Date().taDateFormat(option.timeFormat);
		}
	} else if(typeof option == 'boolean') {
		//传入 option 为 true 时返回 object ，否则返回 String
		if(option) {
			var _date = new Date();
			time = {
				"y": _date.getFullYear(),
				"M": _date.getMonth() + 1,
				"d": _date.getDate(),
				"h": _date.getHours(),
				"m": _date.getMinutes(),
				"s": _date.getSeconds(),
				"ms": _date.getMilliseconds()
			};
		} else {
			time = new Date().taDateFormat("yyyy-MM-dd hh:mm:ss");
		}
	}
	return time
}

// 获取路径参数
$.xuncheng.getUrlParam = function(key, url) {
	/**
	 * 获取url参数值
	 * @param key 需要获取的参数
	 * @param url 传递域名
	 * @return string
	 * @demo gs.getUrlParam(null,"key")
	 * @demo gs.getUrlParam(xx.com?id=1&name=22,"id")
	 */
	var newUrl = url || window.location;
	newUrl = decodeURI(newUrl);
	var params = {};
	var arr = newUrl.split("?");
	if(arr.length <= 1) {
		return params;
	}
	arr = arr[1].split("&");
	for(var i = 0, l = arr.length; i < l; i++) {
		var a = arr[i].split("=");
		params[a[0]] = a[1];
	}
	return key ? params[key] : params;
}

// 公用 js 初始化
$(function() {
	// 去除点击 300ms延时
	FastClick.attach(document.body);

	$.fn.ripple = function(event) {
		var $elm = this;
		var elmLeft = $elm.offset().left;
		var elmTop = $elm.offset().top;
		var elmWidth = $elm.width();
		var elmHeight = $elm.height();
		if(elmWidth >= elmHeight) {
			elmHeight = elmWidth;
		} else {
			elmWidth = elmHeight;
		}
		var x = event.pageX - elmLeft - elmWidth / 2;
		var y = event.pageY - elmTop - elmHeight / 2;

		var _style = 'width:' + elmWidth + 'px;height:' + elmHeight + 'px;top:' + y + 'px;left:' + x + 'px;';
		var $rippleSpan = $('<span class="ta-ripple-span" style="' + _style + '"></span>').appendTo($elm)
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oAnimationEnd animationend', function() {
				$rippleSpan.remove();
			});

		return $elm;
	}

	var $body = $('body');

	$body.on('click', '.ta-ripple', function(event) {
		$(this).ripple(event);
	}).on('focus', 'input', function() {
		mobileInputCover(this)
	}).on('click', 'textarea', function() {
		mobileInputCover(this)
	})

	// 解决移动端遮盖输入框
	function mobileInputCover($elm) {
		if($.getSystem() != 'PC') { // 解决移动端遮盖输入框事件
			$(window).one('resize', function() {
				$elm.scrollIntoView()
			})
		}
	}

	$(window).on('scroll', function() {
		$.xuncheng.backTop($(this).scrollTop())
	});

	// 滚动加载
	var $footerLazy = $('#xc-footer-lazy');

	if($footerLazy.length) {
		// 监听滚动数据加载完毕事件
		$footerLazy.on('lazy.end', function() {
			$footerLazy.data('xcLazy', true)
		}).trigger('lazy.end');

		$(window).on('scroll', function() {
			if($footerLazy.data('xcLazy')) {
				var $this = $(this);
				var winStop = $this.scrollTop() + $this.height();
				if(winStop > $footerLazy.offset().top) {
					// 触发事件并设置滚动监听事件失效
					$footerLazy.data('xcLazy', false).trigger('lazy.open');
				}
			}
		});
	}

});

/* 弹窗组件 */
$(function() {
	function DialogFx($el, options) {
		this.$el = $el;
		this.options = options;
		this.$overlay = this.$el.find('.xc-dialog-overlay')
		this.$confirmBtn = this.$el.find('[data-dialog-confirm]');
		this.$cancelBtn = this.$el.find('[data-dialog-cancel]');
		this._initEvents();
		this.open()
	}
	// 绑定事件
	DialogFx.prototype._initEvents = function() {
			var self = this;
			self.$confirmBtn.on('click', function(e) {
				self.options.confirm(self)
				self.close()
			})
			self.$cancelBtn.on('click', function(e) {
				self.options.cancel(self)
				self.close()
			})
			self.$overlay.on('touchstart', function(e) {
				self.close()
			})
		}
		// 打开
	DialogFx.prototype.open = function() {
			this.$el.addClass('xc-dialog-open')
			this.options.open(this)
		}
		// 关闭
	DialogFx.prototype.close = function() {
		var self = this;
		var xdContent = self.$el.find('.xc-dialog-content')

		if($.isArray(self.options.anim)) {
			xdContent.removeClass(self.options.anim[0]).addClass(self.options.anim[1])
				.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					self.$el.remove()
				})
		} else {
			self.$el.removeClass('xc-dialog-open').addClass('xc-dialog-close')
			xdContent.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				self.$el.remove()
			})
		}
		self.options.end(self)
	}

	/*
	 * options
	 * title	标题
	 * content	内容
	 * anim		动画效果 0-5 或者 使用animated ['in','out']
	 * open		打开回调
	 * end		关闭回调
	 * confirm	确定回调
	 * cancel	取消回调
	 * */
	$.DialogFx = {
		anim: ['susan', 'sandra', 'don', 'ken', 'alex'],
		init: function(options) {
			var animArr = $.DialogFx.anim;
			var opt = $.extend(true, {
				title: '提示',
				content: '提示内容',
				anim: 2,
				open: function() {
					return false;
				},
				end: function() {
					return false;
				},
				confirm: function() {
					return false;
				},
				cancel: function() {
					return false;
				}
			}, options);

			var xdialogAnim = '';
			var xdContetAnim = '';
			if($.isArray(opt.anim)) {
				xdContetAnim = 'animated ' + opt.anim[0]
			} else {
				if(opt.anim >= animArr.length) {
					console.error('DialogFx：没有找到的动画效果')
					return false;
				} else {
					xdialogAnim = 'xc-dialog-' + animArr[opt.anim]
				}
			}
			return {
				opt: opt,
				xdialogAnim: xdialogAnim,
				xdContetAnim: xdContetAnim
			}

		}
	};

	$.DialogFx.alert = function(options) {
		var newOpt = $.DialogFx.init(options);
		var html = [];
		html.push('<div class="xc-dialog ' + newOpt.xdialogAnim + ' ">')
		html.push('<div class="xc-dialog-overlay"></div>')
		html.push('<div class="xc-dialog-content ' + newOpt.xdContetAnim + ' ">')
		html.push('<div class="am-modal-dialog">');
		//		html.push('<div class="am-modal-hd">' + newOpt.opt.title + '</div>');
		html.push('<div class="am-modal-bd">' + newOpt.opt.content + '</div>');
		html.push('<div class="am-modal-footer"><span class="am-modal-btn" data-dialog-confirm>确定</span></div>');
		html.push('</div>');
		html.push('</div>')
		html.push('</div>')
		return new DialogFx($(html.join('')).appendTo('body'), newOpt.opt)
	}

	$.DialogFx.confirm = function(options) {
		var newOpt = $.DialogFx.init(options);
		var html = [];
		html.push('<div class="xc-dialog ' + newOpt.xdialogAnim + ' ">')
		html.push('<div class="xc-dialog-overlay"></div>')
		html.push('<div class="xc-dialog-content ' + newOpt.xdContetAnim + ' ">')
		html.push('<div class="am-modal-dialog">');
		//		html.push('<div class="am-modal-hd">' + newOpt.opt.title + '</div>');
		html.push('<div class="am-modal-bd">' + newOpt.opt.content + '</div>');
		html.push('<div class="am-modal-footer">');
		html.push('<span class="am-modal-btn" data-dialog-cancel>取消</span>');
		html.push('<span class="am-modal-btn" data-dialog-confirm>确定</span>');
		html.push('</div>');
		html.push('</div>')
		html.push('</div>')

		return new DialogFx($(html.join('')).appendTo('body'), newOpt.opt)
	};

});

/*$(function(){
	var $videoBox = $('#xc-video-box');
	var $videoPlay = $videoBox.children('.xc-video-play');
	var $video = $videoBox.children('.xc-video');
	var _video = $video[0];
	$videoBox.on('click', function(){
		_video.play()
	});
	
	$video.on('playing', function() {
	  	$videoBox.addClass('play')
	})
})
*/