<template>
	<view class="flex flex-column w-100" :style="'height:'+pageHeight+'px'">
		<!-- 顶部轮播 -->
		<view class="wrap">
			<u-swiper img-mode="scaleToFill" :list="list" height="440" border-radius="0"></u-swiper>
		</view>
		<!-- 功能分类列表 -->
		<view class="flex flex-row align-center justify-center">
			<view class="flex align-center justify-between flex-wrap ml-1 mr-2 w-100">
				<view v-for="(item, index) in categoryList" :key="index" @click="openWin(index)" style="width: 50%;">
					<view class=" flex justify-between align-center ml-1 mt-1 border rounded" style="height: 160rpx;">
						<view class="flex flex-column pl-2">
							<text class="font-weight-bold">{{ item.title }}</text>
							<text class="pt-2 font-sm"
								style="color: #adadad;height: 90rpx;overflow: hidden;">{{ item.info }}</text>
						</view>
						<view class="mr-1">
							<u-image width="80" height="80" shape="circle"
								:mode="index == 3 ? 'aspectFit' : 'aspectFill'" :src="item.icon"></u-image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageHeight: 0,
				list: [
					'/static/image/index/xueya.jpg',
					'/static/image/index/xuetang.jpg',
					'/static/image/index/taixin.png'
				],
				categoryList: [{
						icon: '/static/image/index/taixinjianhu.png',
						title: '胎心监护',
						info: '点击进行监护'
					},
					{
						icon: '/static/image/index/xuetangceliang.png',
						title: '血糖测量',
						info: '点击进行血糖测量'
					},
					{
						icon: '/static/image/index/xueyaceliang.png',
						title: '血压测量',
						info: '点击进行血压测量'
					},
					// {
					// 	icon: '/static/image/index/tizhongceliang.png',
					// 	title: '体重测量',
					// 	info: '点击进行体重测量'
					// },
					{
						icon: '/static/image/index/bangzhu.png',
						title: '监护记录',
						info: '查看以往的胎心记录、血压、血糖测量结果'
					},
					// {
					// 	icon: '/static/image/index/bangzhu.png',
					// 	title: '监护帮助',
					// 	info: '如何操作、如何寻找胎心'
					// }
					// {
					// 	icon: '/static/image/index/bangzhu.png',
					// 	title: '随访日记查询',
					// 	info: '孕妇/婴儿，产后/术后日记查询'
					// },
					// {
					// 	icon: '/static/image/index/bangzhu.png',
					// 	title: '未填写日记人数',
					// 	info: '查看到期未填写日记人数'
					// }
				],
				innerAudioContext: null,
				timer: '',
				errList: [],
				errAudio: 1,
				paginationobj: {
					rows: 10,
					page: 1,
					sidx: 'createtime',
					sord: 'desc',
					records: 0,
					total: 0
				}
			}
		},
		onLoad() {
			this.handleGetResult();
			let errArr = uni.getStorageSync('errArr');
			this.errList = errArr;
			// this.handleErrardio();
			uni.setStorageSync('errAudio', this.errAudio);
		},
		onShow() {
		},
		mounted() {
			let pageHeight = uni.getSystemInfoSync()
			this.pageHeight = pageHeight.windowHeight;
		},
		// destroyed() {
		// 	if (this.innerAudioContext) {
		// 		this.innerAudioContext.destroy();
		// 	}
		// },
		methods: {
			handleGetResult() {
				this.$u.post('/GetResultParams', {
					name: '',
					jgpd: '',
					tstj: ''
				}).then(res => {
					let arr = res.data;
					uni.setStorageSync('result_storage', arr);
				})
			},
			openWin(index) {
				switch (index) {
					case 0:
						this.$u.route('pages/fetalHeartRateMonitoring/fetalHeartRateMonitoring')
						break;
					case 1:
						uni.navigateTo({
							url: '../../monitoringRecords/monitoringRecords?type=0'
						})
						break;
					case 2:
						uni.navigateTo({
							url: '../../monitoringRecords/monitoringRecords?type=1'
						})
						break;
					case 3:
						uni.navigateTo({
							url: "../../monitoringRecords/monitoringRecords?type=''"
						})
						break;
					case 4:
						
						break;
				}
			}
		}
	}
</script>

<style scoped>
	.wrap {
		width: 100%;
		height: 440rpx;
	}
</style>
