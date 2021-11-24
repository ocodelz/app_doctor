<template>
	<scroll-view scroll-y="true" class="scroll" @scrolltolower="handleScrolltolower">
		<view class="flex flex-wrap align-center p-2">
			<view class="flex align-center justify-center flex-column" style="width: 170rpx;height: 200rpx;"
				v-for="(item,index) in list" :key="index" @click="handleTapItem(item)">
				<u-image src="https://z3.ax1x.com/2021/08/05/fZBsgA.png" width="120" height="120"></u-image>
				<text>{{item.answer_type}}</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				survey_id: '',
				survey_type: '',
				survey_Name: '',
				list: [],
				paginationobj: {
					rows: '35',
					page: 1,
					sidx: '',
					sord: 'desc',
					records: 0,
					total: 0
				},
				paginationobjs: {
					rows: '35',
					page: 1,
					sidx: '',
					sord: 'desc',
					records: 0,
					total: 0
				}
			}
		},
		onLoad(e) {
			if (e) {
				let data = JSON.parse(e.detail);
				this.survey_id = data.survey_id;
				this.survey_type = data.survey_type;
				this.survey_Name = data.survey_Name;
			}
		},
		onShow() {
			this.handleDispenseQuestionnaire();
		},
		methods: {
			// 分发 获取辣妈 / 萌宝 日记列表
			handleDispenseQuestionnaire(){
				this.survey_type == '0' ? this.handleSearchWAnswerSheetList() : this.handleChildAnswerList()
			},
			// 查询孕妇日记列表
			handleSearchWAnswerSheetList(){
				this.list = [];
				let obj = {
					survey_id: this.survey_id,
					paginationobj: JSON.stringify(this.paginationobj),
					sub_status: '1,2',
				}
				this.$u.post(this.baseUrl + 'SearchWAnswerSheetList',obj).then(res => {
					console.log(res);
					let data = res.data.pagedatas;
					for(let item of data){
						if(item.fate.toString().indexOf('.') == -1){
							item.fate = item.fate.toFixed(2);
						}
						if(item.fate.toString().split('.')[1].length == 1){
							item.fate = item.fate + '0';
						}
					}
					data.sort((a,b) => {
						return a.fate - b.fate
					})
					if(res.code == 200 && data.length){
						this.paginationobj.total = res.data.pagenumber;
						this.list = this.list.concat(data);
					}else{
						this.$lz.toast('暂无数据!')
					}
				}).catch(err => {
					this.$lz.toast(err.errMsg)
				})
			},
			// 新生儿日记列表
			handleChildAnswerList(){
				console.log(222);
				this.list = [];
				let obj = {
					survey_id: this.survey_id,
					paginationobj: JSON.stringify(this.paginationobjs)
				}
				this.$u.post(this.baseUrl + 'childAnswerList',obj).then(res => {
					console.log(res);
					let data = res.data.pagedatas;
					if(res.code == 200 && data.length){
						this.paginationobjs.total = res.data.pagenumber;
						this.list = this.list.concat(data);
					}else{
						this.$lz.toast('暂无数据!')
					}
				}).catch(err => {
					this.$lz.toast(err.errMsg)
				})
			},
			// 滑动到底部分页
			handleScrolltolower(e){
				if(this.paginationobj.page < this.paginationobj.total){
					this.paginationobj.page++
					this.handleSearchWAnswerSheetList();
				}else{
					this.$lz.toast('没有更多数据了!');
				}
			},
			handleTapItem(item) {
				item.survey_type = this.survey_type;
				item.survey_Name = this.survey_Name;
				console.log(item);
				uni.navigateTo({
					url: '../postpartumOrPostoperativeQuestionnaireSurvey/postpartumOrPostoperativeQuestionnaireSurvey?detail=' + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll{
		height: 100vh;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>
