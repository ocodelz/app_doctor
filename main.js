import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import request from './common/utils/myRequest.js';
Vue.prototype.$request = request;
Vue.prototype.baseUrl = 'http://app.jnthinksoft.cn:6060/api/postpartum/';
Vue.prototype.show = true;
import $ from 'common/tips.js'
Vue.prototype.$lz = $;
Vue.use(uView);
Vue.config.productionTip = false
//版本更新
let currentVersion = uni.getStorageSync('localDocVersionID')
console.log('localVersion=' + currentVersion.id)
if (!currentVersion) {
	currentVersion = {
		id: 0
	}
} else
if (!currentVersion.id) {
	currentVersion.id = 0
}

Vue.prototype.$current = currentVersion
//
App.mpType = 'app'

const app = new Vue({
	...App
})
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app)
app.$mount()
