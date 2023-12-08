const { ccclass, property } = cc._decorator

/**
 * The running order of game engine
 * 
 * 0.touch events are called outside the engine loop
 * 
 * 1.component update from script
 * 
 * 2.action manager update from tween
 * 
 * 3.animation manager update from Cocos animation
 * 
 * 4.physics system update Check Collision. 
 * If a collision occurs, a callback will be triggered.
 * 
 * 5.component lateUpdate from script
 * 
 * The hitbox added in steps 0-3 will be checked for collision 
 * in step 4, and a callback will be triggered if a collision occurs.
 * 
 * The hitbox is the area of the character's body 
 * that can deal damage to an opponent
 */
@ccclass
export default class HitBox extends cc.Component {

    private list: Array<cc.PhysicsCollider> = []

    onBeginContact(contact: any, self: any, other: cc.PhysicsCollider) {
        this.list.push(other)
    }

    lateUpdate() {
        if (this.list.length === 0) {
            return
        }
        this.node.emit('Hit', this.list)
        this.list.length = 0
    }
}