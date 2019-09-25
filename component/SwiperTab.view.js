import BaseComponent from '../base/Component.js';
import AppTool from '../tool/Tool.js';

export default class SwiperTab extends BaseComponent {
    pageview = null

    conetntCount = 0

    selectIndex = -1

    _tab_item = {
        menu: null, // tab 标题
        name: null,
        contentH: 'auto', // 内容高度
        fontsize: 12, // tab 标题字体大小
        colorContent: 'white', // tab 内容背景
        colorTabTouch: '#cca352', // tab 标题 TOUCH 颜色
        colorText: 'white', // tab 标题选中 字体 颜色
        colorTextNone: 'black', // tab 标题未选中 字体 颜色
        colorLine: '#cca352', // tab 标题下划线选中 颜色
        colorLineNone: '#000000', // tab 标题下划线未选中 颜色
        touchType: 'def', // zoom color
        getContent: null,
        setStyle: null
    }

    _opts = {
        rootId: '',
        mode: 1,
        tabH: 45,
        lineH: 2,
        tabBackground: '#2A2A2A',
        selectHandle: null,
        initHandle: null,
        tabList: [this._tab_item],
        defaultIndex: 0,
        allowTouchMove: true
    }

    constructor(opts) {
        super()

        if (opts == null || opts.rootId == null || opts.tabList == null || opts.tabList.length == 0) {
            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        let new_tab_list = []

        for (let item of this._opts.tabList) {
            if (item.menu) {
                item = AppTool.structureAssignment(Object.assign({}, this._tab_item), item, true)

                new_tab_list.push(item)

                console.log('tab item assign', item)
            }
        }

        this._opts.tabList = new_tab_list

        this.conetntCount = this._opts.tabList.length

        if (this._opts.defaultIndex < 0 || this._opts.defaultIndex >= this.conetntCount) {
            this._opts.defaultIndex = 0
        }

        let tab_menu_rot = '<div id="' + this._opts.rootId + '_tab_menu_root">[con]</div>'

        let tab_menu = '<div id="' + this._opts.rootId + '_tab_menu_[id]" class="' + this._opts.rootId + '_tab_menu">[con]</div>'

        let tab_line_rot = '<div id="' + this._opts.rootId + '_tab_line_root">[con]</div>'

        let tab_line = '<div id="' + this._opts.rootId + '_tab_line_[id]" class="' + this._opts.rootId + '_tab_line"></div>'

        let containe = '<div class="swiper-container" id="' + this._opts.rootId + '_containe">[con]</div>'

        let wrapper = '<div class="swiper-wrapper" id="' + this._opts.rootId + '_wrapper">[con]</div>'

        let con = '<div class="swiper-slide" id="' + this._opts.rootId + '_tabcon_[id]"></div>'

        let tabmenus = ''

        let tablines = ''

        let tabcons = ''

        for (let i = 0; i < this.conetntCount; i++) {
            let item = this._opts.tabList[i]

            tabmenus += tab_menu.replace('[id]', i).replace('[con]', item.menu)

            tablines += tab_line.replace('[id]', i)

            tabcons += con.replace('[id]', i)
        }

        tab_menu_rot = tab_menu_rot.replace('[con]', tabmenus)

        tab_line_rot = tab_line_rot.replace('[con]', tablines)

        wrapper = wrapper.replace('[con]', tabcons)

        containe = containe.replace('[con]', wrapper)

        $('#' + this._opts.rootId).html(tab_menu_rot + tab_line_rot + containe)

        this.setStyle()
    }

    selectTab(index) {
        if (this.selectIndex == index) {
            return
        }

        if (index < 0 || index >= this.conetntCount) {
            return
        }

        // id definite
        if (this.selectIndex >= 0) { // 上一个选中
            let s_item = this._opts.tabList[this.selectIndex]

            $('#' + this._opts.rootId + '_tab_menu_' + this.selectIndex).css({
                'background': '',
                'color': s_item.colorTextNone
            })

            $('#' + this._opts.rootId + '_tab_line_' + this.selectIndex).css({
                'background': s_item.colorLineNone
            })
        }

        let _item = this._opts.tabList[index]

        $('#' + this._opts.rootId + '_tab_menu_' + index).css({
            'background': _item.colorTabTouch,
            'color': _item.colorText
        })

        $('#' + this._opts.rootId + '_tab_line_' + index).css({
            'background': _item.colorLine
        })

        if (this._opts.selectHandle != null) {
            this._opts.selectHandle(index)
        }

        this.selectIndex = index

        console.log('tab pageview select index: ' + index)
    }

    showTab(index) {
        if (index == null) {
            index = this._opts.defaultIndex
        }

        if (this.selectIndex == index) {
            return
        }

        if (this.pageview != null) {
            this.pageview.slideTo(index)
        }
    }

    setStyle() {

        let rotW = Number($('#' + this._opts.rootId).css('width').replace('px', ''))

        let rotH = Number($('#' + this._opts.rootId).css('height').replace('px', '')) - this._opts.tabH - this._opts.lineH

        console.log('tab root width:' + rotW + ' height:' + rotH)

        $('#' + this._opts.rootId).css({
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        if (this._opts.mode >= 0) {
            $('#' + this._opts.rootId).css({
                'flex-direction': 'column'
            })
        } else {
            $('#' + this._opts.rootId).css({
                'flex-direction': 'column-reverse'
            })
        }

        $('#' + this._opts.rootId + '_tab_menu_root').css({
            'width': '100%',
            'height': this._opts.tabH,
            'display': 'flex',
            'justify-content': 'space-between',
            'align-items': 'center',
            'background': this._opts.tabBackground,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_tab_line_root').css({
            'width': '100%',
            'height': this._opts.lineH,
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_containe').css({
            'width': rotW,
            'height': rotH,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_wrapper').css({
            'width': rotW,
            'height': rotH,
            'box-sizing': 'border-box'
        })

        let self = this

        let conIds = []

        for (let i = 0; i < this._opts.tabList.length; i++) {
            let item = this._opts.tabList[i]

            let menu_id = this._opts.rootId + '_tab_menu_' + i

            let line_id = this._opts.rootId + '_tab_line_' + i

            let con_id = this._opts.rootId + '_tabcon_' + i

            if (item.contentH == 'auto') {
                item.contentH = rotH
            }

            conIds.push(con_id)

            // 标题
            $('#' + menu_id).css({
                'width': (100 / self.conetntCount) + '%',
                'height': self._opts.tabH,
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'background': '',
                'font-size': item.fontsize,
                'color': item.colorTextNone,
                'box-sizing': 'border-box'
            })

            // 下划线
            $('#' + line_id).css({
                'width': (100 / self.conetntCount) + '%',
                'height': self._opts.lineH,
                'background': item.colorLineNone,
                'box-sizing': 'border-box'
            })

            // 内容
            $('#' + con_id).css({
                'width': rotW,
                'height': item.contentH,
                'background': item.colorContent,
                'box-sizing': 'border-box'
            })

            if (item.touchType == 'def' || item.touchType == 'zoom') {

                AppTool.setBtnOnTouchEventForScale($('#' + menu_id), 0.9, 1.0, (obj) => {
                    if (this.pageview != null) {
                        this.pageview.slideTo(i)
                    }
                }, null, true)

            } else if (item.touchType == 'color') {

                AppTool.setBtnOnTouchEvent($('#' + menu_id), (obj) => {
                    if (this.pageview != null) {
                        this.pageview.slideTo(i)
                    }
                }, item.colorTabTouch, '', null, true)

            }

            if (item.name) {
                AppTool.LoadHTML({
                    link: item.name,
                    conId: con_id,
                    succHandle: () => {
                        console.log('tab load html succ')
                    },
                    errHandle: () => {
                        console.log('tab load html err')
                    },
                    renum: 3,
                    color: this._opts.tabBackground
                })
            } else if (item.getContent) {
                $('#' + con_id).html(item.getContent())

                if (item.setStyle) {
                    item.setStyle()
                }
            }
        }

        this.pageview = new Swiper('#' + this._opts.rootId + '_containe', {
            autoplay: false,
            observer: true,
            allowTouchMove: this._opts.allowTouchMove,
            nested: true,
            initialSlide: this._opts.defaultIndex,
            on: {
                init: function () {
                    self.selectTab(self._opts.defaultIndex)

                    console.log('tab pageview init index:' + self._opts.defaultIndex)
                },
                slideChange: function () {
                    self.selectTab(this.activeIndex)

                    console.log('tab pageview slideChange index:' + this.activeIndex)
                }
            }
        })

        if (this._opts.initHandle != null) {
            this._opts.initHandle(conIds)
        }
    }

    update() {
        if (this.pageview != null) {
            this.pageview.update()
        }
    }
}
