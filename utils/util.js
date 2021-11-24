const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 将字符串转换成ArrayBufer
 */
const string2buffer = str => {
	let val = ""
	if (!str) return;
	let length = str.length;
	let index = 0;
	let array = []
	while (index < length) {
		array.push(str.substring(index, index + 2));
		index = index + 2;
	}
	val = array.join(",");
	// 将16进制转化为ArrayBuffer
	return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function(h) {
		return parseInt(h, 16)
	})).buffer
}
//十六进制转ASCII码
const hexcharcode2Str = hexstr => {
	var trimedStr = hexstr.trim();
	var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
	var len = rawStr.length;
	if (len % 2 !== 0) {
		alert("存在非法字符!");

		return "";
	}
	var curCharCode;
	var resultStr = [];
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16);
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");
}

/**
 * 将ArrayBuffer转换成字符串
 */
const ab2hex = buffer => {
	var hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('');
}

const  hexToDec=hex=>{
    return parseInt(hex.replace("#",""),16);
}

const  decToHex=dec=>{
    hex = (dec).toString(16);
    while(hex.length<6){
        hex = "0" + hex;
    }
    return "#" + hex;
}

const getFtSystemTime=function(){
	let Time = new Date();
	let y = Time.getFullYear();
	let m = (Time.getMonth() + 1) < 10 ? '0' + (Time.getMonth() + 1) : (Time.getMonth() + 1);
	let d = Time.getDate() < 10 ? '0' + Time.getDate() : Time.getDate();
	let hh = Time.getHours() < 10 ? '0' + Time.getHours() : Time.getHours();
	let mm = Time.getMinutes() < 10 ? '0' + Time.getMinutes() : Time.getMinutes();
	let ss = Time.getSeconds() < 10 ? '0' + Time.getSeconds() : Time.getSeconds();
	
	return  y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
}
const  secoundtoMs=function(i){
	let minute = parseInt((i) / 60);
	let secound = i - minute * 60; //(i/60).toString().split('.')[1].substr(2);
	return minute.toString()+'m'+secound.toString()+'s'
}

module.exports = {
	formatTime: formatTime,
	string2buffer: string2buffer,
	ab2hex: ab2hex,
	hexToDec:hexToDec,
	decToHex:decToHex,
	hexcharcode2Str: hexcharcode2Str,
	getFtSystemTime:getFtSystemTime,
	secoundtoMs:secoundtoMs
}
