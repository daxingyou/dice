
cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume: 1.0,
        sfxVolume: 1.0,
        
        bgmAudioID: -1,
        _bgmUrl: null
    },

    init () {
		let storage = cc.sys.localStorage;
	
        let t = storage.getItem("bgmVolume");
        if (t != null)
            this.bgmVolume = parseFloat(t);
        
        t = storage.getItem("sfxVolume");
        if (t != null)
            this.sfxVolume = parseFloat(t);

        cc.game.on(cc.game.EVENT_HIDE, () => {
            cc.audioEngine.pauseAll();
        });

        cc.game.on(cc.game.EVENT_SHOW, () => {
            cc.audioEngine.resumeAll();
        });
    },

    getUrl (url){
        return cc.url.raw("resources/sounds/" + url);
    },
    
    playBGM (url) {
        let audioUrl = this.getUrl(url);
        let bgmVolume = this.bgmVolume;

        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
            this.bgmAudioID = -1;
        }

        if (bgmVolume > 0) {
            this.bgmAudioID = cc.audioEngine.play(audioUrl, true, bgmVolume);
        } else {
            this._bgmUrl = url;
        }
    },
    
    playSFX (url, cb) {
        let audioUrl = this.getUrl(url);
		let audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);

		if (cb != null)
			cc.audioEngine.setFinishCallback(audioId, cb);
    },

	playBtnClicked () {
		this.playSFX('btn_click.mp3');
    },
    
    setSFXVolume (v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    },

    setBGMVolume (v, force) {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }

        let old = this.bgmVolume;

        if (old != v || force) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            
            if (this.bgmAudioID >= 0) {
                cc.audioEngine.setVolume(this.bgmAudioID, v);
            } else {
                if (v > 0 && this._bgmUrl != null) {
                    this.playBGM(this._bgmUrl);
                }
            }
        }
    },

    pauseAll () {
        cc.audioEngine.pauseAll();
    },

    resumeAll () {
        cc.audioEngine.resumeAll();
    }
});

