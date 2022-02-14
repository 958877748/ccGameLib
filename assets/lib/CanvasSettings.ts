// cc.Texture2D['_getOpts'] = function _getOpts() {
//     var opts = _getSharedOptions();
//     opts.width = this.width;
//     opts.height = this.height;
//     opts.genMipmaps = this._genMipmaps;
//     opts.format = this._format;
//     opts.premultiplyAlpha = this._premultiplyAlpha;
//     opts.anisotropy = this._anisotropy;
//     opts.flipY = this._flipY;
//     opts.minFilter = FilterIndex[this._minFilter];
//     opts.magFilter = FilterIndex[this._magFilter];
//     opts.mipFilter = FilterIndex[this._mipFilter];
//     opts.wrapS = this._wrapS;
//     opts.wrapT = this._wrapT;
//     return opts;
// }

//启用动态合图会占用额外的内存，不同平台占用的内存大小不一样。
//目前在小游戏和原生平台上默认会禁用动态合图，但如果你的项目内存空间仍有富余的话建议开启。
//若希望强制开启动态合图，请在代码中加入：
// cc.macro.CLEANUP_IMAGE_CACHE = false
// cc.dynamicAtlasManager.enabled = true
// cc.dynamicAtlasManager.textureBleeding = false
// texture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST);

const { ccclass, property } = cc._decorator

/**
 * 将canvas的宽高对齐像素
 * 使实际的屏幕像素整数倍于canvas像素
 * 实际屏幕多少分辨率无法调整，只能调整canvas的宽高
 * 做到实际4个像素(2x2区域)对应游戏中1个像素
 * 而不是稍微移动一下角色就闪烁 像素变大变小的
 */
@ccclass
export default class CanvasSettings extends cc.Component {
    static inst: CanvasSettings

    bs: number
    canvas: cc.Canvas

    onLoad() {
        CanvasSettings.inst = this
    }

    onEnable() {
        this.canvas = cc.Canvas.instance

        /** 
         * 设备屏幕分辨率，会有小数点后，取整就行
         */
        let resolution = cc.sys.windowPixelResolution

        let bs: number
        if (this.canvas.fitWidth) {
            //宽为标准
            let windoWidth = Math.round(resolution.width)
            let width = this.canvas.node.width
            let multiple = windoWidth / width
            let remainder = windoWidth % width
            if (remainder == 0) {
                bs = multiple
            } else {
                bs = Math.floor(multiple)
                let newWidth = windoWidth / bs
                cc.view.setDesignResolutionSize(newWidth, 200,
                    cc.ResolutionPolicy.FIXED_WIDTH)
                console.log(`GameSettings->width->${newWidth}`)
            }
        } else {
            //高为标准
            /** 屏幕高多少像素点 例如 iPhone SE  750 x 1136 */
            let windowHeight = Math.round(resolution.height)

            /** 场景上 Canvas 的设计宽高 */
            let height = this.canvas.node.height

            /** 求倍数 */
            let multiple = windowHeight / height

            /** 求余数 */
            let remainder = windowHeight % height


            if (remainder == 0) {
                //余数刚好等于0,刚好一个像素 = '倍数'个真实像素
                bs = multiple

            } else {
                //调整升级分辨率 使大像素点为整倍数个真实像素点
                bs = Math.floor(multiple)

                // 新的 Canvas 高
                let newHeight = windowHeight / bs

                //设置新的设计分辨率,高度随便填200，引擎会自动缩放使宽度适应 屏幕宽度
                cc.view.setDesignResolutionSize(200, newHeight,
                    cc.ResolutionPolicy.FIXED_HEIGHT)

                console.log(`GameSettings->height->${newHeight}`)
            }
        }

        this.bs = bs
    }
}
