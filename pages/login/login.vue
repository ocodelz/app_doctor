<template>
	<view class="flex flex-column" :style="'height:'+pageHeight+'px'">
		<u-navbar title="登录" title-color="#000" :is-back="false" :background="background" :border-bottom="false"></u-navbar>
		<view  class="flex flex-column align-center justify-center mt-5">
			<view style=" margin-bottom:76rpx;">
				<text style="font-size: 36rpx;font-weight: 500;">*欢迎使用孕婴安-医生端*</text>
				<view class="flex justify-center">V{{version}}</view>
			</view>
			<view class="header">
				<image src="http://www.ajylive.cn/update/pwguardapp/timg3.jpg?v=123"></image>
			</view>
			<view  class="mt-5" style="width: 526rpx;">
				<u-form :error-type="errorType" :model="form" ref="uForm">
					<u-form-item label="" prop="tel">
						<u-input type="number" v-model="form.tel" placeholder="请输入手机号" />
					</u-form-item>
					<u-form-item label="" prop="pw">
						<u-input type="password" v-model="form.pw" placeholder="请输入手机密码" />
					</u-form-item>
				</u-form>
			</view>
			<view  class="flex justify-between mt-2 align-center" style="width: 526rpx;">
				<!-- 记住密码 -->
				<checkbox-group>
					<label @tap="handleRememberPw" class="font-sm flex align-center">
						<checkbox value="psw" :checked='rememberPw' color="#09CC86" />记住密码
					</label>
				</checkbox-group>
				<!-- 点击注册 -->
				<view class="ml-2" @click="handleRegister"><text class="font-sm" style="color: #1a1da0;">点我注册</text></view>
			</view>
		</view>
		<view class="flex flex-row">
			<!-- 登陆按钮 -->
			<u-button hover-class="none" :hair-line="false" class="flex" :class="form.tel !== '' && form.pw !== '' ? 'active' : 'btnClass'"
			 @click="handleBtnClick">
				登录
			</u-button>
		</view>
		<!-- 用户服务协议 -->
		<u-popup v-model="isPopup" mode="center" border-radius="16" width="660" height="660" :mask-close-able="false">
			<view class="flex align-center justify-center flex-column">
				<text class="font-md font-weight-bold mt-5">用户协议与隐私政策</text>
				<view class="p-3 font-weight-bold">
					感谢您选择“孕婴安-医生端”APP！我们非常重视您的个人信息和隐私保护。为了更好地保障您的个人权益，在您使用我们的产品前，
					请务必审慎阅读
					<text class="text-primary" @click="handleUserAgreement(1)">《隐私政策》</text>
					和
					<text class="text-primary" @click="handleUserAgreement(0)">《用户协议》</text>
					内的所有条款，尤其是：我们对您的个人信息的收集/保存/使用/对外提供/保护等规则条款，以及您的用户权力等条款。
					如您同意，请点击“同意”开始接受我们的服务。
		
				</view>
				<view class="flex align-center w-100 mt-4">
					<u-button class="mr-3" style="width: 160rpx;" shape="circle" type="error" @click="isPopup = false">暂不使用</u-button>
					<u-button class="ml-3" style="width: 160rpx;" shape="circle" type="success" @click="handleTapConsent">同意</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import utils from '@/utils/util.js';
	export default {
		data() {
			return {
				background: {
					background: '#fff'
				},
				rememberPw: true,
				isActive: false,
				isPopup: true,
				agreement: 0,
				errorType: ['toast'],
				version: '',
				form: {
					// 账号
					tel: '',
					pw: ''
				},
				// switchLanding: true,
				// 登陆按钮样式
				customStyle: {
					marginTop: '40rpx',
					width: '526rpx'
				},
				rules: {
					tel: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '请输入合法的手机号',
							trigger: ['change', 'blur']
						}
					],
					pw: [
						{
							required: true,
							message: '请输入手机密码',
							trigger: ['change', 'blur']
						},
						{
							max: 16,
							required: true,
							message: '请输入6-16位手机密码',
							trigger: ['change', 'blur']
						},
						{
							min: 6,
							required: true,
							message: '请输入6-16位手机密码',
							trigger: ['change', 'blur']
						}
					]
				},
				pageHeight: 0,
				errAudio: 0
			};
		},
		onLoad() {
			let pageHeight = uni.getSystemInfoSync();
			this.pageHeight = pageHeight.windowHeight;
			let errAudio = uni.getStorageSync('errAudio')
			errAudio = this.errAudio;
			uni.setStorageSync('errAudio',errAudio)
			uni.getStorage({
				key:'user_login',
				success: res => {
					this.isPopup = false;
					let arr = res.data;
					for(let item of arr){
						this.form.tel = item.f_mobile
					}
				},
				fail: err => {
					this.isPopup = true;
				}
			})
		},
		mounted() {
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (v) => {
				this.version = v.version;
			})
			// #endif
			let tel = uni.getStorageSync('tel');
			let pw = uni.getStorageSync('pw');
			if (tel && tel) {
				this.form.tel = tel;
				this.form.pw = pw;
			} else {
				this.form.tel = "";
				this.form.pw = "";
			}
		},
		methods: {
			handleTapConsent(){
				uni.setStorageSync('agreement',1);
				this.agreement = 1;
				this.isPopup = false;
			},
			handleRememberPw(){
				this.rememberPw = !this.rememberPw;
			},
			// 切换登陆方式
			handleSwitchLanding() {
				this.switchLanding = !this.switchLanding;
			},
			// 登录按钮
			handleBtnClick() {
				if(uni.getStorageSync('agreement') == ''){
					return uni.showModal({
						title: '温馨提示',
						content: '请先同意“用户协议与隐私政策”',
						success: res => {
							if(res.cancel){
								this.isPopup = false;
							}else{
								this.isPopup = true;
							}
						}
					})
				}
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
							title: '正在登录请稍后...'
						});
						// console.log(this.form);
						this.$u.post('DocLogin',this.form).then(res => {
							// console.log(res);
							let arr = res.data;
							let p_currenttime = arr[0].p_currenttime;
							if(uni.getSystemInfoSync().platform == 'ios'){
								p_currenttime = p_currenttime.replace(/-/g,'/');
							}
							let date = utils.formatTime(new Date());
							let newDate = parseInt(Math.abs((new Date(p_currenttime).getTime() - new Date(date).getTime())) /1000/60);
							if(newDate >= 5){
								return this.$lz.hideCancel('提示','手机时间('+date.replace(/\//g,'-') + ')' + '与标准时间(' + p_currenttime.replace(/\//g,'-') + ')' + '不一致，请校准手机系统时间后重试！');
							}
							if(res.code == 200 && arr.length){
								uni.switchTab({
									url:'../tabbar/index/index'
								})
								uni.showToast({
									title:'登录成功',
									icon:'none'
								})
								uni.setStorage({
									key:'user_login',
									data:arr
								})
								if (this.rememberPw == true) {
									uni.setStorageSync('tel', this.form.tel)
									uni.setStorageSync('pw', this.form.pw)
								} else {
									uni.removeStorageSync('tel')
									uni.removeStorageSync('pw')
								}
								uni.hideLoading();
							}else{
								uni.showToast({
									title:'登录信息有误',
									icon:'none'
								})
							}
						}).catch(e => {
							console.log(e);
						})
					}
				});
			},
			// 跳转注册
			handleRegister() {
				this.$u.route('/pages/register/register');
				uni.removeStorageSync('tel')
				uni.removeStorageSync('pw')
			},
			// 用户协议
			handleUserAgreement(state) {
				let url = '';
				state == 0 ? url = 'https://ajylive.cn/update/pwguarddoctorapp/%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.html' : url =
					'https://ajylive.cn/update/pwguarddoctorapp/%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE.html';
				uni.navigateTo({
					url: "../userAgreement/userAgreement?url=" + url
				})
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>

<style scoped>
	.header {
		width: 161upx;
		width: 161upx;
		background: rgba(63, 205, 235, 0);
		box-shadow: 0upx 10upx 15upx 0upx rgba(63, 205, 235, 0.47);
		border-radius: 50%;
		margin-top: 15upx;
		margin-left: auto;
		margin-right: auto;
	}

	.header image {
		width: 161upx;
		height: 161upx;
		border-radius: 50%;
	}

	.btnClass {
		margin-top: 40rpx;
		width: 526rpx;
		background: #7eeeb1;
		border: 1rpx solid #7eeeb1;
		color: #fff;
	}

	.active {
		margin-top: 40rpx;
		width: 526rpx;
		background-color: #00b457;
		border: 1rpx solid #00b457;
		color: #fff;
	}
</style>
