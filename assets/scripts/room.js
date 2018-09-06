
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    start () {

    },

    onBtnRobSet() {
        let dialog = this.node.getChildByName('dicebankersetting');

        cc.vv.utils.showDialog(dialog, 'body', enable);
    },

    onBtnQuickSet() {
        let dialog = this.node.getChildByName('dicequicksetting');

        cc.vv.utils.showDialog(dialog, 'body', enable);
    },

    onBtnShang() {
        let dialog = this.node.getChildByName('dicebusinessman');

        cc.vv.utils.showDialog(dialog, 'body', enable);
    },

    onBtnExchangeRecord() {
        let dialog = this.node.getChildByName('DialogExchangeRecord');

        cc.vv.utils.showDialog(dialog, 'body', enable);
    },

    onBtnExchange() {
        let dialog = this.node.getChildByName('DialogExchange');

        cc.vv.utils.showDialog(dialog, 'body', enable);
    },

    onBtnTop() {
        let dialog = this.node.getChildByName('dicetop');

        cc.vv.utils.showDialog(dialog, 'body', enable);
    },

    onBtnSetup() {
        let dialog = this.node.getChildByName('DialogSetup');

        cc.vv.utils.showDialog(dialog, 'body', enable);
    },
});



