import Spinner from '../component/Spinner.view.js';
import TipsBox from '../component/TipsBox.view.js';
import PopupBox from '../component/PopupBox.view.js';
import Toast from '../component/Toast.view.js';
import AppTool from '../tool/Tool.js';
import routing from './Routing.js';
import Activity from '../component/Activity.view.js';

/**
 * FrameworkEland
 * 
 * create 2019/06/29 11:21
 * version 1.0.1
 */
export default class FrameworkEland {
    _default_opts = {
        root: 'app',
        name: 'FrameworkEland',
        mainAtivityOpts: null,
        version: '1.0.1',
        debug: true
    }

    mainAtivity = null // 主 act

    msgBox = new TipsBox({
        rootId: 'msgBox',
        topColor: '#cca352',
        topColorDK: '#cca352',
        contentColor: 'white',
        textColor: 'black'
    })

    popup = new PopupBox({
        rootId: 'popupBox',
        align: 'center',
        isfadeIn: true,
        isfadeOut: true,
        opacity: 0
    })

    toast = new Toast({
        rootId: 'toast',
        maskOpacity: 0,
        colorText: '#cccccc',
        colorBox: '#383838',
        fontSize: '16px'
    })

    loadview = new Spinner({
        rootId: 'loading',
        maskOpacity: 0,
        colorSpin: '#FFFFFF',
        colorBox: 'rgba(56,56,56,0.8)',
        colorBoxLine: 'white',
        colorText: 'white',
        textWeight: 'bold',
        isTouchCancel: true
    })

    constructor(opts) {
        if (opts.mainAtivityOpts == null) {
            console.error('framework opts for mainAtivity opts is null')

            return
        }

        this._setframestyle()

        this._default_opts = AppTool.structureAssignment(this._default_opts, opts, true)

        this._default_opts.mainAtivityOpts.isMainAct = true

        console.log('framework structureAssignment opts', this._default_opts)

        this.mainAtivity = new Activity(this._default_opts.mainAtivityOpts)

        this.mainAtivity.hideTopBack()

        this.mainAtivity.showTopLogo()

        this.mainAtivity.showTopTitle()

        this.mainAtivity.show()
    }

    getMainAct() {
        return this.mainAtivity
    }

    pushActivity(activityHandel) {
        routing.pushActivity(activityHandel)
    }

    showMsgBox(opts) {
        this.msgBox.show(opts)
    }

    closeMsgBox() {
        this.msgBox.close()
    }

    showToast(msg) {
        this.toast.show(msg)
    }

    closeToast() {
        this.toast.close()
    }

    showPopup(opts) {
        let pame = {
            name: null,
            getContent: () => { },
            setStyle: () => { },
            bindHandle: () => { },
            closeHandle: () => { }
        }

        this.popup.show(opts)
    }

    closePopup() {
        this.popup.close()
    }

    showLoading(opts) {
        this.loadview.show(opts)
    }

    closeLoading(tag) {
        this.loadview.close(tag)
    }

    finish() {
        routing._finishForce()
    }

    _setframestyle() {
        $('.pages').css({
            'width': $(window).width(),
            'height': $(window).height()
        })
    }
}
