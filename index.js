const PAGE = {
    /* 数据集合 */
    data: {
        albumList: [
            {
                imgList: [
                    "./image/1.jpeg",
                    "./image/1.jpeg",
                    "./image/1.jpeg"
                ],
                completed: true
            },
            {
                imgList: [
                    "./image/1.jpeg",
                    "./image/2.jpeg",
                    "./image/3.jpeg"
                ],
                completed: true
            },
            {
                imgList: [
                    "./image/2.jpeg",
                    "./image/2.jpeg",
                    "./image/3.jpeg"
                ],
                completed: true
            }
        ],

        swiper: null
    },
    /* 初始化函数 */
    init() {
        this.bind();
        this.render();
    },

    /* bind绑定事件函数 */
    bind() {
        let album = document.getElementById('album-list');
        let swiperClose = document.getElementsByClassName('swiper-top-close')[0];
        this.onEventLister(album, 'click', 'image-item', this.swiperShow);
        this.onEventLister(swiperClose, 'click', 'close', this.onSwiperClose)
    },

    /* 委托绑定封装函数 */
    onEventLister: function (parentNode, action, childClassName, callback) {
        parentNode.addEventListener(action, function (e) {
            e.target.className.indexOf(childClassName) >= 0 && callback(e);
        })
    },

    /* 渲染方法 */
    render() {
        let albumList = this.data.albumList;

        /* 使用map循环数组方便返回数据 */
        let imgList = albumList.map((data, index) => {
            /* 创建变量用于储存宽、高 */
            let width = [];
            let height = [];

            data.imgList.forEach(arr => {
                let img = new Image(); // 定义image对象
                img.src = arr;  // image对象加载图片地址

                // 获取image对象图片宽、高放到width变量和height变量里
                width.push(img.width);
                height.push(img.height);
            })

            /* 判断图片组是否有图片宽、高大于260 */
            let completeWidth = width.some((item) => item < 260);
            let completeHeight = height.some((item) => item < 260);

            /* 根据判断修改completed */
            data.completed = completeHeight && completeWidth;

            return data
        })

        /* 根据数组生成HTMl字符串 */
        /* 加上data索引，用于之后事件使用寻找当前元素对应数据 */
        let albumElement = imgList.map((data, indexs) => {
            let imgElement = data.imgList.map((item, index) => {
                return `
                <div class="album-img">
                    <img src="${item}" data-parent="${indexs}" data-index="${index}" class="image-item">
                </div>`
            }).join('');
            return `
            <div class="album-item ${data.completed ? 'active' : ''}">
            ${imgElement}
            </div>
            `
        }).join('');

        let album = document.getElementById('album-list');

        // HTML字符串替换到album-list元素中
        album.innerHTML = albumElement;
    },

    swiperShow(e) {
        let albumList = PAGE.data.albumList;
        let parent = e.target.dataset.parent;
        let index = e.target.dataset.index;
        let imgList = albumList[parent].imgList;
        let progress = document.getElementsByClassName('progress');
        let imageViewer = document.getElementById('image-viewer');
        let swiper = document.getElementById('swiper');

        let imgListElement = imgList.map(data => {
            return `
            <div class="swiper-slide">
                <div class="swiper-img">
                    <img src="${data}">
                </div>
            </div>
            `
        }).join('');

        swiper.innerHTML = imgListElement;

        progress[0].style.display = "block";
        imageViewer.style.display = "block";

        PAGE.initCount(index); // 轮播图
    },

    initCount(index) {
        // 轮播图
        PAGE.data.swiper = new Count({
            id: 'swiper-container',
            index: index,
            duration: 500,
            translateX: 0,
            defaultLenght: null,
            itemWidth: null,
        })
    },

    onSwiperClose() {
        let progress = document.getElementsByClassName('progress');
        let imageViewer = document.getElementById('image-viewer');
        progress[0].style.display = "none";
        imageViewer.style.display = "none";
    }
}

PAGE.init();