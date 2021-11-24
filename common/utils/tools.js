// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}   

export function formatTimeToStr(times, pattern) {
    var d = new Date(times).Format("yyyy-MM-dd hh:mm:ss");
    if (pattern) {
        d = new Date(times).Format(pattern);
    }
    return d.toLocaleString();
}

// RegExp(pattern, attributes)attributes-gim(全局匹配、区分大小写的匹配、多行匹配)
export function randomn(n) {
  if (n > 21) return null
  var re =new RegExp("(\\d{" + n + "})(\\.|$)")
  var num = (Array(n-1).join(0) + Math.pow(10,n) * Math.random()).match(re)[1]
  return num
  // Array(n > num ? (n - ('' + num).length +1) : 0).join(0) + num 补位
}


//  type: (String 类型) 按钮样式
//  运行环境中内置按钮样式直接使用， 内置样式忽略fontSrc和text属性。 可取值： "forward" - 前进按钮； "back" - 后退按钮； "share" - 分享按钮； "favorite" - 收藏按钮； "home" -
//  	主页按钮； "menu" - 菜单按钮； "close" - 关闭按钮； "none" - 无样式。 默认值为无样式（ "none"），
//  需通过text属性设置按钮上显示的内容、 通过fontSrc属性设置使用的字体库。
// 
//  background: (String 类型) 按钮的背景颜色
//  仅在标题栏type = transparent时生效， 当标题栏透明时按钮显示的背景颜色。 可取值# RRGGBB和rgba格式颜色字符串， 默认值为灰色半透明。
// 
//  badgeText: (String 类型) 按钮上显示的角标文本
//  最多显示3个字符， 超过则显示为...。
// 
//  	color: (String 类型) 按钮上文字颜色
//  可取值： "#RRGGBB"
//  格式字符串， 如 "#FF0000"
//  表示绘制红色返回键； "rgba(R,G,B,A)"，
//  其中R / G / B分别代表红色值 / 绿色值 / 蓝色值， 正整数类型， 取值范围为0 - 255， A为透明度， 浮点数类型， 取值范围为0 - 1（ 0 为全透明， 1 为不透明）， 如 "rgba(255,0,0,0.5)"，
//  表示红色半透明。 默认值为窗口标题栏控件的标题文字颜色。
// 
//  colorPressed: (String 类型) 按下状态按钮文字颜色
//  可取值： "#RRGGBB"
//  格式字符串， 如 "#FF0000"
//  表示绘制红色返回键； "rgba(R,G,B,A)"，
//  其中R / G / B分别代表红色值 / 绿色值 / 蓝色值， 正整数类型， 取值范围为0 - 255， A为透明度， 浮点数类型， 取值范围为0 - 1（ 0 为全透明， 1 为不透明）， 如 "rgba(255,0,0,0.5)"，
//  表示红色半透明。 默认值为color属性值自动调整透明度为0 .3。
// 
//  float: (String 类型) 按钮在标题栏上的显示位置
//  可取值： "right" - 在标题栏中靠右排列显示； "left" - 在标题栏中靠左侧排列显示（ 在返回键后）。 默认值为 "right"。
// 
//  fontWeight: (String 类型) 按钮上文字的粗细
//  可取值： "normal" - 标准字体； "bold" - 加粗字体。 默认值为 "normal"。

// fontSize: (String 类型 )按钮上文字大小
// 可取值：字体高度像素值，数字加"px"格式字符串，如"22px"。 窗口标题栏为透明样式（type="transparent"）时，默认值为"22px"； 窗口标题栏为默认样式（type="default"）时，默认值为"27px"。
// 
// fontSrc: (String 类型 )按钮上文字使用的字体文件路径
// 字体文件路径支持以下类型： 相对路径 - 相对于当前页面的host位置，如"a.ttf"，注意当前页面为网络地址则不支持； 绝对路径 - 系统绝对路径，如Android平台"/sdcard/a.ttf"，此类路径通常通过其它5+ API获取的； 扩展相对路径URL(RelativeURL) - 以"_"开头的相对路径，如"_www/a.ttf"； 本地路径URL - 以“file://”开头，后面跟随系统绝对路径。
// 
// onclick: (WebviewCustomButtonCallback 类型 )按钮点击后触发的回调函数
// 回调函数中将返回此JSON对象。
// 
// redDot: (Boolean 类型 )按钮上是否显示红点
// 设置为true则显示红点，false则不显示红点。默认值为false。 注意：当设置了角标文本时红点不显示。
// 
// select: (Boolean 类型 )是否显示选择指示图标
// 设置为true则显示选择指示图标（向下箭头），颜色与文字颜色一致； false则不显示。默认值为false。
// 
// text: (String 类型 )按钮上显示的文字
// 推荐使用一个字符，超过一个字符可能无法正常显示，使用字体图标时unicode字符表示必须'\u'开头，如"\ue123"（注意不能写成"\e123"）。
// 
// width: (String 类型 )按钮的宽度
// 可取值： "*px" - 逻辑像素值，如"10px"表示10逻辑像素值，按钮的内容居中显示； "auto" - 自定计算宽度，根据内容自动调整按钮宽度。 默认值为"44px"（适合字体图标）。	
export  function setNavigateStyle(routepath, btnindex, navStyle) {
	//#ifdef APP-PLUS
	let pages = getCurrentPages(); //pages.length - 1
	let nIndex = pages.length - 1;
	if (nIndex < 0) {
		nIndex = 0;
	}
	let page = pages[nIndex];
//	console.log('page', page.route, routepath)

	if (!page.route.match(routepath)) {
//		console.log('setNavigateStyle', 'exit')
		return;
	}

	let curWebview = page.$getAppWebview();
	//curWebview.setTitleNViewButtonBadge(btnindex,'123')
	curWebview.setTitleNViewButtonStyle(btnindex, navStyle);
	//#endif	

}
