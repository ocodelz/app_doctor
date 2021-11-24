<template>
	<view class="page-trans" @tap="cancelPage">
		<view class="page-trans-parent" v-show="show">
			<view class="page-trans-parent-popup" @click.stop="">
				<view v-for="(item,index) in menuList" :key="index"
					class="flex flex-column align-center justify-center ml-2" @click.stop="chooseMenu(item.name)">
					<u-image :src="item.img" width="100" height="100"></u-image>
					<text class="pt-1">{{item.txt}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				menuList: [
					{
						txt: '随访日记管理',
						img: '/static/image/index/xueyaceliang.png',
						name: 'sfwjcx'
					},
					{
						txt: '日记未上报管理',
						img: '/static/image/index/xueyaceliang.png',
						name: 'wtxwjrs'
					},
					{
						txt: '复诊未到追访统计',
						img: '/static/image/index/xueyaceliang.png',
						name: 'fzwdzftj'
					},
					{
						txt: '复诊到诊率',
						img: '/static/image/index/xueyaceliang.png',
						name: 'fzdzl'
					}
				]
			}
		},
		onShow() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary');
			// #endif
		},
		methods: {
			cancelPage() {
				this.show = false;
				uni.navigateBack();
			},
			chooseMenu(item) {
				this.show = false;
				switch (item) {
					case "sfwjcx":
						this.$u.route({
							type: 'redirectTo',
							url: '/pages/followUpQuestionnaireInquiry/followUpQuestionnaireInquiry'
						})
						break;
					case "wtxwjrs":
						this.$u.route({
							type: 'redirectTo',
							url: '/pages/notFillingInQuestionnaire/notFillingInQuestionnaire'
						})
						break;
					case "fzwdzftj":
						this.$u.route({
							type: 'redirectTo',
							url: '/pages/fuZhenWeiDaoZhuiFangTongJi/fuZhenWeiDaoZhuiFangTongJi'
						})
						break;
					case "fzdzl":
						this.$u.route({
							type: 'redirectTo',
							url: '/pages/fuZhenDaoZhenLv/fuZhenDaoZhenLv'
						})
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}

	.page-trans {
		position: relative;
		width: 100%;
		height: 100vh;
		background-color: rgba(#333333, .5);

		.page-trans-parent {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 200rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.page-trans-parent-popup {
				background-color: #fff;
				width: 96%;
				height: 500rpx;
				border-radius: 44rpx;
				display: flex;
				padding: 20rpx;
				flex-wrap: wrap;
			}
		}
	}
</style>
