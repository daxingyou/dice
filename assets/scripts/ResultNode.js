

cc.Class({
    extends: cc.Component,

    properties: {
		resultNode : null
    },

	start() {
		let self = this;
		this.resultNode = this.node.getChildByName('resultNode');
/*		
		this.node.on('game_records_udpate', () => {
			self.refresh();
		});
*/
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
		let gm = cc.vv.gameMgr;
		let records = gm.room.records;
		let node = this.resultNode;
		let cnt = records.length;

		console.log('records: ' + records);

		for (let i = 0; i < cnt; i++) {
			let record = records[i];

			let id = this.getIndex(record[0]);
			let win = this.getWin(record[record.length - 1]);

			let node1 = node.getChildByName('txtBigOrSmall' + i);
			let node2 = node.getChildByName('txtWinOrFail' + i);

			node1.active = true;
			node2.active = true;
			
			let txt1 = node1.getComponent('SpriteMgr');
			let txt2 = node2.getComponent('SpriteMgr');

			txt1.setIndex(id);			
			txt2.setIndex(win);
		}

		for (let i = cnt; i < 20; i++) {
			let node1 = node.getChildByName('txtBigOrSmall' + i);
			let node2 = node.getChildByName('txtWinOrFail' + i);

			node1.active = false;
			node2.active = false;
		}

		let now = node.getChildByName('resultnow');
		let show = cnt > 0;

		now.active = show;

		if (show) {
			let node1 = node.getChildByName('txtBigOrSmall' + (cnt - 1));

			now.x = node1.x;
		}
	},
});


