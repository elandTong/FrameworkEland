import PullToList from "./appCompPullToList.js";
import AppTool from "./appTool.js";

export default class Listview {
    _opts = {
        rootId: '',
        threshold: 100,
        topRingradius: 24,
        botRingradius: 24,
        topFontsize: 14,
        botFontsize: 14,
        isopenBotPull: true,
        colorTopRing: 'gray',
        colorTopText: 'gray',
        colorBotRing: 'gray',
        colorBotText: 'gray',
        padding: 0,
        itempadd: 1,
        ispull: true,
        itemview: null,
        itemstyle: null,
        emptyview: null,
        emptystyle: null,
        downHandle: null,
        upHandle: null,
        itemclickHandle: null
    }

    _rootdom = null

    _pull = null

    _list = []

    constructor(opts) {
        if (opts == null || opts.rootId == null || opts.itemview == null) {
            console.error('list view for opts pame null')

            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this._rootdom = $('#' + this._opts.rootId)

        this._rootdom.css({
            'display': 'block',
            'overflow-x': 'hidden',
            'overflow-y': 'auto',
            'box-sizing': 'border-box'
        })

        this._rootdom.html('<div id="' + this._opts.rootId + '_content"></div>')

        if (this._opts.ispull) {
            this._pull = new PullToList({
                rootId: this._opts.rootId,
                threshold: this._opts.threshold,
                topRingradius: this._opts.topRingradius,
                botRingradius: this._opts.botRingradius,
                topFontsize: this._opts.topFontsize,
                botFontsize: this._opts.botFontsize,
                isinitAction: true,
                isopenBotPull: this._opts.isopenBotPull,
                colorTopRing: this._opts.colorTopRing,
                colorTopText: this._opts.colorTopText,
                colorBotRing: this._opts.colorBotRing,
                colorBotText: this._opts.colorBotText,
                downCallback: () => { // 下拉刷新
                    if (this._opts.downHandle) {
                        this._opts.downHandle((result) => {
                            this.update(result)

                            this._pull.endSuccess(true)

                            console.log('listview pull down', result)
                        })
                    } else {
                        this._pull.endSuccess(true)

                        console.log('listview pull down handle null')
                    }
                },
                upCallback: () => { // 上拉加载更多
                    if (this._opts.upHandle) {
                        this._opts.upHandle((result, succ) => {
                            this.push(result)

                            this._pull.endSuccess(succ)

                            console.log('listview pull up', result)
                        })
                    } else {
                        this._pull.endSuccess(false)

                        console.log('listview pull up handle null')
                    }
                }
            })
        }

        $('#' + this._opts.rootId + '_content').css({
            'padding': this._opts.padding + 'px',
            'box-sizing': 'border-box'
        })
    }

    _showList(list) {
        let list_len = list.length

        if (list_len == 0) {
            this._showEmpty()

            return
        }

        let views = ''

        this._emptyHtml()

        for (let i = 0; i < list_len; i++) { // 每一行
            let item = list[i]

            if ((item instanceof Array) || !(item instanceof Object)) {
                continue
            }

            let item_view = ''

            if (this._opts.itemview) {
                item_view = this._opts.itemview(item, i, this._opts.rootId)

                if (item_view == null || item_view == '') {
                    continue
                }

                item_view = item_view.replace('[id]', this._opts.rootId + '_item_' + i)
                    .replace('[cas]', this._opts.rootId + '_item_cas')

                Object.keys(item).forEach(function (key) {
                    let stencil = '{[' + key + ']}'

                    if (item_view.indexOf(stencil) >= 0) {
                        item_view = item_view.replace(stencil, item[key])
                    }

                    console.log('show list item key: ' + key + ' val: ', item[key])
                })
            } else {
                break
            }

            if (i == list_len - 1) {
                views += item_view
            } else {
                views += (item_view + '<div class="' + this._opts.rootId + '_line"></div>')
            }
        }

        $('#' + this._opts.rootId + '_content').html(views)

        $('.' + this._opts.rootId + '_line').css({
            'height': this._opts.itempadd + 'px'
        })

        if (this._opts.itemstyle) {
            this._opts.itemstyle(this._opts.rootId + '_item_cas')
        }

        if (this._opts.itemclickHandle) {
            let self = this
            $('.' + this._opts.rootId + '_item_cas').each(function () {
                AppTool.setBtnOnTouchEventForScale($(this), 0.96, 1.0, (obj) => {
                    let id = obj.id
                    let id_list = id.split('_')
                    let id_len = id_list.length
                    let index = id_list[id_len - 1]

                    self._opts.itemclickHandle(list[index], index)
                }, null, false)
            })
        }
    }

    _showEmpty() {
        if (this._opts.emptyview) {
            $('#' + this._opts.rootId + '_content').html(this._opts.emptyview())

            if (this._opts.emptystyle) {
                this._opts.emptystyle()
            }
        } else {
            $('#' + this._opts.rootId + '_content').html('<div style="width:100%;text-align:center;font-size:12px;color:#999999">没有读取到数据,请重试!</div>')
        }
    }

    _emptyHtml() {
        $('#' + this._opts.rootId + '_content').html('')
    }

    update(list) { // 更新列表
        this._list = []
        this._list = this._list.concat(list)

        this._showList(this._list)
    }

    push(list) { // 推送更多数据
        this._list = this._list.concat(list)

        this._showList(this._list)
    }
}