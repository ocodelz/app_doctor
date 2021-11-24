<template>
	<view class="w-100">
		<scroll-view scroll-y style="height: calc(100vh - 210rpx);">
			<view class="flex flex-wrap justify-between  px-2 pt-2" v-if="surveyType == '1'">
				<view><text style="color: #19be6b;">出生日期：</text>{{!!infant.child_birth_Date  ? infant.child_birth_Date : '空'}}</view>
				<view><text style="color: #19be6b;">分娩方式：</text>{{infant.delivery_Mode == 0 ? '顺产' : infant.delivery_Mode == 1 ? '剖腹产' : '空'}}</view>
				<view><text style="color: #19be6b;">姓名：</text>{{!!infant.child_Name  ? infant.child_Name : '空'}}</view>
				<view><text style="color: #19be6b;">性别：</text>{{infant.child_Sex == 0 ? '男' : infant.child_Sex == 1 ? '女' : '空'}}</view>
				<view><text style="color: #19be6b;">年龄：</text>{{!!infant.birth_date ? infant.birth_date : '空'}}天</view>
				<view><text style="color: #19be6b;">孕周：</text>{{!!infant.birth_week ? infant.birth_week : '空'}}</view>
				<view><text style="color: #19be6b;">结局：</text>{{!!infant.gestation_ending ? infant.gestation_ending : '空'}}</view>
				<view><text style="color: #19be6b;">转科：</text>{{!!infant.transfer  ? infant.transfer : '空'}}</view>
				<view><text style="color: #19be6b;">体重：</text>{{!!infant.birth_weight ? infant.birth_weight : '空'}}g</view>
			</view>
			<view v-if="surveyType == '0'" class="flex flex-wrap justify-between px-2 pt-2">
				<view><text
						style="color: #19be6b;">分娩日期：</text>{{!!pregnantWoman.Delivery_Date ? pregnantWoman.Delivery_Date : '空'}}
				</view>
				<view><text
						style="color: #19be6b;">病区：</text>{{!!pregnantWoman.hos_depName ? pregnantWoman.hos_depName : '空'}}
				</view>
				<view><text
						style="color: #19be6b;">电话：</text>{{!!pregnantWoman.P_Telephone ? pregnantWoman.P_Telephone : '空'}}
				</view>
				<view><text style="color: #19be6b;">姓名：</text>{{!!pregnantWoman.P_Name ? pregnantWoman.P_Name : '空'}}
				</view>
				<view><text style="color: #19be6b;">年龄：</text>{{!!pregnantWoman.P_Age ? pregnantWoman.P_Age : '空'}}
				</view>
				<view><text
						style="color: #19be6b;">孕周：</text>{{!!pregnantWoman.P_Now_Yunzhou ? pregnantWoman.P_Now_Yunzhou : '空'}}
				</view>
				<u-collapse>
					<u-collapse-item title="点击查看详细信息">
						<view class="text-dark flex flex-wrap py-1" style="background-color: #dbf1e1;">
							<text
								class="ml-1"><b>产次：</b>{{!!pregnantWoman.P_Chanci ? pregnantWoman.P_Chanci : '空'}}</text>
							<text
								class="ml-1"><b>初/经：</b>{{!!pregnantWoman.Initial_regular? pregnantWoman.Initial_regular : '空'}}</text>
							<text
								class="ml-1"><b>分娩方式：</b>{{pregnantWoman.Delivery_Mode == 0 ? '顺产' : pregnantWoman.Delivery_Mode == 1 ? '剖腹产' : '空'}}</text>
							
								
							<text
								class="ml-1"><b>高危：</b>{{!!pregnantWoman.P_Highrisk_Level ? pregnantWoman.P_Highrisk_Level : '空'}}</text>
							<text
								class="ml-1"><b>高危因素：</b>{{!!pregnantWoman.P_Highrisk_Factor ? pregnantWoman.P_Highrisk_Factor : '空'}}</text>
								<text
									class="ml-1"><b>无痛：</b>{{pregnantWoman.is_painless == 0 ? '痛' : pregnantWoman.is_painless == 1 ? '不痛' : '空'}}</text>
							<text
								class="ml-1"><b>会阴情况：</b>{{!!pregnantWoman.perineal_condition ? pregnantWoman.perineal_condition : '空'}}</text>
								<text
									class="ml-1"><b>顺转刨：</b>{{pregnantWoman.natural_cut == 1 ? '顺转刨' : '空'}}</text>
							<text
								class="ml-1"><b>非医学指征：</b>{{!!pregnantWoman.non_medical_indication ? pregnantWoman.non_medical_indication : '空'}}</text>
							<text
								class="ml-1"><b>并发症及合并症：</b>{{!!pregnantWoman.complication ? pregnantWoman.complication : '空'}}</text>
							<text
								class="ml-1"><b>急性手术：</b>{{!!pregnantWoman.emerg_operation ? pregnantWoman.emerg_operation : '空'}}</text>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>

			<view class="py-1 px-2" v-for="(item,index) in list" :key="index"
				:class="item.name == '其它症状：' || item.name == '其它不适应症状：' ? '' : 'flex'">
				<!-- <text class="flex-shrink">{{item.name}}</text> -->
				<view class="flex">
					<u-image class="flex-shrink" :src="item.url" width="40" height="40"></u-image>
					<text class="flex-shrink mr-2">{{item.name}}</text>
				</view>
				<radio-group class="flex flex-wrap" @change="radioChange($event,item)">
					<view class="flex" v-for="(value, index1) in item.answers" :key="index1">
						<view v-if="value.type=='radio'" class="flex">
							<label class="flex mr-2">
								<radio style="transform:scale(0.7)" :class="{ checked: item.checked == value.value }"
									:checked="item.checked == value.value" :value="value.value"
									:disabled="value.disabled">
								</radio>
								<text>{{ value.value }}</text>
							</label>
						</view>
						<view v-if="value.type =='input'">
							<label class="flex position-relative">
								<radio style="transform:scale(0.7)" :class="{ checked: item.checked == value.value }"
									:checked="item.checked!='' && item.answer != ''" :value="value.value"
									:disabled="item.disabled"></radio>
								<text>{{ value.value }}</text>
								<input v-if="value.type == 'input'" class="border-bottom " v-model="item.answer"
									:disabled="item.disabled"
									@click="item.name == '复诊：' && subStatus !== 2 ? handleTapVisit(item.answer) : ''" />
								<view v-if="item.name == '复诊：' && item.answer !== ''" class="position-absolute right-0" @click="handleClear">X</view>
							</label>
						</view>
						<view v-if="value.type =='textarea'" class="flex mt-2">
							<label class="flex">
								<radio style="transform:scale(0.7)" :class="{ checked: item.checked == value.value }"
									:checked="item.checked != '' && item.answer != ''" :value="value.value"></radio>
								<text>{{ value.value }}</text>
								<u-input v-if="value.type == 'textarea'" v-model="item.answer" type="textarea" border
									height="100" style="width: 600rpx;" :disabled="item.disabled" />
							</label>
						</view>
					</view>
				</radio-group>
			</view>
			<view class="px-2 py-1">
				指导意见：<text @click="subStatus !== 2 ? handleIsEvaluates() : ''">{{evaluateTxt}}</text>
				<u-input v-model="evaluates" type="textarea" border height="100" style="flex-shrink: 0;"
					:disabled="subStatus !== 2 ? false : true" />
			</view>
			<u-picker v-model="isVisitDates" mode="time" @confirm="handlePickerConfirm"></u-picker>
		</scroll-view>
		<view class="flex align-center justify-center" style="width: 100%;height: 140rpx;">
			<u-button v-if="subStatus !== 2" type="success" @click="handleSaveWAnswerSheetUpdate">确定审核</u-button>
			<u-button type="success" @click="handleSendAnswerMessage">短信提醒</u-button>
		</view>
		<!-- <u-modal v-model="isMsgs" show-cancel-button title="温馨提示" @confirm="">
			<view class="p-2">
				<u-input v-model="msgInfos" type="textarea" />
			</view>
		</u-modal> -->
		<u-select v-model="isEvaluates" :list="evaluateList" @confirm="handleEvaluateConfirm"></u-select>
	</view>
</template>

<script>
	export default {
		props: {
			isMsg: {
				type: Boolean,
				default: false
			},
			isVisitDate: {
				type: Boolean,
				default: false
			},
			list: {
				type: [Array, Object],
				default: () => {
					return []
				}
			},
			evaluate: {
				type: String,
				default: ''
			},
			subStatus: {
				type: [Number, String],
				default: 0
			},
			surveyType: {
				type: [Number, String],
				default: 0
			},
			state: {
				type: [Number, String],
				default: 0
			},
			infant: {
				type: [Object, Array],
				default: () => {
					return {}
				}
			},
			pregnantWoman: {
				type: [Object, Array],
				default: () => {
					return {}
				}
			}
		},
		mounted() {
			this.handleIsOperationStatus();
			this.evaluates = this.evaluate;
			this.isVisitDates = this.isVisitDate;
			this.isMsgs = this.isMsg;
		},
		data() {
			return {
				evaluates: '',
				isMsgs: false,
				isVisitDates: false,
				disabled: false,
				// msgInfos: '',
				bodyStyle: {
					color: '#000'
				},
				evaluateList: [{
					value: '1',
					label: '正常'
				}, {
					value: '2',
					label: '有异常指标'
				}],
				isEvaluates: false,
				evaluateTxt: '正常'
			}
		},
		methods: {
			handleIsEvaluates(){
				this.isEvaluates = true;
			},
			handleTapInput(answer) {
				this.$emit('input', answer)
			},
			handleIsOperationStatus() {
				if (this.state == 0) {
					for (let item of this.list) {
						if (item.name !== '复诊：') {
							item.disabled = true;
						}
						if (item.name == '复诊：' && this.subStatus == 2) {
							item.disabled = true;
						}
						for (let jtem of item.answers) {
							jtem.disabled = true;
						}
					}
				}
				console.log(this.list);
			},
			radioChange(e, item) {
				console.info(e)
				this.$set(item, 'checked', e.detail.value);
			},
			handleTapVisit(answer) {
				this.$emit('visit', answer);
			},
			// 保存孕妇日记提交
			handleSaveWAnswerSheetUpdate() {
				this.$emit('click');
			},
			handlePickerConfirm(e) {
				this.$emit('pickerConfirm', e);
			},
			// handleTapMsg() {
			// 	this.isMsgs = true;
			// },
			handleSendAnswerMessage() {
				this.$emit('send',this.evaluates);
			},
			handleEvaluateConfirm(e) {
				this.evaluateTxt = e[0].label;
				if(this.evaluateTxt == '正常'){
					this.evaluates = '亲爱的宝妈，根据您的日记填写，宝宝目前身体状况属于正常状态。'
				}else{
					this.evaluates = ''
				}
			},
			handleClear(){
				this.$emit('clear')
			}
		}
	}
</script>

<style scoped>
	/deep/.uni-scroll-view ::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}
</style>
