export default class Snow {
    constructor (opt = {}) {
        // 是否是雨
        this.isRain = opt.isRain || false
        // 元素
        this.el = null
        // 倾斜方向
        this.dir = opt.dir || 'r'
        // 直径
        this.width = 0
        // 最大直径
        this.maxWidth = 2.5
        // 最小直径
        this.minWidth = 1.5
        // 透明度
        this.opacity = 0
        // 水平位置
        this.x = 0
        // 重置位置
        this.y = 0
        // z轴位置
        this.z = 0
        // 水平速度
        this.sx = 0
        // 是否左右摇摆
        this.isSwing = true
        // 左右摇摆的步长
        this.stepSx = 0.02
        // 左右摇摆的正弦函数x变量
        this.swingRadian = 1
        // 左右摇摆的正弦x步长
        this.swingStep = 0.01
        // 垂直速度
        this.sy = 0
        // 最大速度
        this.maxSpeed = opt.maxSpeed || 2
        // 最小速度
        this.minSpeed = opt.minSpeed || 0.5
        // 快速划过的最大速度
        this.quickMaxSpeed = opt.quickMaxSpeed || 5
        // 快速划过的最小速度
        this.quickMinSpeed = opt.quickMinSpeed || 4
        // 快速划过的宽度
        this.quickWidth = opt.quickWidth || 2
        // 快速划过的透明度
        this.quickOpacity = opt.quickOpacity || 0.2
        // 窗口尺寸
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight

        this.init()
    }

    // 随机初始化属性
    init (reset) {
        let isQuick = Math.random() > 1.1
        this.isSwing = Math.random() > 1.1

        this.width = Math.random() * (this.maxWidth-this.minWidth)+this.minWidth
        this.opacity = 0.4+0.4*Math.random()
        this.x = Math.floor(Math.random() * (window.innerWidth - this.width))
        this.y = Math.floor(Math.random() * (window.innerHeight - this.width))
        if (reset) { this.y = -2*this.width }
        this.sy = Math.random() * this.maxSpeed + this.minSpeed
        this.sx = 0
        this.z = isQuick ? Math.random() * 300 + 200 : 0
        this.swingStep = 0.01 * Math.random()
        this.swingRadian = Math.random() * (1.1 - 0.9) + 0.9
    }

    // 设置样式
    setStyle () {
        this.el.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            display: block;
            width: ${10*this.width}px;
            height: ${10*this.width}px;
            opacity: ${this.opacity};
            background-image: radial-gradient(#fff 0%, rgba(255, 255, 255, 0) 60%);
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
            transform: translate(${this.x}px, ${this.y}px) ${this.getRotate(this.sy, this.sx)};
        `
    }

    // 渲染
    render () {
        this.el = document.createElement('div')
        this.setStyle()
        document.body.appendChild(this.el)
    }

    move () {

        this.sx += (-0.5+Math.random())*this.sy*0.01
        this.x += this.sx
        this.y += this.sy
        // 完全离开窗口就调一下初始化方法，另外还需要修改一下init方法，因为重新出现我们是希望它的y坐标为0或者小于0，这样就不会又凭空出现的感觉，而是从天上下来的
        if (this.x < -this.width || this.x > window.innerWidth || this.y > window.innerHeight) {
          this.init(true)
          this.setStyle()
        }
        this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, ${this.z}px) ${this.getRotate(this.sy, this.sx)}`
      }

    getRotate(sy, sx) {
        return this.isRain ? `rotate(${sx === 0 ? 0 : (90 + Math.atan(sy / sx) * (180 / Math.PI))}deg)` : ''
    }
}

class Snows {
    constructor(opt = {}) {
        this.num = opt.num || 100
        this.opt = opt
        this.snowList = []
        this.createSnows()
        this.moveSnow()
    }
    createSnows () {
        this.snowList = []
        for (let i = 0; i < this.num; i++) {
            let snow = new Snow(this.opt)
            snow.render()
            this.snowList.push(snow)
        }
    }
    moveSnow () {
        window.requestAnimationFrame(() => {
            this.snowList.forEach((item) => {
                item.move()
            })
            this.moveSnow()
        })
    }
}

new Snows({
    isRain: false,
    num: 0.05*window.innerWidth,
    maxSpeed: 1
})