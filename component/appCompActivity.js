import routing from '../framework/routing.js';
import AppTool from './appTool.js';

class TopToolbar {
    _opts = {
        topId: '',
        topH: 50,
        backImg: './pic/theme/back.png',
        menuImg: './pic/theme/menu.png',
        logo: null,
        title: 'FrameworkEland',
        fontSize: '15px',
        fontStyle: 'normal', // italic oblique
        fontWeight: 'normal', // normal bold
        touchType: 'def', // color zoom
        colorMain: 'black',
        colorMainDK: 'black',
        colorText: 'white',
        colorBtnTouch: '#cca352',
        colorShadow: '#000',
        shadowLen: 2,
        openBordLine: true,
        openMenuType: null, // left right
        activity: null,
        menuOpts: { // 内部使用属性
            type: 'btn',
            touchType: null,
            img: '',
            text: '',
            touchHandle: () => {
                if (this._opts.activity) {
                    this._opts.activity.draweMenu()
                }
                if (this._opts.menuHandle) {
                    this._opts.menuHandle()
                }
            }
        },
        backHandle: null,
        menuHandle: null,
        logoTouchHandle: null
    }

    constructor(opts) {
        if (opts == null || opts.topId == null) {
            return
        }

        if (opts.menuOpts) {
            opts.menuOpts = null
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        if (this._opts.topH < 50) {
            this._opts.topH = 50
        }

        if (this._opts.topH > 60) {
            this._opts.topH = 60
        }

        this._opts.menuOpts.img = this._opts.menuImg

        // ------- bind -------

        // 框架
        let left_rot = '<div id="' + this._opts.topId + '_left">[con]</div>'

        let right_rot = '<div id="' + this._opts.topId + '_right"></div>'

        // 元素
        let back = '<div class="' + this._opts.topId + '_left_btn_cas" id="' + this._opts.topId + '_back">[con]</div>'

        let menu = '<div class="' + this._opts.topId + '_left_btn_cas" id="' + this._opts.topId + '_menu">[con]</div>'

        let logo = '<img class="' + this._opts.topId + '_left_img_cas" id="' + this._opts.topId + '_logo"/>'

        let text = '<div class="' + this._opts.topId + '_left_txt_cas" id="' + this._opts.topId + '_text"></div>'

        back = back.replace('[con]', '<img class="' + this._opts.topId + '_btn_img_cas" src="' + this._opts.backImg + '"/>')

        menu = menu.replace('[con]', '<img class="' + this._opts.topId + '_btn_img_cas" src="' + this._opts.menuImg + '"/>')

        left_rot = left_rot.replace('[con]', back + menu + text + logo)

        $('#' + this._opts.topId).html(left_rot + right_rot)

        $('#' + this._opts.topId).css({
            'background': '-webkit-linear-gradient(top, ' + this._opts.colorMain + ' 0%,' + this._opts.colorMainDK + ' 100%)',
            'width': $(window).width(),
            'height': this._opts.topH,
            'display': 'flex',
            'justify-content': 'space-between',
            'align-items': 'center',
            'box-shadow': '0px 0px ' + this._opts.shadowLen + 'px 0px ' + this._opts.colorShadow
        })

        $('#' + this._opts.topId + '_left').css({
            'width': '50%',
            'display': 'flex',
            'justify-content': 'flex-start',
            'align-items': 'center'
        })

        $('#' + this._opts.topId + '_right').css({
            'width': '50%',
            'display': 'flex',
            'justify-content': 'flex-end',
            'align-items': 'center'
        })

        $('.' + this._opts.topId + '_left_btn_cas').css({
            'width': '40px',
            'height': '40px',
            'margin-left': '5px',
            'padding': '2px',
            'border-radius': '50%',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'font-size': '15px',
            'font-weight': this._opts.fontWeight,
            'color': this._opts.colorText,
            'box-sizing': 'border-box'
        })
        if (this._opts.openBordLine == true) {
            $('.' + this._opts.topId + '_left_btn_cas').css({
                'border': '1px solid ' + this._opts.colorBtnTouch
            })
        } else {
            $('.' + this._opts.topId + '_left_btn_cas').css({
                'border': ''
            })
        }

        $('.' + this._opts.topId + '_left_img_cas').css({
            'width': 'auto',
            'height': '24px',
            'margin-left': '5px',
            'max-width': '80px',
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.topId + '_left_txt_cas').css({
            'width': 'auto',
            'height': 'auto',
            'margin-left': '5px',
            'max-width': '50%',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'font-size': this._opts.fontSize,
            'font-style': this._opts.fontStyle,
            'font-weight': this._opts.fontWeight,
            'color': this._opts.colorText,
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.topId + '_btn_img_cas').css({
            'width': 'auto',
            'height': '20px',
            'max-width': '30px'
        })

        let self = this

        $('.' + this._opts.topId + '_left_btn_cas').each(function () {
            let id = this.id
            let id_list = id.split('_')
            let id_len = id_list.length

            let _run = (type) => {
                switch (type) {
                    case 'back': {
                        if (self._opts.backHandle) {
                            self._opts.backHandle()
                        }
                        break
                    }
                    case 'menu': {
                        if (self._opts.activity) {
                            self._opts.activity.draweMenu()
                        }

                        if (self._opts.menuHandle) {
                            self._opts.menuHandle()
                        }
                        break
                    }
                }
            }

            if (self._opts.touchType == 'def' || self._opts.touchType == 'zoom') {
                AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (obj) => {
                    _run(id_list[id_len - 1])
                }, null, true)
            } else if (self._opts.touchType == 'color') {
                AppTool.setBtnOnTouchEvent($(this), (obj) => {
                    _run(id_list[id_len - 1])
                }, self._opts.colorBtnTouch, '', null, true)
            }
        })

        $('.' + this._opts.topId + '_left_img_cas').each(function () {
            let id = this.id
            let id_list = id.split('_')
            let id_len = id_list.length

            let _run = (type) => {
                switch (type) {
                    case 'logo': {
                        if (self._opts.logoTouchHandle) {
                            self._opts.logoTouchHandle()
                        }
                        break
                    }
                }
            }

            AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (obj) => {
                _run(id_list[id_len - 1])
            }, null, true)
        })

        this.hideLogo()

        this.hideMenu()

        this.setTitle(this._opts.title)

        if (this._opts.openMenuType) { // 抽屉菜单类型 为空则表示不启用抽屉菜单
            if (this._opts.openMenuType != 'left' && this._opts.openMenuType != 'right') {
                this._opts.openMenuType = 'left'
            }
        }

        if (this._opts.openMenuType == 'left') {
            this.showMenu()
        } else if (this._opts.openMenuType == 'right') {
            this.addOptBtn([this._opts.menuOpts])
        }
    }

    addOptBtn(opts) {
        if (opts == null || !(opts instanceof Array)) {
            return
        }

        let _it = {
            type: 'btn', // text img btn
            touchType: 'def', // def zoom color 只对 btn type 有效
            img: '',
            text: '按钮',
            touchHandle: null
        }

        let new_opts = []

        // 过滤无效按钮对象
        let ispumenu = false
        for (let i = 0; i < opts.length; i++) {
            let item = opts[i]

            if (item == null || !(item instanceof Object)) {
                continue
            }

            if (!item.type || item.type == null) {
                continue
            }

            switch (item.type) {
                case 'btn': {
                    if ((!item.img || item.img == null) && (!item.text || item.text == null)) {
                        continue
                    }

                    break
                }
                case 'img': {
                    if (!item.img || item.img == null) {
                        continue
                    }

                    break
                }
                case 'text': {
                    if (!item.text || item.text == null) {
                        continue
                    }

                    break
                }
                default: {
                    continue
                }
            }

            if (!item.touchType || item.touchType == null) {
                item['touchType'] = this._opts.touchType // 继承初始化类型
            }

            if (item.touchHandle && this._opts.menuOpts.touchHandle === item.touchHandle) {
                ispumenu = true
            }

            new_opts.push(item)
        }

        if (this._opts.openMenuType == 'right' && !ispumenu) {
            new_opts.push(this._opts.menuOpts)
        }

        let btn = '<div class="' + this._opts.topId + '_right_btn_cas" id="' + this._opts.topId + '_btn_[id]">[con]</div>'

        let img = '<img class="' + this._opts.topId + '_right_img_cas" id="' + this._opts.topId + '_img_[id]" src="[src]"/>'

        let txt = '<div class="' + this._opts.topId + '_right_txt_cas" id="' + this._opts.topId + '_txt_[id]">[con]</div>'

        let btn_img = '<img class="' + this._opts.topId + '_btn_img_cas" src="[src]" />'

        let vis = ''

        for (let i = 0; i < new_opts.length; i++) {
            let item = new_opts[i]

            switch (item.type) {
                case 'btn': {
                    if (item.img) { // 图标按钮
                        vis += btn.replace('[id]', i).replace('[con]', btn_img.replace('[src]', item.img))
                    } else if (item.text) { // 文字按钮
                        vis += btn.replace('[id]', i).replace('[con]', item.text.substr(0, 2))
                    } else { // 无内容
                        continue
                    }

                    break
                }
                case 'img': {
                    vis += img.replace('[id]', i).replace('[src]', item.img)

                    break
                }
                case 'text': {
                    vis += txt.replace('[id]', i).replace('[con]', item.text)

                    break
                }
                default: {
                    continue
                }
            }
        }

        $('#' + this._opts.topId + '_right').html(vis)

        $('.' + this._opts.topId + '_right_btn_cas').css({
            'width': '40px',
            'height': '40px',
            'margin-right': '5px',
            'padding': '2px',
            'border-radius': '50%',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'font-size': '15px',
            'font-weight': this._opts.fontWeight,
            'color': this._opts.colorText,
            'box-sizing': 'border-box'
        })
        if (this._opts.openBordLine == true) {
            $('.' + this._opts.topId + '_right_btn_cas').css({
                'border': '1px solid ' + this._opts.colorBtnTouch
            })
        } else {
            $('.' + this._opts.topId + '_right_btn_cas').css({
                'border': ''
            })
        }

        $('.' + this._opts.topId + '_right_img_cas').css({
            'width': 'auto',
            'height': '24px',
            'margin-right': '5px',
            'max-width': '80px',
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.topId + '_right_txt_cas').css({
            'width': 'auto',
            'height': 'auto',
            'margin-right': '5px',
            'max-width': '50%',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'font-size': this._opts.fontSize,
            'font-style': this._opts.fontStyle,
            'font-weight': this._opts.fontWeight,
            'color': this._opts.colorText,
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.topId + '_btn_img_cas').css({
            'width': 'auto',
            'height': '20px',
            'max-width': '30px'
        })

        let self = this

        $('.' + this._opts.topId + '_right_btn_cas').each(function () {
            let id = this.id
            let id_list = id.split('_')
            let id_len = id_list.length
            let index = id_list[id_len - 1]

            let item = new_opts[index]

            if (item.touchType == 'def' || item.touchType == 'zoom') {
                AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (obj) => {
                    if (item.touchHandle) {
                        item.touchHandle()
                    }
                }, null, true)
            } else if (item.touchType == 'color') {
                AppTool.setBtnOnTouchEvent($(this), (obj) => {
                    if (item.touchHandle) {
                        item.touchHandle()
                    }
                }, self._opts.colorBtnTouch, '', null, true)
            }
        })

        $('.' + this._opts.topId + '_right_img_cas').each(function () {
            let id = this.id
            let id_list = id.split('_')
            let id_len = id_list.length
            let index = id_list[id_len - 1]

            let item = new_opts[index]

            AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (obj) => {
                if (item.touchHandle) {
                    item.touchHandle()
                }
            }, null, true)
        })

        $('.' + this._opts.topId + '_right_txt_cas').each(function () {
            let id = this.id
            let id_list = id.split('_')
            let id_len = id_list.length
            let index = id_list[id_len - 1]

            let item = new_opts[index]

            AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (obj) => {
                if (item.touchHandle) {
                    item.touchHandle()
                }
            }, null, true)
        })
    }

    show() {
        $('#' + this._opts.topId).css({
            'display': 'flex'
        })
    }

    hide() {
        $('#' + this._opts.topId).css({
            'display': 'none'
        })
    }

    showBack() {
        $('#' + this._opts.topId + '_back').css({
            'display': 'flex'
        })
    }

    hideBack() {
        $('#' + this._opts.topId + '_back').css({
            'display': 'none'
        })
    }

    showMenu() {
        $('#' + this._opts.topId + '_menu').css({
            'display': 'flex'
        })
    }

    hideMenu() {
        $('#' + this._opts.topId + '_menu').css({
            'display': 'none'
        })
    }

    showLogo() {
        if (this._opts.logo == null) {
            return
        }

        $('#' + this._opts.topId + '_logo').attr('src', this._opts.logo)

        $('#' + this._opts.topId + '_logo').css({
            'display': 'block'
        })
    }

    hideLogo() {
        $('#' + this._opts.topId + '_logo').css({
            'display': 'none'
        })
    }

    showTitle() {
        $('#' + this._opts.topId + '_text').css({
            'display': 'block'
        })
    }

    hideTitle() {
        $('#' + this._opts.topId + '_text').css({
            'display': 'none'
        })
    }

    setTitle(name) {
        if (name == null) {
            return
        }

        $('#' + this._opts.topId + '_text').html(name)
    }
}

export default class Activity {
    _opts = {
        rootId: '',
        isMainAct: false,
        name: null,
        getContent: null,
        setStyle: null,
        title: 'FrameworkEland',
        toolbarTopFontSize: '15px',
        toolbarTopFontStyle: 'normal', // italic oblique
        toolbarTopFontWeight: 'normal', // normal bold
        toolbarTopLogo: null,
        toolbarTopLogoTouchHandle: null,
        toolbarTopBackImg: null,
        toolbarTopMenuImg: null,
        toolbarTopTouchType: 'def',
        toolbarTopH: 50,
        toolbarTopColor: 'black',
        toolbarTopColorDK: 'black',
        toolbarTopTextColor: 'white',
        toolbarTopBtnTouchColor: '#cca352',
        toolbarTopOpenBtnBordLine: true,
        toolbarTopShadowColor: null,
        toolbarTopShadowLen: null,
        contentBgColor: 'white',
        contentLoadColor: 'black',
        draweMenuType: null,
        draweMenuHandle: null,
        draweWidthScale: 0.5,
        draweContentColor: 'white',
        draweMenuName: '',
        draweMenuGetContent: null,
        draweMenuSetStyle: null,
        finishHandel: null,
        resumeHandel: null,
        pauseHandel: null,
        initHandel: null
    }

    window_w = $(window).width()

    window_h = $(window).height()

    page = null // act dom
    page_root = null // act root dom
    page_top = null // act top dom
    page_content = null // act content dom
    page_drawe = null
    page_drawe_menu = null

    mTop = null

    onRoutingCall = null // 路由处理器

    eventTheme = 'PAGE_PUSH_THEME' // act 推送主题

    eventIndex = null // 事件订阅标识

    isResume = false // act 是否处于恢复状态

    isshow = false // act 是否显示

    constructor(opts) { // act 构造器
        if (opts == null || opts.rootId == null) {
            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        if (!AppTool.o(this._opts.rootId)) {
            AppTool.addPageToHtml('app', this._opts.rootId)

            console.log('act div not exist and so addPageToHtml')
        }

        if (routing.isMainActMount == true) { // main act 已挂载
            this._opts.isMainAct = false // 已挂载 main act 则不能再设置 main act
        } else { // main act 未挂载
            if (this._opts.isMainAct == true) {
                routing.isMainActMount = true
            }
        }

        if (this._opts.draweMenuType) {
            if (this._opts.draweMenuType != 'left' && this._opts.draweMenuType != 'right') {
                this._opts.draweMenuType = 'left'
            }
        }

        if (this._opts.draweWidthScale > 0.8) {
            this._opts.draweWidthScale = 0.8
        } else if (this._opts.draweWidthScale < 0.2) {
            this._opts.draweWidthScale = 0.2
        }

        console.log('activity structureAssignment opts', this._opts)

        this.page = $("#" + this._opts.rootId)

        this.page_root = $('#' + this._opts.rootId + '_root')

        this.page_top = $('#' + this._opts.rootId + '_top')

        this.page_content = $('#' + this._opts.rootId + '_content')

        this.page_drawe = $('#' + this._opts.rootId + '_drawe')

        this.page_drawe_menu = $('#' + this._opts.rootId + '_drawe_menu')

        let _left = this.window_w

        if (this._opts.isMainAct == true) { // 主 act
            _left = 0
        }

        this.page.css({
            'position': 'absolute',
            'top': 0,
            'left': _left,
            'width': this.window_w,
            'height': this.window_h,
            'display': 'none'
        })

        this.page_root.css({
            'position': 'relative',
            'width': this.window_w,
            'height': this.window_h
        })

        this.page_top.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'z-index': 9
        })

        this.page_content.css({
            'position': 'absolute',
            'top': this._opts.toolbarTopH,
            'left': 0,
            'z-index': 8,
            'width': this.window_w,
            'height': this.window_h - this._opts.toolbarTopH,
            'background': this._opts.contentBgColor
        })

        this.page_drawe.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': this.window_w,
            'height': this.window_h,
            'z-index': 10,
            'background': 'rgba(0,0,0,0.4)',
            'display': 'none'
        })

        this.page_drawe_menu.css({
            'position': 'absolute',
            'top': 0,
            'width': (this.window_w * this._opts.draweWidthScale),
            'height': this.window_h,
            'z-index': 11,
            'background': this._opts.draweContentColor,
            'display': 'none'
        })

        if (this._opts.draweMenuType) {
            if (this._opts.draweMenuType == 'left') {
                this.page_drawe_menu.css({
                    'left': -(this.window_w * this._opts.draweWidthScale)
                })
            } else if (this._opts.draweMenuType == 'right') {
                this.page_drawe_menu.css({
                    'right': -(this.window_w * this._opts.draweWidthScale)
                })
            }
        }

        this.page_drawe.click((e) => {
            this.closeDraweMenu()
        })

        this.page_drawe_menu.click((e) => {
            e.stopPropagation()
        })

        this.mTop = new TopToolbar({
            topId: this._opts.rootId + '_top',
            title: this._opts.title,
            fontSize: this._opts.toolbarTopFontSize,
            fontStyle: this._opts.toolbarTopFontStyle,
            fontWeight: this._opts.toolbarTopFontWeight,
            logo: this._opts.toolbarTopLogo,
            backImg: this._opts.toolbarTopBackImg,
            topH: this._opts.toolbarTopH,
            touchType: this._opts.toolbarTopTouchType,
            colorMain: this._opts.toolbarTopColor,
            colorMainDK: this._opts.toolbarTopColorDK,
            colorText: this._opts.toolbarTopTextColor,
            colorBtnTouch: this._opts.toolbarTopBtnTouchColor,
            colorShadow: this._opts.toolbarTopShadowColor,
            shadowLen: this._opts.toolbarTopShadowLen,
            openBordLine: this._opts.toolbarTopOpenBtnBordLine,
            activity: this,
            openMenuType: this._opts.draweMenuType, // left right
            menuHandle: this._opts.draweMenuHandle,
            menuImg: this._opts.toolbarTopMenuImg,
            backHandle: () => { // 顶部返回按钮处理器
                if (routing.backClickInterceptHandel != null) { // 拦截器 这是全局拦截器
                    routing.backClickInterceptHandel()
                } else {
                    this.finish()
                }
            },
            logoTouchHandle: this._opts.toolbarTopLogoTouchHandle,
        })

        this.eventIndex = AppTool.onEmit(this.eventTheme, (obj) => {
            if (obj['theme'] != this.eventTheme) {
                return
            }

            let unique = obj['TOP_LEVEL']

            if (this.onRoutingCall == null) {
                return
            }

            if (unique === this.onRoutingCall) {
                if (this._opts.resumeHandel != null && !this.isResume) {
                    this._opts.resumeHandel() // 该 act 恢复
                }

                this.isResume = true
            } else {
                if (this._opts.pauseHandel != null && this.isResume) {
                    this._opts.pauseHandel() // 该 act 暂停
                }

                this.isResume = false
            }
        })

        if (this._opts.name) {
            AppTool.LoadHTML({
                link: this._opts.name,
                conId: this.page_content.attr('id'),
                color: this._opts.contentLoadColor,
                succHandle: () => {
                    console.log('act load content succ')
                },
                errHandle: () => {
                    console.error('act load content err')
                },
                renum: 2
            })
        } else if (this._opts.getContent) {
            this.page_content.html(this._opts.getContent())

            if (this._opts.setStyle != null) {
                this._opts.setStyle()
            }
        }

        if (this._opts.draweMenuType) {
            if (this._opts.draweMenuName) {
                AppTool.LoadHTML({
                    link: this._opts.draweMenuName,
                    conId: this.page_drawe_menu.attr('id'),
                    color: this._opts.contentLoadColor,
                    succHandle: () => {
                        console.log('act drawe menu load content succ')
                    },
                    errHandle: () => {
                        console.error('act drawe menu load content err')
                    },
                    renum: 2
                })
            } else if (this._opts.draweMenuGetContent) {
                this.page_drawe_menu.html(this._opts.draweMenuGetContent())

                if (this._opts.draweMenuSetStyle != null) {
                    this._opts.draweMenuSetStyle()
                }
            }
        }

        if (this._opts.initHandel != null) {
            this._opts.initHandel()
        }
    }

    show() { // 展示界面
        if (this.isshow) {
            console.log('current activity then show')

            return
        }

        this.onRoutingCall = () => { // 路由处器理 将 act 界面的退出操作交由路由器处理
            this._stop()

            if (this._opts.finishHandel != null) {
                this._opts.finishHandel()
            }
        }

        this.page.css({
            'display': 'block',
            'z-index': ++routing.currentZIndex
        })

        this._show()

        routing.pushActivity(this.onRoutingCall)
    }

    draweMenu() {
        let dis = this.page_drawe.css('display')

        if (dis == 'none') {
            this.openDraweMenu()
        } else {
            this.closeDraweMenu()
        }

        console.log('act drawmenu')
    }

    openDraweMenu() {
        if (!this._opts.draweMenuType) {
            return
        }

        this.page_drawe.css({
            'display': 'block'
        })

        this.page_drawe_menu.css({
            'display': 'block'
        })

        if (this._opts.draweMenuType == 'left') {
            this.page_drawe_menu.transition({
                left: 0
            }, 'fast')
        } else {
            this.page_drawe_menu.transition({
                right: 0
            }, 'fast')
        }

        console.log('open drawe menu')
    }

    closeDraweMenu() {
        if (!this._opts.draweMenuType) {
            return
        }

        let _run = () => {
            this.page_drawe_menu.css({
                'display': 'none'
            })

            this.page_drawe.css({
                'display': 'none'
            })
        }

        if (this._opts.draweMenuType == 'left') {
            this.page_drawe_menu.transition({
                left: -(this.window_w * this._opts.draweWidthScale)
            }, 'fast', _run)
        } else {
            this.page_drawe_menu.transition({
                right: -(this.window_w * this._opts.draweWidthScale)
            }, 'fast', _run)
        }

        console.log('close drawe menu')
    }

    onResume(handel) {
        this._opts.resumeHandel = handel
    }

    onPause(handel) {
        this._opts.pauseHandel = handel
    }

    addTopOptBtn(opts) {
        this.mTop.addOptBtn(opts)
    }

    // 显示 隐藏 工具栏
    showTop() {
        this.mTop.show()

        this.page_content.css({
            'top': this._opts.toolbarTopH,
            'height': this.window_h - this._opts.toolbarTopH
        })
    }

    hideTop() {
        this.mTop.hide()

        this.page_content.css({
            'top': 0,
            'height': this.window_h
        })
    }

    // 显示 隐藏 返回按钮
    showTopBack() {
        this.mTop.showBack()
    }

    hideTopBack() {
        this.mTop.hideBack()
    }

    // 显示 隐藏 Logo
    showTopLogo() {
        this.mTop.showLogo()
    }

    hideTopLogo() {
        this.mTop.hideLogo()
    }

    // 显示 隐藏 标题
    showTopTitle() {
        this.mTop.showTitle()
    }

    hideTopTitle() {
        this.mTop.hideTitle()
    }

    setTitle(name) {
        this.mTop.setTitle(name)
    }

    finish() {
        routing.finish(this.onRoutingCall)
    }

    setInterceptHandel(han) {
        routing.backClickInterceptHandel = han
    }

    _show() {
        if (this._opts.isMainAct == false) { // 非主 act
            this.page.transition({
                x: -this.window_w
            }, 'fast')
        }

        this.isshow = true
    }

    _stop() { // 内部方法
        if (this._opts.isMainAct == false) { // 非主 act
            this.page.transition({
                x: 0
            }, 'fast')

            this.isshow = false
        }
    }
}