class Count {
    constructor(props) {
        this.state = {
            //容器得ID
            id: props.id,
            //当前第几项
            index: props.index,
            //滑动时长
            duration: props.duration,
            //偏移量
            translateX: props.translateX,
            //默认的醒目数量
            defaultLenght: props.defaultLenght,
            //单个项目长度
            itemWidth: props.itemWidth,
            //锁
            isLock: false,
        };

        this._init();
    }

    _init() {
        this._bind();
        this._clone();
    }

    _bind() {
        let swiperPrev = $(`#${this.state.id}`).find('.swiper-button-prev').get(0)
        let swiperNext = $(`#${this.state.id}`).find('.swiper-button-next').get(0)

        let that = this;

        // 查看上一个
        swiperPrev.addEventListener('click', function () {
            let index = that.state.index;
            if (index == 0) return
            that._goIndex(Number(index) - 1)
        })

        // 查看下一个
        swiperNext.addEventListener('click', function () {
            let index = that.state.index;
            if (index == 2) return
            that._goIndex(Number(index) + 1)
        })
    }

    /**
     * 创建克隆方法
     */
    _clone() {
        // 获取对应ID容器的swiper-wrapper容器
        let swiperWrapper = $(`#${this.state.id}`).find('.swiper-wrapper').get(0);
        this.state.id = swiperWrapper;

        // 更新PAGE.data的defaultLenght 、itemWidth、translateX 的值
        let index = this.state.index;
        let swiperItemWidth = swiperWrapper.offsetWidth;
        this.state.itemWidth = swiperItemWidth;
        this.state.translateX = -(swiperItemWidth * index);

        //执行滑动
        this._goIndex(index);
    }

    _goIndex(index) {
        // 获取动画时间长、项目宽度、偏移量（ duration、itemWidth、translateX ）
        let swiperDuration = this.state.duration;
        let swiperWidth = this.state.itemWidth;
        let beginTranslateX = this.state.translateX;

        // 根据传入的index就算出滑动结束位置
        let endTranslateX = -(swiperWidth * index);

        // 禁止滑动结束前再次点击
        if (this.state.isLock) {
            return
        }

        this.state.isLock = true;

        let swiperWrapper = this.state.id;
        let that = this;

        // 调用动画，滑动中设置swiper-wrapper的偏移值
        this.animateTo(beginTranslateX, endTranslateX, swiperDuration, function (value) {
            //滑动回调
            swiperWrapper.style.transform = `translateX(${value}px)`
        }, function (value) {

            //结束更新当前索引及偏移值
            swiperWrapper.style.transform = `translateX(${value}px)`
            that.state.index = index;
            that.state.translateX = value;

            that.state.isLock = false;
        })
    }


    animateTo(begin, end, duration, changeCallback, finishCallback) {
        // 动画开始时间
        let startTime = Date.now();
        let that = this;
        requestAnimationFrame(function update() {
            // 当前执行的时间
            let dataNow = Date.now();
            // 当前所消耗的时间
            let time = dataNow - startTime;
            // 当前发生的位移
            let value = that.linear(time, begin, end, duration);
            // 执行变化事件回调
            typeof changeCallback === 'function' && changeCallback(value)
            // 如果动画结束时间大于当前执行时间
            if (startTime + duration > dataNow) {
                // 在执行一次动画渲染
                requestAnimationFrame(update)
            } else {
                // 执行结束回调
                typeof finishCallback === 'function' && finishCallback(end)
            }
        })
    }

    /**
     * 
     * @param {*} time 当前时间
     * @param {*} begin 开始位移
     * @param {*} end 结束时间
     * @param {*} duration 当前位移
     * @returns 
     */
    linear(time, begin, end, duration) {
        return (end - begin) * time / duration + begin;
    }
}