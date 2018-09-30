

cc.Class({
    extends: cc.Component,

    properties: {
		prefab : cc.Prefab,
		navigator : cc.Label,
		page : 0,
		pages : 0
    },

	onEnable () {
		this.page = 0;
		this.refresh();
	},

	refresh () {
		let utils = cc.vv.utils;
		let param = {
			token : cc.vv.userMgr.token,
			page : this.page
		};

		let self = this;
	
		cc.vv.http.post('/dealer/list_dealer_records', param, ret => {
			if (!ret) {
				utils.showTips('通讯失败');
				return;
			}

			let code = ret.code;
			if (code != 0) {
				utils.showTips('通讯失败: ' + ret.msg);
				return;
			}

			self.showRecords(ret.data);
		});
	},

    onBtnClose() {
    	cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	onBtnPrev() {
		cc.vv.audioMgr.playBtnClicked();
	
		if (this.page <= 0)
			return;

		this.page --;
		this.refresh();
	},

	onBtnNext() {
		cc.vv.audioMgr.playBtnClicked();
	
		if (this.page >= this.pages - 1)
			return;

		this.page ++;
		refresh();
	},

	showRecords (data) {
		let pages = Math.ceil(data.count / 10);
		
		this.navigator.string = (this.page + 1) + '/' + pages;

		let content = cc.find('body/content', this.node);
		let rows = data.rows;
		let account = cc.vv.userMgr.account;
		let utils = cc.vv.utils;
		
		for (let i = 0; i < rows.length; i++) {
			let item = this.getItem(content, i);
			let record = rows[i];
			let dealer = account == record.account;

			let date = utils.dateformat(record.create_at * 1000);

			item.getChildByName('txtTime').getComponent(cc.Label).string = date;
			item.getChildByName('txtUser').getComponent(cc.Label).string = dealer ? record.target : record.account;
			item.getChildByName('txtMoney').getComponent(cc.Label).string = (dealer ? '-' : '+') + record.amount;
		}

		this.shrink(content, rows.length);
	},

	getItem (content, id) {
        if (content.childrenCount > id)
            return content.children[id];

        let node = cc.instantiate(this.prefab);
        content.addChild(node);
        return node;
    },

	shrink (content, num) {
		while (content.childrenCount > num) {
            let lastOne = content.children[content.childrenCount -1];
            content.removeChild(lastOne, true);
        }
	}
});


