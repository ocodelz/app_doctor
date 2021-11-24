<template>
	<view>
		<view class="pl-3 mt-2"></view>
		<scroll-view scroll-y v-if="list.length">
			<view class="w-100 flex justify-center mt-2 align-center flex-column">
				<block v-for="(item,index) in list" :key="index">
					<view class="bg-white border p-3 mb-2 rounded position-relative" style="width: 96%;"
						@click="handleTapItem(item,index)">
						<view class="flex justify-between">
							<u-badge v-if="item.status !== '已审核'" :is-dot="item.status !== '已审核'" type="error"
								:offset="[0,0]"></u-badge>
							<text>姓名: {{item.name}}</text>
							<text>{{item.t_time}}</text>
						</view>
						<text class="mt-1 d-block" v-if="item.type !== '胎心' && item.test_result !== ''">测量结果: {{item.test_result}}</text>
						<u-collapse v-if="item.type == '胎心'">
							<u-collapse-item title="点击查看胎心测量结果详情">
								{{item.test_result}}
							</u-collapse-item>
						</u-collapse>
					</view>
				</block>
			</view>
		</scroll-view>
		<view class="pl-3 mt-1 text-danger">{{answerSheetList.length ? info = '以下是日记信息' : ''}}</view>
		<scroll-view v-if="answerSheetList.length || answerNorReportalerts.length">
			<view class="w-100 flex justify-center mt-2 align-center flex-column">
				<block v-for="(item,index) in answerSheetList" :key="index">
					<view class="bg-white border p-3 mb-2 rounded position-relative" style="width: 96%;"
						@click="handleTapQuestionnaire(item)">
						<view class="flex justify-between">
							<u-badge v-if="item.sub_status !== 2" :is-dot="item.sub_status !== 2 " type="error"
								:offset="[0,0]"></u-badge>
							<text>姓名: {{item.survey_Name}}</text>
							<text>{{item.createTime}}</text>
						</view>
						<text class="mt-1 d-block" v-if="item.evaluate_results">测量结果: {{item.evaluate_results}}</text>
					</view>
				</block>
			</view>
			<view class="w-100 flex justify-center mt-2 align-center flex-column" v-if="answerNorReportalerts.length">
				<block v-for="(item,index) in answerNorReportalerts" :key="index">
					<view class="bg-white border p-3 mb-2 rounded position-relative" style="width: 96%;"
						@click="handleShowPhoneModel(item)">
						<view class="flex justify-between">
							<u-badge is-dot type="error" :offset="[0,0]"></u-badge>
							<text>姓名: {{item.P_Name}},分娩天数：{{item.delivery_day}}天,日记未上传类型：{{item.template_Name}},联系方式: {{item.P_Telephone}}</text>
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
		<view v-if="answerSheetList.length + list.length + answerNorReportalerts.length == 0">
			<u-empty text="消息列表为空" mode="message" icon-size="80" margin-top="120"></u-empty>
		</view>
		<u-modal v-model="show" @cancel="handleCancelModel" show-cancel-button confirm-text="拨打电话" @confirm="handleConfirmModel(norReportalerts.P_Telephone)">
			<view class="p-1">
				<view class="flex justify-between flex-wrap">
					<text>姓名：{{norReportalerts.P_Name}}</text>
					<text>联系方式：{{norReportalerts.P_Telephone}}</text>
				</view>
				<view class="flex flex-wrap">
					<text>分娩天数：{{norReportalerts.delivery_day}}天</text>
					<text class="ml-2">日记类型：{{norReportalerts.template_Name}}</text>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				docid: '',
				list: [],
				listStyle: 0,
				answerSheetList: [],
				answerNorReportalerts: [],
				norReportalerts: {},
				info: '',
				errInterval: '',
				errTimeout: '',
				interval: '',
				timeout: '',
				nInterval: '',
				nTimeout: ''
			}
		},
		onLoad() {
			let res = uni.getSystemInfoSync();
			this.listStyle = res.windowHeight / 2;
			// console.log(this.listStyle);
			let errArr = uni.getStorageSync('errArr')
			this.list = errArr
			let answerSheetLists = uni.getStorageSync('answerSheetList');
			this.answerSheetList = answerSheetLists;
			let answerNorReportalerts = uni.getStorageSync('answerNorReportalerts');
			this.answerNorReportalerts = answerNorReportalerts
			console.log(this.answerNorReportalerts);
		},
		onShow() {
			console.log(this.answerNorReportalerts);
			uni.$on('answerSheetUpdate', (data) => {
				console.log(data);
				for (let item of this.answerSheetList) {
					if (item.id == data.id) {
						this.answerSheetList.splice(item, 1)
					}
				}
			})
			this.errInterval = setInterval(() => {
				// console.log(1);
				this.errTimeout = setTimeout(() => {
					// console.log(2);
					let errArr = uni.getStorageSync('errArr')
					this.list = errArr
				}, 0)
			}, 8000)
			this.interval = setInterval(() => {
				// console.log(3);
				this.timeout = setTimeout(() => {
					// console.log(4);
					let answerSheetLists = uni.getStorageSync('answerSheetList');
					this.answerSheetList = answerSheetLists;
				}, 0)
			}, 8000)
			this.nInterval = setInterval(() => {
				// console.log(3);
				this.nTimeout = setTimeout(() => {
					// console.log(4);
					let answerNorReportalerts = uni.getStorageSync('answerNorReportalerts');
					this.answerNorReportalerts = answerNorReportalerts
				}, 0)
			}, 8000);
		},
		onHide() {
			clearInterval(this.errInterval);
			clearTimeout(this.errTimeout);
			clearInterval(this.interval);
			clearTimeout(this.timeout);
			clearInterval(this.nInterval);
			clearTimeout(this.nTimeout);
			console.log('msgCenter onHide');
		},
		destroyed() {
			uni.$off('spliceList');
		},
		methods: {
			handleCancelModel() {
				setTimeout(() => {
					uni.showTabBar();
				}, 300)
			},
			handleShowPhoneModel(item) {
				// console.log(item);
				this.norReportalerts = item;
				this.show = true;
				uni.hideTabBar();
				uni.getStorage({
					key: 'user_login',
					success: res => {
						let notify_readed_doctors = res.data[0].f_userid;
						this.handleSaveNotifyReadInfo(item,notify_readed_doctors);
					}
				})
			},
			// 保存医生查看的未上报信息
			handleSaveNotifyReadInfo(item,notify_readed_doctors){
				let obj = {
					survey_type: item.send_type,
					answer_day: Number(item.send_cycle),
					notify_readed_doctors
				}
				item.send_type == '0' ? obj.awiId = item.awiId : obj.nbid = item.nbID;
				console.log(obj);
				this.$u.post(this.baseUrl + 'SaveNotifyReadInfo',obj).then(res => {
					console.log(res);
					if(res.code == 200){
						console.log(this.answerNorReportalerts);
						for(let jtem of this.answerNorReportalerts){
							if(item.P_Name == jtem.P_Name){
								console.log('删除前',this.answerNorReportalerts);
								this.answerNorReportalerts.splice(jtem,1);
								console.log('删除后',this.answerNorReportalerts);
								uni.setStorageSync('answerNorReportalerts',this.answerNorReportalerts);
							}
						}
					}
				}).catch(err => {
					console.log(err);
				})
			},
			// 拨打电话
			handleConfirmModel(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
				setTimeout(() => {
					uni.showTabBar();
				}, 300)
			},
			handleTapItem(item, index) {
				console.log(item);
				switch (item.type) {
					case '胎心':
						uni.navigateTo({
							url: '../../fetalHeartRate/fetalHeartRate?tapState=3&&detail=' + JSON.stringify(item)
						})
						break;
					case '血糖':
						uni.navigateTo({
							url: '../../bloodSugar/bloodSugar?tapState=3&&detail=' + JSON.stringify(item)
						})
						break;
					case '血压':
						uni.navigateTo({
							url: '../../bloodPressure/bloodPressure?tapState=3&&detail=' + JSON.stringify(item)
						})
						break;
				}
			},
			handleTapQuestionnaire(item) {
				console.log(item);
				uni.navigateTo({
					url: '../../postpartumOrPostoperativeQuestionnaireSurvey/postpartumOrPostoperativeQuestionnaireSurvey?questionnaire=0&detail=' +
						JSON.stringify(item)
				})
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
