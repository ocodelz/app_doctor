<template>
	<view class="w-100 flex align-center justify-center flex-column" style="margin-top: 80rpx;">
		<view style="width: 686rpx;" class="mr-1">
			<u-form :model="form" ref="uForm" :error-type="errorType">
				<u-form-item prop="userNamePwd" :border-bottom="false">
					<view class="position-absolute flex align-center">
						<u-icon :custom-style="customIconStyle" color="#cccccc" name="lock" size="35"></u-icon>
					</view>
					<u-input type="password" :custom-style="customInputStyle" v-model="form.userNamePwd" border height="80"
					 placeholder="请输入新密码" />
				</u-form-item>
				<u-form-item prop="repeatPassword" :border-bottom="false">
					<view class="position-absolute flex align-center">
						<u-icon :custom-style="customIconStyle" color="#cccccc" name="lock" size="35"></u-icon>
					</view>
					<u-input type="password" :custom-style="customInputStyle" v-model="form.repeatPassword" border height="80"
					 placeholder="请再次输入新密码" />
				</u-form-item>
			</u-form>
		</view>
		<!-- 按钮 -->
		<u-button :class="form.userNamePwd !== '' && form.repeatPassword !== '' ? 'active' : 'btnClass'"hover-class="none" :hair-line="false" @click="submitUpdatePw">提交</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errorType: ['toast'],
				form: {
					userNamePwd: '',
					repeatPassword: ''
				},
				customIconStyle: {
					marginLeft: '10rpx'
				},
				customInputStyle: {
					marginLeft: '40rpx'
				},
				// 验证规则
				rules: {
					userNamePwd: [{
							required: true,
							message: '密码不能为空',
							trigger: 'change'
						},
						{
							min: 6,
							required: true,
							message: '密码不能少于6位数',
							trigger: 'change'
						},
						{
							max: 16,
							required: true,
							message: '密码不能大于16位数',
							trigger: 'change'
						}
					],
					repeatPassword: [{
						required: true,
						message: '请再次输入密码',
						trigger: 'change'
					}],
				},
				docid: ''
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'user_login',
				success: (res) => {
					let arr = res.data;
					this.docid = arr[0].f_userid
				}
			})
		},
		methods: {
			submitUpdatePw() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (this.form.repeatPassword == this.form.userNamePwd) {
							let data = {
								docid: this.docid,
								pw: this.form.userNamePwd
							}
							console.log(data);
							this.$u.post('UpdateDocPw',data).then(res => {
								console.log(res);
								uni.showModal({
									title:'提示',
									content:'修改成功，是否要重新登录?',
									success: (res) => {
										if(res.confirm){
											this.$u.route('pages/login/login')
										}
									}
								})
							}).catch(e => {
								uni.showToast({
									title: "未知错误"
								})
							})
						} else {
							uni.showToast({
								title: '两次密码必须一致',
								icon: 'none'
							})
						}
					} else {
						console.log('验证失败')
					}
				});
			},

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style scoped>
	.active{
		width:686rpx;
		background-color: #e55a6f;
		margin-top: 100rpx;
		color: #fff;
		border: 1rpx solid #e55a6f;
	}
	.btnClass {
		width: 686rpx;
		background-color: #e59192;
		margin-top: 100rpx;
		color: #fff;
		border: 1rpx solid #e59192;
	}
</style>
