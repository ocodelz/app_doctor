<template>
	<view class="wrap">
		<web-view :src="url" v-if="url.length"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
			}
		},
		onLoad(e) {
			if (e) {
				this.url = e.url;
			}
		}
	}
</script>

<style>
</style>
