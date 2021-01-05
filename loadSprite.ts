import Load from "../Script/View/Load"

const { ccclass, property, menu } = cc._decorator

@ccclass
@menu('面板/loadSprite')
export default class loadSprite extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    /**
     * 正在显示的uuid
     */
    private uuid_c: string = null
    /**
     * 加载中的uuid
     */
    private uuid_l: string = null

    onLoad() {
        let spriteFrame = this.sprite.spriteFrame
        if (spriteFrame) {
            this.uuid_c = spriteFrame['_uuid']
        } else {
            this.uuid_c = null
        }
    }

    /**
     * 设置图片路径
     */
    set url(url: string) {
        if (!url) {
            //如果传入一个空url,精灵不显示,uuid和uuid加载清空
            this.sprite.spriteFrame = null
            this.uuid_c = null
            this.uuid_l = null
            return
        }
        //默认resources
        let bundle = cc.resources
        //检查缓存
        let info = bundle.getInfoWithPath(url, cc.SpriteFrame)
        if (info) {
            //有信息,就在这个resources包里
            this.showsf(bundle, url, info.uuid)
        } else {
            //resources里没有这个资源
            //第一个斜杠前是banndle名字
            //在Load.Bundles里面检查
            let index = url.indexOf('/')
            if (index == -1) {
                throw Error('SpriteData.url ' + url)
            }
            //检查是否在load中纪录的banndle
            let bundle_name = url.slice(0, index)
            if (!Load.Bundles.includes(bundle_name)) {
                throw Error('not find bundle ' + bundle_name)
            }
            //检查bundle是否存在
            let bundle = cc.assetManager.getBundle(bundle_name)
            if (bundle == null) {
                throw Error('not find bundle ' + bundle_name)
            }
            let bundle_url = url.slice(index + 1)
            info = bundle.getInfoWithPath(url, cc.SpriteFrame)
            this.showsf(bundle, bundle_url, info.uuid)
        }
    }

    private showsf(bundle: cc.AssetManager.Bundle, url: string, uuid: string) {
        if (this.uuid_c == uuid) {
            //当前显示的就是这个,加载中的不再需要
            this.uuid_l = null
        } else {
            //当前显示的和需要显示的不一样
            //1.通过uuid取到缓存
            let asset = cc.assetManager.assets.get(uuid) as cc.SpriteFrame
            //2.有缓存
            if (asset) {
                //使用缓存显示
                this.sprite.spriteFrame = asset
                this.uuid_c = uuid
                this.uuid_l = null
            } else {
                //去加载
                if (this.uuid_l && this.uuid_l == uuid) {
                    //如果正在加载且正在加载的uuid和当前传入的uuid一样,啥都不干
                } else {
                    //没有正在加载,或者加载的和传入的uuid不一致
                    this.uuid_l = uuid
                    bundle.load(url, cc.SpriteFrame, (err, asset) => {
                        if (err)
                            console.log(err)
                        if (asset['_uuid'] == this.uuid_l) {
                            this.sprite.spriteFrame = asset as cc.SpriteFrame
                            this.uuid_c = this.uuid_l
                            this.uuid_l = null
                        }
                    })
                }
            }
        }
    }

    resetInEditor() {
        this.sprite = this.getComponent(cc.Sprite)
        if (this.sprite == null) {
            this.sprite = this.addComponent(cc.Sprite)
        }
    }
}