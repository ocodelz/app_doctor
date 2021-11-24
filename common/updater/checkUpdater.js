import {
	baseUrl,
	serverUrl,
	updateUrl
} from "@/service/ServerInfo.js"
import {
	formatTimeToStr,
	randomn
} from '@/common/utils/tools.js'
const updaterServerAddress = updateUrl + '/versioninfopwguarddoctor.txt?v=' + randomn(8)

function sliceSetup(androidLink, iosLink, latestId) {
	console.log(androidLink + ',' + iosLink)
	let downloadLink = ''
	let ready = false
	// 判断系统类型
	if (plus.os.name.toLowerCase() === 'android') {
		console.log('安卓系统')
		if (androidLink && androidLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
			console.log('发现下载地址')
			// 安卓：创建下载任务
			if (androidLink.match(RegExp(/.wgt/))) {
				console.log('确认wgt热更新包')
				downloadLink = androidLink
				ready = true
			} else {
				console.log('安卓推荐.wgt强制更新，.apk的强制更新请您自行修改程序')
			}
		} else {
			console.log('下载地址是空的，无法继续')
		}
	} else {
		//console.log('苹果系统')
		if (iosLink && iosLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
			//console.log('发现下载地址')
			// 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
			if (iosLink.match(RegExp(/.wgt/))) {
				///console.log('确认wgt热更新包')
				downloadLink = iosLink
				ready = true
			} else {
				//console.log('苹果只支持.wgt强制更新')
			}
		} else {
			//console.log('下载地址是空的，无法继续')
		}
	}
	if (ready) {
		//		console.log('任务开始')
		let downloadTask = uni.downloadFile({
			url: downloadLink,
			success: (res) => {
				if (res.statusCode === 200) {
					// 保存下载的安装包
					//console.log('保存安装包')
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: (res) => {
							const packgePath = res.savedFilePath
							// 保存更新记录到stroage，下次启动app时安装更新
							uni.setStorage({
								key: 'updated',
								data: {
									completed: false,
									packgePath: packgePath,
									versionid: latestId
								},
								success: () => {
									//									console.log('成功保存记录')
								}
							})
							// 任务完成，关闭下载任务
							//console.log('任务完成，关闭下载任务，下一次启动应用时将安装更新')
							downloadTask.abort()
							downloadTask = null
						}
					})
				}
			}
		})
	} else {
		//console.log('下载地址未准备，无法开启下载任务')
	}

}
export function checkUpdater(currentId, updaterPage) {
	console.log('checkUpdater.data=' + currentId + ',' + updaterPage + ',updateurl=' + updaterServerAddress);
	let _this = this;
	uni.downloadFile({
		url: updaterServerAddress, //仅为示例，并非真实的资源
		complete(res) {
			//			console.log('downloadFile:' + JSON.stringify(res));
			if (res.statusCode === 200) {

				console.log('下载成功');

				let tmpPath = res.tempFilePath
				let index = tmpPath.lastIndexOf("/");
				let fileName = tmpPath.substr(index + 1);
				let path = tmpPath.substr(0, index);
				console.log(fileName + ',' + path)

				plus.io.resolveLocalFileSystemURL(tmpPath, function(entry) {
					entry.file(
						function(file) {
							//读取文件内容
							let read = new plus.io.FileReader();
							read.onerror = function(res) {
								console.log('onerror=' + JSON.stringify(res))
							}
						
							read.onload = function(res) {

								let fileContent = JSON.parse(res.target.result);
								console.log('onloadend=文件内容' + JSON.stringify(fileContent))
								const latestId = fileContent.latest.info.id
								const method = fileContent.latest.method

                                console.log(currentId , latestId)
								if (!latestId) {
									console.log('当前没有发行版本')
									return;
								}
								if (currentId != latestId && method === 'force') {
									//console.log('确认强制更新，正在取得地址')
									//  如果需要背地（静默）热更新，获取下载地址
									//console.log('地址请求成功')

									const iosLink = fileContent.latest.info.iosLink
									const androidLink = fileContent.latest.info.androidLink
									sliceSetup(androidLink, iosLink, latestId);

								} else if (currentId != latestId) {
									console.log('检测到更新')
									uni.showModal({
										title: '发现新版本',
										content: '有新版本可用 (版本id:' + latestId + ')，请问您是否更新？',
										success: (res) => {
											if (res.confirm) {
												console.log('navigateTo:'+updaterPage)
												uni.navigateTo({
													url: updaterPage
												})
											} else if (res.cancel) {
												console.log('取消')
											}
										}
									})
								} else {
									//									console.log('现在是最新版本')
								}

							}

							read.readAsText(file, "UTF-8")
						}
					)
				})
			}
		}
	});
}
export function checkUpdaterForIos(current) {
	let _this = this;
	console.log('checkUpdaterForIos')
	uni.request({
		url: "https://itunes.apple.com/cn/lookup?id=1471975642"+"&v=" + randomn(8)
	}).then(d => {
		//#ifdef APP-PLUS
	
		plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {

				let appStoreVersion = d[1].data.results[0].version;
				let appVersion = wgtinfo.version;
				console.log(appVersion)
				current.appstoreversion = appStoreVersion;
				current.appcurrentversion=appVersion;
				current.appstoreupdatecontent= d[1].data.results[0].releaseNotes
				current.appstorereleasedate= d[1].data.results[0].currentVersionReleaseDate
				current.appstorereleasedate=current.appstorereleasedate.replace('T',' ').replace('Z',' ');
				
				if (appStoreVersion !== appVersion) {
					let appUrl = 'itms-apps://itunes.apple.com/cn/app/id1471975642?mt=8'; // XXXX为对应的AppID
					
					uni.navigateTo({
						url:"/pages/update/index"
					})
					
					// uni.showModal({
					// 	title: "检查更新",
					// 	content: "发现新版本,是否立即前往应用商店更新?",
					// 	confirmText: "立即更新",
					// 	showCancel: true,
					// 	cancelText: "忽略",
					// 	success: function(res) {
					// 		if (res.confirm) {
					// 			console.log("go")
					// 			plus.runtime.openURL(appUrl);
					// 		}
					// 	}
					// })
				}
			}
		)
			//#endif
	})
}


export function autoUpdate(currentid) {
	console.log(updaterServerAddress)
	// #ifdef APP-PLUS
	//plus.screen.lockOrientation('portrait-primary'); //竖屏正方向锁定
	const updated = uni.getStorageSync('updated'); // 尝试读取storage
	const versionid = updated.versionid;
	console.log(JSON.stringify(updated) )
	if (updated.completed === true) {
		// 如果上次刚更新过
		// 删除安装包及安装记录
		//console.log('安装记录被删除，更新成功');
		uni.removeSavedFile({
			filePath: updated.packgePath,
			success: res => {
				uni.removeStorageSync('updated');
			}
		});
	} else if (updated.completed === false) {
		uni.removeStorageSync('updated');

		plus.runtime.install(updated.packgePath, {
			force: true
		});
		uni.setStorage({
			key: 'updated',
			data: {
				completed: true,
				packgePath: updated.packgePath
			},
			success: res => {
				//console.log('成功安装上次的更新，应用需要重启才能继续完成');
				uni.setStorageSync('localDocVersionID', {
					id: versionid
				});
				//console.log('localVersionID已更新,' + versionid);
			}
		});
		uni.showModal({
			title: '提示',
			content: '配置已经修改,应用将重启!!', // + versionid,
			showCancel: false,
			complete: () => {
				plus.runtime.restart();
			}
		});
	} else {
		
		// 检查更新，参数：{ 当前版本号，跳转到更新页面的url }
		checkUpdater(currentid, '../../pages/update/index');
	}
	// #endif
}
