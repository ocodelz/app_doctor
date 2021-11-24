const baseUrl = 'http://app.jnthinksoft.cn:6060/api/eytsystem/'   
const request = (url = '', date = {}, type = 'POST', header = {
}) => {
	// console.info(baseUrl + url)
    return new Promise((resolve, reject) => {
        uni.request({
            method: type,
            url: baseUrl + url,
            data: date,
            header: header,
            dataType: 'json',         
        }).then((response) => {
            setTimeout(function() {
                uni.hideLoading();
            }, 200);
            let [error, res] = response;        
            resolve(res.data);
        }).catch(error => {
			setTimeout(function() {
			    uni.hideLoading();
			}, 200);
            let [err, res] = error;
            reject(err)
        })
    });
}

export default request
