<template>
	<view class="content">
		<view class="pl-4 flex align-center text-danger" style="height: 100rpx;" v-if="uncheckednumber > 0">待审核数量：{{uncheckednumber}}</view>
		<view class="flex align-center border" style="height: 100rpx;">
			<view v-for="(item,index) in navList" :key="index" class="flex align-center justify-center flex-1">
				<text>{{item}}</text>
			</view>
		</view>
		
		<scroll-view class="scroll" :style="uncheckednumber > 0 ? 'height: calc(100vh - 200rpx);top: 200rpx;' : 'height: calc(100vh - 100rpx);top: 100rpx;'" scroll-y @scrolltolower="handleScrolltolower">
			<view class="mb-1 border-bottom flex align-center" style="height: 100rpx;" v-for="(item,index) in list"
				:key="index" @click="handleTapItem(item)">
				<text class="flex-1 flex align-center justify-center">{{item.survey_Name}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.Delivery_Mode == 0 ? '顺产' : '剖腹产'}}</text>
				<text class="flex-1 flex align-center justify-center text-ellipsis-2">{{item.evaluate}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.answer_type}}</text>
				<text class="flex-1 flex align-center justify-center"
					:style="handleSubStatusStyle(item.sub_status)">{{item.sub_status == 1 ? '待审核' : '已审核'}}</text>
			</view>
		</scroll-view>
		<u-popup v-model="isShow" mode="center" border-radius="8" width="660" height="660">
			<view class="p-2">
				<view class="flex align-center mb-2">
					<text class="font-md">孕妇/孩子姓名：</text>
					<u-input v-model="screeningCondition.name" border />
				</view>
				<view class="flex align-center mb-2">
					<text class="font-md">手机号：</text>
					<u-input v-model="screeningCondition.tel" border />
				</view>
				<view class="flex align-center mb-2">
					<text class="font-md">身份证号：</text>
					<u-input v-model="screeningCondition.cardID" border />
				</view>
				<view class="flex align-center mb-2">
					<text class="font-md">起始时间段：</text>
					<u-input @click="isStartDate = true" v-model="screeningCondition.startDate" border disabled
						placeholder="请选择时间" />
				</view>
				<view class="flex align-center mb-2">
					<text class="font-md">结束时间段：</text>
					<u-input @click="isEndDate = true" v-model="screeningCondition.endDate" border disabled
						placeholder="请选择时间" />
				</view>
				<u-checkbox-group>
					<u-checkbox @change="checkboxChange" v-model="screeningCondition.checked">只显示孕妇日记</u-checkbox>
				</u-checkbox-group>
				<view class="flex align-center justify-between mt-2">
					<u-button type="success" @click="handleAnswerSheetLists">确定</u-button>
					<u-button type="warning" @click="isShow = false">取消</u-button>
				</view>
			</view>
		</u-popup>
		<u-picker v-model="isStartDate" mode="time" @confirm="handlePickerConfirm($event,0)"></u-picker>
		<u-picker v-model="isEndDate" mode="time" @confirm="handlePickerConfirm($event,1)"></u-picker>
	</view>
</template>

<script>
	import freePopup from '@/components/free-ui/free-popup/free-popup.vue';
	export default {
		components: {
			freePopup
		},
		data() {
			return {
				uncheckednumber: 0,
				screeningCondition: {
					name: '',
					tel: '',
					cardID: '',
					startDate: '',
					endDate: '',
					checked: true
				},
				isShow: false,
				isStartDate: false,
				isEndDate: false,
				navList: ['姓名', '分娩方式', '指导意见', '日记类型', '日记状态'],
				list: [],
				customStyle: {
					marginTop: '30rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					height: '60rpx',
					width: '120rpx'
				},
				background: {
					backgroundColor: '#fc979f'
				},
				statusBarHeight: '',
				paginationobj: {
					rows: 15,
					page: 1,
					sidx: 'createtime',
					sord: 'desc',
					records: 0,
					total: 0
				}
			}
		},
		onLoad() {
		},
		onShow() {
			this.handleAnswerSheetList();
		},
		computed: {
			handleSubStatusStyle() {
				return function(item) {
					return item == 1 ? 'color: #f00;' : 'color: #19be6b;'
				}
			}
		},
		mounted() {
			// #ifdef APP-PLUS
			let height = uni.getSystemInfoSync()
			this.statusBarHeight = height.statusBarHeight + 114;
			// #endif
		},
		// 点击筛选按钮
		onNavigationBarButtonTap() {
			this.isShow = true;
			this.handleInitDate();
		},
		methods: {
			// 获取默认起始&结束 时间段
			handleInitDate() {
				let Time = new Date();
				let y = Time.getFullYear();
				let m = (Time.getMonth() + 1) < 10 ? '0' + (Time.getMonth() + 1) : (Time.getMonth() + 1);
				let d = Time.getDate() < 10 ? '0' + Time.getDate() : Time.getDate();
				let m2 = (Time.getMonth() + 1) < 10 ? '0' + (Time.getMonth()) : (Time.getMonth());
				this.screeningCondition.endDate = y + '-' + m + '-' + d + ' ' + '23' + ':' + '59' + ':' + '59';
				this.screeningCondition.startDate = y + '-' + m2 + '-' + d + ' ' + '00' + ':' + '00' + ':' + '00'
			},
			handlePickerConfirm(e, state) {
				console.log(e);
				let data = this.screeningCondition;
				if (state == 0) {
					data.startDate = e.year + '-' + e.month + '-' + e.day + ' ' + '00' + ':' + '00' + ':' + '00'

				} else {
					data.endDate = e.year + '-' + e.month + '-' + e.day + ' ' + '23' + ':' + '59' + ':' + '59'
				}
			},
			// 日记列表分页查询
			handleAnswerSheetList() {
				this.isShow = false;
				let data = this.screeningCondition;
				let obj = {
					P_IdCard: data.cardID,
					P_Telephone: data.tel,
					userName: data.name,
					survey_type: data.checked == true ? 0 : '',
					startTime: data.startDate,
					endTime: data.endDate,
					paginationobj: JSON.stringify(this.paginationobj)
				}
				console.log(obj);
				this.$u.post(this.baseUrl + 'AnswerSheetLastList', obj).then(res => {
					console.log(res);
					if (res.code == 200 && res.data.pagedatas.length) {
						this.list = [];
						this.paginationobj.total = res.data.pagenumber;
						this.list = this.list.concat(res.data.pagedatas);
						this.uncheckednumber = res.data.uncheckednumber;
					}
				}).catch(err => {
					console.log(err);
				})
			},
			handleAnswerSheetLists() {
				this.list = [];
				this.paginationobj.page = 1;
				this.handleAnswerSheetList();
				let obj = this.screeningCondition;
				obj.name = '';
				obj.tel = '';
				obj.cardID = '';
				obj.startDate = '';
				obj.endDate = '';
			},
			// 滑动翻页
			handleScrolltolower(e) {
				if (this.paginationobj.page < this.paginationobj.total) {
					this.paginationobj.page++;
					this.handleAnswerSheetList();
				} else {
					uni.showToast({
						title: '没有更多数据了!',
						icon: 'none'
					})
				}
			},
			// checkbox选择状态
			checkboxChange(e) {
				console.log(e);
			},
			handleTapItem(item) {
				// console.log(item);
				let data = {
					survey_id: item.survey_id,
					survey_type: item.survey_type,
					survey_Name: item.survey_Name
				}
				// let obj = {
				// 	Delivery_Mode: item.Delivery_Mode == 0 ? '顺产' : '剖腹产',
				// 	sub_status: item.sub_status,
				// 	answer_type: item.answer_type,
				// 	pre_answerID: item.id,
				// 	survey_type: item.survey_type,
				// 	child_answerID: item.id
				// }
				uni.navigateTo({
					url: '../followUpQuestionnaireInquiryDetail/followUpQuestionnaireInquiryDetail?detail=' + JSON.stringify(data)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		.scroll {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
</style>
