

cc.Class({
    extends: cc.Component,

    properties: {
        sprites: {
            default: [],
            type: [cc.SpriteFrame]
        },

        index: -1,
    },

	start () {
		this.setIndex(this.index);
	},
    
    setIndex (index) {
        let target = this.node.getComponent(cc.Sprite);

        if (index == -1) {
            target.spriteFrame = null;
        } else if (this.sprites[index] != null) {
            target.spriteFrame = this.sprites[index];
        }
        
        this.index = index;
    },
});


