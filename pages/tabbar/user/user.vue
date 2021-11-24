<template>
	<view>
		<u-cell-group :border="false">
			<block v-for="(item,index) in list" :key="index">
				<u-cell-item :title-style="titleStyle" :center="true" icon-size="44" :arrow="item.arrow" :icon="item.icon" :title="item.title"
				 @click="openWin(item)" :value="index == 1 ? 'V' + version : ''"></u-cell-item>
			</block>
		</u-cell-group>
		<u-modal title="版本信息" v-model="show" @confirm="handleConfirm" confirm-color="#000">
			<scroll-view v-if="updateVersion.length > 0" scroll-y="true" style="height: 700rpx;">
				<view class="flex align-center justify-center" v-for="(item,index) in updateVersion" :key="index">
					<view class="flex flex-column" style="width: 560rpx;border-bottom:2rpx solid #dee2e6 ;">
						<text>更新版本: {{item.version}}</text>
						<text>更新时间: {{item.update_time}}</text>
						<text class="text-danger">更新内容:</text>
						<text class="text-danger">{{item.update_content}}</text>
					</view>
				</view>
			</scroll-view>
			<view v-else>
				<u-empty mode="data"></u-empty>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				// 列表
				list: [
					{
						title: "修改密码",
						icon: '/static/image/user/updatepw.png',
						arrow: true
					},
					{
						title: "版本信息",
						icon: '/static/image/user/verision.png',
						arrow: true
					},
					{
						title: "升级检测",
						icon: '/static/image/user/verision.png',
						arrow: true
					},
					{
						title: "退出当前账号",
						icon: '/static/image/user/tuichuzhanghao.png',
						arrow: false
					}
				],
				titleStyle: {
					marginLeft: '10rpx',
					fontSize: '32rpx'
				},
				version: '',
				updateVersion: []
			}
		},
		mounted() {
			plus.runtime.getProperty(plus.runtime.appid, (v) => {
				this.version = v.version;
			})
		},
		methods: {
			updateCheck() {
				this.$u.route('pages/update/index')
			},
			openVersion() {
				this.$u.get('DocAppVersion', {
					version: ""
				}).then(res => {
					this.show = true;
					this.updateVersion = res.data;
					uni.hideTabBar();
				}).catch(e => {
					// console.log(e);
					uni.showToast({
						title: '未知错误',
						icon: 'none'
					})
				})
			},
			handleConfirm() {
				uni.showTabBar();
			},
			openWin(item) {
				switch (item.title) {
					case '退出当前账号':
						uni.showModal({
							title: '提示',
							content: '确定要退出吗?',
							success: (res) => {
								if (res.confirm) {
									uni.reLaunch({
										url: '../../login/login'
									})
								}
							}
						})
						break;
					case '修改密码':
						this.$u.route('pages/changePassword/changePassword')
						break;
					case '版本信息':
						this.openVersion();
						break;
					case '升级检测':
						 this.updateCheck();
						break;

				}
			}
		}
	}
</script>

<style>

</style>
