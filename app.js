import Activity from './component/Activity.view.js';
import Pageview from './component/Pageview.view.js';
import SwiperTab from './component/SwiperTab.view.js';
import FrameworkEland from './base/Framework.js';
import Listview from './component/Listview.view.js';
import TouchLock from './component/TouchLock.view.js';
import Tool from './tool/Tool.js';

class Dome {
    frame = null

    mact = null

    subact = null

    constructor() {
        this.swipertab = {}

        this.pageview = {}

        this.listview = {}

        this.lockview = {}

        let main_opts = { // 配置对象
            rootId: 'app_main',
            content: {
                name: null,
                getContent: null,
                setStyle: () => {
                },
                initHandle: (succ) => {
                    this.listview = new Listview({
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
                        emptystyle: () => {
                        },
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
                            }, 2000)
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
                            }, 2000)
                        }
                    })
                    console.log('main act content initHandle: ' + succ)
                }
            },
            toolbar: { // 操作栏配置
                topH: Tool.getToolbarHeight(),
                finish: {
                    active: false,
                    icon: './pic/theme/back.png'
                },
                logo: {
                    active: true,
                    icon: './pic/theme/log.png',
                    touchHandle: null
                },
                title: {
                    active: false,
                    text: 'FrameworkEland',
                    align: 'left',
                    touchHandle: null
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
                buttons: [{
                    level: 1,
                    id: 'email_menu',
                    icon: './pic/theme/email.png',
                    text: '按钮',
                    touchHandle: () => {
                        this.subact.show()
                    }
                }],
                background: 'black'
            },
            drawer: { // 抽屉菜单配置
                active: true,
                icon: './pic/theme/menu.png',
                type: 'left', // left right
                background: 'white',
                widthscale: 0.75,
                name: '',
                getContent: function () {
                    return 'draweMenuGetContent'
                },
                setStyle: function () {
                },
                initHandle: function (succ) {
                    console.log('main act drawer initHandle: ' + succ)
                },
                changedHandle(isopen) {
                    console.log('main act drawer changedHandle: ' + isopen)
                }
            },
            preloading: { // 预加载配置
                color: 'red'
            },
            background: 'white',
            finishTopHandle: () => {
                console.log('main act finishTopHandle')
            },
            resumeHandle: () => {
                console.log('main act resumeHandle')
            },
            pauseHandle: () => {
                console.log('main act pauseHandle')
            },
            initHandle: () => {
                console.log('main act initHandle')
            }
        }

        let sub_opts = { // 配置对象
            rootId: 'app_sub',
            content: {
                name: null,
                getContent: null,
                setStyle: () => {
                },
                initHandle: (succ) => {
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

                    console.log('sub act content initHandle: ' + succ)
                }
            },
            toolbar: { // 操作栏配置
                topH: Tool.getToolbarHeight(),
                finish: {
                    active: true,
                    icon: './pic/theme/back.png'
                },
                logo: {
                    active: false,
                    icon: './pic/theme/log.png',
                    touchHandle: null
                },
                title: {
                    active: true,
                    text: 'SUB_DOME',
                    align: 'left',
                    touchHandle: null
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
                buttons: [{
                    level: 1,
                    id: 'email_menu',
                    icon: './pic/theme/email.png',
                    text: '按钮',
                    touchHandle: () => {
                        this.tabact.show()
                    }
                }],
                background: 'black'
            },
            drawer: { // 抽屉菜单配置
                active: true,
                icon: './pic/theme/menu.png',
                type: 'right', // left right
                background: 'white',
                widthscale: 0.75,
                name: '',
                getContent: function () {
                    return 'draweMenuGetContent'
                },
                setStyle: function () {
                },
                initHandle: function (succ) {
                    console.log('sub act drawer initHandle: ' + succ)
                },
                changedHandle(isopen) {
                    console.log('sub act drawer changedHandle: ' + isopen)
                }
            },
            preloading: { // 预加载配置
                color: 'red'
            },
            background: 'white',
            finishTopHandle: () => {
                this.frame.showTipsBox({
                    title: 'SUB ACT FINISH',
                    isHideBackBtn: true,
                    isTouchOtherClose: true,
                    getContent: () => {
                        return 'welcome framework dome'
                    },
                    setStyle: () => { },
                    backHandle: () => { }
                })

                console.log('sub act finishTopHandle')
            },
            resumeHandle: () => {
                this.pageview.update()

                console.log('sub act resumeHandle')
            },
            pauseHandle: () => {
                console.log('sub act pauseHandle')
            },
            initHandle: () => {
                console.log('sub act initHandle')
            }
        }

        let tab_opts = { // 配置对象
            rootId: 'app_tab',
            content: {
                name: null,
                getContent: null,
                setStyle: () => {
                },
                initHandle: (succ) => {
                    this.swipertab = new SwiperTab({
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

                    console.log('tab act content initHandle: ' + succ)
                }
            },
            toolbar: { // 操作栏配置
                topH: Tool.getToolbarHeight(),
                finish: {
                    active: true,
                    icon: './pic/theme/back.png'
                },
                logo: {
                    active: false,
                    icon: './pic/theme/log.png',
                    touchHandle: null
                },
                title: {
                    active: true,
                    text: 'TAB_DOME',
                    align: 'left',
                    touchHandle: null
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
                buttons: [{
                    level: 1,
                    id: 'email_menu',
                    icon: './pic/theme/email.png',
                    text: '按钮',
                    touchHandle: () => {
                        this.lockact.show()
                    }
                }],
                background: 'black'
            },
            drawer: { // 抽屉菜单配置
                active: true,
                icon: './pic/theme/menu.png',
                type: 'right', // left right
                background: 'white',
                widthscale: 0.75,
                name: '',
                getContent: function () {
                    return 'draweMenuGetContent'
                },
                setStyle: function () {
                },
                initHandle: function (succ) {
                    console.log('tab act drawer initHandle: ' + succ)
                },
                changedHandle(isopen) {
                    console.log('tab act drawer changedHandle: ' + isopen)
                }
            },
            preloading: { // 预加载配置
                color: 'red'
            },
            background: 'white',
            finishTopHandle: () => {
                console.log('tab act finishTopHandle')
            },
            resumeHandle: () => {
                this.swipertab.update()

                console.log('tab act resumeHandle')
            },
            pauseHandle: () => {
                console.log('tab act pauseHandle')
            },
            initHandle: () => {
                console.log('tab act initHandle')
            }
        }

        let lock_opts = { // 配置对象
            rootId: 'app_lock',
            content: {
                name: null,
                getContent: null,
                setStyle: () => {
                },
                initHandle: (succ) => {
                    this.lockview = new TouchLock({
                        rootId: 'app_lock_content',
                        type: 'setPwd',
                        point: {
                            outerRadius: 25,
                            innerRadius: 25 / 2,
                            colorOuter: null,
                            colorInner: null,
                            colorTouch: null
                        },
                        line: {
                            color: null,
                            hide: false
                        },
                        setPassHandle: function (pass) {
                        },
                        verifyHandle: function (pass, handle) {
                        }
                    })

                    console.log('tab act content initHandle: ' + succ)
                }
            },
            toolbar: { // 操作栏配置
                topH: Tool.getToolbarHeight(),
                finish: {
                    active: true,
                    icon: './pic/theme/back.png'
                },
                logo: {
                    active: false,
                    icon: './pic/theme/log.png',
                    touchHandle: null
                },
                title: {
                    active: true,
                    text: 'LOCK_DOME',
                    align: 'left',
                    touchHandle: null
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
            drawer: { // 抽屉菜单配置
                active: true,
                icon: './pic/theme/menu.png',
                type: 'right', // left right
                background: 'white',
                widthscale: 0.75,
                name: '',
                getContent: function () {
                    return 'draweMenuGetContent'
                },
                setStyle: function () {
                },
                initHandle: function (succ) {
                    console.log('tab act drawer initHandle: ' + succ)
                },
                changedHandle(isopen) {
                    console.log('tab act drawer changedHandle: ' + isopen)
                }
            },
            preloading: { // 预加载配置
                color: 'red'
            },
            background: 'white',
            finishTopHandle: () => {
                console.log('tab act finishTopHandle')
            },
            resumeHandle: () => {
                this.lockview.updateOpts({ type: 'verify' })

                setTimeout(() => {
                    this.lockview.updateOpts({ type: 'setPwd' })
                }, 8000)

                console.log('tab act resumeHandle')
            },
            pauseHandle: () => {
                console.log('tab act pauseHandle')
            },
            initHandle: () => {
                console.log('tab act initHandle')
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

        this.lockact = new Activity(lock_opts)

        this.mact = this.frame.getMainAct()
    }

    showMainLoading(text) {
        this.frame.showLoading(this.mact, text)
    }

    showMainToast(text) {
        this.frame.showToast(this.mact, text)
    }

    showMainTipsBox(text) {
        this.frame.showTipsBox(this.mact, {
            title: 'TipsBox',
            name: null,
            getContent: function () { // handle
                return text
            },
            setStyle: function () { // handle
            },
        })
    }

    showMainPopup() {
        this.frame.showPopup(this.mact, {
            name: null,
            getContent: function () {
                return '<div style="width: 200px;height: 200px;background: blue"></div>'
            },
            setStyle: function () {
            }
        })
    }

    showLoading(text) {
        this.frame.showLoading(this.subact, text)
    }

    showToast(text) {
        this.frame.showToast(this.subact, text)
    }

    showTipsBox(text) {
        this.frame.showTipsBox(this.subact, {
            title: 'TipsBox',
            name: null,
            getContent: function () { // handle
                return text
            },
            setStyle: function () { // handle
            },
        })
    }

    showPopup() {
        this.frame.showPopup(this.subact, {
            name: null,
            getContent: function () {
                return '<div style="width: 200px;height: 200px;background: blue"></div>'
            },
            setStyle: function () {
            }
        })
    }

    // close
    closePopup() {
        this.frame.closePopup()
    }

    closeTipsBox() {
        this.frame.closeTipsBox()
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

window._dome = new Dome()
