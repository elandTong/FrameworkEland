import Activity from '../component/Activity.view.js';
import Popupwindow from '../component/Popupwindow.view.js';
import SpinnerBox from '../component/SpinnerBox.view.js';
import TipsBox from '../component/TipsBox.view.js';
import Toast from '../component/Toast.view.js';
import AppTool from '../tool/Tool.js';
import routing from './Routing.js';

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
        mainAtivityOpts: {
            toolbar: { // 操作栏配置
                topH: 50,
                finish: {
                    active: false,
                    icon: './pic/theme/back.png'
                },
                logo: {
                    active: true,
                    icon: './pic/theme/log.png',
                    touchHandle: function () {
                    }
                },
                title: {
                    active: true,
                    text: 'FrameworkEland',
                    align: 'left',
                    touchHandle: function () {
                    }
                },
                font: {
                    color: 'white',
                    style: 'normal',
                    weight: 'normal'
                },
                shadow: {
                    color: '#000',
                    length: 2
                },
                buttons: [],
                background: 'black'
            },
        },
        version: '1.0.1',
        debug: true
    }

    mainAtivity = null // 主 act

    tipsBox = new TipsBox({
        rootId: 'tipsBox',
        maskOpacity: 0.1,
        isTouchCancel: true,
        topBackground: '#4169E1',
        contentBackground: 'white',
        colorText: 'black',
        cancelHandel: function () { // handle
        }
    })

    popup = new Popupwindow({
        rootId: 'popupBox',
        align: 'center', // top bottom center none(position)
        position: {
            x: 20, y: 20
        },
        isTouchCancel: true,
        opacity: 0.1,
        openHandle: function () {
        },
        closeHandle: function () {
        }
    })

    toast = new Toast({
        rootId: 'toast',
        maskId: null,
        contentId: null,
        maskOpacity: 0.1,
        position: 'center', // top bottom center
        autoCancel: true,
        autoCancelLength: 'short', // short long
        isTouchCancel: true,
        colorText: '#cccccc',
        colorBox: '#383838',
        fontSize: '16px'
    })

    spinnerBox = new SpinnerBox({
        rootId: 'loading',
        mode: 1,
        maskOpacity: 0.1,
        text: 'Framework',
        colorSpin: '#FFFFFF',
        colorBox: 'rgba(56,56,56,0.5)',
        colorBoxLine: 'white',
        colorText: 'white',
        textWeight: 'bold', // normal
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

        this._default_opts.mainAtivityOpts.toolbar.finish.active = false

        this.mainAtivity = new Activity(this._default_opts.mainAtivityOpts)

        this.mainAtivity.show()

        console.log('framework structureAssignment opts', this._default_opts)
    }

    getMainAct() {
        return this.mainAtivity
    }

    pushActivity(activity) {
        routing.pushActivity(activity)
    }

    showTipsBox(act, opts) {
        this.tipsBox.show(act, opts)
    }

    closeTipsBox() {
        this.tipsBox.close()
    }

    showToast(act, text) {
        this.toast.show(act, text)
    }

    closeToast() {
        this.toast.close()
    }

    showPopup(act, opts) {
        let pame = {
            name: null,
            getContent: null,
            setStyle: null
        }

        this.popup.show(act, opts)
    }

    closePopup() {
        this.popup.close()
    }

    showLoading(act, text) {
        this.spinnerBox.show(act, text)
    }

    closeLoading() {
        this.spinnerBox.close()
    }

    finish() {
        routing.nativeComeBack()
    }

    _setframestyle() {
        $('.pages').css({
            'width': $(window).width(),
            'height': $(window).height()
        })
    }
}
