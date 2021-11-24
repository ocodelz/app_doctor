<template>
	<view class="wrap w-100 ">
		<free-questionnaire ref="questionnaire" :surveyType="survey_type" :pregnantWoman="pregnantWoman"
			:infant="infant" :subStatus="sub_status" :evaluate="evaluate" :isVisitDate="isVisitDate" state="0"
			:list="list" @click="handleSwitchUploadStatus" @visit="handleTapVisit" @pickerConfirm="handlePickerConfirm"
			@send="handleSendAnswerMessage" @clear="handleClear">
		</free-questionnaire>
	</view>
</template>

<script>
	import freeQuestionnaire from '@/components/free-ui/free-questionnaire/free-questionnaire.vue'
	import util from '@/utils/util.js';
	export default {
		components: {
			freeQuestionnaire
		},
		data() {
			return {
				isVisitDate: false,
				followVisitDate: '',
				survey_id: '',
				answer_type: '',
				pregnantWoman: {
					Delivery_Date: '',
					hos_depName: '',
					P_Telephone: '',
					P_Name: '',
					P_Age: 0,
					P_Now_Yunzhou: '',
					P_Chanci: 0,
					Initial_regular: '',
					Delivery_Mode: '',
					P_Highrisk_Level: '',
					P_Highrisk_Factor: '',
					is_painless: '',
					perineal_condition: '',
					natural_cut: '',
					non_medical_indication: '',
					complication: '',
					emerg_operation: '',
				},
				infant: {
					child_birth_Date: '',
					child_Name: '',
					child_Sex: '',
					birth_date: '',
					birth_week: '',
					gestation_ending: '',
					delivery_Mode: '',
					transfer: '',
					birth_weight: ''
				},
				sub_status: '',
				list: [],
				pre_answerID: '',
				evaluate: '亲爱的宝妈，根据您的日记填写，宝宝目前身体状况属于正常状态。',
				survey_type: '',
				child_answerID: '',
				survey_Name: '',
				P_IdCard: '',
				P_Telephone: '',
				fate: 0,
				nbID: ''
			}
		},
		onLoad(e) {
			if (e.detail) {
				console.log(e);
				let detail = JSON.parse(e.detail)
				this.sub_status = detail.sub_status; // 日记状态
				this.answer_type = detail.answer_type;
				this.survey_type = detail.survey_type;
				this.survey_Name = detail.survey_Name;
				// console.log(this.sub_status);
				if (e.questionnaire) {
					this.pre_answerID = detail.id;
					this.child_answerID = detail.id;
					this.survey_id = detail.survey_id;
					console.log("002");
				} else {
					this.pre_answerID = detail.pre_answerID;
					this.child_answerID = detail.child_answerID;
					this.survey_id = detail.survey_id;
					console.log("003");
				}
				// console.log(this.survey_type);
				// console.log(this.survey_id);
				// console.log(this.pre_answerID);
			}
			this.setNavigationBarTitle();
			this.handleGetData();
			this.survey_type == '0' ? this.handleSearchWAnswerSheetInfo(this.pre_answerID) : this.handleCAnswerSheetDetail(
				this.child_answerID);
		},
		methods: {
			// onLoad
			// 动态设置导航栏标题
			setNavigationBarTitle() {
				let title = '';
				if (this.answer_type.substring(0, 2) == '产后' || this.answer_type.substring(0, 2) == '术后') {
					title = '辣妈'
				} else {
					title = '萌宝'
				}
				uni.setNavigationBarTitle({
					title: title + this.answer_type + '日记'
				})
			},
			// 初始化数据
			handleGetData() {
				if (this.answer_type !== '产后42天' && this.answer_type !== '术后42天' && this.answer_type !== '生后42天' && this
					.answer_type !== '生后5天' &&
					this.answer_type !== '生后7天' && this.answer_type !== '生后15天' && this.answer_type !== '生后30天' && this
					.survey_type == 0) {
					this.list.push({
						name: '体温℃：',
						key: 'temperature',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'input',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					}, {
						name: '恶露量：',
						key: 'lochia_amonut',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '多',
								disabled: false
							},
							{
								type: 'radio',
								value: '少',
								disabled: false
							},
							{
								type: 'radio',
								value: '无',
								disabled: false
							}
						],
						answer: '',
						checked: '无',
						required: true
					}, {
						name: '颜色：',
						key: 'lochia_color',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '鲜红',
								disabled: false
							},
							{
								type: 'radio',
								value: '暗红',
								disabled: false
							},
							{
								type: 'radio',
								value: '白色或粉色',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '会阴切口：',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						key: 'incision',
						answers: [{
								type: 'radio',
								value: '痛',
								disabled: false
							},
							{
								type: 'radio',
								value: '不痛',
								disabled: false
							}
						],
						answer: '',
						checked: '不痛',
						required: true
					}, {
						name: '乳头：',
						key: 'Nipple_condition',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '有皲裂',
								disabled: false
							},
							{
								type: 'radio',
								value: '无皲裂',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, 
					{
						name: '乳房：',
						key: 'Nipple_swelling',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '有胀痛',
								disabled: false
							},
							{
								type: 'radio',
								value: '无胀痛',
								disabled: false
							}
						],
						answer: '',
						checked: '无胀痛',
						required: true
					},
					{
						name: '奶量：',
						key: 'Milk_quantity',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '充足',
								disabled: false
							},
							{
								type: 'radio',
								value: '不充足',
								disabled: false
							},
							{
								type: 'radio',
								value: '无',
								disabled: false
							}
						],
						answer: '',
						checked: '充足',
						required: true
					}, {
						name: '大便：',
						key: 'stool_condition',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '正常',
								disabled: false
							},
							{
								type: 'radio',
								value: '便秘',
								disabled: false
							},
							{
								type: 'radio',
								value: '腹泻',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '排尿状态：',
						key: 'urinat_status',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '通畅',
								disabled: false
							},
							{
								type: 'radio',
								value: '不通畅',
								disabled: false
							}
						],
						answer: '',
						checked: '通畅',
						required: true
					}, {
						name: '漏尿情况：',
						key: 'urine_leakage',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '无',
								disabled: false
							},
							{
								type: 'radio',
								value: '有',
								disabled: false
							}
						],
						answer: '',
						checked: '无',
						required: true
					}, {
						name: '腰背部：',
						key: 'lumbar',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '痛',
								disabled: false
							},
							{
								type: 'radio',
								value: '不痛',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '骨盆区：',
						key: 'pelvic_area',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '痛',
								disabled: false
							},
							{
								type: 'radio',
								value: '不痛',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '心情：',
						key: 'mood',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '好',
								disabled: false
							},
							{
								type: 'radio',
								value: '一般',
								disabled: false
							},
							{
								type: 'radio',
								value: '不好',
								disabled: false
							}
						],
						answer: '',
						checked: '一般',
						required: true
					}, {
						name: '其它不适应症状：',
						key: 'other_indications',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'textarea',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					})
					let arr = [];
					for (let item of this.list) {
						if (this.answer_type.substring(0, 2) == '术后' && item.name == '会阴切口：') {
							item.name = '腹部刀口：'
						}
						if (this.answer_type.substring(0, 2) == '产后' && (this.answer_type == '产后3天' || this.answer_type ==
								'产后7天') && (item.name == '腰背部：' ||
								item.name == '骨盆区：')) {
							arr.push(item)
						}
					}
					for (let i in this.list) {
						for (let j in arr) {
							if (this.list[i].name == arr[j].name) {
								this.list.splice(i, 1);
							}
						}
					}
				} else if (this.answer_type == '产后42天' || this.answer_type == '术后42天' && this.survey_type == '0') {
					this.list = [
						{
							name: '乳房：',
							key: 'Nipple_swelling',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '有胀痛',
									disabled: false
								},
								{
									type: 'radio',
									value: '无胀痛',
									disabled: false
								}
							],
							answer: '',
							checked: '无胀痛',
							required: true
						},
						{
							name: '奶量：',
							key: 'Milk_quantity',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '充足',
									disabled: false
								},
								{
									type: 'radio',
									value: '不充足',
									disabled: false
								},
								{
									type: 'radio',
									value: '无',
									disabled: false
								}
							],
							answer: '',
							checked: '充足',
							required: true
						},
						{
							name: '大便：',
							key: 'stool_condition',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '正常',
									disabled: false
								},
								{
									type: 'radio',
									value: '便秘',
									disabled: false
								},
								{
									type: 'radio',
									value: '腹泻',
									disabled: false
								}
							],
							answer: '',
							checked: '',
							required: true
						},
						{
							name: '排尿状态：',
							key: 'urinat_status',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '通畅',
									disabled: false
								},
								{
									type: 'radio',
									value: '不通畅',
									disabled: false
								}
							],
							answer: '',
							checked: '通畅',
							required: true
						},
						{
							name: '漏尿情况：',
							key: 'urine_leakage',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '无',
									disabled: false
								},
								{
									type: 'radio',
									value: '有',
									disabled: false
								}
							],
							answer: '',
							checked: '无',
							required: true
						},
						{
							name: '腰背部：',
							key: 'lumbar',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '痛',
									disabled: false
								},
								{
									type: 'radio',
									value: '不痛',
									disabled: false
								}
							],
							answer: '',
							checked: '',
							required: true
						},
						{
							name: '骨盆区：',
							key: 'pelvic_area',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '痛',
									disabled: false
								},
								{
									type: 'radio',
									value: '不痛',
									disabled: false
								}
							],
							answer: '',
							checked: '',
							required: true
						},
						{
							name: '心情：',
							key: 'mood',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
									type: 'radio',
									value: '好',
									disabled: false
								},
								{
									type: 'radio',
									value: '一般',
									disabled: false
								},
								{
									type: 'radio',
									value: '不好',
									disabled: false
								}
							],
							answer: '',
							checked: '一般',
							required: true
						},

						{
							name: '其它不适应症状：',
							key: 'other_indications',
							url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
							answers: [{
								type: 'textarea',
								value: ''
							}],
							answer: '',
							checked: '',
							required: true,
							disabled: false
						}
					]
				} else if (this.answer_type !== '生后42天' && this.survey_type == '1') {
					this.list.push({
						name: '体温℃：',
						key: 'temperature',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'input',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					}, {
						name: '黄疸值：',
						key: 'jaundice_value',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '未测量',
								disabled: false
							},
							{
								type: 'input',
								value: '测量数值',
								disabled: false
							}
						],
						answer: '',
						checked: '未测量',
						required: true,
						disabled: false
					}, {
						name: '脐带：',
						key: 'umbilical_cord',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '已脱落',
								disabled: false
							},
							{
								type: 'radio',
								value: '未脱落有异常',
								disabled: false
							},
							{
								type: 'radio',
								value: '未脱落无异常',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '喂养：',
						key: 'feed_method',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '母乳喂养',
								disabled: false
							},
							{
								type: 'radio',
								value: '混合喂养',
								disabled: false
							},
							{
								type: 'radio',
								value: '人工喂养',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '大便24小时次：',
						key: 'hours_stools',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'input',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					}, {
						name: '大便性质：',
						key: 'stool_condition',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '正常',
								disabled: false
							},
							{
								type: 'radio',
								value: '便秘',
								disabled: false
							},
							{
								type: 'radio',
								value: '腹泻',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '小便24小时次数：',
						key: 'hours_urines',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'input',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					}, {
						name: '小便颜色：',
						key: 'urine_condition',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '深黄色',
								disabled: false
							},
							{
								type: 'radio',
								value: '浅黄色',
								disabled: false
							},
							{
								type: 'radio',
								value: '无色',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '臀部皮肤：',
						key: 'buttock_skin',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '好',
								disabled: false
							},
							{
								type: 'radio',
								value: '红臀',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '其它部位皮肤：',
						key: 'other_skin',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '正常',
								disabled: false
							},
							{
								type: 'radio',
								value: '新生儿红斑',
								disabled: false
							},
							{
								type: 'radio',
								value: '湿疹',
								disabled: false
							},
							{
								type: 'radio',
								value: '热疹',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '体重：',
						key: 'child_weight',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '未测量',
								disabled: false
							},
							{
								type: 'input',
								value: '测量值',
								disabled: false
							}
						],
						answer: '',
						checked: '未测量',
						required: true
					}, {
						name: '其它症状：',
						key: 'other_condition',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'textarea',
							value: ''
						}],
						answer: '',
						checked: 'other_condition',
						required: true,
						disabled: false
					})
					for (let i in this.list) {
						if (this.answer_type == '生后5天' && this.list[i].name == '体重：') {
							this.list.splice(i, 1)
						}
					}
				} else if (this.answer_type == '生后42天' && this.survey_type == '1') {
					this.list.push({
						name: '喂养：',
						key: 'feed_method',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '母乳喂养',
								disabled: false
							},
							{
								type: 'radio',
								value: '混合喂养',
								disabled: false
							},
							{
								type: 'radio',
								value: '人工喂养',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '大便24小时次：',
						key: 'hours_stools',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'input',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					}, {
						name: '大便性质：',
						key: 'stool_condition',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '正常',
								disabled: false
							},
							{
								type: 'radio',
								value: '便秘',
								disabled: false
							},
							{
								type: 'radio',
								value: '腹泻',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '小便24小时次数：',
						key: 'hours_urines',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'input',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					}, {
						name: '小便颜色：',
						key: 'urine_condition',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '深黄色',
								disabled: false
							},
							{
								type: 'radio',
								value: '浅黄色',
								disabled: false
							},
							{
								type: 'radio',
								value: '无色',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '臀部皮肤：',
						key: 'buttock_skin',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '好',
								disabled: false
							},
							{
								type: 'radio',
								value: '红臀',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '其它部位皮肤：',
						key: 'other_skin',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '正常',
								disabled: false
							},
							{
								type: 'radio',
								value: '新生儿红斑',
								disabled: false
							},
							{
								type: 'radio',
								value: '湿疹',
								disabled: false
							},
							{
								type: 'radio',
								value: '热疹',
								disabled: false
							}
						],
						answer: '',
						checked: '',
						required: true
					}, {
						name: '体重：',
						key: 'child_weight',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
								type: 'radio',
								value: '未测量',
								disabled: false
							},
							{
								type: 'input',
								value: '测量值',
								disabled: false
							}
						],
						answer: '',
						checked: '未测量',
						required: true
					}, {
						name: '其它症状：',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						key: 'other_condition',
						answers: [{
							type: 'textarea',
							value: ''
						}],
						answer: '',
						checked: 'other_condition',
						required: true,
						disabled: false
					})
				}
				if (this.survey_type == '1') {
					this.list.push({
						name: '就诊卡号：',
						key: 'hosCardNo',
						url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
						answers: [{
							type: 'input',
							value: ''
						}],
						answer: '',
						checked: '',
						required: true,
						disabled: false
					})
				}
				this.list.unshift({
					name: '病历号：',
					key: 'patID',
					url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
					answers: [{
						type: 'input',
						value: ''
					}],
					answer: '',
					checked: '',
					required: true,
					disabled: true
				})
				this.list.push({
					name: '复诊：',
					key: 'FollowVisit_Date',
					url: 'https://z3.ax1x.com/2021/08/02/fpyPAI.png',
					answers: [{
						type: 'input',
						value: ''
					}],
					answer: '',
					checked: 'IsFollowVisit',
					required: false,
					disabled: true
				})
			},
			// 查询孕妇日记信息
			handleSearchWAnswerSheetInfo(pre_answerID) {
				let data = {
					pre_answerID,
					survey_id: this.survey_id,
					answer_type: this.answer_type
				}
				console.log(data);
				this.$u.post(this.baseUrl + 'SearchWAnswerSheetInfo', data).then(res => {
					console.log(res);
					if (res.code == 200 && res.data !== null) {
						for (let item of this.list) {
							item.answer = res.data[item.key];
							item.checked = res.data[item.key];
							if (item.key == 'IsFollowVisit') {
								item.checked = 'IsFollowVisit'
							}
							if (res.data.IsFollowVisit == 0 && item.name == '复诊：') {
								// console.log(1);
								item.checked = '';
								item.answer = '';
							}
						}
						this.sub_status = res.data.sub_status;
						if(this.sub_status == 2){
							if (res.data.evaluate_results == null) {
								this.$refs.questionnaire.evaluateTxt = '有异常指标'
							}
							if (res.data.evaluate_results == '') {
								this.$refs.questionnaire.evaluateTxt = '有异常指标'
							} else {
								this.$refs.questionnaire.evaluateTxt = res.data.evaluate_results
							}
							
							if (res.data.evaluate == null) {
								this.evaluate = '有异常指标'
							}
							if (res.data.evaluate == '') {
								this.evaluate = '有异常指标'
							} else {
								this.evaluate = res.data.evaluate
							}
						}
						
						
						this.P_IdCard = res.data.P_IdCard;
						this.P_Telephone = res.data.P_Telephone;
						this.fate = res.data.fate;
						for (let i in this.pregnantWoman) {
							this.pregnantWoman[i] = res.data[i]
						}
					}
					// console.log(this.list);
				}).catch(err => {
					console.log(err);
				})
			},
			// 新生儿日记查询接口
			handleCAnswerSheetDetail(child_answerID) {
				let data = {
					child_answerID: child_answerID,
					survey_id: this.survey_id,
					answer_type: this.answer_type
				}
				console.log(data);
				this.$u.post(this.baseUrl + 'CAnswerSheetDetail', data).then(res => {
					console.log(res);
					let datas = res.data.userInfo;
					if (res.code == 200 && datas !== null) {
						if (datas.other_condition == null) {
							datas.other_condition = '';
						}
						for (let item of this.list) {
							if (datas[item.key] !== null) {
								if (item.key == 'jaundice_value' || item.key == 'child_weight') {
									for (let jtem of item.answers) {
										if (jtem.type == 'radio') {
											if (datas[item.key] == '未测量') {
												item.checked = datas[item.key];
											} else {
												item.answer = datas[item.key];
												item.checked = datas[item.key];
											}
										}
									}
								} else {
									item.answer = datas[item.key];
									item.checked = datas[item.key];
								}
								if (item.key == 'other_condition') {
									item.checked = 'other_condition'
								}
							}
						}
						if(datas.sub_status == 2){
							if (datas.evaluate_results == null) {
								this.$refs.questionnaire.evaluateTxt = '有异常指标'
							} else if (datas.evaluate_results == '') {
								this.$refs.questionnaire.evaluateTxt = '有异常指标'
							} else {
								this.$refs.questionnaire.evaluateTxt = datas.evaluate_results
							}
							if (datas.evaluate == null) {
								this.evaluate = '有异常指标'
							} else if (datas.evaluate == '') {
								this.evaluate = '有异常指标'
							} else {
								this.evaluate = datas.evaluate
							}
						}
						for (let i in this.infant) {
							this.infant[i] = datas[i]
						}
						this.nbID = datas.nbID;
						this.P_Telephone = datas.P_Telephone;
						this.P_IdCard = datas.P_IdCard;
					}
				}).catch(err => {
					console.log(err);
				})
			},
			// 分发 修改孕妇日记状态 / 修改新生儿日记状态
			handleSwitchUploadStatus() {
				uni.getStorage({
					key: 'user_login',
					success: res => {
						// console.log(res);
						let data = res.data[0];
						let Review_Name = data.f_username;
						this.survey_type == 0 ? this.handleSaveWAnswerSheetUpdate(Review_Name) : this
							.handleCAnswerSheetUpdate(Review_Name);
					}
				})
			},
			handleClear() {
				this.followVisitDate = '';
				for (let item of this.list) {
					if (item.name == '复诊：') {
						item.answer = '';
					}
				}
			},
			// 修改孕妇日记状态
			handleSaveWAnswerSheetUpdate(Review_Name) {
				let obj = {
					pre_answerID: this.pre_answerID,
					current_status: this.sub_status + '',
					update_status: '2',
					evaluate_results: this.$refs.questionnaire.evaluateTxt,
					evaluate: this.$refs.questionnaire.evaluates,
					Review_Name,
					Review_Date: util.getFtSystemTime(),
					IsFollowVisit: this.followVisitDate == '' ? '0' : '1',
					FollowVisit_Date: this.followVisitDate
				}
				// if (obj.evaluate_results == '点我选择指导意见') return this.$lz.toast('请先选择指导意见');
				if (obj.evaluate == '') return this.$lz.toast('请先输入指导意见内容');
				console.log(obj);
				this.$u.post(this.baseUrl + 'WAnswerExamine', obj).then(res => {
					console.log(res);
					if (res.code == 200) {
						this.$lz.toast(res.info + '2秒后自动返回')
						uni.$emit('answerSheetUpdate', {
							id: res.data.pre_answerID
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					} else {
						this.$lz.toast(res.info);
					}
				}).catch(err => {
					this.$lz.toast(err.errMsg)
				})
			},
			// 修改新生儿日记状态
			handleCAnswerSheetUpdate(Review_Name) {
				let obj = {
					child_answerID: this.child_answerID,
					current_status: this.sub_status + '',
					update_status: '2',
					evaluate_results: this.$refs.questionnaire.evaluateTxt,
					evaluate: this.$refs.questionnaire.evaluates,
					Review_Name,
					Review_Date: util.getFtSystemTime(),
					IsFollowVisit: this.followVisitDate == '' ? '0' : '1',
					FollowVisit_Date: this.followVisitDate
				}
				// if (obj.evaluate_results == '点我选择指导意见') return this.$lz.toast('请先选择指导意见');
				if (obj.evaluate == '') return this.$lz.toast('请先输入指导意见内容');
				console.log(obj);
				this.$u.post(this.baseUrl + 'CAnswerExamine', obj).then(res => {
					console.log(res);
					if (res.code == 200) {
						this.$lz.toast(res.info + '2秒后自动返回');
						uni.$emit('answerSheetUpdate', {
							id: res.data.child_answerID
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 3000)
					} else {
						this.$lz.toast(res.info)
					}
				}).catch(err => {
					this.$lz.toast(err.errMsg);
					console.log(err);
				})
			},
			handleTapVisit(answer) {
				this.$refs.questionnaire.isVisitDates = true;
			},
			handlePickerConfirm(e) {
				let day = e.year + '-' + e.month + '-' + e.day;
				for (let item of this.list) {
					if (item.name == '复诊：') {
						item.answer = day;
						item.checked = day;
						this.followVisitDate = item.answer;
					}
				}
			},
			// 发短信提醒
			handleSendAnswerMessage(evaluates) {
				// if (evaluateTxt == '点我选择指导意见') return this.$lz.toast('请先选择指导意见');
				
				let data = {
					userName: this.survey_Name,
					send_date: util.getFtSystemTime(),
					send_target: this.survey_type - 0,
					send_cycle: this.fate - 0 || this.answer_type.replace(/[^\d]/g, '') - 0,
					msg_Content: evaluates,
					send_telephone: this.P_Telephone,
					P_IdCard: this.P_IdCard,
				}
				console.log(data);
				if (this.survey_type == 0) {
					data.awiId = this.survey_id;
					data.pre_answerID = this.pre_answerID;
				} else {
					data.nbID = this.nbID;
					data.child_answerID = this.child_answerID;
				}
				if (data.msg_Content == '') {
					return this.$lz.toast('提醒内容不能为空！');
				}
				console.log(data);
				this.$u.post(this.baseUrl + 'SendAnswerMessage', {
					data
				}).then(res => {
					console.log(res);
					this.$lz.toast(res.info);
				}).catch(err => {
					this.$lz.toast(err.errMsg);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		width: 100%;
		// padding: 20rpx;

		.content {
			display: flex;
			flex-wrap: wrap;

			.category-item {
				display: flex;
				width: 100%;
				padding: 10rpx;
			}
		}
	}
</style>
