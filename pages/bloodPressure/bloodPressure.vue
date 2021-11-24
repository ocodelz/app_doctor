<template>
	<view class="w-100 flex flex-column " :style="'height:' + pageHeight + 'px'">
		<view v-if="tapState == 1" style="height: 300rpx" class="flex flex-column  flex align-center justify-center ">
			<u-image width="96%" height="100%" src="/static/image/bloodPressure/xueyabanner.jpg"></u-image>
		</view>
		<u-line v-if="tapState == 1" style="height: 1rpx;" color="#22b14c" margin="20rpx 0" />
		<!-- 测量结果 -->
		<view class="flex flex-column">
			<view class="ml-2"><text class="flex font-weight-bold" style="color: #ff7f27;">测量结果</text></view>
			<view class="flex flex-column align-center justify-center">
				<view class="flex justify-center flex-column align-center">
					<!-- 血压 -->
					<view class="flex align-center justify-start mt-2" style="width:100%">
						<view class="bloodPressureBox"><text class="font-weight-bold">血压</text></view>
						<view class="ml-2">
							<u-image width="150" height="240" src="/static/image/bloodPressure/xueya.png"></u-image>
						</view>
						<view class="flex align-center flex-column justify-center">
							<view class="flex align-center ml-2" style="min-width: 210rpx;">
								<view class="flex flex-column">
									<text class="font-md font-weight-bold">收缩压</text>
									<text class="font-small text-muted">mmHg</text>
								</view>
								<view class="ml-3" :style="systolicPressureFontStyle" style="width: 100rpx;display: block;">
									<text class="sfont">{{ info.systolicPressure}}</text>
								</view>
							</view>
							<view class="flex align-center ml-2" style="min-width: 210rpx;">
								<view class="flex flex-column mt-3">
									<text class="font-md font-weight-bold">舒张压</text>
									<text class="font-small text-muted">mmHg</text>
								</view>
								<view class="ml-3" :style="diastolicPressureFontStyle" style="width: 100rpx;display: block;">
									<text class="sfont">{{ info.diastolicPressure }}</text>
								</view>
							</view>
						</view>
						<view class="ml-2">
							<view>
								<text class="font-weight-bold font-sm">理想标准</text>
								<text class="font-small font-weight-bold">(mmHg):</text>
							</view>
							<view class="font-sm">收缩压&lt;120</view>
							<view class="font-sm">舒张压&lt;80</view>
						</view>
					</view>
					<!-- 心率 -->
					<view class="flex align-center justify-start mt-3" style="width:100%">
						<view class="bloodPressureBox"><text class="font-weight-bold ">心率</text></view>
						<view class="ml-2">
							<u-image width="180" height="160" src="/static/image/bloodPressure/xinlv.png"></u-image>
						</view>
						<view class="flex align-center flex-column justify-center" style="min-width: 210rpx">
							<view class="flex align-center">
								<text class="sfont">{{ info.heartRate }}</text>
								<text class="font-lg font-weight-bold">/分钟</text>
							</view>
						</view>
						<view class="ml-2">
							<view>
								<text class="font-weight-bold font-sm">正常标准</text>
								<text class="font-small font-weight-bold">(分钟):</text>
							</view>
							<view class="font-sm">心率:60-100</view>
						</view>
					</view>
				</view>
			</view>
			<u-line style="height: 2rpx;" color="#22b14c" margin="60rpx 0 30rpx 0" />
			<view class="flex flex-column ml-2" :class="tapState == 2 ? 'result' : ''">
				<!-- 测量结果 v-if="tapState == 0"-->
				<view class="flex align-center">
					<text class="font-lg font-weight-bold">测量结果：</text>
					<text class="font-lg font-weight-bold" :class="info.t_result == '---' ? 'text-dark' : 'text-danger'" v-if="info.t_result">{{ info.t_result }}</text>
					<text v-else class="font-lg font-weight-bold">---</text>
				</view>
				<!-- 测量时间 v-if="tapState == 0"-->
				<view class="flex align-center">
					<text class="font-lg font-weight-bold">测量时间：</text>
					<text v-if="info.c_time !== ''" class="font-lg font-weight-bold text-danger">{{ info.c_time}}</text>
					<text v-else class="font-lg font-weight-bold">---</text>
				</view>
				<view class="flex align-center" v-if="info.exam_result">
					<text class="font-lg font-weight-bold">审核结果：</text>
					<text class="font-lg font-weight-bold text-danger">{{ info.exam_result }}</text>
				</view>
				<view class="flex align-center" v-if="info.exam_time">
					<text class="font-lg font-weight-bold">审核时间：</text>
					<text class="font-lg font-weight-bold text-danger">{{ info.exam_time }}</text>
				</view>
				<view class="flex align-center" v-if="info.yishengjianyi">
					<text class="font-lg font-weight-bold">医生建议：</text>
					<text class="font-lg font-weight-bold text-danger">{{ info.yishengjianyi }}</text>
				</view>
				<!-- 判定结果 -->
				<view v-if="tapState == 3">
					<view>
						<!-- <text class="font-lg font-weight-bold">审核结果:</text> -->
						<view class="mr-2 font-lg">
							<text @click="show = true" class="font-lg font-weight-bold" v-show="isValue == ''">请选择判断结果</text>
							<text @click="show = true" class="font-lg font-weight-bold">{{isValue}}</text>
							<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
						</view>
					</view>
					<view class="py-1">
						<!-- <text class="font-md font-weight-bold">审核结果:</text> -->
						<view class="mr-5 flex align-center justify-between">
							<!-- <text class="font-lg font-weight-bold" @click="isSelectShow = true" v-show="doctorDeptname == ''">选择医生</text> -->
							 <text  @click="isSelectShow = true" v-show="doctorDeptname" class="font-lg font-weight-bold">科室:{{doctorDeptname}} 姓名:{{doctorName}}</text>
							<u-select title="选择您的医生" v-model="isSelectShow" mode="mutil-column-auto" :list="addlist" @confirm="handleDoctorNumberSelect"></u-select>
						</view>
					</view>
					<view class="mt-1">
						<text class="font-lg font-weight-bold">医生建议:</text>
						<view class="mr-2 flex align-center justify-center">
							<textarea v-model="textareaValue" placeholder="请输入医生建议" placeholder-style="font-size:28rpx;" style="width: 98%;margin-top: 10rpx;height: 130rpx;border: 2rpx solid #dee2e6;border-radius: 12rpx;" />
							</view>
					</view>
					<u-button type="success" :custom-style="customStyle" @click="handleSubmit">提交审核</u-button>
				</view>
			</view>
		</view>
		<u-line v-if="tapState == 1" class="flex " style="height: 1rpx;" color="#22b14c" margin="40rpx 0 60rpx 0" />
	</view>
</template>
<script>
	export default {
		data() {
			return {
				show:false,
				isValue:'',
				textareaValue:'',
				isSelectShow: false,
				// 医生编号数组
				addlist: [],
				doctorDeptname: '',
				doctorName: '',
				customStyle: {
					width:'400rpx',
					height: '60rpx',
					marginTop:'40rpx',
					padding:'35rpx'
				},
				actionSheetList: [{
						text: '血压高'
					},
					{
						text: '血压低'
					},
					{
						text: '血压正常'
					},
					{
						text: '无效'
					}
				],
				// 血压
				info: {
					// 孕妇ID
					p_id: '',
					// 测量时间
					c_time: '',
					// 收缩压
					systolicPressure: '',
					// 舒张压
					diastolicPressure: '',
					// 脉搏
					heartRate: '',
					// 血压结果
					bloodPressureResult: '',
					// 心率结果
					heartRateResult: '',
					// 测量结果
					t_result: '',
					// 设备建议
					sbcljy: '',
					// 审核时间
					exam_time: '',
					// 审核结果
					exam_result: '',
					// 医生建议
					yishengjianyi: ''
				},
				pageHeight: 0,
				ssyList:[],
				szyList:[],
				xlList:[],
				tapState:0,
				type:'',
				id:''
			};
		},
		onLoad(e) {
			this.tapState = e.tapState
			let obj = JSON.parse(e.detail)
			if(obj){
				this.type = obj.type;
				this.id = obj.id;
				this.info.yishengjianyi = obj.yishengjianyi;
				this.info.c_time = obj.t_time;
				this.info.t_result = obj.test_result;
				this.info.exam_result = obj.exam_result;
				this.info.exam_time = obj.exam_time;
				this.info.systolicPressure = obj.high_pressure;
				this.info.diastolicPressure = obj.low_pressure;
				this.info.heartRate = obj.pulse;
				let result = uni.getStorageSync('result_storage');
				for (let item of result) {
					if (item.classify_name === '收缩压') {
						this.ssyList.push(item)
					} else if (item.classify_name === '舒张压') {
						this.szyList.push(item)
					} else if (item.classify_name === '心率') {
						this.xlList.push(item)
					}
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
		},
		filters: {
			formatDate(time) {
				let data = new Date(time);
				let y = data.getFullYear();
				let m = (data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : (data.getMonth() + 1);
				let d = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
				let hh = data.getHours() < 10 ? '0' + data.getHours() : data.getHours();
				let mm = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();
				let ss = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds();
				return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
			}
		},
		mounted() {
			let pageHeight = uni.getSystemInfoSync();
			this.pageHeight = pageHeight.windowHeight - 30;
		},
		computed: {
			// 收缩压
			systolicPressureFontStyle() {
				try {
					let ssyVal = Number(this.info.systolicPressure);
					for(let item of this.ssyList){
						if(item.jieguopanding === '低血压（收缩压）'){
							if(ssyVal >= item.jieguozhifanwei1 && ssyVal < item.jieguozhifanwei2){
								return `color:#ccc`; // 低
							}
						}else if(item.jieguopanding === '正常（收缩压）'){
							if(ssyVal >= item.jieguozhifanwei1 && ssyVal < item.jieguozhifanwei2){
								return `color:#71d5a1`; // 正常
							}
						}else if(item.jieguopanding === '理想（收缩压）'){
							if(ssyVal >= item.jieguozhifanwei1 && ssyVal < item.jieguozhifanwei2){
								return `color:#399561`; // 理想
							}
						}else if(item.jieguopanding === '高限（收缩压）'){
							if(ssyVal >= item.jieguozhifanwei1 && ssyVal <= item.jieguozhifanwei2){
								return `color:#dea234`; // 高限
							}
						}else if(item.jieguopanding === '高血压（收缩压）'){
							if(ssyVal >= item.jieguozhifanwei1){
								return `color:#f00`; // 高
							}
						}
					}
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			},
			// 舒张压
			diastolicPressureFontStyle() {
				try {
					let szyVal = this.info.diastolicPressure;
					for(let item of this.szyList){
						if(item.jieguopanding === '低血压（舒张压）'){
							if(szyVal >= item.jieguozhifanwei1 && szyVal < item.jieguozhifanwei2){
								return `color:#ccc`; //低
							}
						}else if(item.jieguopanding === '理想（舒张压）'){
							if(szyVal >= item.jieguozhifanwei1 && szyVal < item.jieguozhifanwei2){
								return `color:#399561`; //理想
							}
						}else if(item.jieguopanding === '正常（舒张压）'){
							if(szyVal >= item.jieguozhifanwei1 && szyVal < item.jieguozhifanwei2){
								return `color:#71d5a1`; //正常
							}
						}else if(item.jieguopanding === '高限（舒张压）'){
							if(szyVal >= item.jieguozhifanwei1 && szyVal <= item.jieguozhifanwei2){
								return `color:#dea234`; //高限
							}
						}else if(item.jieguopanding === '高血压（舒张压）'){
							if(szyVal >= item.jieguozhifanwei1){
								return `color:#f00`; //高
							}
						}
					}
				} catch (e) {
					console.log(e.message);
					this.testdata = e.message;
				}
			}
		},
		methods: {
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
				this.$u.post('DocUploadExamResult',{
					id: this.id,
					eresult: this.isValue,
					ysjy: this.textareaValue,
					type: this.type,
					edoc: this.doctorName
				}).then(res => {
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
			},
			actionSheetCallback(index){
				this.isValue = this.actionSheetList[index].text;
				if(this.isValue == '血压正常'){
					this.textareaValue = '遵医嘱，继续监测'
				}else{
					this.textareaValue = ''
				}
			}
		}
	};
</script>
<style scoped>
	.qiun-charts {
		width: 750rpx;
		height: 200rpx;
		background-color: #ffffff;
	}

	.charts {
		width: 750rpx;
		height: 200rpx;
		background-color: #ffffff;
	}

	.bloodPressureBox {
		width: 40rpx;
		line-height: 40rpx;
		text-align: center;
	}

	.sfont {
		font-size: 52rpx;
	}
	.result{
		min-height: 500rpx;
	}
</style>
