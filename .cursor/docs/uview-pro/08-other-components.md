# uViewPro 其他组件

## 目录
- [MessageInput 验证码输入](#messageinput-验证码输入)
- [Loadmore 加载更多](#loadmore-加载更多)
- [ReadMore 展开阅读更多](#readmore-展开阅读更多)
- [LazyLoad 懒加载](#lazyload-懒加载)
- [Gap 间隔槽](#gap-间隔槽)
- [Avatar 头像](#avatar-头像)
- [Loading 加载动画](#loading-加载动画)
- [LoadingPopup 加载弹窗](#loadingpopup-加载弹窗)
- [safeAreaInset 底部安全区](#safeareainset-底部安全区)

## MessageInput 验证码输入

[MessageInput 组件文档将从官网获取...]

## Loadmore 加载更多

此组件一般用于标识页面底部加载数据时的状态，共有三种状态：

加载前，显示"加载更多"，加入点击可选，是因为数据不够一页时，无法触发页面的onReachBottom生命周期
加载中，显示"正在加载..."，2种动画可选
加载后，如果还有数据，回到"加载前"状态，否则加载结束，显示"没有更多了"
平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过status设置组件的状态，加载前值为loadmore，加载中为loading，没有数据为nomore
注意：以下示例仅为模拟效果，实际中请根据自己的逻辑，修改代码的实现


<template>
	<view class="wrap">
		<view class="item u-border-bottom" v-for="(item, index) in list" :key="index">
			{{'第' + item + '条数据'}}
		</view>
		<u-loadmore :status="status" />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onReachBottom } from '@dcloudio/uni-app'

// 定义响应式数据
const status = ref<string>('loadmore')
const list = ref<number>(15)
const page = ref<number>(0)

// 页面上拉触底事件处理
onReachBottom(() => {
	if (page.value >= 3) return
	status.value = 'loading'
	page.value = ++page.value
	setTimeout(() => {
		list.value += 10
		if (page.value >= 3) status.value = 'nomore'
		else status.value = 'loading'
	}, 2000)
})
</script>

<style lang="scss" scoped>
.wrap {
	padding: 24rpx;
}

.item {
	padding: 24rpx 0;
	color: $u-content-color;
	font-size: 28rpx;
}
</style>
控制组件的提示以及动画效果
可以通过icon-type设置加载中的图标为flower或者circle，如果不需要图标，可以设置icon为false
可以设置is-dot为true，在没有数据时，内容显示为一个"●"替代默认的"没有更多了"
可以通过配置load-text配置提示的文字，该参数为一个对象值，可以修改默认的文字提示，见如下：

<template>
	<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 定义响应式数据
const status = ref<string>('loadmore')
const iconType = ref<string>('flower')

// 使用 reactive 定义 loadText 对象
const loadText = reactive({
	loadmore: '轻轻上拉',
	loading: '努力加载中',
	nomore: '实在没有了'
})
</script>
手动触发加载更多
有时候可能会因为网络，或者数据不满一页的原因，导致无法上拉触发onReachBottom生命周期，这时候(需status为loadmore状态)，用户点击组件，就会触发loadmore 事件，可以在回调中，进行状态的控制和数据的加载，同时也可以修改loadText的loadmore为"上拉或点击加载更多"进行更加人性化的提示。

API
Props
参数	说明	类型	默认值	可选值
status	组件状态	String	loadmore	loading / nomore
bg-color	组件背景颜色，在页面是非白色时会用到(1.7.0起废弃此参数，默认为transparent)	String	#ffffff	-
icon	加载中时是否显示图标	Boolean	true	false
icon-type	加载中时的图标类型，	String	circle	flower
icon-color	icon-type为circle时有效，加载中的动画图标的颜色	String	#b7b7b7	-
is-dot	status为nomore时，内容显示为一个"●"	Boolean	false	true
color	字体颜色	String	#606266	-
font-size	字体大小，单位rpx	String | Number	28	-
load-text	自定义显示的文字，见上方说明示例	Object	-	-
margin-top	与前一个元素的距离，单位rpx	String | Number	0	-
margin-bottom	与后一个元素的距离，单位rpx	String | Number	0	-
Event
事件名	说明	回调参数	版本
loadmore	status为loadmore时，点击组件会发出此事件	-	-

## ReadMore 展开阅读更多

该组件一般用于内容较长，预先收起一部分，点击展开全部内容的场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过slot传入正文内容


<template>
	<u-read-more>
		<rich-text :nodes="content"></rich-text>
	</u-read-more>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const content = ref<string>(`山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。
苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。
无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？`)
</script>
展开收起
配置toggle为true，展开后可以收起，否则展开后没有收起的按钮


<u-read-more :toggle="true">
	<rich-text :nodes="content"></rich-text>
</u-read-more>
配置展开高度
可以配置一个高度，单位rpx，只有slot传入的内容高度超出这个值，才会出现"展开阅读全文"字样的按钮


<u-read-more show-height="600">
	<rich-text :nodes="content"></rich-text>
</u-read-more>
异步初始化
有时候需要展示的内容是从后端获取的，组件内部的mounted生命周期初始化时，请求尚未回来，会导致 内容的高度在初始化有误差。可以在请求完毕渲染后(指的是this.$nextTick)，通过ref调用组件的init方法，重新初始化


<template>
	<u-read-more ref="uReadMoreRef">
		<rich-text :nodes="content"></rich-text>
	</u-read-more>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义响应式数据
const content = ref<string>('')
const uReadMoreRef = ref<any>(null)

// 模拟页面加载完成生命周期
onMounted(() => {
	// 模拟后端请求
	setTimeout(() => {
		content.value = `山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。
		苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。
		无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？`
		
		// 使用 nextTick 确保 DOM 更新后初始化组件
		setTimeout(() => {
			if (uReadMoreRef.value && uReadMoreRef.value.init) {
				uReadMoreRef.value.init()
			}
		}, 0)
	}, 2000)
})
</script>
自定义样式
此组件上边部分有一个白色虚化的阴影，用以将点击区域与文字内容进行融合，如果您不想要这个阴影，可以调整shadow-style对象，此对象内部如下：


{
	backgroundImage: "linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 80%)",
	paddingTop: "300rpx",
	marginTop: "-300rpx"
}
如果您不想要阴影，将backgroundImage设置为none即可，关于paddingTop和marginTop自行调整至合适数值即可。


<template>
	<u-read-more ref="uReadMore" :shadow-style="shadowStyle" :show-height="200">
		<rich-text :nodes="content"></rich-text>
	</u-read-more>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 定义响应式数据
const content = ref<string>('')
const uReadMore = ref<any>(null)

// 定义阴影样式对象
const shadowStyle = reactive({
	backgroundImage: "none",
	paddingTop: "0",
	marginTop: "20rpx"
})
</script>
API
Props
参数	说明	类型	默认值	可选值
show-height	内容超出此高度才会显示展开全文按钮，单位rpx	String | Number	400	-
toggle	展开后是否显示收起按钮	Boolean	false	true
close-text	关闭时的提示文字	String	展开阅读全文	-
font-size	提示文字的大小，单位rpx	String | Number	28	-
open-text	展开时的提示文字	String	收起	-
color	提示文字的颜色	String	#2979ff	-
shadow-style	对阴影的自定义处理，对象形式	Object	见上方说明	-
text-indent	段落首行缩进的字符个数，无需缩进请设置为0	String	2em	-
index	用于在open和close事件中当作回调参数返回	String | Number	-	-
Methods
此方法如要通过ref手动调用

名称	说明
init	重新初始化组件内部高度计算过程，如果内嵌u-parse组件时可能需要用到
Events
事件名	说明	回调参数
open	内容被展开时触发	index - props中传入的index参数值
close	内容被收起时触发	index - props中传入的index参数值


## LazyLoad 懒加载

懒加载使用的场景为：页面有很多图片时，APP会同时加载所有的图片，导致页面卡顿，各个位置的图片出现前后不一致等
本组件高度封装和集成，创新性地使用uni.createIntersectionObserver 接口，保证高性能的同时，还有其他友好的可配置参数，比如预加载占位图，加载错误占位图，加载位置参数(threshold)，各种事件等。

提示

由于右侧的演示是通过iframe标签引入的，缺少了手机端运行的相关API，或者因为演示区域太小，或者电脑分别率不够高 ，导致演示可能会有问题，手机端有不会这些问题，请在右上角的"演示"中用手机扫码查看对应的效果。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过image参数传入图片的src路径即可

注意

由于uni-app默认给了image组件的height为225px，同时也只有在uni-appimage组件的mode参数为widthFix时，image才会自动计算出一个高度值 覆盖默认的height(225px)。其他mode参数下，如果设置height为auto，或者100%的话，图片将会无法显示。

所以：当您使用uView的lazyload组件时，如果设置height参数为auto，或者100%，而img-mode参数又不为widthFix的话，图片将会不显示，这不是uView的BUG。

结论：如果img-mode参数不为widthFix的话，必须设置height参数为一个固定的高度(单位rpx)，否则无效。


<template>
	<view>
		<u-lazy-load v-for="(item, index) in list" :key="index" :image="item.src"></u-lazy-load>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const list = ref<Array<{ src: string }>>([
	{
		src: "https://gtd.alicdn.com/sns_logo/i1/TB124_3NXXXXXasXVXXSutbFXXX.jpg_240x240xz.jpg",
	},
	{
		src: "https://gtd.alicdn.com/sns_logo/i7/TB1IWtgQFXXXXcmXFXXSutbFXXX.jpg_240x240xz.jpg",
	},
	{
		src: "https://gtd.alicdn.com/sns_logo/i1/TB1_f_PLXXXXXbVXpXXSutbFXXX.jpg_240x240xz.jpg",
	},
	{
		// 这里图片不存在，会加载失败，显示错误的占位图
		src: "xxx",
	},
])
</script>
配置占位图
占位图有两种情况：

一种是正常预加载时显示的，通过loading-img配置类似"正在加载"的占位图。
另一种是图片加载失败(如图片不存在，路径不完整等)，通过error-img参数配置类似"图片加载错误"的占位图

<template>
	<view>
		<u-lazy-load :image="image" :loading-img="loadingImg" :error-img="errorImg"></u-lazy-load>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const image = ref<string>("https://gtd.alicdn.com/sns_logo/i1/TB124_3NXXXXXasXVXXSutbFXXX.jpg_240x240xz.jpg")
const loadingImg = ref<string>('/static/uView/loading.png')
const errorImg = ref<string>('/static/uView/load_error.png')
</script>
图片加载位置
可以通过threshold参数设置图片距离屏幕底部多少距离时触发图片加载，单位rpx，说明：

如果取负值(如-300)，为尚未到达屏幕底部，距离300rpx时触发
如果取正数(如300)，为图片超出屏幕底部300rpx时触发

<u-lazy-load :image="image" threshold="300"></u-lazy-load>
API
Props
参数	说明	类型	默认值	可选值
index	用户自定义值，在事件触发时回调，用以区分是哪个图片	String | Number	-	-
image	图片路径	String	-	-
loading-img	预加载时的占位图	String	-	-
error-img	图片加载出错时的占位图	String	-	-
threshold	触发加载时的位置，见上方说明，单位 rpx	String	100	-
duration	图片加载成功时，淡入淡出时间，单位ms	String | Number	500	-
effect	图片加载成功时，淡入淡出的css动画效果	String	ease-in-out	linear / ease / ease-in / ease-out
is-effect	图片加载成功时，是否启用淡入淡出效果	Boolean	true	false
border-radius	图片圆角值，单位rpx	String | Number	0	-
height	图片高度，注意：实际高度可能受img-mode参数影响	String | Number	450	-
img-mode	图片的裁剪模式，详见image组件裁剪模式	String | Number	widthFix	-
Events
事件名	说明	回调参数	版本
click	点击图片时触发	index：用户通过props传递的index值	-
load	图片加载成功时触发	index：用户通过props传递的index值	-
error	图片加载失败时触发	index：用户通过props传递的index值	-

## Gap 间隔槽

该组件一般用于内容块之间的用一个灰色块隔开的场景，方便用户风格统一，减少工作量

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
直接引入即可使用

通过height配置高度，单位rpx
通过bg-color配置背景颜色

<u-gap height="80" bg-color="#bbb"></u-gap>
API
Props
参数	说明	类型	默认值	可选值
bg-color	背景颜色	String	transparent(背景透明)	-
height	间隔槽高度，单位rpx	String | Number	30	-
margin-top	与前一个元素的距离，单位rpx	String | Number	0	-
margin-bottom	与后一个元素的距离，单位rpx	String | Number	0	-

## Avatar 头像

本组件一般用于展示头像的地方，如个人中心，或者评论列表页的用户头像展示等场所。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过src指定头像的路径即可简单使用，如果传递了text参数，text将会优先起作用

注意： 请保证传递给src的是绝对地址，而不是相对地址，为什么呢？因为传入avatar组件的相对地址，是相对于组件的，而不是父组件(页面)，所以相对址可能会出错。


<template>
	<view>
		<u-avatar :src="src"></u-avatar>
		<u-avatar :text="text"></u-avatar>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
const text = ref('无头像')
</script>
头像类型
mode参数指定头像的类型，取值circle为圆形，取值square为圆角方形

<template>
	<u-avatar :src="src" mode="square"></u-avatar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
</script>
默认头像
如果头像加载失败，导致加载图片失败，将会显示一个默认的灰色头像

API
Props
参数	说明	类型	默认值	可选值
bg-color	背景颜色，一般显示文字时用	String	#ffffff	-
src	头像路径，如加载失败，将会显示默认头像	String	-	-
size	头像尺寸，可以为指定字符串(large, default, mini)，或者数值，单位rpx	String | Number	default	-
mode	显示类型，见上方说明	String	circle	square
text	用文字替代图片，级别优先于src	String	-	-
img-mode	头像图片的裁剪类型，与uni的image组件的mode参数一致，如效果达不到需求，可尝试传widthFix值	String	aspectFill	-
show-sex	是否显示右上角的性别图标	Boolean	false	true
sex-icon	右上角性别图标，可传入图片路径，或内置图标名	String	man	woman
sex-bg-color	性别图标的背景颜色	String	man-primary主题，woman-error主题	-
show-level	是否显示右下角的等级图标	Boolean	false	true
level-icon	右下角等级图标，可传入图片路径，或内置图标名	String	level	-
level-bg-color	等级图标的背景颜色	String	warning主题	-
Event
事件名	说明	回调参数
click	头像被点击	index: 用户传递的标识符

## Loading 加载动画

此组件为一个小动画，目前用在uView的loadmore加载更多和switch开关等组件的正在加载状态场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过mode设定动画的类型，circle为圆圈的形状，flower为经典类似花朵的形状


<template>
	<view>
		<u-loading mode="circle"></u-loading>
		<u-loading mode="flower"></u-loading>
	</view>
</template>
动画颜色
color可以指定动画活动区域的颜色


<u-loading color="red"></u-loading>
动画尺寸
通过size设定尺寸，单位rpx，组件内把size值体现为组件的宽和高


<u-loading size="36"></u-loading>
显示或隐藏动画
通过show设置为true或false，来显示或隐藏动画


<u-loading :show="true"></u-loading>

/* 等价于 */
<u-loading show></u-loading>
API
Props
参数	说明	类型	默认值	可选值
mode	模式选择，见上方说明	String	circle	flower
color	动画活动区域的颜色，只对 mode = circle 模式有效	String	#c7c7c7	-
size	加载图标的大小，单位rpx	String | Number	34	-
show	是否显示动画	Boolean	true	false

## LoadingPopup 加载弹窗

u-loading-popup 是 uView Pro 提供的弹窗式加载动画组件，常用于页面或局部异步加载、数据请求等待等场景。相比普通的 u-loading，它支持遮罩、内容插槽、自动关闭等高级功能。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过 v-model 实现弹窗的双向绑定显示，mode 设定动画类型（circle 圆圈、flower 花朵），可自定义内容。


<template>
  <u-loading-popup v-model="show" mode="circle" text="加载中..." />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const show = ref(true)
</script>
方向
可通过 direction 属性设置内容方向，可选值有 vertical（垂直）和 horizontal（水平）。


<template>
  <u-loading-popup
    v-model="show"
    text="正在加载，请稍候..."
    :direction="direction"
  />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  const show = ref(true)

  const direction = ref<'vertical' | 'horizontal'>('vertical')
</script>
动画颜色与尺寸
color 设置动画颜色（仅 mode=circle 有效）。
size 设置动画尺寸，单位 rpx。

<u-loading-popup v-model="show" color="#2979ff" size="40" />
自动关闭与遮罩交互
duration 设置自动关闭时间（ms），默认（设置为 0）表示不自动关闭。
cancelTime 允许点击遮罩关闭的最短时间（ms），默认 10000。
遮罩层点击在 cancelTime 毫秒后可关闭弹窗，触发 cancel 事件。

<u-loading-popup v-model="show" :duration="2000" :cancelTime="5000" />
事件
@cancel 点击遮罩关闭时触发。

<template>
  <u-loading-popup v-model="show" @cancel="handleCancel" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  const show = ref(true)

  function handleCancel() {
    console.log('cancel')
  }
</script>
API
Props
参数	说明	类型	默认值	可选值
v-model	弹窗显示的双向绑定	Boolean	false	true/false
mode	加载动画类型	String	circle	circle/flower
text	加载提示文字	String	-	-
direction	内容方向	String	vertical	vertical/horizontal
duration	自动关闭时间（ms）	Number	0	-
cancelTime	允许点击遮罩关闭的最短时间	Number	10000	-
color	动画颜色	String	#c7c7c7	-
size	加载动画尺寸（rpx）	String/Number	48	-
Events
事件名	说明	回调参数
cancel	点击遮罩关闭时触发	-
更多用法请参考组件源码和实际业务场景。

## safeAreaInset 底部安全区

