

cc.Class({
    extends: cc.Component,

    properties: {
		inited : false,
		_diceresultitemTemp : null
    },

	onLoad() {
		let content = cc.find('body/content', this.node);
		let temp = content.children[0];

		this._diceresultitemTemp = temp;
		content.removeChild(temp);
	},

    start () {	
		this.refresh();
		this.inited = true;
    },

    onBtnClose() {
    	cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	onEnable() {
		if (this.inited)
			this.refresh();
	},

	getIndex(ret) {
		if (ret == 'L')
			return 2;
		else if (ret == 'B')
			return 0;
		else if (ret == 'S')
			return 1;

		return 0;
	},

	getWin(ret) {
		if (ret == 'w')
			return 0;
		else if (ret == 'l')
			return 1;
		else if (ret == 'd')
			return 2;

		return 0;
	},

	refresh() {
		let body = this.node.getChildByName('body');
		let txtServerName = body.getChildByName('txtServerName').getComponent(cc.Label);
		let txtBankerName = body.getChildByName('txtBankerName').getComponent(cc.Label);
		let txtTotalBetBig = body.getChildByName('txtTotalBetBig').getComponent(cc.Label);
		let txtBankerMoney = body.getChildByName('txtBankerMoney').getComponent(cc.Label);
		let txtTotalBetSmall = body.getChildByName('txtTotalBetSmall').getComponent(cc.Label);
		let txtBankerWin = body.getChildByName('txtBankerWin').getComponent(cc.Label);
		let txtLeopard = body.getChildByName('txtLeopard').getComponent(cc.Label);
		let txtTotalBig = body.getChildByName('txtTotalBig').getComponent(cc.Label);
		let txtTotalSmall = body.getChildByName('txtTotalSmall').getComponent(cc.Label);

		let gm = cc.vv.gameMgr;
		let room = gm.room;
		let last = gm.last;

		if (!last)
			return;

		txtServerName.string = room.server;
		txtBankerName.string = last.banker.nickname;
		txtTotalBetBig.string = '' + last.stat.big_bet_total;
		txtBankerMoney.string = '' + last.banker.banker_amount;
		txtTotalBetSmall.string = '' + last.stat.small_bet_total;
		txtBankerWin.string = '' + (last.banker.profit - last.banker.banker_amount);
		txtLeopard.string = '' + last.stat.triple;
		txtTotalBig.string = '' + last.stat.big;
		txtTotalSmall.string = '' + last.stat.small;

		let content = body.getChildByName('content');
		let records = last.records;
		let cnt = records.length;

		for (let i = 0; i < cnt; i++) {
			let item = this.getItem(content, i);
			let record = records[i];

			item.getChildByName('txtValue').getComponent(cc.Label).string = record.substring(1, 4);
			item.getChildByName('txtBigOrSmall').getComponent('SpriteMgr').setIndex(this.getIndex(record[0]));
			item.getChildByName('txtWinOrLoss').getComponent('SpriteMgr').setIndex(this.getWin(record[record.length - 1]));
		}

		this.shrinkContent(content, cnt);
	},

	getItem (content, index) {
        if (content.childrenCount > index)
            return content.children[index];

        let node = cc.instantiate(this._diceresultitemTemp);
        content.addChild(node);
        return node;
    },

    shrinkContent (content, num) {
        while (content.childrenCount > num) {
            let lastOne = content.children[content.childrenCount -1];
            content.removeChild(lastOne, true);
        }
    }
});


