<template>
	<view class="flex flex-column" :style="'height:' + pageHeight + 'px'">
		<!-- <u-navbar class="flex" title="血糖测量" title-color="#fff" :border-bottom="false" :background="background" back-icon-color="#fff" back-icon-size="40"></u-navbar> -->
		<!-- 测量结果正文 -->
		<view class="content flex flex-column" style="height:400rpx;">
			<view class="flex align-center justify-center content-box">
				<view class="content-box-xy font-weight-normal flex align-center justify-center flex-column">
					<!-- 血糖值 -->
					<text style="font-size: 80rpx;color: #80d478;">{{ bloodSugarObj.bloodGlucoseLevel }}</text>
					<!-- 单位 -->
					<text class="position-relative font-sm" style="bottom: 16rpx;color: #cecccf;">mmol/L</text>
					<!-- 血糖测试结果 -->
					<view v-if="isresult" class="flex align-center justify-center rounded-circle" :style="xtResultInfo()" style="width: 130rpx;height: 40rpx;">
						<text class="text-white font-md">{{ bloodSugarObj.bloodGlucoseLestResults }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 血糖时间tabs -->
		<view class="position-relative flex " style="bottom: 16rpx;height: 80rpx;background-color:#fac6b6 ;">
			<u-tabs :list="list" font-size="30" gutter="25" active-color="#2B85E4" inactive-color="#000000" bg-color="#fac6b6"
			 :show-bar="false" :current="current" @change="change" :bold="false"></u-tabs>
		</view>
		<view class="flex flex-column">
			<view class="" v-for="(item, index) in sugarControlTarget" :key="index">
				<view v-if="current == index" class="bg-white position-relative flex align-center justify-center border" style="bottom: 16rpx; height: 80rpx;">
					<u-icon name="miaozhun" custom-prefix="custom-icon" size="30"></u-icon>
					<text class="font-md ml-1">控糖目标</text>
					<text class="font-md ml-2" style="color: #94a6b7;">{{ item.jieguozhifanwei1}}</text>
					<text class="font-md ml-1" style="color: #94a6b7;">-{{ item.jieguozhifanwei2}}</text>
				</view>
			</view>
		</view>
		<!-- 分割线 -->
		<!-- 	<view class="w-100 position-relative" style="bottom: 16rpx; height: 10rpx; background-color: #efefef;"></view>
		 -->
		<!-- 标签 -->
		<view class="w-100 position-relative border-bottom" style=" height: 140rpx;">
			<view class="mt-2 ml-2">为此次血糖添加标签</view>
			<block v-for="(item1, index1) in tagList" :key="index1">
				<u-tag class="flex ml-2 mt-2" shape="circle" mode="plain" border-color="#e6e5ea" :class="checkTagList.indexOf(item1) != -1 ? 'active' : 'tag'"
				 :text="item1" @click="tapState == 0 ? handleTag(item1) : ''" />
			</block>
		</view>
		<!-- 当前感觉 -->
		<view class="mt-2" style=" height: 140rpx;">
			<text class="ml-2">当前感觉</text>
			<view class="flex flex-wrap">
				<block v-for="(item2, index2) in currentFeeling" :key="index2">
					<u-tag class="flex ml-2 mt-2 tag" shape="circle" :index="index2" mode="plain" border-color="#e6e5ea" :text="item2"
					 :class="checkCurrentFeeling.indexOf(item2) !== -1 ? 'active' : 'tag'" @click="tapState == 0 ? handleTagClick(item2) : ''" />
				</block>
			</view>
		</view>
		<!-- 测量结果 -->
		<view class="flex flex-column pl-5">
			<!-- -->
			<view class="flex align-center" v-if="bloodSugarObj.bloodGlucoseLestResults">
				<!-- -->
				<text class="font-md font-weight-bold">检测结果：</text>
				<text class="font-md font-weight-bold text-danger">{{ bloodSugarObj.bloodGlucoseLestResults }}</text>
			</view>
			<!-- -->
			<view class="flex align-center" v-if="bloodSugarObj.time">
				<!-- -->
				<text class="font-md font-weight-bold">检测时间：{{ bloodSugarObj.time}}</text>
				<text class="font-md font-weight-bold text-danger"></text>
			</view>
		</view>
		<!-- 审核结果 -->
		<view class="flex flex-column pl-5">
			<!-- v-if="audit" -->
			<view class="flex align-center" v-if="bloodSugarObj.exam_result">
				<!--  -->
				<text class="font-md font-weight-bold">审核结果：</text>
				<text class="font-md font-weight-bold text-danger">{{ bloodSugarObj.exam_result }}</text>
			</view>
			<view class="flex align-center" v-if="bloodSugarObj.exam_time">
				<!--  -->
				<text class="font-md font-weight-bold">审核时间：{{ bloodSugarObj.exam_time }}</text>
				<text class="font-md font-weight-bold text-danger"></text>
			</view>
			<!-- <view class="flex align-center" v-if="bloodSugarObj.sbcljy">
				<text class="font-lg font-weight-bold">设备建议：</text>
				<text class="font-lg font-weight-bold text-danger">{{bloodSugarObj.sbcljy}}</text>
			</view> -->
			<view class="flex align-center" v-if="bloodSugarObj.yishengjianyi">
				<!--  -->
				<text class="font-md font-weight-bold">医生建议：</text>
				<text class="font-md font-weight-bold text-danger">{{ bloodSugarObj.yishengjianyi }}</text>
			</view>
		</view>
		<!-- 判定结果 -->
		<view v-if="tapState == 3">
			<view class="pl-5">
				<!-- <text class="font-md font-weight-bold">审核结果:</text> -->
				<view>
					<text @click="show = true" class="font-md font-weight-bold" v-show="isValue == ''">请选择判断结果</text>
					<text @click="show = true" class="font-md font-weight-bold">{{isValue}}</text>
					<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
				</view>
			</view>
			<view class="pl-5">
				<!-- <text class="font-md font-weight-bold">审核结果:</text> -->
				<view class="mr-5 flex align-center justify-between">
					<!-- <text class="font-md font-weight-bold" @click="isSelectShow = true" v-show="doctorDeptname == ''">选择医生</text> -->
					<text @click="isSelectShow = true" v-show="doctorDeptname" class="font-md font-weight-bold">科室:{{doctorDeptname}}
						姓名:{{doctorName}}</text>
					<u-select title="选择您的医生" v-model="isSelectShow" mode="mutil-column-auto" :list="addlist" @confirm="handleDoctorNumberSelect"></u-select>
				</view>
			</view>
			<view class="pl-5">
				<text class="font-md font-weight-bold">医生建议:</text>
				<view class="mr-5 flex align-center justify-center">
					<textarea placeholder="请输入医生建议" placeholder-style="font-size:28rpx;" v-model="textareaValue" style="width: 97%;margin-top: 10rpx;height: 80rpx;border: 2rpx solid #dee2e6;border-radius: 12rpx;" />
					</view>
			</view>
			<u-button type="success" :custom-style="customStyle" @click="handleSubmit">提交审核</u-button>
		</view>
		
	</view>
</template>

<script>
	// let bldsgr = null;
	// let bldsugarDevice = require('@/utils/BTDevice/BldSugarBTDevice.js');
	// import {
	// 	clearStorageList,
	// 	setStorageList
	// } from '@/common/storage.js';
	// import tool from '@/utils/util.js';

	export default {
		data() {
			return {
				show:false,
				isSelectShow:false,
				doctorDeptname:'',
				doctorName:'',
				customStyle: {
					width:'400rpx',
					height: '60rpx',
					marginTop:'40rpx'
				},
				textareaValue:'',
				// 提示框显示状态
				//	isTips: false,
				// 查看结果显示状态
				audit: false,
				// 血糖测试结果显示状态
				isresult: true,
				// state: '', // 添加当前感觉
				// 时间
				// myDate: '20/09/03 周四 15:15',
				// 自定义导航样式
				background: {
					backgroundColor: '#fc979f'
				},
				// 医生编号数组
				addlist: [],
				// tab列表
				list: [{
						name: '空腹'
					},
					{
						name: '餐后2小时'
					}
				],
				isValue: '',
				current: 1, //下标
				// tagCurrent: -1,
				sugarControlTarget: [],
				tagList: ['已服口服药', '已注射胰岛素', '运动后'],
				checkTagList: [],
				currentFeeling: ['正常', '头晕', '头痛', '心慌', '恶心', '呕吐'],
				checkCurrentFeeling: [],
				bloodSugarObj: {
					// 检测时间
					time: '',
					// 审核时间
					exam_time: '',
					// 血糖值
					bloodGlucoseLevel: '---',
					// 测试结果
					bloodGlucoseLestResults: '',
					// 设备测量建议
					sbcljy: '',
					// 0有效 1无效
					flag: 0,
					// 控制液
					effect: '',
					// 医生建议
					yishengjianyi: '',
					// 审核结果
					exam_result: ''
				},
				actionSheetList: [{
						text: '血糖高'
					},
					{
						text: '血糖低'
					},
					{
						text: '血糖正常'
					},
					{
						text: '无效'
					}
				],
				eat: '',
				// 跳转状态
				tapState: 0,
				pageHeight: 0,
				bloodSugarCqList: [],
				bloodSugarChList: [],
				type:'',
				id:''
				
			};
		},
		mounted() {
			let pageHeight = uni.getSystemInfoSync();
			this.pageHeight = pageHeight.windowHeight;
		},
		onLoad(e) {
			this.tapState = e.tapState
			let getResult = uni.getStorageSync('result_storage');
			for (let item of getResult) {
				if (item.classify_name == '血糖' && item.teshutiaojian == '餐前') {
					this.bloodSugarCqList.push(item)
				} else if (item.classify_name == '血糖' && item.teshutiaojian == '餐后') {
					this.bloodSugarChList.push(item)
				}
			}
			for (let item of this.bloodSugarCqList) {
				if (item.jieguopanding == "正常") {
					this.sugarControlTarget.push(item)
				}
			}
			for (let _item of this.bloodSugarChList) {
				if (_item.jieguopanding == "正常") {
					this.sugarControlTarget.push(_item)
				}
			}
			let obj = JSON.parse(e.detail);
			this.type = obj.type;
			this.id = obj.id;
			this.bloodSugarObj.bloodGlucoseLestResults = obj.test_result;
			this.bloodSugarObj.time = obj.t_time;
			this.bloodSugarObj.exam_result = obj.exam_result;
			this.bloodSugarObj.yishengjianyi = obj.yishengjianyi;
			this.bloodSugarObj.exam_time = obj.exam_time;
			this.bloodSugarObj.bloodGlucoseLevel = obj.celiangzhi;
			if (obj.is_eat == '空腹') {
				this.current = 0;
			} else {
				this.current = 1;
			}
			let tapArr = obj.current_feeling ? obj.current_feeling.split(',') : [];
			let tagArr = obj.xuetang_lable ? obj.xuetang_lable.split(',') : [];
			for (let item of tagArr) {
				this.handleTag(item);
			}
			for (let item of tapArr) {
				this.handleTagClick(item);
			}
			uni.getStorage({
				key:'user_login',
				success:res => {
					// console.log(res);
					this.doctorDeptname = res.data[0].f_deptname;
					this.doctorName = res.data[0].f_username;
				}
			})
			this.handleGetDoctorInfo();
		},
		methods: {
			// 血糖测量显示状态
			xtResultInfo() {
				try {
					let xt = Number(this.bloodSugarObj.bloodGlucoseLevel);
					let index = this.current;
					let _result = '',
						_bg = '';
					switch (index) {
						case 0:
							for (let item of this.bloodSugarCqList) {
								if (item.jieguopanding === '血糖低' && xt >= item.jieguozhifanwei1 && xt < item.jieguozhifanwei2) {
									_result = item.jieguopanding;
									_bg = '#5500ff';
									// break;
								}
								if (item.jieguopanding === '正常' && xt >= item.jieguozhifanwei1 && xt <= item.jieguozhifanwei2) {
									_result = item.jieguopanding;
									_bg = '#19be6b';
									// break;
								}
								if (item.jieguopanding === '血糖高' && xt > item.jieguozhifanwei1 && xt <= item.jieguozhifanwei2) {
									_result = item.jieguopanding;
									_bg = '#f00';
									// break;
								}
							}
							this.bloodSugarObj.bloodGlucoseLestResults = _result;
							return `backgroundColor:` + _bg;
							break;
						case 1:
							for (let item of this.bloodSugarChList) {
								if (item.jieguopanding === '正常' && xt >= item.jieguozhifanwei1 && xt <= item.jieguozhifanwei2) {
									_result = item.jieguopanding;
									_bg = '#19be6b';
									break;
								}
								if (item.jieguopanding === '血糖低' && xt >= item.jieguozhifanwei1 && xt < item.jieguozhifanwei2) {
									_result = item.jieguopanding;
									_bg = '#5500ff';
									break;
								}
								if (item.jieguopanding === '血糖高' && xt > item.jieguozhifanwei1 && xt <= item.jieguozhifanwei2) {
									_result = item.jieguopanding;
									_bg = '#f00';
									break;
								}
							}
							this.bloodSugarObj.bloodGlucoseLestResults = _result;
							return `backgroundColor:` + _bg;
							break;
					}
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// tab切换
			change(index) {
				try {
					this.current = this.tapState == 0 ? index : this.current;
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 血糖标签
			handleTag(item) {
				try {
					if (this.checkTagList.indexOf(item) == -1) {
						this.checkTagList.push(item);
					} else {
						this.checkTagList.splice(this.checkTagList.indexOf(item), 1);
					}
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 当前感觉
			handleTagClick(item) {
				try {
					if (this.checkCurrentFeeling.indexOf(item) == -1) {
						this.checkCurrentFeeling.push(item);
					} else {
						this.checkCurrentFeeling.splice(this.checkCurrentFeeling.indexOf(item), 1);
					}
				} catch (e) {
					console.log(e.message)
					this.testdata = e.message;
				}
			},
			handleSubmit(){
				if (!this.isValue) {
					uni.showToast({
						title: '判断结果不能为空',
						icon: 'none'
					})
					return;
				}
				if (!this.textareaValue) {
					uni.showToast({
						title: '医生建议不能为空',
						icon: 'none'
					})
					return;
				}
				let data = {
					id: this.id,
					eresult: this.isValue,
					ysjy: this.textareaValue,
					type: this.type,
					edoc: this.doctorName
				}
				console.log(JSON.stringify(data));
				this.$u.post('DocUploadExamResult',data).then(res => {
					console.log(res);
					uni.showToast({
						title:res.info,
						icon:'none',
						duration:3000
					})
					setTimeout(() => {
						uni.navigateBack()
					},3000)
				})
			},
			actionSheetCallback(index){
				this.isValue = this.actionSheetList[index].text;
				if(this.isValue == '血糖正常'){
					this.textareaValue = '遵医嘱，继续监测'
				}else{
					this.textareaValue = ''
				}
			},
			handleDoctorNumberSelect(e) {
				for (let i in e) {
					this.doctorDeptname = e[i].value;
					this.doctorName = e[i].label;
				}
			},
			handleGetDoctorInfo(){
				let that = this;
				uni.request({
					url: 'http://app.jnthinksoft.cn:6060/api/eytsystem/getalldocotor',
					success: (res) => {
						// console.log(res);
						that.getData(res.data.data);
					}
				});
			},
			getData(arrData) {
				if (arrData.length > 0) {
					let data = [];
					let dataKey = [];
					let that = this;
					arrData.forEach((item, index) => {
						if (!data[item.f_deptid]) {
							dataKey.push(item.f_deptid);
							data[item.f_deptid] = {
								label: item.f_deptname,
								value: item.f_deptid,
								children: []
							};
						}
						data[item.f_deptid].children.push({
							label: item.f_username,
							value: item.f_fullname
						})
					})
					dataKey.map((res) => {
						that.addlist.push(data[res]);
					})
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.content {
		background: linear-gradient(180deg, #fc979f 0%, #fac6b6 49%, #fac6b6 51%, #fac6b6 100%);
		width: 100%;
		height: 400rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.content-box {
			width: 300rpx;
			height: 290rpx;
			background-color: #fcfcfb;
			border-radius: 100%;

			.content-box-xy {
				width: 250rpx;
				height: 250rpx;
				background-color: #ffffff;
				border-radius: 100%;
				border: 1rpx solid #eeeeee;
			}
		}
	}

	.tag {
		color: #3dbbff;
	}

	.active {
		color: #f00;
	}
</style>
