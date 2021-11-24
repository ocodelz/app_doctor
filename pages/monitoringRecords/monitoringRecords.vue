<template>
	<view class="content">
		<u-navbar title="记录查询" title-color="#fff" :border-bottom="false" :background="background" back-icon-color="#fff">
			<view class="flex align-center  w-100">
				<view class="position-absolute" style="right: 120rpx;" @click="isShow = true">
					<text class="text-white position-relative">筛选</text>
				</view>
			</view>
		</u-navbar>
		<u-sticky :offset-top="statusBarHeight">
		<view class="nav cell-box bg-white">
			<view class="nav-item" v-for="(item,index) in titleList" :key="index">{{item}}</view>
		</view>
		</u-sticky>
		<scroll-view scroll-y="true" :style="'height:' + scrollHeight + 'px'" @scrolltolower="handleScrolltolower">
			<view v-if="list.length" v-for="(item,index) in list" :key="index">
				<view class="cell-box" @click="handleTapItem(item)">
					<view class="cell">{{item.name}}</view>
					<view class="cell">{{item.t_time}}</view>
					<view class="cell">{{item.duration}}</view>
					<view class="cell u-line-1">{{item.expert_opinion}}</view>
					<view class="cell">{{item.type}}</view>
				</view>
			</view>
		</scroll-view>
		<u-popup v-model="isShow" mode="center" width="500" height="500" border-radius="14">
			<view style="height: 500rpx;" :class="type == ''? 'flex flex-column' : 'flex flex-column  justify-center'">
				<view class="flex flex-column">
					<text>数据状态</text>
					<u-checkbox-group class="ml-3">
						<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in menus" :key="index" :name="item.name">{{item.name}}</u-checkbox>
					</u-checkbox-group>
				</view>
				<text>数据时间</text>
				<u-radio-group class="ml-3">
					<u-radio @change="radioChange"  v-model="radioValue" v-for="(item, index) in radioMenus" :key="index" :name="item.name" :disabled="item.disabled">
						{{item.name}}
					</u-radio>
				</u-radio-group>
				<view v-if="type == ''">
					<text>数据类型</text>
					<u-checkbox-group class="ml-3">
						<u-checkbox @change="checkboxType" v-model="item.checked" v-for="(item, index) in checkbox" :key="index" :name="item.name">{{item.name}}</u-checkbox>
					</u-checkbox-group>
				</view>
				<view style="width: 480rpx;">
					<view class="ml-2">
						<u-input v-model="search" placeholder="请输入要查询的姓名或手机号" :border="true" />
					</view>
					<u-button @click="handleTapSearchGetData" :custom-style="customStyle" type="primary">搜索</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	// import tool from '@/utils/util.js';
	import freePopup from '@/components/free-ui/free-popup/free-popup.vue';
	export default {
		components: {
			freePopup
		},
		data() {
			return {
				scrollHeight: 0,
				customStyle: {
					marginTop: '30rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					height: '60rpx',
					width: '120rpx'
				},
				menus: [{
						name: '已上传',
						checked: true
					},
					{
						name: '已审核',
						checked: true
					}
				],
				checkbox: [{
						name: '胎心',
						checked: true
					},
					{
						name: '血糖',
						checked: false
					},
					{
						name: '血压',
						checked: false
					}
				],
				radioMenus: [{
						name: '一周',
						disabled: false
					},
					{
						name: '一个月',
						disabled: false
					},
					{
						name: '二个月',
						disabled: false
					}, {
						name: '三个月',
						disabled: false
					}
				],
				radioValue: '一周',
				background: {
					backgroundColor: '#fc979f'
				},
				titleList: ['姓名', '时间', '时长', '专家意见', '类型'],
				list: [],
				searchData: [],
				bloodSugarList: [],
				bloodPressureList: [],
				docid: '',
				isShow: false,
				search: '',
				statusBarHeight: '',
				status: '',
				typeTap: '',
				type: '',
				paginationobj: {
					rows: 20,
					page: 1,
					sidx: '',
					sord: 'desc',
					records: 0,
					total: 0
				},
				initPage: 0
			}
		},
		onLoad(e) {
			let type = e.type;
			this.typeTap = e.type;
			if (type == 0) {
				this.type = '0'
			} else if (type == 1) {
				this.type = '1'
			} else {
				this.type = ''
			}
			this.handleGetData();
		},
		mounted() {
			// #ifdef APP-PLUS
			let height = uni.getSystemInfoSync()
			this.statusBarHeight = height.statusBarHeight + 114;
			// #endif
			let scrollHeight = uni.getSystemInfoSync();
			this.scrollHeight = scrollHeight.windowHeight;
		},
		methods: {
			handleScrolltolower(e){
				if(this.paginationobj.page < this.paginationobj.total){
					this.paginationobj.page++;
					this.handleGetData();
				}else{
					uni.showToast({
						title: '没有更多数据了',
						icon: 'none'
					})
				}
			},
			// 点击数据列表
			handleTapItem(item) {
				let obj = item;
				if (obj.type == '血糖') {
					uni.navigateTo({
						url: '../bloodSugar/bloodSugar?tapState=1&&detail=' + JSON.stringify(item)
					})
				} else if (obj.type == '血压') {
					uni.navigateTo({
						url: '../bloodPressure/bloodPressure?tapState=1&&detail=' + JSON.stringify(item)
					})
				} else if (obj.type == '胎心') {
					uni.navigateTo({
						url: '../fetalHeartRate/fetalHeartRate?tapState=1&&detail=' + JSON.stringify(item)
					})
				}
			},
			radioChange(e){
				this.radioValue = e;
			},
			// 选择数据上传状态
			checkboxChange(e) {
				this.status = e;
				for (let item of this.menus) {
					if (item.name == this.status) {
						item.checked = !this.status.value;
					}
				}
			},
			// 选择数据类型
			checkboxType(e) {
				for (let item of this.checkbox) {
					if (item.name == e.name) {
						item.checked = !e.value;
					}
				}
			},
			// 获取数据
			handleGetData() {
				let statusArr = [],
					typeArr = [];
				for (let item of this.menus) {
					if (item.checked == true) {
						statusArr.push(item.name)
					}
				}
				if (this.typeTap == 0) {
					typeArr = '';
					for (let item of this.checkbox) {
						if (item.checked == true) {
							typeArr = '血糖';
						}
					}
				} else if (this.typeTap == 1) {
					typeArr = '';
					for (let item of this.checkbox) {
						if (item.checked == true) {
							typeArr = '血压';
						}
					}
				} else {
					typeArr = [];
					for (let item of this.checkbox) {
						if (item.checked == true) {
							typeArr.push(item.name);
						}
					}
					typeArr = typeArr.join(',')
				}

				let data = {
					status: statusArr.join(','),
					docid: '',
					time: this.radioValue,
					type: typeArr,
					name: this.search,
					paginationobj: JSON.stringify(this.paginationobj)
				}
				console.log(data);
				this.$u.post('DocQueryYFCLInfo', data).then(res => {
					console.log(res);
					if (res.code == 200 && res.data.pagedatas.length) {
						this.paginationobj.total = res.data.pagenumber;
						let arr = res.data.pagedatas;
						this.list = this.list.concat(arr);
						this.search = '';
						this.isShow = false;
						// this.radioValue = ''
					} else {
						this.search = '';
						this.isShow = false;
						// this.radioValue = ''
					}
				}).catch(e => {
					uni.showToast({
						title: '未知错误',
						icon: 'none’'
					})
				})
			},
			handleTapSearchGetData(){
				this.list = [];
				this.paginationobj.page = 1;
				this.handleGetData();
			}
		}
	}
</script>

<style scoped lang="scss">
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-flow: nowrap;
		height: 70rpx;
		border: 1rpx solid #ccc;

		.nav-item {
			box-sizing: border-box;
			width: 33.33%;
			font-size: 30rpx;
			// color: #333;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.cell-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-flow: nowrap;
		width: 100%;

		.cell {
			border-bottom: 1px solid #F5F5F5;
			box-sizing: border-box;
			width: 25%;
			height: 100rpx;
			font-size: 24rpx;
			// color: #333;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
		}
	}
</style>
