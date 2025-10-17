# uViewPro 布局组件

## 目录
- [Line 线条](#line-线条)
- [Card 卡片](#card-卡片)
- [Mask 遮罩层](#mask-遮罩层)
- [NoNetwork 无网络提示](#nonetwork-无网络提示)
- [Grid 宫格布局](#grid-宫格布局)
- [Swiper 轮播图](#swiper-轮播图)
- [TimeLine 时间轴](#timeline-时间轴)
- [Skeleton 骨架屏](#skeleton-骨架屏)
- [Sticky 吸顶](#sticky-吸顶)
- [Waterfall 瀑布流](#waterfall-瀑布流)
- [Divider 分割线](#divider-分割线)

## Line 线条

组件一般用于显示一根线条，用于分隔内容块，有横向和竖向两种模式，且能设置0.5px线条，使用也很简单。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
组件内部有预置的参数，直接使用即可，有如下几个参数需要了解：

color为线条的颜色
direction为线条的方向，默认为横向
hair-line为是否设置细线条(0.5px)，默认为true
length参数需要特别留意，它需要带上单位，比如设置为"50%"，"500rpx"等，在线条为横向时，表现为线条的长度；在线条为竖向时，表现为线条的高度。

<template>
	<u-line color="red" />
	
	/* 等同于 */
	<u-line color="red"></u-line>
</template>
线条类型
我们可以通过border-style参数设置线条的类型，有如下三种可选项：

solid表示实线
dashed表示方形虚线
dotted表示圆点虚线
兼容性
由于头条小程序的兼容性，如果组件无效的情况下，您可能需要给组件加上u-line类，如下：


<u-line class="u-line"></u-line>
API
Props
参数	说明	类型	默认值	可选值
color	线条的颜色	String	#e4e7ed	-
length	长度，竖向时表现为高度，横向时表现为长度，可以为百分比，带rpx单位的值等	String	100%	-
direction	线条的方向，row-横向，column-竖向	String	row	column
hair-line	是否显示细线条	Boolean	true	false
margin	线条与上下左右元素的间距，字符串形式，如"30rpx"、"20rpx 30rpx"	String	-	-
border-style	线条类型，见上方说明	String	solid	dashed / dotted

## Card 卡片

卡片组件一般用于多个列表条目，且风格统一的场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
组件的头部信息可以通过参数配置，其他主体和底部的信息，需要通过slot传入。

title配置标题
sub-title配置副标题

<template>
	<u-card :title="title" :sub-title="subTitle" :thumb="thumb">
		<template #body>
			<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
				<view class="u-body-item-title u-line-2">瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半</view>
				<image src="https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg" mode="aspectFill"></image>
			</view>
			<view class="u-body-item u-flex u-row-between u-p-b-0">
				<view class="u-body-item-title u-line-2">釉色渲染仕女图韵味被私藏，而你嫣然的一笑如含苞待放</view>
				<image src="https://img12.360buyimg.com/n7/jfs/t1/102191/19/9072/330688/5e0af7cfE17698872/c91c00d713bf729a.jpg" mode="aspectFill"></image>
			</view>
		</template>
		<template #foot>
			<u-icon name="chat-fill" size="34" color="" label="30评论"></u-icon>
		</template>
	</u-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('素胚勾勒出青花，笔锋浓转淡')
const subTitle = ref('2020-05-15')
const thumb = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
</script>

<style scoped lang="scss">
	.u-card-wrap { 
		background-color: $u-bg-color;
		padding: 1px;
	}
	
	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}
		
	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}
</style>
配置卡片间距
可以通过margin参数配置卡片与屏幕左右的边距，以及上下卡片之间的距离，如: 20rpx 30rpx、20rpx 30rpx 30rpx 20rpx。
注意：当设置full参数为true的时候，也就是卡片占据屏幕总宽度的时候，通过margin配置的左右边距会失效。


<u-card margin="30rpx"></u-card>
配置卡片左上角的缩略图
这个缩略图是可选的，显示在卡片的左上角位置，如果配置了thumb参数(图片路径)，就会显示图片。

thumb缩略图路径
thumb-width缩略图宽度，高等于宽
thumb-circle缩略图是否为圆形

<u-card thumb="xxx.jpg" thumb-width="60"></u-card>
配置卡片边框
这里说的边框，有3个：

border配置是否显示整个卡片的外边框
head-border-bottom配置是否显示卡片内部头部的下边框
foot-border-top配置是否显示卡片内部底部的上边框

<u-card :border="false" :foot-border-top="false"></u-card>
设置内边距
默认下，卡片内部的头部，主体，底部都有一个内边距，可以通过配置padding参数去覆盖：


<u-card padding="30"></u-card>
API
Props
参数	说明	类型	默认值	可选值
full	卡片与屏幕两侧是否留空隙	Boolean	fasle	true
title	头部左边的标题	String	-	-
title-color	标题颜色	String	#303133	-
title-size	标题字体大小，单位rpx	String | Number	30	-
sub-title	头部右边的副标题	String	-	-
sub-title-color	副标题颜色	String	#909399	-
sub-title-size	副标题字体大小	String | Number	26	-
border	是否显示边框	Boolean	true	false
index	用于标识点击了第几个卡片	String | Number	-	-
margin	卡片与屏幕两边和上下元素的间距，需带单位，如"30rpx 20rpx"，见上方说明	String	30rpx	-
border-radius	卡片整体的圆角值，单位rpx	String | Number	16	-
head-style	头部自定义样式，对象形式	Object	-	-
body-style	主体自定义样式，对象形式	Object	-	-
foot-style	底部自定义样式，对象形式	Object	-	-
head-border-bottom	是否显示头部的下边框	Boolean	true	false
foot-border-top	是否显示底部的上边框	Boolean	true	false
thumb	缩略图路径，如设置将显示在标题的左边，不建议使用相对路径	String	-	-
thumb-width	缩略图的宽度，高等于宽，单位rpx	String | Number	60	-
thumb-circle	缩略图是否为圆形	Boolean	false	true
padding	给head，body，foot部的内边距，见上方说明，单位rpx	String | Number	30	-
show-head	是否显示头部	Boolean	true	false
show-foot	是否显示尾部	Boolean	true	false
box-shadow	卡片外围阴影，字符串形式	String	none	-
Slot
名称	说明
head	自定义卡片头部内容
body	自定义卡片主体部分内容
foot	自定义卡片底部部分内容
Event
事件名	说明	回调参数
click	整个卡片任意位置被点击时触发	index: 用户传递的标识符
head-click	卡片头部被点击时触发	index: 用户传递的标识符
body-click	卡片主体部分被点击时触发	index: 用户传递的标识符
foot-click	卡片底部部分被点击时触发	index: 用户传递的标识符

## Mask 遮罩层

创建一个遮罩层，用于强调特定的页面元素，并阻止用户对遮罩下层的内容进行操作，一般用于弹窗场景

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过show参数配置是否显示遮罩
遮罩被点击时，会发送一个click事件，如不需要此事件，请设置mask-click-able参数为false

<template>
	<u-mask :show="show" @click="show = false"></u-mask>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(true)
</script>
嵌入内容
通过默认插槽可以在遮罩层上嵌入任意内容
注意：如果不想让slot插槽内容的点击事件冒泡到遮罩，请给指定元素添加上@tap.stop


<template>
	<u-mask :show="show" @click="show = false">
		<view class="warp">
			<view class="rect" @tap.stop></view>
		</view>
	</u-mask>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(true)
</script>

<style scoped>
.warp {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.rect {
	width: 120px;
	height: 120px;
	background-color: #fff;
}
</style>
遮罩样式
通过duration设置遮罩淡入淡出的时长，单位ms
通过zoom设置遮罩淡入淡出时是否带有轻微的缩放效果，内部通过transform: scale(1.2, 1.2)实现
通过custom-style传入一个对象，自定义样式，如"{backgroundColor: 'red', color: 'blue'}"

<u-mask :show="show" :duration="400" :zoom="true" :custom-style="{background: 'rgba(0, 0, 0, 0.5)'}"></u-mask>
API
Props
参数	说明	类型	默认值	可选值
show	是否显示遮罩	Boolean	false	true
z-index	z-index 层级	String | Number	10070	-
duration	动画时长，单位毫秒	String | Number	300	-
zoom	是否使用scale对遮罩进行缩放	Boolean	true	false
mask-click-able	遮罩是否可点击，为false时点击不会发送click事件	Boolean	true	false
Events
事件名	说明	回调参数
click	mask-click-able为true时，点击遮罩发送此事件	-
Slot
名称	说明
default	默认插槽，用于在遮罩层上方嵌入内容

## NoNetwork 无网络提示

## Grid 宫格布局

宫格组件一般用于同时展示多个同类项目的场景，可以给宫格的项目设置徽标组件(badge)，或者图标等，也可以扩展为左右滑动的轮播形式。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
该组件外层为u-grid组件包裹，通过col设置内部宫格的列数
内部通过ugrid-item组件的slot设置宫格的内容
如果不需要宫格的边框，可以设置border为false

<template>
	<u-grid :col="3">
		<u-grid-item>
			<u-icon name="photo" :size="46"></u-icon>
			<view class="grid-text">图片</view>
		</u-grid-item>
		<u-grid-item>
			<u-icon name="lock" :size="46"></u-icon>
			<view class="grid-text">锁头</view>
		</u-grid-item>
		<u-grid-item>
			<u-icon name="hourglass" :size="46"></u-icon>
			<view class="grid-text">沙漏</view>
		</u-grid-item>
	</u-grid>
</template>

<style scoped lang="scss">
	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
</style>
给宫格设置右上角的角标和图标
可以通过uView的badge(注意Badge在此需要设置相关定位属性，详见Badge)或者image设置宫格有右上角的内容


<template>
	<u-grid :col="3">
		<u-grid-item>
			<u-badge count="9" :offset="[20, 20]"></u-badge>
			<u-icon name="photo" :size="46"></u-icon>
			<view class="grid-text">图片</view>
		</u-grid-item>
		<u-grid-item>
			<image src="/static/image/icon/hot5.png" class="badge-icon"></image>
			<u-icon name="lock" :size="46"></u-icon>
			<view class="grid-text">锁头</view>
		</u-grid-item>
		<u-grid-item>
			<u-icon name="hourglass" :size="46"></u-icon>
			<view class="grid-text">沙漏</view>
		</u-grid-item>
	</u-grid>
</template>

<style scoped lang="scss">
	.badge-icon {
		position: absolute;
		top: 14rpx;
		right: 40rpx;
		width: 30rpx;
		height: 30rpx;
	}
	
	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
</style>
实现宫格的左右滑动
结合uni的swiper组件可以实现宫格的左右滑动，因为swiper特性的关系，请指定swiper的高度 ，否则swiper的高度不会被内容撑开，可以自定义swiper的指示器，达到更高的灵活度


<template>
	<swiper class="swiper" @change="change">
		<swiper-item>
			<u-grid :col="3" @click="click" hover-class="hover-class">
				<u-grid-item v-for="(item, index) in list" :index="index" :key="index">
					<u-icon :name="item" :size="46"></u-icon>
					<text class="grid-text">{{ '宫格' + (index + 1) }}</text>
				</u-grid-item>
			</u-grid>
		</swiper-item>
		<swiper-item>
			<u-grid :col="3" @click="click">
				<u-grid-item v-for="(item, index) in list" :index="index + 9" :key="index">
					<u-icon :name="item" :size="46"></u-icon>
					<text class="grid-text">{{ '宫格' + (index + 1) }}</text>
				</u-grid-item>
			</u-grid>
		</swiper-item>
		<swiper-item>
			<u-grid :col="3" @click="click">
				<u-grid-item v-for="(item, index) in list" :index="index + 18" :key="index">
					<u-icon :name="item" :size="46"></u-icon>
					<text class="grid-text">{{ '宫格' + (index + 1) }}</text>
				</u-grid-item>
			</u-grid>
		</swiper-item>
	</swiper>
	<view class="indicator-dots" v-if="isSwiper">
		<view class="indicator-dots-item" :class="[current == 0 ? 'indicator-dots-active' : '']">
		</view>
		<view class="indicator-dots-item" :class="[current == 1 ? 'indicator-dots-active' : '']">
		</view>
		<view class="indicator-dots-item" :class="[current == 2 ? 'indicator-dots-active' : '']">
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const current = ref<number>(0)
const list = ref<Array<string>>([
	'integral', 'kefu-ermai', 'coupon', 'gift', 'scan', 
	'pause-circle', 'wifi', 'email', 'list'
])

// 定义事件处理函数
const change = (e: any) => {
	current.value = e.detail.current
}

// 注意：isSwiper 变量在原代码中未定义，但模板中使用了，这里需要根据实际需求处理
const isSwiper = ref<boolean>(true)

// 注意：click 方法在模板中使用了但未在原代码中定义，这里需要根据实际需求实现
const click = (index: number) => {
	// 根据实际需求实现点击逻辑
	console.log('点击了宫格:', index)
}
</script>

<style scoped lang="scss">
/* 下方这些scss变量为uView内置变量，详见开发  组件-指南-内置样式 */

.grid-text {
	font-size: 28rpx;
	margin-top: 4rpx;
	color: $u-type-info;
}

.swiper {
	height: 480rpx;
}

.indicator-dots {
	margin-top: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.indicator-dots-item {
	background-color: $u-tips-color;
	height: 6px;
	width: 6px;
	border-radius: 10px;
	margin: 0 3px;
}

.indicator-dots-active {
	background-color: $u-type-primary;
}
</style>
API
Grid Props
参数	说明	类型	默认值	可选值
col	宫格的列数	String | Number	3	-
border	是否显示宫格的边框	Boolean	true	false
align	宫格的对齐方式，用于控制只有一两个宫格时的对齐场景	String	left	center / right
hover-class	样式类名，按下时有效，样式必须写在根目录的App.vue或通过其引入的全局样式中才有效，none为无效果，作用于头部标题区域	String	u-hover-class	none / 其他
Grid-item Props
参数	说明	类型	默认值	可选值
bg-color	宫格的背景颜色	String	#ffffff	-
index	点击宫格时，返回的值	String | Number	-	-
Grid Event
注意：请在<u-grid></u-grid>上监听此事件

事件名	说明	回调参数
click	点击宫格触发	index: u-grid-item通过props传递的index值
Grid-item Event
注意：请在<u-grid-item></u-grid-item>上监听此事件

事件名	说明	回调参数
click	点击宫格触发	index: u-grid-item通过props传递的index值

## Swiper 轮播图
该组件一般用于导航轮播，广告展示等场景,可开箱即用，具有如下特点：

内置多种指示器模式，可配置指示器位置
3D 轮播图效果
可配置是否显示标题
平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ 小程序
√	√	√	√	√	√	√
基本使用
通过list参数传入轮播图列表值，该值为一个数组，元素为对象，见如下：

list的"image"属性为轮播图的图片路径
list的"title"属性为需要显示的标题
说明： 某些情况下

您从服务端获取的数据，里面的数组对于图片的属性名不一定为image，如果让您再历遍修改为image属性，显然是不人性的， 所以 uView 提供了一个name参数，比如您数组中的图片名称为img，您可以设置u-swiper组件的name参数为img值。

您也可以直接传递一个元素为图片路径的数组给list参数，如下(1.6.5 支持)：


<u-swiper :list="list"></u-swiper>

let list = [ '1.png', '2.png' ];
注意

如果需要显示标题，还需要设置title参数为true


<template>
  <view class="wrap">
    <u-swiper :list="list"></u-swiper>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义轮播图项接口
interface SwiperItem {
  image: string
  title: string
}

// 定义响应式数据
const list = ref<SwiperItem[]>([
  {
    image: "https://cdn.uviewpro.cn/uview/xxx.png",
    title: "昨夜星辰昨夜风，画楼西畔桂堂东",
  },
  {
    image: "https://cdn.uviewpro.cn/uview/xxx.png",
    title: "身无彩凤双飞翼，心有灵犀一点通",
  },
  {
    image: "https://cdn.uviewpro.cn/uview/xxx.png",
    title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
  },
])
</script>

<style lang="scss" scoped>
.wrap {
  padding: 40rpx;
}
</style>
指示器类型
本组件内置了多种指示器，通过配置mode参数即可，有如下：

rect-指示器为方块状
dot-指示器为圆点
number-指示器为数字
round-激活的指示器为块状，未激活的未点状，为默认值
none-不显示指示器
通过indicator-pos参数配置指示器的位置，有如下值：

topLeft-指示器位于左上角
topCenter-指示器位于上方中间位置
topRight-指示器位于右上角
bottomLeft-指示器位于左下角
bottomCenter-指示器位于底部中间位置，为默认值
bottomRight-指示器位于右下角

<u-swiper :list="list" mode="dot" indicator-pos="bottomRight"></u-swiper>
是否开启 3D 效果
配置effect3d为true即可，该效果左右两边可以缩略形式预览前后一个 swiper-item 的一部分


<u-swiper :list="list" :effect3d="true"></u-swiper>
控制轮播效果
autoplay-是否自动轮播，默认为true
interval-前后两张图自动轮播的时间间隔
duration-切换一张轮播图所需的时间
circular-是否衔接滑动，即到最后一张时，是否可以直接转到第一张

<u-swiper :list="list" duration="3000" :circular="false"></u-swiper>
API
Props
参数	说明	类型	默认值	可选值
list	轮播图数据，见上方"基本使用"说明	Array	-	-
title	是否显示标题文字，需要配合list参数，见上方说明	Boolean	false	true
mode	指示器模式，见上方说明	String	round	rect / dot / number / none
height	轮播图组件高度，单位 rpx	String | Number	250	-
indicator-pos	指示器的位置	String	bottomCenter	topLeft / topCenter / topRight / bottomLeft / bottomRight
effect3d	是否开启 3D 效果	Boolean	false	true
autoplay	是否自动播放	Boolean	true	false
interval	自动轮播时间间隔，单位 ms	String | Number	2500	-
circular	是否衔接播放，见上方说明	Boolean	true	false
duration	切换一张轮播图所需的时间，单位 ms	String | Number	500	-
border-radius	轮播图圆角值，单位 rpx	String | Number	8	-
title-style	自定义标题样式	Object	-	-
effect3d-previous-margin	effect3d = true 模式的情况下，激活项与前后项之间的距离，单位 rpx	String | Number	50	-
img-mode	图片的裁剪模式，详见image 组件裁剪模式	String	aspectFill	-
name	组件内部读取的list参数中的属性名，见上方说明	string	name	-
bg-color	背景颜色	string	#f3f4f6	-
current	初始化时，默认显示第几项	String | Number	0	-
Events
事件名	说明	回调参数
click	点击轮播图时触发	index：点击了第几张图片，从 0 开始
change	轮播图切换时触发(自动或者手动切换)	index：切换到了第几张图片，从 0 开始

## TimeLine 时间轴


## Skeleton 骨架屏


## Sticky 吸顶


## Waterfall 瀑布流


## Divider 分割线

Divider 分割线 
区隔内容的分割线，一般用于页面底部"没有更多"的提示。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
文字内容通过slot传入


<u-divider>大漠孤烟直</u-divider>
设置文字颜色
可以通过color指定文字的颜色


<u-divider color="#fa3534">长河落日圆</u-divider>
设置单边边线条宽度和颜色
half-width指定文字某一边的线条宽度(注意这里设置的是一边，而不是文字两边线条的总长度)，half-width可以是数值(rpx)或者百分比
type可以快捷的设置线条为某一个主题色(默认primary)，border-color参数同样也能设置线条颜色，优先级高于type，也即是说二者同时 设置了值，将会是border-color起作用。反之，如果要让type值起作用，就要将border-color置为空字符串或者null。

<u-divider color="#fa3534" half-width="200" border-color="#6d6d6d">姑苏城外寒山寺</u-divider>
API
Props
参数	说明	类型	默认值	可选值
half-width	文字左或右边线条宽度，数值或百分比，数值时单位为rpx	String | Number	-	150
border-color	线条颜色，优先级高于type	String	#dcdfe6	-
color	文字颜色	String	#909399	-
fontSize	字体大小，单位rpx	String | Number	26	-
bg-color	整个divider的背景颜色	String	#ffffff	-
height	整个divider的高度，单位rpx	string | Number	40	-
type	将线条设置主题色	string	primary	info \ success \ warning \ error
margin-top	与前一个元素的距离，单位rpx	String | Number	0	-
margin-bottom	与后一个元素的距离，单位rpx	String | Number	0	-
use-slot	是否使用slot传入内容，如果不传入，中间不会有空隙	Boolean	true	false
Events
事件名	说明	回调参数	版本
click	divider组件被点击时触发	-	-