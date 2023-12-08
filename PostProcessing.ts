const { ccclass, property, requireComponent } = cc._decorator

/**
 * 1.game camera clear -> renderTexture
 * 2.game camera draw game group -> renderTexture -> sprite
 * 3.sprite is default group
 * 4.main camera clear -> player device
 * 5.main camera draw default group -> player device
 * 6.view camera draw view group -> player device
 * 
 * use sprite material do PostProcessing
 */
@ccclass
@requireComponent(cc.Sprite)
export default class PostProcessing extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null

    @property(cc.Material)
    blurMaterial: cc.Material = null
    originMaterial: cc.Material = null

    sprite: cc.Sprite = null
    renderTexture: cc.RenderTexture
    spriteFrame: cc.SpriteFrame

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite)
        this.renderTexture = new cc.RenderTexture()
        let { width, height } = cc.Canvas.instance.node
        this.renderTexture.initWithSize(width, height)
        this.camera.targetTexture = this.renderTexture
        this.spriteFrame = new cc.SpriteFrame(this.renderTexture)
        this.spriteFrame.setFlipY(true)
        this.sprite.spriteFrame = this.spriteFrame

        this.renderTexture.addRef()
        this.spriteFrame.addRef()

        // this.scheduleOnce(() => {
        //     this.showBlur()
        // }, 5)
    }

    showBlur() {
        let scale = 3
        this.originMaterial = this.sprite.getMaterial(0)
        let { width, height } = cc.Canvas.instance.node
        this.blurMaterial.setProperty('size', [width / scale, height / scale])
        this.sprite.setMaterial(0, this.blurMaterial)
    }

    onDestroy() {
        this.renderTexture.decRef()
        this.spriteFrame.decRef()
    }
}
