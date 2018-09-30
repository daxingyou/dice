

let URL = "http://ip9.queda88.com:8000/dice";

var HTTP = cc.Class({
    extends: cc.Component,

    statics : {
        sessionId : 0,
        userId : 0,
        master_url : URL,
        url : URL,
        
        sendRequest : function(path, data, handler, extraUrl) {
            let xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            let str = "?";
            for (let k in data) {
                if(str != "?")
                    str += "&";

                str += k + "=" + data[k];
            }
			
            if (extraUrl == null)
                extraUrl = HTTP.url;

            let requestURL = extraUrl + path + encodeURI(str);

            xhr.open("GET", requestURL, true);
            if (cc.sys.isNative)
                xhr.setRequestHeader("Accept-Encoding", "gzip, deflate", "text/html;charset=UTF-8");

            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        let ret = JSON.parse(xhr.responseText);
                        if(handler !== null){
                            handler(ret);
                        }                        /* code */
                    } catch (e) {
                        console.log("err:" + e);
                        //handler(null);
                    }
                    finally {
                        if(cc.vv && cc.vv.wc){
                        //       cc.vv.wc.hide();
                        }
                    }
                }
            };

            if(cc.vv && cc.vv.wc){
                //cc.vv.wc.show();
            }
			
            xhr.send();
            return xhr;
        },
        
        post : function(path, data, handler, extraUrl) {
            let xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            
            if(extraUrl == null)
                extraUrl = HTTP.url;
            
            let requestURL = extraUrl + path;

            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    console.log("http post res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        let ret = JSON.parse(xhr.responseText);
                        if (handler !== null) {
                            handler(ret);
                        }
                    } catch (e) {
                        console.log("post err:" + e);
						//handler(null);
                    }
					finally {
						cc.vv.utils.showLoading(false);
					}
                }
            };

			xhr.open('POST', requestURL);
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

			cc.vv.utils.showLoading(true);

            xhr.send(JSON.stringify(data));
            return xhr;
        }
    },
});

