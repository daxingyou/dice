
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    start () {

    },

    onBtnJoin() {
        cc.director.loadScene('room');
    },

    onBtnExchangeRecord() {
        let dialog = this.node.getChildByName('DialogExchangeRecord');

	cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnSetting() {
        let dialog = this.node.getChildByName('DialogSetup');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnExchange() {
        let dialog = this.node.getChildByName('DialogExchange');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    // update (dt) {},
});
