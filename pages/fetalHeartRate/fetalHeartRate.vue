<template>
	<view class="flex flex-column" :style="'height:' + pageHeight + 'px'">
		<!-- 测量结果 -->
		<view v-if="audit">
			<view class="flex" v-if="c_time || exam_result">
				<view>
					<text class="font font-weight-bold">测量时间：</text>
					<text class="font font-weight-bold text-info">{{ c_time }}</text>
				</view>
				<view class="flex align-center ml-2" v-if="exam_result">
					<text class="font font-weight-bold">审核结果：</text>
					<text class="font font-weight-bold text-info">{{ exam_result }}</text>
				</view>
			</view>
			<view v-if="exam_time">
				<text class="font font-weight-bold">审核时间：</text>
				<text class="font font-weight-bold text-info">{{ exam_time }}</text>
			</view>
			<view v-if="yishengjianyi">
				<text class="font font-weight-bold">医生建议：</text>
				<text class="font font-weight-bold text-info">{{ yishengjianyi }}</text>
			</view>
		</view>
		<view v-if="tapState == 3">
			<view>
				<text @click="show = true" class="font-md font-weight-bold" v-show="isValue == ''">请选择判断结果</text>
				<text @click="show = true" class="font-md font-weight-bold">{{isValue}}</text>
				<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
			</view>
			<view>
				<!-- <text class="font-md font-weight-bold">审核结果:</text> -->
				<view class="mr-5 flex align-center justify-between">
					<!-- <text class="font-md font-weight-bold" @click="isSelectShow = true">选择医生</text> -->
					<text @click="isSelectShow = true" v-show="doctorDeptname" class="font-md font-weight-bold">科室:{{doctorDeptname}} 姓名:{{doctorName}}</text>
					<u-select title="选择您的医生" v-model="isSelectShow" mode="mutil-column-auto" :list="addlist" @confirm="handleDoctorNumberSelect"></u-select>
				</view>
			</view>
			<view>
				<text class="font font-weight-bold">医生建议:</text>
				<view class="flex align-center justify-center">
					<textarea placeholder="请输入医生建议" placeholder-style="font-size:28rpx;" v-model="textareaValue" style="width: 98%;margin-top: 10rpx;height: 200rpx;border: 2rpx solid #dee2e6;border-radius: 12rpx;" />
					</view>
			</view>
			<u-button type="success" :custom-style="customStyle" @click="handleSubmit">提交审核</u-button>
		</view>
		<!-- <view style="height: 35rpx;">{{ testdata }}121</view> -->

		<!-- 胎心 -->
		<view id="chart-taixin" class="flex flex-1">
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="chart-size" disable-scroll="true" @touchstart="touchLineA"
			 @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
		</view>
		<!-- 宫缩压 -->
		<view id="chart-gsy" class="flex flex-1" style="margin-top: -20rpx;">
			<!-- :style="'height:'+chart2Height+'px'", -->
			<canvas canvas-id="canvasLineB" id="canvasLineB" class="chart-size" disable-scroll="true" @touchstart="touchLineB"
			 @touchmove="moveLineB" @touchend="touchEndLineB"></canvas>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import tool from '@/utils/util.js';
	var _self;
	var canvaLineA = null;
	var canvaLineB = null;
	export default {
		data() {
			return {
				doctorDeptname:'',
				doctorName:'',
				isSelectShow:false,
				addlist:[],
				actionSheetList: [{
						text: '有反应'
					},
					{
						text: '无反应'
					},
					{
						text: '正弦曲线'
					},
					{
						text: '不满意'
					}
				],
				show:false,
				id:'',
				type:'',
				 
				isValue:'',
				textareaValue:'',
				maindataInsert: false,
				testdata: '',
				// 胎心1
				taixinlv1: '',
				// 胎心2
				taixinlv2: '',
				//
				c_time: '',
				// 测量时长
				clTime: '',
				// 审核时间
				exam_time: '',
				// 审核结果
				exam_result: '',
				// 医生建议
				yishengjianyi: '',
				// 审核结果显示状态
				audit: true,
				// 宫缩压
				fetalHeartRate: {
					manualFetalMovement: ''
				},
				// 胎心
				chartData: {
					scrollPosition: 'right',
					title: 'xx',
					subtitle: {},
					animation: false,
					categories: [0, 1, 2, 3, 4, 5],
					series: [{
							name: 'a1',
							data: [],
							color: '#000000'
						},
						{
							name: 'a2',
							data: [],
							color: '#c077bf'
						}
					]
				},
				// 宫缩压
				chartDataB: {
					scrollPosition: 'right',
					title: 'xx',
					subtitle: {},
					animation: false,
					categories: [0, 1, 2, 3, 4, 5],
					series: [{
						name: '',
						data: [],
						color: '#000000'
					}]
				},
				gongsuoya: '',
				// 图表初始样式
				cWidth: '',
				cHeight: '',
				bWidth: '',
				bHeight: '',
				pixelRatio: 1,
				// 测量结果
				c_result: '待医生诊断',
				// 测试时间
				nowTime: '',
				// 测量结果显示状态
				isResult: true,
				taixinId: '',
				pageHeight: 0,
				tapState:0,
				customStyle: {
					width:'400rpx',
					height: '60rpx',
					marginTop:'40rpx',
					padding:'35rpx'
				},
				 timer:'', //定时器名称
				 stopInterVal:''
				 // state:1
			};
		},
		onReady() {
			try {
				let that = this;
				let info = uni.createSelectorQuery().select('#chart-taixin');
				info.boundingClientRect(function(data) {
					//data - 各种参数
					//this.cWidth = uni.upx2px(750);
					that.cHeight = data.height;
					that.bHeight = data.height;
					that.cWidth = data.width;
					that.bWidth = data.width; //;uni.upx2px(750);
					that.getServerData();
					that.getServerDatas();
				}).exec();
			} catch (e) {
				console.log(e.message);
				this.testdata = e.message;
			}
		},
		onLoad(e) {
			try {
				this.tapState = e.tapState
				console.log(this.tapState);
				let that = this;
				_self = this;
				// that.state = that.state;
				if(this.tapState == 2){
					this.stopInterVal = setInterval(() => {
						setTimeout(() => {
							let tx_list = uni.getStorageSync('tx_list');
							for(let item of tx_list){
								if(item.id == this.taixinId && item.rt_endtime !== null){
									clearInterval(this.stopInterVal);
									uni.showModal({
										title: '提示',
										content: '本次测量已结束',
										showCancel: false,
										success: (res) => {
											if (res.confirm) {
												uni.navigateBack({
													delta:1
												});
											}
										}
									})
								}
							}
						},0)
					},5000)
				}
				uni.getSystemInfo({
					success: res => {
						_self.pageHeight = res.windowHeight;
					}
				});
				that.chartData.series[0].data = [];
				that.chartData.series[1].data = [];
				that.chartDataB.series[0].data = [];
				that.chartData.categories = [];
				that.chartDataB.categories = [];
				for (var i = 0; i < 300; i++) {
				let xLabel = tool.secoundtoMs(i);
				that.chartData.categories.push(xLabel);
				that.chartDataB.categories.push(xLabel);
				}
				that.getServerData();
				that.getServerDatas();
				canvaLineA.updateData(that.chartData);
				canvaLineB.updateData(that.chartDataB);
				if (e.detail) {
					let _arr = JSON.parse(e.detail);
					if(this.tapState == 2){
						uni.setNavigationBarTitle({
							title: _arr.p_name+'正在进行胎心监护...'
						}) 
					}else{
						uni.setNavigationBarTitle({
							title: '胎心监护'
						}) 
					}
					// console.log(_arr)
					that.c_time = _arr.t_time;
					that.type = _arr.type;
					that.yishengjianyi = _arr.expert_opinion;
					that.exam_result = _arr.exam_result;
					that.exam_time = _arr.exam_time;
					that.chartData.series[0].data = [];
					that.chartData.series[1].data = [];
					//this.chartDataB.categories = [0, 1, 2, 3, 4, 5];
					that.chartDataB.series[0].data = [];
					that.chartData.categories = [];
					that.chartDataB.categories = [];
					that.taixinId = _arr.id;
					canvaLineA.updateData(that.chartData);
					canvaLineB.updateData(that.chartDataB);
					if(this.tapState == 1 || this.tapState == 3){
						this.handleErrData();
					}else if(this.tapState == 2){
						this.handleErrData();
						this.timer = setInterval(() => {
							setTimeout(()=> {
								 this.handleErrData();
							},0)
						},6000)
					}
				}
				uni.getStorage({
					key:'user_login',
					success:res => {
						this.doctorDeptname = res.data[0].f_deptname;
						this.doctorName = res.data[0].f_username;
					}
				})
				this.handleGetDoctorInfo();
			} catch (e) {
				console.log(e.message);
				this.testdata = e.message;
			}
		},
		destroyed() {
			console.log('fetalHeartRate destroyed');
			clearInterval(this.timer)
		},
		methods: {
			actionSheetCallback(index){
				this.isValue = this.actionSheetList[index].text;
				if(this.isValue == '有反应'){
					this.textareaValue = '本次监护反应型。请自数胎动，定期监护。有其他不适或胎动异常请及时前往医院复诊。(如有脐带问题，每天睡前和次日早饭后半小时必须各做一次监护)下次监护时间不少二十分钟。'
				}else{
					this.textareaValue = ''
				}
			},
			handleErrData(){
				let that = this;
				console.log(that.taixinId);
				this.$request('DocSSTaixinManyDetails',{
					taixinId: that.taixinId
				}).then(res => {
					// console.log(res);
					console.log(res.code);
					let i = 0;
					if (res.code == 200) {
						that.chartData.series[0].data = [];
						that.chartData.series[1].data = [];
						that.chartDataB.series[0].data = [];
						that.chartData.categories = [];
						that.chartDataB.categories = [];
						for (var t = 0; t < 300; t++) {
							let xLabel = tool.secoundtoMs(t);
							//let xLabel = minute.toString(); //+"分"+secound+"秒";
							that.chartData.categories.push(xLabel);
							that.chartDataB.categories.push(xLabel);
						}
						// canvaLineA.updateData(that.chartData);
						// canvaLineB.updateData(that.chartDataB);
						let arr = res.data;
						// console.log(arr);
						for (let item of arr) {
							//let xLabel = parseInt(i / 60).toString(); // + '分';
				
							let xLabel = tool.secoundtoMs(i);
							i++;
							if (i >= 300) {
								that.chartData.categories.push(xLabel);
								that.chartDataB.categories.push(xLabel);
							} else {
								that.chartData.categories[i] = xLabel;
								that.chartDataB.categories[i] = xLabel;
							}
							// var heartrate1 = item.taixinlv1 == 255 || item.taixinlv1 == -1 ? 0 : item.taixinlv1;
							// var heartrate2 = item.taixinlv2 == 255 || item.taixinlv2 == -1 ? 0 : item.taixinlv2;
							var heartrate1 = item.taixinlv1 == 255 || item.taixinlv1 == -1 || item.taixinlv1 == 0 || item.taixinlv1 == null ? null : item.taixinlv1;
							var heartrate2 = item.taixinlv2 == 255 || item.taixinlv2 == -1 || item.taixinlv2 == 0 || item.taixinlv2 == null ? null : item.taixinlv2;
							if(heartrate1 !== null){
								that.chartData.series[0].data.push(Number(heartrate1));
							}else{
								that.chartData.series[0].data.push(heartrate1);
							}
							if(heartrate2 !== null){
								that.chartData.series[1].data.push(Number(heartrate2));
							}else{
								that.chartData.series[1].data.push(heartrate2);
							}
							// var contractions = item.gongsuoya == -1 ? 0 : item.gongsuoya + '';
							var contractions = item.gongsuoya == -1 || item.gongsuoya == 0 || item.gongsuoya == 255 || item.gongsuoya == null ? null : item.gongsuoya + '';
							if(contractions !== null){
								that.chartDataB.series[0].data.push(Number(contractions));
							}else{
								that.chartDataB.series[0].data.push(contractions);
							}
							// console.log(contractions);
						}
						// that.getServerData();
						// that.getServerDatas();
						// console.log(that.chartData);
						// console.log(that.chartDataB);
						canvaLineA.updateData(that.chartData);
						canvaLineB.updateData(that.chartDataB);
					}
				}).catch(err => {
					console.log(err);
					console.log(that.chartData);
					console.log(that.chartDataB);
				})
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
					id: this.taixinId,
					eresult: this.isValue,
					ysjy: this.textareaValue,
					type: this.type,
					edoc: this.doctorName
				}
				// console.log(data);
				this.$u.post('DocUploadExamResult',data).then(res => {
					// console.log(res);
					uni.showToast({
						title:res.info,
						icon:'none',
						duration:3000
					})
					setTimeout(() => {
						uni.navigateBack()
					},3000)
				}).catch(e => {
					console.log(e);
				})
			},
			// 宫缩压
			getServerDatas() {
				try {
					let LineB = {
						categories: [],
						series: []
					};
					LineB.categories = _self.chartDataB.categories;
					LineB.series = _self.chartDataB.series;
					_self.showLineB('canvasLineB', LineB);
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 胎心1图表配置
			showLineA(canvasId, chartData) {
				try {
					canvaLineA = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'line',
						fontSize: 11,
						legend: {
							show: false
						},
						enableMarkLine: true,
						dataLabel: false,
						dataPointShape: false,
						background: '#FFFFFF',
						pixelRatio: _self.pixelRatio,
						categories: chartData.categories,
						series: chartData.series,
						animation: false,
						enableScroll: true,
						xAxis: {
							type: 'grid',
							gridColor: '#CCCCCC',
							gridType: 'dash',
							// calibration: true,
							dashLength: 1,
							itemCount: 300, //x轴单屏显示数据的数量，默认为5个 实际个数=设置值×2+8   实际值(60)=设置值30×2
							scrollShow: false, //新增是否显示滚动条，默认false
							scrollAlign: 'left', //滚动条初始位置
							scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
							scrollColor: '#DEE7F7', //默认为 #A6A6A6
							gridEval: 10,
							splitNumber: 30,
							labelCount: 6,
							format: val => {
								return parseInt(val / 60).toString() + '分';
							}
						},
						yAxis: {
							//data:{
							// min:0,
							// max:240,
							//calibration:false,
							//axisLine:true,
							//disabled:false
							//},
							type: 'grid',
							padding: 0,
							gridType: 'dash',
							gridColor: '#CCCCCC',
							dashLength: 2,
							max: 240,
							min: 0,
							splitNumber: 24,
							// data:{disabled: false},
							format: val => {
								if (val % 10 == 0) return val;
								else return '';
								//return val.toFixed(0) + '';
							}
						},
						width: _self.cWidth * _self.pixelRatio,
						height: _self.cHeight * _self.pixelRatio,
						extra: {
							touchMoveLimit: 20,
							line: {
								type: 'straight',
								width: 1
							},
							markLine: {
								areacolor:'#087c00',
								areaopacity:0.15,
								data: [{ value: 110, lineColor: '#087c00' }, { value: 160, lineColor: '#087c00' }]
							}
						}
					});
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 胎心1图表回调
			touchLineA(e) {
				try {
					canvaLineA.scrollStart(e);
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 胎心1图表回调
			moveLineA(e) {
				try {
					canvaLineA.scroll(e);
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 胎心1图表回调
			touchEndLineA(e) {
				try {
					canvaLineA.scrollEnd(e);
					//下面是toolTip事件，如果滚动后不需要显示，可不填写
					canvaLineA.showToolTip(e, {
						format: function(item) {
							return item.data;
						}
					});
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 胎心2图表配置
			showLineB(canvasId, chartDataB) {
				try {
					canvaLineB = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'line',
						fontSize: 11,
						legend: {
							show: false
						},
						dataLabel: false,
						dataPointShape: false,
						background: '#FFFFFF',
						pixelRatio: _self.pixelRatio,
						categories: chartDataB.categories,
						series: chartDataB.series,
						animation: false,
						enableScroll: true,
						xAxis: {
							type: 'grid',
							gridColor: '#CCCCCC',
							gridType: 'dash',
							dashLength: 2,
							itemCount: 300, //x轴单屏显示数据的数量，默认为5个
							scrollShow: false, //新增是否显示滚动条，默认false
							scrollAlign: 'left', //滚动条初始位置
							scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
							scrollColor: '#DEE7F7', //默认为 #A6A6A6
							splitNumber: 30,
							labelCount: 6,
							gridEval: 10
						},
						yAxis: {
							gridType: 'dash',
							gridColor: '#CCCCCC',
							dashLength: 2,
							max: 100,
							min: 0,
							splitNumber: 10,
							format: val => {
								return val.toFixed(0) + '';
							}
						},
						width: _self.bWidth * _self.pixelRatio,
						height: _self.bHeight * _self.pixelRatio,
						extra: {
							touchMoveLimit: 20,
							line: {
								type: 'straight',
								width: 1
							}
							// markLine: {
							// 	data: [{ value: 20, lineColor: '#087c00' }, { value: 30, lineColor: '#087c00' }]
							// }
						}
					});
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 胎心2图表拖动回调
			touchLineB(e) {
				try {
					canvaLineB.scrollStart(e);
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
				// console.log(e)
			},
			// 胎心2图表拖动回调
			moveLineB(e) {
				try {
					canvaLineB.scroll(e);
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
				// console.log(e)
			},
			// 胎心2图表回调
			touchEndLineB(e) {
				try {
					// console.log(e)
					canvaLineB.scrollEnd(e);
					canvaLineB.showToolTip(e, {
						format: function(item) {
							return item.data;
						}
					});
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 胎心
			getServerData() {
				try {
					let LineA = {
						categories: [],
						series: []
					};
					LineA.categories = _self.chartData.categories;
					LineA.series = _self.chartData.series;
					_self.showLineA('canvasLineA', LineA);
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
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

<style  scoped>
	.wrap {
		background-color: #ede0e7;
	}

	.u-col-item {
		width: 160rpx;
		height: 160rpx;
		border-right: 2rpx solid #ebebeb;
	}

	.u-col-lh {
		line-height: 70rpx;
	}

	.chart-size {
		height: 100%;
		width: 100%;
	}

	.qiun-charts {
		width: 100%;
		height: 400rpx;
		background-color: #fff;
	}

	.charts {
		width: 100%;
		height: 350rpx;
		background-color: #fff;
	}

	.gsy {
		width: 100%;
		height: 350rpx;
	}

	.bCharts {
		width: 100%;
		height: 350rpx;
	}
</style>
