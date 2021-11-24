<template>
	<view>
		<view class="flex align-center justify-center w-100">
			<view class="flex flex-wrap justify-between align-center" style="width: 98%;">
				<view v-for="(item,index) in womanList" :key="index">
					<view class="flex justify-center flex-column" @click="handleTapItem(item)"
						style="width: 240rpx;height: 200rpx;">
						<view class="flex align-center justify-center">
							<view class="flex align-center justify-center" style="min-width: 100rpx;">
								<u-image width="100" height="100" :src="img"></u-image>
							</view>
							<view class="flex flex-column" style="min-width: 140rpx;">
								<text class="font-small">姓名: {{item.p_name}}</text>
								<text class="font-small mt-1">年龄: {{item.p_age}}</text>
							</view>
						</view>
						<view class="flex mt-1 flex-column ml-1">
							<text class="font-small">测量时间: {{item.check_time}}</text>
							<text class="font-small">测量时长: {{item.duration}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	export default {
		data() {
			return {
				docid: '',
				time_out: '',
				img: '/static/image/fetalHeartRateMonitoring/woman.png',
				womanList: [],
				interval: '',
				timeout: ''
				// state:0
			}
		},
		onLoad() {
			this.womanList.sort((a, b) => {
				return a.measure_time < b.measure_time ? 1 : -1
			})
		},
		onShow() {
			this.handleGetData();
			this.interval = setInterval(() => {
				this.timeout = setTimeout(() => {
					this.handleGetData();
				},0)
			},5000)
		},
		onHide() {
			clearInterval(this.interval);
			clearTimeout(this.timeout);
			console.log('fetalHeartRateMonitoring onHide');
		},
		destroyed() {
			clearInterval(this.interval);
			clearTimeout(this.timeout);
			console.log('fetalHeartRateMonitoring destroyed');
		},
		methods: {
			handleGetData() {
				// console.log(1);
				this.$request('DocSSTaixinMany', {
					docid: '',
					pregnantid: ''
				}).then(res => {
					// console.log(JSON.stringify(res));
					let arr = res.data,
						_arr = [];
					arr.sort((a, b) => {
						return a.check_time < b.check_time ? 1 : -1
					})
					arr.forEach(item => {
						if (item.rt_endtime == null) {
							_arr.push(item)
						}
					})
					if (res.code == 200 && _arr.length) {
						for (let item of _arr) {
							if (item.rt_starttime) {
								if (uni.getSystemInfoSync().platform === 'ios') {
									item.rt_starttime = item.rt_starttime.replace(/-/g, '/');
									let date = util.getFtSystemTime().replace(/-/g, '/');
									item.rt_starttime = Date.parse(item.rt_starttime) / 1000;
									item.duration = Date.parse(date) / 1000 - item.rt_starttime;
									var secondTime = parseInt(item.duration) // 秒
									var minuteTime = 0 // 分
									var hourTime = 0 // 小时
									var result = ''
									if (item.duration < 60) {
										result = secondTime + ''
									} else {
										if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
											// 获取分钟，除以60取整数，得到整数分钟
											minuteTime = parseInt(secondTime / 60)
											// 获取秒数，秒数取佘，得到整数秒数
											secondTime = parseInt(secondTime % 60)
											// 如果分钟大于60，将分钟转换成小时
											if (minuteTime >= 60) {
												// 获取小时，获取分钟除以60，得到整数小时
												hourTime = parseInt(minuteTime / 60)
												// 获取小时后取佘的分，获取分钟除以60取佘的分
												minuteTime = parseInt(minuteTime % 60)
											}
										}
										if (secondTime > 0) {
											secondTime = parseInt(secondTime) >= 10 ? secondTime : '0' + secondTime
											result = '' + secondTime + ''
										}
										if (minuteTime > 0) {
											minuteTime = parseInt(minuteTime) >= 10 ? minuteTime : '0' + minuteTime
											result = '' + minuteTime + ':' + result
										}
										if (hourTime > 0) {
											result = '' + parseInt(hourTime) + ':' + result
										}
										item.duration = result;
									}
								} else {
									item.rt_starttime = item.rt_starttime;;
									let date = util.getFtSystemTime();
									item.rt_starttime = Date.parse(item.rt_starttime) / 1000;
									item.duration = Date.parse(date) / 1000 - item.rt_starttime;
									var secondTime = parseInt(item.duration) // 秒
									var minuteTime = 0 // 分
									var hourTime = 0 // 小时
									var result = ''
									if (item.duration < 60) {
										result = secondTime + ''
									} else {
										if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
											// 获取分钟，除以60取整数，得到整数分钟
											minuteTime = parseInt(secondTime / 60)
											// 获取秒数，秒数取佘，得到整数秒数
											secondTime = parseInt(secondTime % 60)
											// 如果分钟大于60，将分钟转换成小时
											if (minuteTime >= 60) {
												// 获取小时，获取分钟除以60，得到整数小时
												hourTime = parseInt(minuteTime / 60)
												// 获取小时后取佘的分，获取分钟除以60取佘的分
												minuteTime = parseInt(minuteTime % 60)
											}
										}
										if (secondTime > 0) {
											secondTime = parseInt(secondTime) >= 10 ? secondTime : '0' + secondTime
											result = '' + secondTime + ''
										}
										if (minuteTime > 0) {
											minuteTime = parseInt(minuteTime) >= 10 ? minuteTime : '0' + minuteTime
											result = '' + minuteTime + ':' + result
										}
										if (hourTime > 0) {
											result = '' + parseInt(hourTime) + ':' + result
										}
										item.duration = result;
									}

								}
							}
						}
						this.womanList = _arr;
						uni.setStorageSync('tx_list', this.womanList)
					} else if (res.code == 200 && _arr.length == 0) {
						uni.showModal({
							title: '提示',
							content: '目前没有人在测量哦',
							showCancel: false,
							success: (res) => {
								if (res.confirm) {
									uni.navigateBack({
										delta: 1
									})
								}
							}
						})
					}
				}).catch(err => {
					console.log(err);
				})
			},
			handleTapItem(item) {
				uni.navigateTo({
					url: '../fetalHeartRate/fetalHeartRate?tapState=2&&detail=' + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style>
</style>
