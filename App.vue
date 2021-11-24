<script>
	import {
		autoUpdate,
		checkUpdaterForIos
	} from '@/common/updater/checkUpdater.js';
	export default {
		data() {
			return {
				list: [],
				answerSheetList: [],
				answerNorReportalerts: [],
				innerAudioContext: null,
				innerAudioContexts: null,
				showAnswerNorReportalert: '',
				errAudio: 0,
				showinterValData: '',
				showAnswerSheetList: '',
				hideinterValData: '',
				player: '',
				docid: '',
				paginationobj: {
					rows: 10,
					page: 1,
					sidx: '',
					sord: 'desc',
					records: 0,
					total: 0
				},
				paginationobjs: {
					rows: 10,
					page: 1,
					sidx: 'createtime',
					sord: 'desc',
					records: 0,
					total: 0
				},
				paginationobjRj: {
					rows: 10,
					page: 1,
					sidx: '',
					sord: 'desc',
					records: 0,
					total: 0
				}
			}
		},
		onLaunch: function() {
			uni.onTabBarMidButtonTap((res) => {
				let currentPages = getCurrentPages();
				let currentPage = currentPages[currentPages.length - 1].$getAppWebview();
				if (currentPage.__uniapp_route === 'pages/manipulationMenu/manipulationMenu') {
					uni.navigateBack();
					return false;
				}
				uni.navigateTo({
					url: '/pages/manipulationMenu/manipulationMenu',
					animationType: 'none'
				})
			})
			// const dcRichAlert = uni.requireNativePlugin('Aimer-RichAlert');
			let _this = this;
			// 判断当前客户端环境
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					let maintest = plus.android.runtimeMainActivity();
					let Contexttest = plus.android.importClass("android.content.Context");
					let telephonyManager = plus.android.importClass("android.telephony.TelephonyManager");
					let telManager = plus.android.runtimeMainActivity().getSystemService(Contexttest
						.TELEPHONY_SERVICE);
					let receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
						onReceive: function(Contexttest, intent) {
							plus.android.importClass(intent);
							console.log(intent.getAction());
							let phonetype = telManager.getCallState();
							let phoneNumber = intent.getStringExtra(telephonyManager
								.EXTRA_INCOMING_NUMBER);
							console.log("phonetype:" + phonetype); //电话状态 0->空闲状态 1->振铃状态 2->通话存在
							switch (phonetype) {
								case 0:
									// _this.handleHideAudio();
									clearInterval(_this.hideinterValDatas)
									console.log(0);
									break;
								case 1:
									clearInterval(_this.showinterValData)
									clearInterval(_this.hideinterValData)
									console.log(1);
									break;
								case 2:
									clearInterval(_this.showinterValData)
									clearInterval(_this.hideinterValData)
									console.log(2);
									break;
							}
						}
					});
					let IntentFilter = plus.android.importClass('android.content.IntentFilter');
					let filter = new IntentFilter();
					filter.addAction(telephonyManager.ACTION_PHONE_STATE_CHANGED);
					maintest.registerReceiver(receiver, filter);
					console.log('客户端是Android');
					break;
				case 'ios':
					// dcRichAlert.listenCall({
					// 		id: 'Aimer'
					// 	},
					// 	result => {
					// 		console.log(result);
					// 		/**
					// 		 * 0 通话出错
					// 		 * 1 用户触发通话
					// 		 * 2 接通了
					// 		 * 3 挂断了
					// 		 * 4 未接通,取消接通
					// 		 */
					// 	}
					// );
					console.log('客户端是iOS')
					break;
				case 'devtools':
					console.log('客户端是在开发者工具上')
					break;
				default:
					console.log('客户端是在其他工具上')
					break;
			}
			let currentid = 0;
			if (this.$current != null && this.$current.id != null) {
				currentid = this.$current.id;
			}
			autoUpdate(currentid);
		},
		methods: {
			handleAnswerSheetList() {
				let obj = {
					userName: '',
					startTime: '',
					endTime: '',
					sub_status: 1,
					paginationobj: JSON.stringify(this.paginationobjs)
				}
				this.$u.post(this.baseUrl + 'AnswerSheetList', obj).then(res => {
					// console.log(res);
					if (res.code == 200 && res.data.pagedatas.length) {
						this.answerSheetList = res.data.pagedatas;
						if (this.list.length + this.answerSheetList.length + this.answerNorReportalerts == 0) {
							uni.removeTabBarBadge({
								index: 1
							})
						} else {
							uni.setTabBarBadge({
								index: 1,
								text: '' + (this.list.length + this.answerSheetList.length + this
									.answerNorReportalerts.length)
							})
						}
						uni.setStorageSync('answerSheetList', this.answerSheetList);
					} else {
						uni.removeStorageSync('answerSheetList');
						this.answerSheetList = [];
					}
				}).catch(err => {
					uni.removeStorageSync('answerSheetList');
					this.answerSheetList = [];
				})
			},
			handleGetData() {
				// console.log(111);
				let typeArr = ['血糖', '血压', '胎心'];
				let data = {
					type: typeArr.join(','),
					docid: "",
					status: '已上传',
					time: '',
					paginationobj: JSON.stringify(this.paginationobj),
					name: ''
				}
				// console.log(data);
				this.$request('DocQueryYFCLInfo', data).then(res => {
					// console.log(res);
					if (res.code == 200 && res.info == '响应成功') {
						let arr = res.data.pagedatas,
							_arr = [];
						// console.log(arr);
						arr.forEach(item => {
							if (item.exam_time == null && item.name !== null) {
								_arr.push(item);
							}
						})
						this.list = _arr;
						// console.log(this.list);
						if (this.list.length + this.answerSheetList.length + this.answerNorReportalerts.length ==
							0) {
							uni.removeTabBarBadge({
								index: 1
							})
						} else {
							uni.setTabBarBadge({
								index: 1,
								text: '' + (this.list.length + this.answerSheetList.length + this.answerNorReportalerts.length)
							})
						}
						if (this.list.length !== 0 && this.errAudio == 1) {
							let player = plus.audio.createPlayer('/static/image/audio/ts.mp3');
							this.player = player;
							this.player.play(function() {
								// console.log('Audio play success!');
							}, function(e) {
								// console.log("Audio play failed: " + e.message);
							})
						}
						uni.setStorageSync('errArr', this.list);
						let errAudio = uni.getStorageSync('errAudio');
						this.errAudio = errAudio;
					}
				}).catch(err => {
					console.log(err);
					uni.removeStorageSync('errArr');
					this.list = [];
				})
			},
			// 日记未上报消息通知
			handleAnswerNorReportalerts() {
				let obj = {
					paginationobj: JSON.stringify(this.paginationobjRj),
					StartTime: "",
					EndTime: ""
				}
				this.$u.post(this.baseUrl + 'AnswerNorReportalerts', obj).then(res => {
					// console.log(res);
					this.answerNorReportalerts = res.data.pagedatas;
					if(this.answerNorReportalerts.length && res.code == 200){
						if (this.list.length + this.answerSheetList.length + this.answerNorReportalerts.length == 0) {
							uni.removeTabBarBadge({
								index: 1
							})
						} else {
							uni.setTabBarBadge({
								index: 1,
								text: '' + (this.list.length + this.answerSheetList.length + this.answerNorReportalerts.length)
							})
						}
						uni.setStorageSync('answerNorReportalerts', this.answerNorReportalerts);
					}else{
						uni.removeStorageSync('answerNorReportalerts');
						this.answerNorReportalerts = [];
					}
				}).catch(err => {
					uni.removeStorageSync('answerNorReportalerts');
					this.answerNorReportalerts = [];
				})
				// let res = uni.getStorageSync('answerNorReportalerts');
				// console.log(res);
			},
			handleHideAudio() {
				// console.info("测试2")
				if (this.list.length !== 0 && this.errAudio == 1) {
					// console.info("测试1")
					// plus.device.vibrate(100)
					let player = plus.audio.createPlayer('/static/image/audio/ts.mp3');
					this.player = player;
					this.player.play(function() {
						// console.log('Audio play success!');
					}, function(e) {
						// console.log("Audio play failed: " + e.message);
					})
				}
			}
		},
		onShow: function() {
			clearInterval(this.showAnswerSheetList);
			clearInterval(this.showinterValData);
			clearInterval(this.hideinterValData);
			clearInterval(this.showAnswerNorReportalert);
			this.handleGetData();
			this.showinterValData = setInterval(() => {
				this.handleGetData();
			}, 8000)
			this.handleAnswerSheetList();
			this.showAnswerSheetList = setInterval(() => {
				this.handleAnswerSheetList();
			}, 8000)
			this.handleAnswerNorReportalerts();
			this.showAnswerNorReportalert = setInterval(() => {
				this.handleAnswerNorReportalerts();
			},8000)
			console.log('App Show');
		},
		onHide: function() {
			clearInterval(this.showinterValData);
			clearInterval(this.hideinterValData);
			clearInterval(this.showAnswerNorReportalert);
			this.hideinterValData = setInterval(() => {
				this.handleHideAudio();
			}, 3000)
			console.log('App Hide');
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "./common/free.css";
</style>
