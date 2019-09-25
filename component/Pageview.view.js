import BaseComponent from '../base/Component.js'
import AppTool from '../tool/Tool.js'

export default class Pageview extends BaseComponent {
    pageview = null

    conetntCount = 0

    selectIndex = -1

    _page_item = {
        name: null,
        contentH: 'auto', // 内容高度
        colorContent: 'white', // tab 内容背景
        getContent: null,
        setStyle: null
    }

    _opts = {
        rootId: '',
        selectHandle: null,
        initHandle: null,
        pageList: [this._page_item],
        defaultIndex: 0,
        allowTouchMove: true,
        autoplay: false,
        pagination: false
    }

    constructor(opts) {
        super()
        
        if (opts == null || opts.rootId == null || opts.pageList == null || opts.pageList.length == 0) {
            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        let new_page_list = []

        for (let item of this._opts.pageList) {
            item = AppTool.structureAssignment(Object.assign({}, this._page_item), item, true)

            new_page_list.push(item)

            console.log('page item assign', item)
        }

        this._opts.pageList = new_page_list

        this.conetntCount = this._opts.pageList.length

        if (this._opts.defaultIndex < 0 || this._opts.defaultIndex >= this.conetntCount) {
            this._opts.defaultIndex = 0
        }

        let containe = '<div class="swiper-container" id="' + this._opts.rootId + '_containe">[con]</div>'

        let wrapper = '<div class="swiper-wrapper" id="' + this._opts.rootId + '_wrapper">[con]</div>'

        let slide = '<div class="swiper-slide" id="' + this._opts.rootId + '_slide_[id]"></div>'

        let pagination = '<div class="swiper-pagination" id="' + this._opts.rootId + '_pagination"></div>'

        let slides = ''

        for (let i = 0; i < this.conetntCount; i++) {
            slides += slide.replace('[id]', i)
        }

        wrapper = wrapper.replace('[con]', slides)

        if (this._opts.pagination) {
            containe = containe.replace('[con]', wrapper + pagination)
        } else {
            containe = containe.replace('[con]', wrapper)
        }

        $('#' + this._opts.rootId).html(containe)

        this.setStyle()
    }

    select(index) {
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

        let rotH = Number($('#' + this._opts.rootId).css('height').replace('px', ''))

        console.log('pageview root width:' + rotW + ' height:' + rotH)

        $('#' + this._opts.rootId).css({
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
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

        for (let i = 0; i < this._opts.pageList.length; i++) {
            let item = this._opts.pageList[i]

            let con_id = this._opts.rootId + '_slide_' + i

            if (item.contentH == 'auto') {
                item.contentH = rotH
            }

            conIds.push(con_id)

            // 内容
            $('#' + con_id).css({
                'width': rotW,
                'height': item.contentH,
                'background': item.colorContent,
                'box-sizing': 'border-box'
            })

            if (item.name) {
                AppTool.LoadHTML({
                    link: item.name,
                    conId: con_id,
                    succHandle: () => {
                        console.log('pageview load html succ')
                    },
                    errHandle: () => {
                        console.log('pageview load html err')
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
            autoplay: this._opts.autoplay,
            observer: true,
            allowTouchMove: this._opts.allowTouchMove,
            nested: true,
            initialSlide: this._opts.defaultIndex,
            pagination: {
                el: '#' + this._opts.rootId + '_pagination',
            },
            on: {
                init: function () {
                    console.log('pageview init index:' + self._opts.defaultIndex)
                },
                slideChange: function () {
                    console.log('pageview slide change index:' + this.activeIndex)
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
