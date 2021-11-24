<template>
	<view class="content">
		<view class="flex align-center border-bottom" style="height: 100rpx;">
			<view v-for="(item,index) in navList" :key="index" class="flex align-center justify-center flex-1">
				<text>{{item}}</text>
			</view>
		</view>
		<scroll-view class="scroll" scroll-y @scrolltolower="handleScrolltolower">
			<view class="mb-1 border-bottom flex align-center" style="height: 100rpx;" v-for="(item,index) in list"
				:key="index">
				<text class="flex-1 flex align-center justify-center">{{item.P_Name}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.template_Name}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.delivery_day}}</text>
				<text class="flex-1 flex align-center justify-center">{{item.Delivery_Date}}</text>
				<text class="flex-1 flex align-center justify-center"
					@click.stop="handleMakeAPhoneCall(item.P_Telephone)">{{item.P_Telephone}}</text>
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
				<u-radio-group v-model="value">
					<u-radio @change="radioChange" v-for="(item, index) in radioList" :key="index" :name="item.name"
						:disabled="item.disabled">
						{{item.name}}
					</u-radio>
				</u-radio-group>
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
				navList: ['姓名', '日记类型', '分娩天数', '分娩日期', '电话'],
				list: [],
				radioList: [{
						name: '全部',
						disabled: false
					},
					{
						name: '辣妈',
						disabled: false
					},
					{
						name: '萌宝',
						disabled: false
					}
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: '全部',
				paginationobj:{
					rows: 15,
					page: 1,
					sidx: '',
					sord: 'desc',
					records: 0,
					total: 0
				}
			}
		},
		onLoad() {
			this.handleAnswerNorReportList();
		},
		onNavigationBarButtonTap() {
			this.isShow = true;
		},
		methods: {
			// 发请求 获取日记未上报列表
			handleAnswerNorReportList() {
				let obj = {
					paginationobj: JSON.stringify(this.paginationobj),
					survey_type: this.value == '全部' ? '' : this.value == '辣妈' ? '0' : '1',
					StartTime: this.filterCriteria.startDate,
					EndTime: this.filterCriteria.endDate
				}
				console.log(obj);
				this.$u.post(this.baseUrl + 'AnswerNorReportList',obj).then(res => {
					console.log(res);
					let data = res.data.pagedatas;
					if(res.code == 200 && data.length){
						this.paginationobj.total = res.data.pagenumber;
						this.list = this.list.concat(data);
					}else{
						this.$lz.toast('没有找到相关的数据!');
					}
				}).catch(err => {
					console.log(err);
				})
			},
			handleScrolltolower(e){
				console.log(e);
				if(this.paginationobj.page < this.paginationobj.total){
					this.paginationobj.page++;
					this.handleAnswerNorReportList();
				}else{
					this.$lz.toast('没有更多数据了')
				}
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
				this.paginationobj.page = 1;
				this.handleAnswerNorReportList();
				this.isShow = false;
			},
			radioChange(e) {
				console.log(e);
				this.value = e;
				console.log(this.value);
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
