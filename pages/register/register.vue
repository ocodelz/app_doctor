<template>
	<view>
		<view class="w-100 flex flex-column" style="padding: 10rpx 60rpx;">
			<u-form :model="form" ref="uForm" label-width="90" :error-type="errorType">
				<u-form-item label="姓名:">
					<u-input v-model="form.doctor_name" placeholder="请输入您的姓名" />
				</u-form-item>
				<u-form-item label="手机号:" label-width="110">
					<u-input v-model="form.doctor_tel" type="number" placeholder="请输入您的手机号" />
				</u-form-item>
				<u-form-item label="密码:">
					<u-input v-model="form.doctor_pwd" type="password" placeholder="请输入您的密码" />
				</u-form-item>
				<u-form-item label="确认密码:" label-width="140">
					<u-input v-model="form.doctor_pwds" type="password" placeholder="请输入您的确认密码" />
				</u-form-item>
				<u-form-item label="科室:">
					<u-input v-model="form.doctor_department" placeholder="请选择您的科室" type="select" @click="isShow = true" />
					<u-action-sheet :list="deptList" v-model="isShow" @click="handleDeptList"></u-action-sheet>
				</u-form-item>
				<u-form-item label="工号:">
					<u-input v-model="form.doctor_jobnum" type="number" placeholder="请输入您的工号(非必填)" />
				</u-form-item>
				<u-form-item label="性别:">
					<u-input v-model="form.value" type="select" placeholder="请选择您的性别" @click="show = true" />
					<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
				</u-form-item>
				<u-button :class="form.doctor_name!== '' 
				&& form.doctor_tel !== '' 
				&& form.doctor_pwd !== '' 
				&& form.doctor_pwds !== '' 
				&& form.doctor_department !== ''? 'active' : 'btnClass'"
				 hover-class="none" :hair-line="false" @click="handleSubmit">完成注册</u-button>
			</u-form>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				show: false,
				isShow: false,
				errorType: ['toast'],
				form: {
					doctor_name: '',
					doctor_tel: '',
					doctor_pwd: '000000',
					doctor_pwds: '000000',
					doctor_department: '',
					doctor_jobnum: '',
					value: ''
				},
				actionSheetList: [{
						text: '男'
					},
					{
						text: '女'
					}
				],
				deptList: [{
						text: '产科'
					},
					{
						text: '产房'
					},
					{
						text: '产二科'
					},
					{
						text: '产一科'
					}
				],
			}
		},
		methods: {
			actionSheetCallback(index) {
				this.form.value = this.actionSheetList[index].text;
				console.log(this.form.value);
			},
			handleDeptList(index) {
				this.form.doctor_department = this.deptList[index].text;
			},
			handleSubmit() {
				let gender = 0;
				let dept = '';
				if (this.form.value == '女') {
					gender = 0
				} else {
					gender = 1
				}
				switch (this.form.doctor_department) {
					case '产房':
						dept = '15eecb3f-5bb6-4b34-8848-e5918035d697';
						break;
					case '产科':
						dept = '87962687-e32f-4f06-acae-4c294fd856e7';
						break;
					case '产二科':
						dept = '97d16a35-a0de-4262-ba45-a73647e347cd';
						break;
					case '产一科':
						dept = 'dd48bd65-9448-44e2-a192-7486208dda06';
						break;
				}
				if (this.$u.test.isEmpty(this.form.doctor_name)) {
					uni.showToast({
						title: '姓名不能为空',
						icon: 'none'
					})
					return;
				} else if (!this.$u.test.letter(this.form.doctor_name) && !this.$u.test.chinese(this.form.doctor_name)) {
					uni.showToast({
						title: '只能输入纯中文或纯英文的姓名',
						icon: 'none'
					})
					return;
				}
				if (!this.form.doctor_tel) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return;
				}
				if (!this.$u.test.mobile(this.form.doctor_tel)) {
					uni.showToast({
						title: '非法手机号',
						icon: 'none'
					})
					return
				}
				if (!this.form.doctor_pwd) {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none'
					})
					return;
				}
				if (this.form.doctor_pwd.length < 6 || this.form.doctor_pwd.length > 16) {
					uni.showToast({
						title: '请输入6~16位密码',
						icon: 'none'
					})
					return;
				}
				if (!this.form.doctor_pwds) {
					uni.showToast({
						title: '确认密码不能为空',
						icon: 'none'
					})
					return;
				}
				if (this.form.doctor_pwds.length < 6 || this.form.doctor_pwds.length > 16) {
					uni.showToast({
						title: '请输入6~16位密码',
						icon: 'none'
					})
					return;
				}
				if (this.form.doctor_pwd !== this.form.doctor_pwds) {
					uni.showToast({
						title: '两次密码必须一致',
						icon: 'none'
					})
					return;
				}
				if (!this.form.doctor_department) {
					uni.showToast({
						title: '请选择您所在的科室',
						icon: 'none'
					})
					return;
				}
				// if (!this.form.doctor_jobnum) {
				// 	uni.showToast({
				// 		title: '工号不能为空',
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				if (!this.form.value) {
					uni.showToast({
						title: '请选择您的性别',
						icon: 'none'
					})
					return;
				}
				let data = {
					name: this.form.doctor_name,
					tel: this.form.doctor_tel,
					pw: this.form.doctor_pwd,
					dept: dept,
					encode: this.form.doctor_jobnum,
					gender: gender
				}
				this.$u.post('DocRegister', data).then(res => {
					let arr = res.data;
					// console.log(JSON.stringify(res));
					if (res.code == 200 && JSON.stringify(arr) !== '{}') {
						uni.setStorage({
							key:'user_login',
							data:arr
						})
						uni.reLaunch({
							url: '../login/login'
						})
						uni.showToast({
							title: '注册成功,请登录',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						})
					}
				}).catch(e => {
					uni.showToast({
						title: e.info,
						icon: 'none'
					})
				})

			}
		}
	}
</script>
<style scoped>
	.active {
		background-color: #e55a6f;
		margin-top: 100rpx;
		color: #fff;
		border: 1rpx solid #e55a6f;
	}

	.btnClass {
		background-color: #e59192;
		margin-top: 100rpx;
		color: #fff;
		border: 1rpx solid #e59192;
	}
</style>
