<template>
	<view v-if="status" style="z-index:999999;">
		<view class="fixed-top">
			<!-- 蒙版 -->
			<view v-if="mask" class="position-fixed top-0 left-0 right-0 bottom-0" :style="getMaskColor" @click="hide"></view>
			<!-- 弹出框内容 -->
			<view class="position-fixed bg-white" :class="getBodyClass">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 是否开启蒙版颜色
			maskColor: {
				type: Boolean,
				default: false
			},
			// 是否开启蒙版
			mask: {
				type: Boolean,
				default: true
			},
			// 是否处于底部
			fixedBottom: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				status: false // 蒙版的显示和隐藏
			}
		},
		computed: {
			// 蒙版颜色
			getMaskColor() {
				let i = this.maskColor ? 0.5 : 0
				return `background-color: rgba(0,0,0,${i});`
			},
			// 是否处于底部
			getBodyClass() {
				let fixedBottom = this.fixedBottom ? 'left-0 right-0 bottom-0 rounded' : 'rounded border';
				return fixedBottom
			}
		},
		methods: {
			// 显示蒙版
			show() {
				this.status = true;
			},
			// 隐藏蒙版
			hide() {
				this.status = false;
			}
		}
	}
</script>

<style scoped>

</style>
