<template>
	<view class="content">
		<view class="flex align-center border-bottom" style="height: 100rpx;">
			<view v-for="(item,index) in navList" :key="index" class="flex align-center justify-center flex-1">
				<text>{{item}}</text>
			</view>
		</view>
		<scroll-view class="scroll" scroll-y>
			<view class="mb-1 border-bottom flex align-center" style="height: 100rpx;" v-for="(item,index) in list"
				:key="index">
				<text class="flex-1 flex align-center justify-center">{{item.survey_type}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.followvisit_number}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.followvisit_state_number}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.followvisit_rate}}</text>
			</view>
		</scroll-view>
		<u-popup v-model="isShow" mode="center" border-radius="8" width="660" height="660">
			<view class="p-2">
				<view class="flex align-center mb-2">
					<text class="font-md">起始时间段：</text>
					<u-input @click="isStartDate = true" v-model="filterCriteria.startDate" border disabled
						placeholder="请选择时间" />
				</view>
				<view class="flex align-center mb-2">
					<text class="font-md">结束时间段：</text>
					<u-input @click="isEndDate = true" v-model="filterCriteria.endDate" border disabled
						placeholder="请选择时间" />
				</view>
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
	export default {
		data() {
			return {
				isShow: false,
				filterCriteria: {
					startDate: '',
					endDate: ''
				},
				isStartDate: false,
				isEndDate: false,
				navList: ['日记类型', '应到人数', '实到人数', '复诊率'],
				list: []
			}
		},
		onLoad() {
			this.handleAnswerNorReportList();
		},
		// 点击筛选按钮
		onNavigationBarButtonTap() {
			this.isShow = true;
		},
		methods: {
			// 发请求 获取复诊到诊率数据
			handleAnswerNorReportList(){
				let obj = {
					StartTime: this.filterCriteria.startDate,
					EndTime: this.filterCriteria.endDate
				}
				console.log(obj);
				this.$u.post(this.baseUrl + 'FollowVisitArrivedRate',obj).then(res => {
					console.log(res);
					let data = res.data;
					if(res.code == 200 && data.length){
						this.list = data;
					}else{
						this.$lz.toast('没有找到相关的数据!');
					}
				}).catch(err => {
					this.$lz.toast(err.errMsg)
				})
			},
			// 拨打电话
			handleMakeAPhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			handlePickerConfirm(e, state) {
				console.log(e);
				let data = this.filterCriteria;
				if (state == 0) {
					data.startDate = e.year + '-' + e.month + '-' + e.day + ' ' + '00' + ':' + '00' + ':' + '00'

				} else {
					data.endDate = e.year + '-' + e.month + '-' + e.day + ' ' + '23' + ':' + '59' + ':' + '59'
				}
			},
			handleAnswerSheetLists() {
				this.list = [];
				this.handleAnswerNorReportList();
				this.isShow = false;
				this.filterCriteria.startDate = '';
				this.filterCriteria.endDate = '';
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		.scroll {
			height: calc(100vh - 100rpx);
			position: fixed;
			top: 100rpx;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
</style>
