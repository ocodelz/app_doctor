<template>
	<view class="flex-column">
		<view class="content">
			<image class="logo imgloading" src="../../static/logos/8080.png" />
			<view class="mainInfo">
				<text class="title">{{ info }} | {{ Minfo }}</text>
				<text class="tip">\n{{ Mtip }}</text>
			</view>
			<text class="line" />
		</view>
		<view class="content">
			<view class="infoContentTitle">
				<image class="infoPic imgloading" src="../../static/update/info-circle.png" />
				<text class="infoTitle">功能摘要</text>
			</view>
			<view v-if="bShowAppStoreUptCont" style="width: 50%;font-size: small; margin-top: 5upx;">
				<view v-if="bGotoAppStore" style="color: #007AFF; font-size:small;margin-bottom: 5upx;">
					<text>发现新版本:V{{ appStoreVersion }}</text>
				</view>
				<view>
					<view style="color: #007AFF; font-size:small;margin-bottom: 5upx;">发布时间:{{ appStoreReleasedate }}</view>
					<textarea auto-height disabled :value="appStoreUpdateContent"></textarea>
				</view>
			</view>

			<view v-if="!bShowAppStoreUptCont" class="infoContent">
				<text class="updateInfo">{{ updateInfo }}</text>
			</view>
			<view style="border-top: #007AFF;font-size: small; border-width: thick;margin-top: 15upx;">
				<view><text class="line" /></view>
				<view v-show="bGotoAppStore" style="text-align: center;">
					<button :disabled="!bGotoAppStore" size="mini" @click="gotoAppStore" type="primary">立即更新</button>
				</view>
				<view v-show="!bGotoAppStore" style="text-align: center;">
					<button size="mini" v-if="!startProgress && !currentIsLatest" type="primary" @tap="handleUpdate()">立即更新</button>
				</view>
			</view>
			
		</view>
		<view class="content" v-if="!currentIsLatest">
			<view class="infoContentTitle">
				<image class="infoPic imgloading" src="../../static/update/sync.png" />
				<text class="infoTitle">更新大小</text>
				<text class="updateInfo">{{ packgeSize }}</text>
			</view>
			<!-- <view class="infoContent">
				
			</view> -->
		</view>
		<view class="minorContent bottom_aera">
			<view v-if="startProgress && !currentIsLatest" class="smallTitle">
				<text>下载进度:{{ downloadProgress }}%</text>
				<progress :percent="downloadProgress" stroke-width="4" />
			</view>

			<!-- 	<button style="width :400upx;line-height: 80upx; font-size: 30upx;height: 80upx;" v-if="!startProgress && !currentIsLatest" type="primary" @tap="handleUpdate()">
				立即更新
			</button> -->
			<!-- <button style="line-height: 80upx; width :400upx;font-size: 30upx;height: 80upx;" v-if="currentIsLatest" :loading="buttonLoading" type="primary" @tap="getLatest()">
				检查更新
			</button> -->
		</view>
	</view>
</template>

<script>
import { baseUrl, serverUrl, updateUrl } from '@/service/ServerInfo.js';
const updaterServerAddress = updateUrl + '/versioninfopwguarddoctor.txt';
export default {
	components: {},
	data() {
		return {
			bGotoAppStore: false,
			bShowAppStoreUptCont: false,
			appStoreVersion: '',
			appStoreReleasedate: '',
			appStoreUpdateContent: '',
			info: '正在加载', // 主标题显示版本号
			Minfo: '正式版', // 副标题显示版本类型
			Mtip: '', // 小提示标语
			updateInfo: '幼儿英语学习及育儿指导', // 更新摘要

			latest: null, // 版本信息
			packgeSize: null, // 更新包大小
			packgePath: null, // 更新包的文件地址
			downloadTask: null, // 下载任务
			downloadProgress: 0, // 下载进度

			buttonLoading: false, // 加载 - 标记
			installed: false, // 是否执行了安装 - 标记
			startProgress: false, // 下载进行 - 标记
			currentIsLatest: true // 当前版本就是最新版本 - 标记
		};
	},
	onReady() {
		//if (uni.getSystemInfoSync().platform != 'ios') {
		console.log('onReady-1');
		this.getLatest();
		const updated = uni.getStorageSync('updated');
		if (updated.packgePath) {
			this.packgePath = updated.packgePath;
		}
		uni.setNavigationBarTitle({
			title: '版本信息'
		});
		//}
	},
	// 如果用户下载后没有完成安装，却回到app，则执行这里
	onShow() {
		//#ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
			this.info = wgtinfo.name + wgtinfo.version.toString();
		});
		//#endif

		if (this.installed === true && this.packgePath) {
			this.installed = false;
			this.haveDownloaded();
		}
		/*if (uni.getSystemInfoSync().platform != 'ios') {
			if (this.installed === true && this.packgePath) {
				this.installed = false;
				this.haveDownloaded();
			}
		} else {
			this.appStoreVersion = this.$current.appstoreversion||'未知';
			this.appStoreReleasedate = this.$current.appstorereleasedate||'未知'
			
			this.appStoreUpdateContent = this.$current.appstoreupdatecontent;
			if (this.$current.appstoreversion !== this.$current.appcurrentversion) {
				this.bGotoAppStore = true;
			} else {
				this.bGotoAppStore = false;
			}
			this.bShowAppStoreUptCont = true;
		}*/
	},
	// 用户关闭页面时检查是否存在下载任务
	onUnload() {
		//if (uni.getSystemInfoSync().platform != 'ios') {
		if (this.downloadTask) {
			this.closeTask();
			//this.showToast('更新被取消');
		}
		//}
	},
	// 下拉刷新更新
	onPullDownRefresh() {
		//if (uni.getSystemInfoSync().platform != 'ios') {
		this.getLatest();
		uni.stopPullDownRefresh();
		//}
	},
	methods: {
		gotoAppStore() {
			let appUrl = 'itms-apps://itunes.apple.com/cn/app/id1471975642?mt=8'; // XXXX为对应的AppID

			plus.runtime.openURL(appUrl);
		},
		// 封装个Toast方便用
		showToast(text) {
			uni.showToast({
				title: text,
				duration: 3000,
				icon: 'none'
			});
		},
		installPackge() {
			// 安装更新
			plus.runtime.install(this.packgePath, { force: true });
			this.installed = true;
			// 保存更新记录到stroage，方便下次启动app时删除安装包
			uni.setStorage({
				key: 'updated',
				data: {
					completed: true,
					packgePath: this.packgePath
				},
				success: res => {
					//console.log('成功保存更新记录');
					uni.setStorageSync('localDocVersionID', { id: this.latest.id });
					//console.log('localVersionID已更新,' + this.latest.id);
				}
			});
			// 判断是否为热更新（判断文件名中是否含有.wgt）
			if (this.packgePath.match(RegExp(/.wgt/))) {
				this.installed = false;
				uni.showModal({
					title: '提示',
					content: '应用将重启以完成更新',
					showCancel: false,
					complete: () => {
						plus.runtime.restart();
					}
				});
			}
		},
		// 已经下载了更新包但是没有安装
		haveDownloaded() {
			let _this = this;
			uni.showModal({
				title: '更新尚未完成',
				content: '您已下载更新包，但是还没有完成安装，请问是否要继续安装更新包呢？',
				success: res => {
					if (res.confirm) {
						// 安装
						_this.installPackge();
					} else if (res.cancel) {
						_this.showToast('更新被取消');
					}
				}
			});
		},
		// 取得最新版本及其所有信息
		getLatest() {
			let _this = this;
			this.info = '正在加载'; // 主标题显示版本号
			this.Minfo = '未知'; // 副标题显示版本类型
			this.updateInfo = '无'; // 更新摘要

			this.buttonLoading = true;
			this.latest = null;
			console.log(updaterServerAddress);
			try {
				uni.downloadFile({
					url: updaterServerAddress, //仅为示例，并非真实的资源
					complete(res) {
						if (res.statusCode === 200) {
							//_this.showToast('下载文件成功');

							let tmpPath = res.tempFilePath;
							let index = tmpPath.lastIndexOf('/');
							let fileName = tmpPath.substr(index + 1);
							let path = tmpPath.substr(0, index);
							//_this.showToast('文件路径' + path + ',' + '文件名' + fileName);

							plus.io.resolveLocalFileSystemURL(
								tmpPath,
								function(entry) {
									entry.file(function(file) {
										//读取文件内容
										let read = new plus.io.FileReader();
										read.onerror = res => {
											_this.showToast('onerror=' + JSON.stringify(res));
										};
										read.onloadend = res => {
										//	_this.showToast('onload=' + JSON.stringify(res));
										};
										read.onload = res => {
											let fileContent = JSON.parse(res.target.result);
											//_this.showToast('下载的文件内容' + JSON.stringify(fileContent));
											_this.latest = fileContent.latest.info;
											//this.showToast('downloadFile id=' + _this.latest.id)

											_this.buttonLoading = false;
											//this.test()
											_this.checkLatest();
										};
										read.readAsText(file, 'UTF-8');
									});
								},
								function(e) {
									_this.showToast('Resolve file URL failed: ' + e.message);
								}
							);
						}
					}
				});
			} catch (err) {
				_this.showToast('getLatest 错误' + err.message);
			}
		},
		test() {
			console.log('test');
			//this.showToast('checkLatest2 id=' + this.latest.id);
		},
		// 检查版本
		checkLatest() {
			//this.showToast('checkLatest2 id=' + this.latest.id);

			if (!this.latest.id) {
				this.Mtip = '未找到发行版本';
			} else if (this.$current.id != this.latest.id) {
				// 当前版本与新版本不符（$current在main.js里）
				this.currentIsLatest = false;
				this.Mtip = '发现新版本';
				this.info = this.latest.name + ' ' + this.latest.number; //名称 版本号
				this.updateInfo = this.latest.info;
				this.packgeSize = (this.latest.packgeSize / 1048576).toFixed(2) + 'MB'; // 请求取得的packgeSize是字节大小，转换为保留两位小数的MB
				this.setMinfo(this.latest.type);
				// this.showToast('发现新版本,请点击下面的[立即更新]按钮进行升级!');
			} else {
				//this.showToast('当前是最新版了');
				this.currentIsLatest = true;
				this.Mtip = '当前是最新版';
				this.info = this.latest.name + ' ' + this.latest.number; //名称 版本号
				this.updateInfo = this.latest.info;
				this.setMinfo(this.latest.type);
				this.showToast('当前已经是最新版了!');
			}
		},
		// 根据英文版本类型选择中文版本类型
		setMinfo(type) {
			switch (type) {
				case 'base':
					this.Minfo = '结构版';
					break;
				case 'alpha':
					this.Minfo = '内测版';
					break;
				case 'beta':
					this.Minfo = '公测版';
					break;
				case 'rc':
					this.Minfo = '终测版';
					break;
				case 'release':
					this.Minfo = '正式版';
					break;
				default:
					this.Minfo = '未知';
			}
		},
		// 关闭下载任务
		closeTask() {
			this.downloadTask.abort();
			this.downloadTask = null;
			this.startProgress = false;
		},
		// 开始下载任务
		createTask(downloadLink) {
			let _this = this;
			//判断是否已经存在任务
			if (this.packgePath) {
				this.haveDownloaded();
			} else {
				this.downloadProgress = 0;
				this.startProgress = true;
				// 创建下载任务对象
				this.downloadTask = uni.downloadFile({
					url: downloadLink,
					success: res => {
						if (res.statusCode === 200) {
							// 保存下载的安装包
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: res => {
									_this.packgePath = res.savedFilePath;
									// 进行安装
									_this.installPackge();
									// 任务完成，关闭下载任务
									_this.closeTask();
								}
							});
						}
					}
				});
				// 进度条更新
				this.downloadTask.onProgressUpdate(res => {
					this.downloadProgress = res.progress;
				});
			}
		},
		handleUpdate() {
			// 判断系统类型
			if (plus.os.name.toLowerCase() === 'android') {
				if (this.latest.androidLink && this.latest.androidLink !== '#') {
					// 我这里默认#也是没有地址，请根据业务自行修改
					// 安卓：创建下载任务
					this.createTask(this.latest.androidLink);
				} else {
					this.showToast('未找到下载地址');
				}
			} else {
				if (this.latest.iosLink && this.latest.iosLink !== '#') {
					// 我这里默认#也是没有地址，请根据业务自行修改
					// 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
					if (this.latest.iosLink.match(RegExp(/.wgt/))) {
						this.createTask(this.latest.iosLink);
					} else {
						// 苹果(B)：打开商店链接（如果iosLink是苹果商店的地址）
						plus.runtime.openURL(this.latest.iosLink);
					}
				} else {
					this.showToast('未找到ios商店地址');
				}
			}
		}
	}
};
</script>

<style scoped>
.flex-column {
	display: flex;
	flex-direction: column;
}
.content {
	/* background-image: var(--gradualBlue);
	color: var(--white); */
	/* bg-gradual-blue; */

	background-color: #ffffff;

	display: flex;
	align-items: center;
	align-content: center;
	flex-direction: column;
	justify-content: center;
	flex: 1;
}
.minorContent {
	width: 650upx;
	padding: 50upx 50upx;
}
.process {
	margin-top: 200upx;
	margin-left: 30%;
}
.logo {
	height: 200upx;
	width: 200upx;
	margin-top: 100upx;
}
.title {
	font-size: 36upx;
	color: #373737;
	font-weight: bold;
}
.infoTitle {
	font-size: 32upx;
	color: #373737;
	padding-left: 15upx;
	font-weight: bold;
}
.tip {
	font-size: 28upx;
	color: #7e7e83;
	vertical-align: text-top;
}
.bottom_aera {
	position: absolute;
	bottom: 0;
	height: 12%;
}
.line {
	padding: 0 200upx;
	border-bottom: 2upx solid #d8d8d8;
}
.infoPic {
	height: 50upx;
	width: 50upx;
}
.infoContentTitle {
	display: flex;
	align-items: center;
	padding: 20upx 40upx;
}
.infoContent {
	display: flex;
	align-items: center;
}
.updateInfo {
	font-size: 28upx;
	color: #7e7e83;
	padding: 0 80upx;
}
.smallTitle {
	font-size: 26upx;
	font-weight: 500;
	padding: 20upx 0;
	line-height: 1.5;
	color: #888;
}
</style>
