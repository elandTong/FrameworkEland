import Activity from './component/Activity.view.js';
import Pageview from './component/Pageview.view.js';
import ElandTab from './component/Tab.view.js';
import FrameworkEland from './base/Framework.js';
import Listview from './component/Listview.view.js';

class AppDome {
    frame = null

    mact = null

    subact = null

    constructor() {
        this.elandTab = {}

        this.pageview = {}

        let main_opts = {
            rootId: 'app_main',
            name: null, // 优先级高于 getContent
            getContent: null,
            setStyle: () => { },
            title: '',
            toolbarTopFontSize: '16px',
            toolbarTopFontStyle: '', // italic oblique
            toolbarTopFontWeight: 'normal', // normal bold
            toolbarTopLogo: './pic/theme/log.png',
            toolbarTopMenuImg: null,
            toolbarTopTouchType: 'def',
            toolbarTopH: 55,
            toolbarTopColor: 'black',
            toolbarTopColorDK: 'black',
            toolbarTopTextColor: 'white',
            toolbarTopBtnTouchColor: '#cca352',
            toolbarTopOpenBtnBordLine: false,
            toolbarTopShadowColor: null,
            toolbarTopShadowLen: null,
            contentBgColor: 'white',
            contentLoadColor: 'red',
            draweMenuType: 'left',
            draweContentColor: null,
            draweWidthScale: 0.6,
            draweMenuName: '',
            draweMenuGetContent: () => {
                return 'draweMenuGetContent'
            },
            draweMenuSetStyle: () => {
                console.log('draweMenuSetStyle')
            },
            draweMenuHandle: () => {
                console.log('draweMenuHandle for main')
            },
            finishHandel: () => { // 返回处理器
                this.frame.showMsgBox({
                    title: 'MAIN ACT FINISH',
                    isHideBackBtn: true,
                    isTouchOtherClose: true,
                    getContent: () => {
                        return 'welcome framework dome'
                    },
                    setStyle: () => { },
                    backHandle: () => { }
                })
            },
            resumeHandel: () => {
                console.log('main act resumeHandel')
            },
            pauseHandel: () => {
                console.log('main act pauseHandel')
            },
            initHandel: () => {
                new Listview({
                    rootId: 'app_main_content',
                    ispull: true,
                    threshold: 100,
                    topRingradius: 24,
                    botRingradius: 24,
                    topFontsize: 14,
                    botFontsize: 14,
                    isopenBotPull: true,
                    padding: 2,
                    itempadd: 1,
                    colorTopRing: 'red',
                    colorTopText: 'red',
                    colorBotRing: 'red',
                    colorBotText: 'red',
                    itemclickHandle: (item, index) => {
                        console.log('itemclickHandle item', item, 'index: ' + index)
                    },
                    itemview: (item, index, id) => {
                        // 根标签必须指定 id 与 class 并且值设为 ID模版[id] 与 class模版[cas]
                        // 否则item点击事件处理将失效
                        return '<div id="[id]" class="[cas]">{[con]}</div>'
                    },
                    itemstyle: (cas) => { // cas 为所有根标签的 class 名称
                        $('.' + cas).css({
                            'width': '100%',
                            'height': '80px',
                            'display': 'flex',
                            'justify-content': 'center',
                            'align-items': 'center',
                            'background': 'red',
                            'font-size': '16px'
                        })
                    },
                    emptyview: () => {
                        return '没有数据喔喔哦喔'
                    },
                    emptystyle: () => { },
                    downHandle: (handle) => {
                        setTimeout(() => {
                            let lis = []
                            for (let i = 1; i <= 50; i++) {
                                lis.push({
                                    con: '这是第' + i + '条数据'
                                })
                            }

                            window.dowmIndex = 50

                            if (handle) {
                                handle(lis)
                            }
                        }, 3500)
                    },
                    upHandle: (handle) => {
                        setTimeout(() => {
                            let lis = []

                            for (let i = 0; i < 50; i++) {
                                lis.push({
                                    con: '这是第' + (++window.dowmIndex) + '条数据'
                                })
                            }

                            if (handle) {
                                handle(lis, true)
                            }
                        }, 3500)
                    }
                })

                console.log('main act initHandel')
            },
            toolbarTopLogoTouchHandle: () => {
                console.log('toolbarTopLogoTouchHandle')
            }
        }

        let sub_opts = {
            rootId: 'app_sub',
            name: null, // 优先级高于 getContent
            getContent: null,
            setStyle: null,
            title: 'DOME',
            toolbarTopFontSize: '16px',
            toolbarTopFontStyle: '', // italic oblique
            toolbarTopFontWeight: 'normal', // normal bold
            toolbarTopLogo: './pic/theme/log.png',
            toolbarTopBackImg: './pic/theme/back.png',
            toolbarTopMenuImg: null,
            toolbarTopTouchType: 'def',
            toolbarTopH: 55,
            toolbarTopColor: 'black',
            toolbarTopColorDK: 'black',
            toolbarTopTextColor: 'white',
            toolbarTopBtnTouchColor: '#cca352',
            toolbarTopOpenBtnBordLine: false,
            toolbarTopShadowColor: null,
            toolbarTopShadowLen: null,
            contentBgColor: 'white',
            contentLoadColor: '#cca352',
            draweMenuType: 'right',
            draweContentColor: 'red',
            draweWidthScale: 0.6,
            draweMenuName: '',
            draweMenuGetContent: () => {
                return 'draweMenuGetContent'
            },
            draweMenuSetStyle: () => {
                console.log('draweMenuSetStyle')
            },
            draweMenuHandle: () => {
                console.log('draweMenuHandle for sub')
            },
            finishHandel: () => { // 返回处理器
                this.frame.showMsgBox({
                    title: 'SUB ACT FINISH',
                    isHideBackBtn: true,
                    isTouchOtherClose: true,
                    getContent: () => {
                        return 'welcome framework dome'
                    },
                    setStyle: () => { },
                    backHandle: () => { }
                })
            },
            resumeHandel: () => {
                this.pageview.update()

                console.log('sub act resumeHandel')
            },
            pauseHandel: () => {
                console.log('sub act pauseHandel')
            },
            initHandel: () => {
                this.pageview = new Pageview({
                    rootId: 'app_sub_content',
                    defaultIndex: 0,
                    allowTouchMove: true,
                    autoplay: false,
                    pagination: true,
                    selectHandle: (index) => {
                        console.log('tab act pageview selectHandle:' + index)
                    },
                    initHandle: (ids) => {
                        console.log('tab act pageview initHandle conids', ids)
                    },
                    pageList: [{
                        name: './pages/main.html',
                        contentH: 'auto', // 内容高度
                        colorContent: 'white', // tab 内容背景
                        getContent: null,
                        setStyle: null
                    }, {
                        name: './pages/sub.html',
                        contentH: 'auto', // 内容高度
                        colorContent: 'white', // tab 内容背景
                        getContent: null,
                        setStyle: null
                    }, {
                        name: './pages/main.html',
                        contentH: 'auto', // 内容高度
                        colorContent: 'white', // tab 内容背景
                        getContent: null,
                        setStyle: null
                    }, {
                        name: './pages/sub.html',
                        contentH: 'auto', // 内容高度
                        colorContent: 'white', // tab 内容背景
                        getContent: null,
                        setStyle: null
                    }]
                })
                console.log('sub act initHandel')
            },
            toolbarTopLogoTouchHandle: () => {
                console.log('toolbarTopLogoTouchHandle')
            }
        }

        let tab_opts = {
            rootId: 'app_tab',
            name: null, // 优先级高于 getContent
            getContent: null,
            setStyle: null,
            title: 'DOME',
            toolbarTopFontSize: '16px',
            toolbarTopFontStyle: '', // italic oblique
            toolbarTopFontWeight: 'normal', // normal bold
            toolbarTopLogo: './pic/theme/log.png',
            toolbarTopBackImg: './pic/theme/back.png',
            toolbarTopMenuImg: null,
            toolbarTopTouchType: 'def',
            toolbarTopH: 55,
            toolbarTopColor: 'black',
            toolbarTopColorDK: 'black',
            toolbarTopTextColor: 'white',
            toolbarTopBtnTouchColor: '#cca352',
            toolbarTopOpenBtnBordLine: false,
            toolbarTopShadowColor: null,
            toolbarTopShadowLen: null,
            contentBgColor: 'white',
            contentLoadColor: '#cca352',
            draweMenuType: 'right',
            draweContentColor: 'red',
            draweWidthScale: 0.6,
            draweMenuName: '',
            draweMenuGetContent: () => {
                return 'draweMenuGetContent'
            },
            draweMenuSetStyle: () => {
                console.log('draweMenuSetStyle')
            },
            draweMenuHandle: () => {
                console.log('draweMenuHandle for sub')
            },
            finishHandel: () => { // 返回处理器
            },
            resumeHandel: () => {
                this.elandTab.update()

                console.log('tab act resumeHandel')
            },
            pauseHandel: () => {
                console.log('tab act pauseHandel')
            },
            initHandel: () => {
                this.elandTab = new ElandTab({
                    rootId: 'app_tab_content',
                    tabH: 45,
                    lineH: 2,
                    mode: -1,
                    defaultIndex: 0,
                    allowTouchMove: true,
                    tabBackground: '#2A2A2A',
                    selectHandle: (index) => {
                        console.log('tab act pageview selectHandle:' + index)
                    },
                    initHandle: (ids) => {
                        console.log('tab act pageview initHandle conids', ids)
                    },
                    tabList: [{
                        menu: 'AB', // tab 标题
                        name: './pages/main.html',
                        contentH: 'auto', // 内容高度
                        fontsize: 12, // tab 标题字体大小
                        colorContent: 'white', // tab 内容背景
                        colorTabTouch: '#cca352', // tab 标题 TOUCH 颜色
                        colorText: 'white', // tab 标题选中 字体 颜色
                        colorTextNone: 'red', // tab 标题未选中 字体 颜色
                        colorLine: '#cca352', // tab 标题下划线选中 颜色
                        colorLineNone: 'red', // tab 标题下划线未选中 颜色
                        touchType: 'def',
                        getContent: () => { },
                        setStyle: () => { }
                    }, {
                        menu: 'CD', // tab 标题
                        name: './pages/sub.html',
                        contentH: 'auto', // 内容高度
                        fontsize: 12, // tab 标题字体大小
                        colorContent: 'blue', // tab 内容背景
                        colorTabTouch: '#cca352', // tab 标题 TOUCH 颜色
                        colorText: 'white', // tab 标题选中 字体 颜色
                        colorTextNone: 'red', // tab 标题未选中 字体 颜色
                        colorLine: '#cca352', // tab 标题下划线选中 颜色
                        colorLineNone: 'white', // tab 标题下划线未选中 颜色
                        touchType: 'def',
                        getContent: () => {
                            return 'framework eland'
                        },
                        setStyle: () => { }
                    }, {
                        menu: 'EF', // tab 标题
                        name: './pages/main.html',
                        contentH: 'auto', // 内容高度
                        fontsize: 12, // tab 标题字体大小
                        colorContent: 'red', // tab 内容背景
                        colorTabTouch: '#cca352', // tab 标题 TOUCH 颜色
                        colorText: 'white', // tab 标题选中 字体 颜色
                        colorTextNone: 'red', // tab 标题未选中 字体 颜色
                        colorLine: '#cca352', // tab 标题下划线选中 颜色
                        colorLineNone: 'blue', // tab 标题下划线未选中 颜色
                        touchType: 'def',
                        getContent: () => { },
                        setStyle: () => { }
                    }, {
                        menu: 'GH', // tab 标题
                        name: './pages/sub.html',
                        contentH: 'auto', // 内容高度
                        fontsize: 12, // tab 标题字体大小
                        colorContent: 'white', // tab 内容背景
                        colorTabTouch: '#cca352', // tab 标题 TOUCH 颜色
                        colorText: 'white', // tab 标题选中 字体 颜色
                        colorTextNone: 'red', // tab 标题未选中 字体 颜色
                        colorLine: '#cca352', // tab 标题下划线选中 颜色
                        colorLineNone: '', // tab 标题下划线未选中 颜色
                        touchType: 'def',
                        getContent: () => {
                            return 'framework eland'
                        },
                        setStyle: () => { }
                    }, {
                        menu: 'OP', // tab 标题
                        name: './pages/main.html',
                        contentH: 'auto', // 内容高度
                        fontsize: 12, // tab 标题字体大小
                        colorContent: 'red', // tab 内容背景
                        colorTabTouch: '#cca352', // tab 标题 TOUCH 颜色
                        colorText: 'white', // tab 标题选中 字体 颜色
                        colorTextNone: 'red', // tab 标题未选中 字体 颜色
                        colorLine: '#cca352', // tab 标题下划线选中 颜色
                        colorLineNone: 'red', // tab 标题下划线未选中 颜色
                        touchType: 'def',
                        getContent: () => { },
                        setStyle: () => { }
                    }]
                })

                console.log('tab act initHandel')
            },
            toolbarTopLogoTouchHandle: () => {
                console.log('toolbarTopLogoTouchHandle')
            }
        }

        this.frame = new FrameworkEland({
            root: 'app',
            name: 'FrameworkElandDome',
            mainAtivityOpts: main_opts,
            version: '1.0.1',
            debug: true
        })

        this.subact = new Activity(sub_opts)


        this.tabact = new Activity(tab_opts)

        // 添加顶部工具栏按钮 推荐使用 btn type 添加按钮 非 btn type 添加按钮请尽量保持一种 type 已获得更好的视觉效果
        // 所有按钮的样式受 Act 实例配置对象影响
        this.subact.addTopOptBtn([{
            type: 'btn', // text img btn
            touchType: null, // def zoom color 只对 btn type 有效 为空则继承实例配置对象TOUCH类型
            img: './pic/theme/email.png', // 当 type 为 btn img 优先级高于 texts
            text: '',
            touchHandle: () => {
                this.tabact.show()

                console.log('touchHandle for btn img')
            }
        }])

        // this.subact.showTopLogo()

        // this.subact.hideTopTitle()

        this.mact = this.frame.getMainAct()

        this.mact.addTopOptBtn([{
            type: 'btn', // text img btn
            touchType: null, // def zoom color 只对 btn type 有效 为空则继承实例配置对象TOUCH类型
            img: './pic/theme/email.png', // 当 type 为 btn img 优先级高于 text
            text: '',
            touchHandle: () => {
                this.subact.show()

                console.log('touchHandle for btn img')
            }
        }])
    }

    showLoading() {
        this.frame.showLoading({
            mode: 1,
            text: 'welcome Framework',
            tag: 'frame'
        })
    }

    showToast() {
        this.frame.showToast('welcome Framework welcome Frameworkwelcome Frameworkwelcome Frameworkwelcome Frameworkwelcome Frameworkwelcome Framework')
    }

    showMsgBox() {
        this.frame.showMsgBox({
            title: '提示',
            isHideBackBtn: true,
            isTouchOtherClose: true,
            getContent: () => {
                return 'welcome framework dome'
            },
            setStyle: () => { },
            backHandle: function () { }
        })
    }

    showPopup() {
        this.frame.showPopup({
            name: null,
            getContent: () => {
                return '<div style="width: 200px;height: 200px;background: blue"></div>'
            },
            setStyle: () => { },
            bindHandle: () => { },
            closeHandle: () => { }
        })
    }

    // close

    closePopup() {
        this.frame.closePopup()
    }

    closeMsgBox() {
        this.frame.closeMsgBox()
    }

    closeToast() {
        this.frame.closeToast()
    }

    closeLoading() {
        this.frame.closeLoading('frame')
    }

    showSubAct() {
        if (this.subact != null) {
            this.subact.show()
        }
    }

    finishSubAct() {
        if (this.subact != null) {
            this.subact.finish()
        }
    }
}

window.appdome = new AppDome()
