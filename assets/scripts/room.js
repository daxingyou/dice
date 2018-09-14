
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

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnQuickSet() {
        let dialog = this.node.getChildByName('dicequicksetting');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnShang() {
        let dialog = this.node.getChildByName('dicebusinessman');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnExchangeRecord() {
        let dialog = this.node.getChildByName('DialogExchangeRecord');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnExchange() {
        let dialog = this.node.getChildByName('DialogExchange');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnTop() {
        let dialog = this.node.getChildByName('dicetop');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnSetup() {
        let dialog = this.node.getChildByName('DialogSetup');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnResult() {
        let dialog = this.node.getChildByName('diceresult');

        cc.vv.utils.showDialog(dialog, 'body', true);
    }
});



