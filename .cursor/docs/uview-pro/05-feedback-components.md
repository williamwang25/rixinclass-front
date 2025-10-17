# uViewPro 反馈组件

## 目录
- [ActionSheet 操作菜单](#actionsheet-操作菜单)
- [AlertTips 警告提示](#alerttips-警告提示)
- [Toast 消息提示](#toast-消息提示)
- [NoticeBar 滚动通知](#noticebar-滚动通知)
- [TopTips 顶部提示](#toptips-顶部提示)
- [Collapse 折叠面板](#collapse-折叠面板)
- [Popup 弹出层](#popup-弹出层)
- [SwipeAction 滑动单元格](#swipeaction-滑动单元格)
- [Modal 模态框](#modal-模态框)
- [FullScreen 压窗屏](#fullscreen-压窗屏)

## ActionSheet 操作菜单
本组件用于从底部弹出一个操作菜单，供用户选择并返回结果。
本组件功能类似于uni的uni.showActionSheetAPI，配置更加灵活，所有平台都表现一致。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过list设置需要显示的菜单，该值为一个数组，元素为对象，对象至少要提供text属性，另外可选的有fontSize(字体大小)，color(颜色)，disabled(是否禁用，1.5.6引入)， subText(描述信息，1.6.8引入)
通过v-model绑定一个值为布尔值的变量控制组件的弹出与收起，v-model的值是双向绑定的

<template>
	<view>
		<u-action-sheet :list="list" v-model="show"></u-action-sheet>
		<u-button @click="show = true">打开ActionSheet</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义列表数据
const list = ref([
	{
		text: '点赞',
		color: 'blue',
		fontSize: 28,
		subText: '感谢您的点赞'
	},
	{
		text: '分享'
	},
	{
		text: '评论'
	}
])

// 控制 ActionSheet 显示状态
const show = ref(false)
</script>
配置顶部的提示信息和底部取消按钮
tips参数为一个对象类型，属性可以设置text，fontSize(字体大小)，color(颜色)，文本内容将会显示组件的上方，起提示作用。
cancel-btn参数配置是否显示底部的取消按钮，默认显示

<template>
	<u-action-sheet :list="list" v-model="show" :tips="tips" :cancel-btn="true"></u-action-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 顶部提示信息
const tips = ref({
	text: '在水一方',
	color: '#909399',
	fontSize: 24
})

// 按钮列表
const list = ref([{
	text: '点赞',
	color: 'blue',
	fontSize: 28
}])

// 控制显示状态
const show = ref(true)
</script>
如何知道点了第几项
click回调事件带有一个index值，这个索引值为传递的list数组的索引值，根据回调事件，能获得点击了 第几项和该项的内容


<template>
	<u-action-sheet :list="list" @click="handleClick" v-model="show"></u-action-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 按钮列表
const list = ref([
	{
		text: '点赞',
		color: 'blue',
		fontSize: 28
	},
	{
		text: '分享'
	},
	{
		text: '评论'
	}
])

// 控制显示状态
const show = ref(true)

// 处理点击事件
const handleClick = (index: number) => {
	console.log(`点击了第${index + 1}项，内容为：${list.value[index].text}`)
}
</script>
API
Props
注意：props中没有控制组件弹出与收起的参数，因为这是通过v-model绑定变量实现的，见上方说明。

参数	说明	类型	默认值	可选值
list	按钮的文字数组，见上方文档示例	Array<Object>	[ ]	-
tips	顶部的提示文字，见上方文档示例	Object	-	-
cancel-btn	是否显示底部的取消按钮	Boolean	true	false
border-radius	弹出部分顶部左右的圆角值，单位rpx	Number \ String	0	-
mask-close-able	点击遮罩是否可以关闭	Boolean	true	false
safe-area-inset-bottom	是否开启底部安全区适配	Boolean	false	true
z-index	z-index值	Number \ String	1075	-
cancel-text	取消按钮的提示文字	String	取消	-
Event
事件名	说明	回调参数	版本
click	点击ActionSheet列表项时触发	index: 点击了第几个，从0开始	-
close	点击取消按钮时触发	-	-

## AlertTips 警告提示

警告提示，展现需要关注的信息。

使用场景
当某个页面需要向用户显示警告的信息时。
非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。
平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过title和description设置组件的标题和描述内容，如果内容和标题同时存在，标题字体会被加粗加大
通过type设置主题类型，有primary,success,error,warning,info可选值

<template>
	<u-alert-tips type="warning" :title="title" :description="description"></u-alert-tips>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('登高望远')
const description = ref('欲穷千里目，更上一层楼')
</script>
图标
通过show-icon设置是否显示图标，作用是让信息类型更加醒目。

注意：当前版本图标为uView内置图标，根据type参数显示不同的图标，无法自定义。


<u-alert-tips type="warning" :show-icon="true"></u-alert-tips>
可关闭的警告提示
显示关闭按钮，点击可关闭警告提示。

close-text参数配置关闭的文字，默认为一个叉的icon图标。close-able为true时有效
close-able参数配置是否允许关闭的文字或图标
注意

由于props传参的限制，您需要监听组件的close事件，并在此此事件中设置show参数为false，才能关闭组件。


<template>
	<u-alert-tips :show="show" type="error" @close="show = false" :title="title" :close-able="true"></u-alert-tips>
	
	<u-alert-tips type="error" :title="title" close-text="close" :description="description" :close-able="true"></u-alert-tips>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('寻隐者不遇')
const description = ref('松下问童子，言师采药去。只在此山中，云深不知处。')
const show = ref(true)
</script>
API
Props
参数	说明	类型	默认值	可选值
title	显示的文字	String	-	-
description	辅助性文字，颜色比title浅一点，字号也小一点，可选	String	-	-
close-able	关闭按钮(默认为叉号icon图标)	Boolean	false	true
type	使用预设的颜色	String	warning	success / primary / error / info
close-text	用文字替代关闭图标，close-able为true时有效	String	-	-
show-icon	是否显示左边的辅助图标	Boolean	false	true
show	显示或隐藏组件	Boolean	true	false
icon	左侧的图标名称，如设置type和show-icon值，会有一个默认的图标	String	-	-
icon-style	自定义图标的样式，对象形式	Object	-	-
title-style	自定义标题的样式，对象形式	Object	-	-
desc-style	自定义内容的样式，对象形式	Object	-	-
Events
事件名	说明	回调参数
close	点击关闭按钮时触发，需在此回调设置show为false	-
click	点击组件时触发	-

## Toast 消息提示

此组件表现形式类似uni的uni.showToastAPI，但也有不同的地方，具体表现在：

uView Pro的toast有5种主题可选
可以配置toast结束后，跳转相应URL
目前没有加载中的状态，请用uni的uni.showLoading，这个需求uni已经做得很好
注意：

由于uni中无法通过js创建元素，所以需要在页面中调用<toast />组件，再通过ref开启

基本使用
以下为一个模拟登录成功后，弹出toast提示，并在一定时间(默认2000ms)后，自动跳转页面到个人中心页(也可以配置跳转的参数)的示例


<template>
	<view>
		<u-toast ref="uToastRef" />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const uToastRef = ref()

function showToast() {
	// 通过ref调用uToast组件的show方法
	uToastRef.value?.show({
		title: '登录成功',
		type: 'success',
		url: '/pages/user/index'
	})
}
</script>
配置toast主题
一共有6种主题可选，如下：

default-灰黑色，最普通的场景，此为默认主题，可以不用填type参数
error-红色，代表错误
success-绿色，代表成功
warning-黄色，代表警告
info-灰色，比default浅一点
primary-蓝色，uView的主色调
除了default状态，其他5种主题，都是默认带有一个左边的图标，可以通过配置icon参数为none来取消


uToastRef.value?.show({
	title: '操作成功',
	// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
	// type: 'success', 
	// 如果不需要图标，请设置为false
	// icon: false
})
toast结束跳转URL
如果配置了url参数，在toast结束的时候，就会用uni.navigateTo(默认)或者uni.switchTab(需另外设置isTab为true)
如果配置了params参数，就会在跳转时自动在URL后面拼接上这些参数，具体用法如下：

uToastRef.value?.show({
	title: '操作成功',
	url: '/pages/user/index',
	params: {
		id: 1,
		menu: 3
	}
})
API
Props
参数	说明	类型	默认值	可选值
z-index	toast展示时的z-index值	String | Number	10090	-
Params
这些参数为通过ref调用<toast/>组件内部的show方法时，需要传递参数

参数	说明	类型	默认值	可选值
title	显示的文本	String	-	-
type	主题类型，不填默认为default	String	default	primary / success / error / warning / info
duration	toast的持续时间，单位ms	Nubmer	2000	-
url	toast结束跳转的url，不填不跳转，优先级高于back参数	String	-	-
icon	是否显示显示type对应的图标，为false不显示图标	Boolean	true	false
position	toast出现的位置	String	center	top / bottom
callback	toast结束后执行的回调方法	Function	-	-
isTab	toast结束后，跳转tab页面时需要配置为true	Boolean	false	true
back	toast结束后，是否返回上一页，优先级低于url参数	Boolean	false	true
Methods
方法是通过ref调用的，参见上方说明 注意：所有有关ref的调用，都不能在页面的onLoad生命周期调用，因为此时组件尚未创建完毕，会报错，应该在onReady生命周期调用。

方法名	说明	参数	版本
show	显示toast，如需一进入页面就显示toast，请在onReady生命周期调用	见上方说明	-

## NoticeBar 滚动通知

该组件用于滚动通告场景，有多种模式可供选择

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过list数组参数设置需要滚动的内容
滚动mode参数有两种模式，分别是horizontal水平滚动，vertical垂直滚动。其中水平滚动又可以通过is-circular来配置是衔接滚动(true)还是步进滚动(false)， 衔接滚动滚动会把list数组元素拼接成一个字符串形式进行滚动，步进滚动模式类似轮播图水平滚动的形式，具体效果请见实例

<template>
	<view>
		<u-notice-bar mode="horizontal" :list="list"></u-notice-bar>
		
		<u-notice-bar mode="horizontal" :is-circular="false" :list="list"></u-notice-bar>
		
		<u-notice-bar mode="vertical" :list="list"></u-notice-bar>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const list = ref<string[]>([
	'寒雨连江夜入吴',
	'平明送客楚山孤',
	'洛阳亲友如相问',
	'一片冰心在玉壶'
])
</script>
配置主题
通过type参数可以配置5种主题，即primary、warning(默认)、error、info、success、none
说明：none主题默认没有背景颜色


<u-notice-bar type="error" :list="list"></u-notice-bar>
配置图标
volume-icon参数配置是否显示左侧的音量小喇叭图标，默认显示
more-icon配置是否显示右侧的向右箭头，默认关闭
close-icon配置是否显示关闭的图标，默认关闭

<u-notice-bar :volume-icon="false" :list="list"></u-notice-bar>

<u-notice-bar :more-icon="true" :list="list"></u-notice-bar>

<u-notice-bar :close-icon="true" :list="list"></u-notice-bar>
配置滚动速度
mode为vertical(垂直滚动)，或者mode为horizontal且is-circular为false时，两者都可视为"步进"滚动，此时通过duration设置滚动周期时长
mode为horizontal且is-circular为true时，可视为"水平衔接滚动"，此时uView加入了一个滚动因子参数，可确保在任意多内容情况下，滚动速度恒定不变， 可通过speed参数配置每秒滚动的距离，单位为rpx

<u-notice-bar :mode="vertical" :duration="1500" :list="list"></u-notice-bar>

<u-notice-bar :mode="vertical" :is-circular="false" :duration="1500" :list="list"></u-notice-bar>

<u-notice-bar :mode="vertical" :is-circular="true" :speed="200"  :list="list"></u-notice-bar>
控制滚动的开始和暂停
autoplay参数默认为true，控制是否自动播放滚动通告
play-state参数为paused，滚动会暂停，为play滚动继续播放

<u-notice-bar :autoplay="true" play-state="paused" :list="list"></u-notice-bar>
事件回调
more-icon参数为true时，点击向右图标会回调一个getMore事件
close-icon参数为true时，点击关闭箭头图标会触发一个close事件
点击通告栏的文字时，会触发click事件，回调参数为当前文字所在list数组参数的索引值
API
Props
参数	说明	类型	默认值	可选值
list	滚动内容，数组形式，见上方说明	Array	-	-
type	显示的主题	String	warning	primary / info / error / success / none
volume-icon	是否显示小喇叭图标	Boolean	true	false
more-icon	是否显示右边的向右箭头	Boolean	false	true
close-icon	是否显示关闭图标	Boolean	false	true
autoplay	是否自动播放	Boolean	true	false
color	文字颜色	String	-	-
bg-color	背景颜色	String | Number	-	-
mode	滚动模式	String	horizontal(水平滚动)	vertical(垂直滚动)
show	是否显示	Boolean	true	false
volume-size	左边喇叭的大小	String | Number	34	-
font-size	字体大小，单位rpx	String | Number	28	-
duration	滚动周期时长，只对步进模式有效，横向衔接模式无效，单位ms	String | Number	2000	-
speed	水平滚动时的滚动速度，即每秒移动多少距离，只对水平衔接方式有效，单位rpx	String | Number	160	-
is-circular	mode为horizontal时，指明是否水平衔接滚动	Boolean	true	false
play-state	播放状态，play - 播放，paused - 暂停	String	play	paused
disable-touch	是否禁止通过手动滑动切换通知，只有mode = vertical，或者mode = horizontal且is-circular = false时有效；只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序	Boolean	true	false
padding	内置滚动通知的内边距，字符串，类似"16rpx 20rpx"	String	18rpx 24rpx	-
border-radius	圆角值，单位rpx	String \ Number	0	-
no-list-hidden	list为空数组时，是否显示组件	Boolean	true	false
Events
详细解释见上方说明

事件名	说明	回调参数	版本
click	点击通告文字触发，只有mode = vertical，或者mode = horizontal且is-circular = false时有效	index：当前文字所在list数组的索引值	-
close	点击右侧关闭图标触发	-	-
getMore	点击右侧向右图标触发	-	-
end	列表的消息每次被播放一个周期时触发，只有mode = vertical，或者mode = horizontal且is-circular = false时有效	-	-

## TopTips 顶部提示

该组件一般用于页面顶部向下滑出一个提示，尔后自动收起的场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
该组件通过ref调用，使用简单，只需title参数设置显示的内容即可

注意：不要在onLoad中调用，应在onReady生命周期调用，因为onLoad生命周期组件尚未创建完成


<template>
	<u-top-tips ref="uTipsRef"></u-top-tips>
</template>

<script setup lang="ts">
import { ref, onReady } from 'vue'

// 定义u-top-tips组件的引用
const uTipsRef = ref()

// 在onReady生命周期中调用
onReady(() => {
	if (uTipsRef.value) {
		uTipsRef.value.show({
			title: '铁马冰河入梦来',
			type: 'success',
			duration: '2300'
		})
	}
})
</script>
自定义导航栏使用本组件的问题
注意： 只有使用了自定义导航栏才需要注意如下事项，否则无需在意，不用处理。

由于本组件是预先将组件隐藏于导航栏底部，调用时显示，内部已兼容处理H5，APP，小程序等的系统导航栏高度问题。
但是如果您是使用了自定义导航栏的话，组件内部不知道您的自定义导航栏高度是多少，可能会显示有误，所以您需要传入一个navbar-height参数(单位为px)。
需要注意的是，这个navbar-height参数是您自定义导航栏的整个高度，比如在APP和各家小程序上，是“导航栏”+“状态栏”的高度，H5中，“状态栏”无法自定义，高度为0。

温馨提示

uView 有推出Navbar 自定义导航栏组件，此组件有一个height参数(单位px，默认44)，这个高度是不包含状态栏的高度的， 所以您使用uView的自定义导航栏组件的话，您还需要通过"uni.getSystemInfoSync().statusBarHeight"(字节跳动小程序不支持)去获得状态栏的高度， 加上你需要的导航栏高度(也即uView的navbar组件的height)，即为需要传入u-top-tips组件的navbar-height参数值。

使用uView自定导航栏可进行如下处理，如果是其他的UI框架的导航栏或者自己做的导航栏组件，请以此类推，也能不需要下面的处理。


<template>
	<view class="wrap">
		<u-navbar title="文章列表"></u-navbar>
		<u-top-tips ref="uTipsRef" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
		<u-button @click="showTips">弹出Tips</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义u-top-tips组件的引用
const uTipsRef = ref()

// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
// 导航栏内容区域高度，不包括状态栏高度在内
const navbarHeight = ref<number>(44)

// 定义showTips方法
const showTips = () => {
	if (uTipsRef.value) {
		uTipsRef.value.show({
			title: '雨打梨花深闭门，忘了青春，误了青春'
		})
	}
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40rpx;
}
</style>
主题设置
可以通过配置type参数设置显示的背景颜色：

type值可选的有primary(默认)、success、info、warning、error
显示时间设置
duration值设置显示的时间，单位ms：
API
Methods
需要注意的是，这里的参数是通过ref调用的，调用方法如上方"基本使用"中所示

参数	说明	类型	默认值	可选值
title	要显示的内容	String	-	-
type	主题选择	String	primary	success / info / warning / error
duration	显示的时间，单位ms	String | Number	-	
Props
需要注意到是，这里的参数是需要通过props调用的，只有使用了自定义导航栏才需要配置，见上方说明。

参数	说明	类型	默认值	可选值
navbar-height	导航栏高度(包含状态栏高度在内)，单位PX	String | Number	-	-
z-index	z-index值	String | Number	975	-

## Collapse 折叠面板

通过折叠面板收纳内容区域

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
默认为手风琴模式，即打开一个，另外所有的都会关闭。可以将u-collapse的accordion设置为false，这样可以允许打开多个面板


<template>
	<u-collapse>
		<u-collapse-item :title="item.head" v-for="(item, index) in itemList" :key="index">
			{{item.body}}
		</u-collapse-item>
	</u-collapse>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface CollapseItem {
  head: string
  body: string
  open?: boolean
  disabled?: boolean
}

const itemList = reactive<CollapseItem[]>([{
  head: "赏识在于角度的转换",
  body: "只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来",
  open: true,
  disabled: true
}, {
  head: "生活中不是缺少美，而是缺少发现美的眼睛",
  body: "学会欣赏，实际是一种积极生活的态度，是生活的调味品，会在欣赏中发现生活的美",
  open: false,
}, {
  head: "周围一些不起眼的人、事、物，或许都隐藏着不同凡响的智慧",
  body: "但是据说雕刻大卫像所用的这块大理石，曾被多位雕刻家批评得一无是处，有些人认为这块大理石采凿得不好，有些人嫌它的纹路不够美",
  open: false,
}])
</script>
控制面板的初始状态，以及是否可以操作
设置u-collapse-item的open参数为true，可以让面板初始化时为打开状态
如果设置u-collapse-item的disabled参数为true，那么面板会保持初始状态，无法关闭或打开

<template>
	<u-collapse>
		<u-collapse-item :title="item.head" v-for="(item, index) in itemList" :key="index" :open="item.open" :disabled="item.disabled">
			{{item.body}}
		</u-collapse-item>
	</u-collapse>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface CollapseItem {
  head: string
  body: string
  open?: boolean
  disabled?: boolean
}

const itemList = reactive<CollapseItem[]>([{
  head: "赏识在于角度的转换",
  body: "只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来",
  open: true,
  disabled: true
}, {
  head: "生活中不是缺少美，而是缺少发现美的眼睛",
  body: "学会欣赏，实际是一种积极生活的态度，是生活的调味品，会在欣赏中发现生活的美",
  open: false,
}, {
  head: "周围一些不起眼的人、事、物，或许都隐藏着不同凡响的智慧",
  body: "但是据说雕刻大卫像所用的这块大理石，曾被多位雕刻家批评得一无是处，有些人认为这块大理石采凿得不好，有些人嫌它的纹路不够美",
  open: false,
}])
</script>
自定义样式
在此组件中，可以通过多个方式对每个Item进行样式定义，我们可以从如下方面思考和着手：

1. 如果修改展开后的内容？
因为是通过默认的slot传入的(见上方示例)，我们可以加一个view元素当做外层，在父组件给它添加样式，如下：

<template>
	<u-collapse :item-style="itemStyle" event-type="close" :arrow="arrow" :accordion="accordion" @change="change">
		<u-collapse-item :index="index" @change="itemChange" :title="item.head" v-for="(item, index) in itemList" :key="index">
			<view class="collapse-item">
				{{item.body}}
			</view>
		</u-collapse-item>
	</u-collapse>
</template>

<style scoped>
	.collapse-item {
		color: red;
		padding-bottom: 10px;
	}
</style>
通过Collapse的body-style参数也可以配置主体内容的样式，需要注意上面的自定义slot内容如果在父组件定义了样式，会优先起作用。
2. 如何自定义标题的样式？
如果想修改头部标题的字体大小，颜色等，可以通过head-style参数修改。

3. 如何修改整个Item的样式？
有时候我们需要修改Item的整体样式，比如将各个Item之间隔开，这时我们可以通过item-style参数进行设置，比如：


<template>
	<u-collapse :item-style="itemStyle">
		......
	</u-collapse>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const itemStyle = reactive({
	marginTop: '20px'
})
</script>
API
Collapse Props
参数	说明	类型	默认值	可选值
accordion	是否手风琴模式	Boolean	true	false
arrow	是否显示标题右侧的箭头	Boolean	true	false
arrow-color	标题右侧箭头的颜色	String	#909399	-
item-style	整个Item的自定义样式，对象形式	Object	-	-
head-style	Item的标题自定义样式，对象形式	Object	-	-
body-style	Item的主体自定义样式，对象形式	Object	-	-
hover-class	样式类名，按下时有效，样式必须写在根目录的App.vue或通过其引入的全局样式中才有效，none为无效果，作用于头部标题区域	String	u-hover-class	none/其他
Collapse Item Props
参数	说明	类型	默认值	可选值
title	面板标题	String	-	-
index	主要用于事件的回调，标识那个Item被点击	String/Number	-	-
disabled	面板是否可以打开或收起	Boolean	false	true
open	设置某个面板的初始状态是否打开	Boolean	false	true
name	唯一标识符，如不设置，默认用当前collapse-item的索引值	String/Number	-	-
align	标题的对齐方式	String	left	-
active-style	不显示箭头时，可以添加当前选择的collapse-item活动样式，对象形式	Object	-	-
Collapse Event
注意：请在<u-collapse></u-collapse>上监听此事件

事件名	说明	回调参数
change	当前激活面板展开时触发(如果是手风琴模式，参数activeNames类型为String，否则为Array)	activeNames: String/Array
Collapse Item Event
注意：请在<u-collapse-item></u-collapse-item>上监听此事件

事件名	说明	回调参数
change	某个item被打开或者收起时触发	对象，{index: index, show: true
Collapse Methods
注意：此方法需要通过ref调用

方法	说明
init	重新初始化内部高度计算，用于异步获取内容的情形，请结合nextTick()使用
Slot
名称	说明
-	主体部分的内容
title	头部的内容，不含右边的箭头
title-all	整个头部的内容，包含右边的箭头

## Popup 弹出层

弹出层容器，用于展示弹窗、信息提示等内容，支持上、下、左、右和中部弹出。组件只提供容器，内部内容由用户自定义

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
弹出层的内容通过slot传入，由用户自定义
通过v-model绑定一个布尔值的变量控制弹出层的打开和收起

<template>
	<view>
		<u-popup v-model="show">
			<view>出淤泥而不染，濯清涟而不妖</view>
		</u-popup>
		<u-button @click="show = true">打开</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(false)
</script>
设置弹出层的方向
可以通过mode参数设置，可以设置为left、top、right、bottom、center

<template>
	<u-popup v-model="show" mode="top">
		<view>
			人生若只如初见，何事秋风悲画扇
		</view>
	</u-popup>
</template>
设置弹出层的圆角
可以给border-radius设置一个值来给弹窗增加圆角，单位rpx。


<template>
	<u-popup v-model="show" mode="top" border-radius="14">
		<view>
			人生若只如初见，何事秋风悲画扇
		</view>
	</u-popup>
</template>
控制弹窗的宽度 | 高度
这里说的宽度，指的是左边，右边，中部弹出的场景，高度指的是顶部和底部弹出的场景(因为这两个场景宽度都是100%)。
uView提供了length来控制此种情况，此值可以是数值(单位rpx)，auto，百分比等，内部会自动处理对应的逻辑。 如果为auto的时候，表示弹窗的宽度 | 高度由内容撑开。

width和height参数：

优先推荐width和height参数，并且优先级会高于length，这3个参数都可以设置百分比、auto、数值(单位rpx)、或者是带px和rpx单位的字符串：

width只对mode = left | center | right模式有效
height只对mode = top | center | bottom模式有效
提示

内置了scroll-view元素，内如内容超出容器的高度，将会自动获得垂直滚动的特性，如果您因为在slot内容做了滚动的处理，而造成了 冲突的话，请移除自定义关于滚动部分的逻辑。


<template>
	<u-popup v-model="show" mode="top" length="60%">
		<view>
			等闲变却故人心，却道故人心易变
		</view>
	</u-popup>
	
	<u-popup v-model="show" mode="center" width="500rpx" height="600px">
		<view>
			骊山语罢清宵半，泪雨霖铃终不怨
		</view>
	</u-popup>
</template>
内容局部滚动
如果您需要让弹窗中的内容局部滚动，局部固定，比如商城底部弹出SKU选择的场景，可以按如下思路进行处理：

在弹窗内容中放一个scroll-view组件，设置为竖向滚动，并指定高度(必须)
在scroll-view组件下方放一块无需滚动内容，如下：

<template>
	<view class="">
		<u-button @click="show = true">打开弹窗</u-button>
		<u-popup mode="bottom" v-model="show">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view>
						<view v-for="index in 20" :key="index">
							第{{index}}个Item
						</view>
					</view>
				</scroll-view>
				<view class="confrim-btn">
					<u-button @click="show = false">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(false)
</script>

<style lang="scss" scoped>
.content {
	padding: 24rpx;
	text-align: center;
}
</style>
API
Props
注意：props中没有控制弹窗打开与收起的参数，因为这是通过v-model绑定变量实现的，见上方说明。

参数	说明	类型	默认值	可选值
mode	弹出方向	String	left	top / right / bottom / center
mask	是否显示遮罩	Boolean	true	false
length	mode=left | 见上方说明	String | Number	auto	-
zoom	是否开启缩放动画，只在mode为center时有效	Boolean	true	false
safe-area-inset-bottom	是否开启底部安全区适配	Boolean	false	true
mask-close-able	点击遮罩是否可以关闭弹出层	Boolean	true	false
border-radius	弹窗圆角值	Number | String	0	-
z-index	弹出内容的z-index值	Number | String	10075	-
closeable	是否显示关闭图标	Boolean	false	true
close-icon	关闭图标的名称，只能uView的内置图标	String	close	-
close-icon-pos	自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角	String	top-right	top-left / bottom-left / bottom-right
close-icon-color	关闭图标的颜色	String	#909399	-
close-icon-size	关闭图标的大小，单位rpx	String | Number	30	-
width	mode = left | center | right时有效，优先级高于length	String | Number	-	-
height	mode = top | center | bottom时有效，优先级高于length	String | Number	-	-
negative-top	中部弹出时，以避免可能弹出的键盘重合，往上偏移的值，单位任意，数值则默认为rpx单位	String | Number	0	-
mask-custom-style	遮罩自定义样式，一般用于修改遮罩透明度对象形式，如：{background: 'rgba(0, 0, 0, 0.5)'}	Object	-	-
duration	遮罩打开或收起的动画过渡时间，单位ms	String | Number	250	-
Event
事件名	说明	回调参数	版本
open	弹出层打开	-	-
close	弹出层收起	-	-

## SwipeAction 滑动单元格

该组件一般用于左滑唤出操作菜单的场景，用的最多的是左滑删除操作。

注意

如果把该组件通过 v-for 用于左滑删除的列表，请保证循环的:key是一个唯一值，可以用数据的 id 或者 title 替代。 不能是数组循环的 index，否则删除的时候，可能会出现数据错乱

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ 小程序
√	√	√	√	√	√	√
基本使用
通过 slot 传入内部内容即可，可以将v-for的"index"索引值传递给index参数，用于点击时，在回调方法中对某一个数据进行操作(点击回调时第一个参数会返回此索引值)
内部的按钮通过options参数配置，此参数为一个数组，元素为对象，可以配置按钮的文字，背景颜色(建议只配置此两个参数即可)，请勿配置宽高等属性。
说明：有时候，我们在打开一个 swipeAction 的同时，需要自动关闭其他的 swipeAction，这时需要通过open事件实现，见如下：


<template>
  <view>
    <u-swipe-action
      :show="item.show"
      :index="index"
      v-for="(item, index) in list"
      :key="item.id"
      @click="click"
      @open="open"
      :options="options"
    >
      <view class="item u-border-bottom">
        <image mode="aspectFill" :src="item.images" />
        <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
        <view class="title-wrap">
          <text class="title u-line-2">{{ item.title }}</text>
        </view>
      </view>
    </u-swipe-action>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义列表项接口
interface ListItem {
  id: number
  title: string
  images: string
  show: boolean
}

// 定义选项按钮接口
interface OptionButton {
  text: string
  style: {
    backgroundColor: string
  }
}

// 定义响应式数据
const list = ref<ListItem[]>([
  {
    id: 1,
    title: "长安回望绣成堆，山顶千门次第开，一骑红尘妃子笑，无人知是荔枝来",
    images: "https://ik.imagekit.io/anyup/uview-pro/common/logo.png",
    show: false,
  },
  {
    id: 2,
    title: "新丰绿树起黄埃，数骑渔阳探使回，霓裳一曲千峰上，舞破中原始下来",
    images: "https://ik.imagekit.io/anyup/uview-pro/common/logo.png",
    show: false,
  },
  {
    id: 3,
    title: "登临送目，正故国晚秋，天气初肃。千里澄江似练，翠峰如簇",
    images: "https://ik.imagekit.io/anyup/uview-pro/common/logo.png",
    show: false,
  },
])

const disabled = ref<boolean>(false)
const btnWidth = ref<number>(180)
const show = ref<boolean>(false)

const options = ref<OptionButton[]>([
  {
    text: "收藏",
    style: {
      backgroundColor: "#007aff",
    },
  },
  {
    text: "删除",
    style: {
      backgroundColor: "#dd524d",
    },
  },
])

// 定义点击事件回调函数
const click = (index: number, index1: number) => {
  if (index1 == 1) {
    list.value.splice(index, 1)
    // uni.$u.toast(`删除了第${index}个cell`)
  } else {
    list.value[index].show = false
    // uni.$u.toast(`收藏成功`)
  }
}

// 定义打开事件回调函数
const open = (index: number) => {
  // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
  // 原本为'false'，再次设置为'false'会无效
  list.value[index].show = true
  list.value.map((val, idx) => {
    if (index != idx) list.value[idx].show = false
  })
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  padding: 20rpx;
}

image {
  width: 120rpx;
  flex: 0 0 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
  border-radius: 12rpx;
}

.title {
  text-align: left;
  font-size: 28rpx;
  color: $u-content-color;
  margin-top: 20rpx;
}
</style>
修改按钮样式
通过options参数配置按钮的数量和样式，见上方说明
通过btn-width设置按钮的宽度，单位 rpx

<u-swipe-action btn-width="180" :options="options"> ... </u-swipe-action>
点击事件
click点击事件回调中，有两个参数，第一个参数为通过 Props 传入的index参数，第二个参数为滑动按钮的索引，即options数组的索引， 用于标识第几个按钮被点击。

API
Props
参数	说明	类型	默认值	可选值
bg-color	整个组件背景颜色	String	#ffffff	-
index	标识符，点击时候用于区分点击了哪一个，用v-for循环时的 index 即可	String | Number	-	-
btn-width	按钮宽度，单位 rpx	String | Number	180	-
disabled	是否禁止某个 swipeAction 滑动	Boolean	false	true
vibrate-short	是否使手机发生短促震动，目前只在 iOS 的微信小程序和微信小程序开发工具有效	Boolean	false	true
show	打开或者关闭某个组件	Boolean	false	true
options	按钮组的配置参数，数组形式，见上方说明	Array	[ ]	-
Event
事件名	说明	回调参数
click	点击组件时触发	(index1, index)，见上方"点击事件"的说明
close	组件触发关闭状态时	index: 通过 props 传递的index
open	组件触发打开状态时	index: 通过 props 传递的index
content-click	点击内容时触发	index: 通过 props 传递的index

## Modal 模态框

弹出模态框，常用于消息提示、消息确认、在当前页面内完成特定的交互操作。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
默认情况下，模态框只有一个确认按钮：

请至少要配置弹框的内容参数content。
通过v-model绑定一个布尔变量来控制模态框的显示与否。

<template>
	<view>
		<u-modal v-model="show" :content="content"></u-modal>
		<u-button @click="open">
			打开模态框
		</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(false)
const content = ref<string>('东临碣石，以观沧海')

// 定义打开模态框的方法
const open = () => {
	show.value = true
}
</script>
传入富文本内容
有时候我们需要给模态框的内容，不一定是纯文本的字符串，可能会需要换行，嵌入其他元素等，这时候我们可以使用slot功能，再结合uni-apprictText组件， 就能传入富文本内容了，如下演示：


<template>
	<view>
		<u-modal v-model="show" :title-style="{color: 'red'}">
			<view class="slot-content">
				<rich-text :nodes="content"></rich-text>
			</view>
		</u-modal>
		<u-button @click="open">
			打开模态框
		</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(false)
const content = ref<string>(`空山新雨后<br>天气晚来秋`)

// 定义打开模态框的方法
const open = () => {
	show.value = true
}
</script>

<style lang="scss" scoped>
.slot-content {
	font-size: 28rpx;
	color: $u-content-color;
	padding-left: 30rpx;
}
</style>
异步关闭
异步关闭只对"确定"按钮起作用，需要设置async-close为true，当点击确定按钮的时候，按钮的文字变成一个loading动画，此动画的颜色为 confirm-color参数的颜色，同时Modal不会自动关闭，需要手动设置通过v-model绑定的变量为false来实现手动关闭。


<template>
	<view class="">
		<u-modal v-model="show" @confirm="confirm" ref="uModalRef" :async-close="true"></u-modal>
		<u-button @click="showModal">弹起Modal</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(false)

// 定义组件引用
const uModalRef = ref<any>(null)

// 定义显示模态框的方法
const showModal = () => {
	show.value = true
}

// 定义确认按钮的回调函数
const confirm = () => {
	setTimeout(() => {
		// 3秒后自动关闭
		show.value = false
		// 如果不想关闭，而单是清除loading状态，需要通过ref手动调用方法
		// uModalRef.value?.clearLoading()
	}, 3000)
}
</script>
点击遮罩关闭
有时候我们不显示"关闭"按钮的时候，需要点击遮罩也可以关闭Modal，这时通过配置mask-close-able为true即可


<u-modal v-model="show" :mask-close-able="true"></u-modal>
控制模态框宽度
可以通过设置width参数控制模态框的宽度，此值可以为数值(单位rpx)，百分比，auto等。


<u-modal v-model="show" width="70%"></u-modal>
自定义样式
此组件有完善的自定义功能，可以配置标题，内容，按钮等样式(传入对象形式)，具体参数详见底部的API说明


<u-modal v-model="show" :title-style="{color: 'red'}"></u-modal>
缩放效果
开启缩放效果，在打开和收起模态框的时候，会带有缩放效果，具体效果请见示例，此效果默认开启，通过zoom参数配置


<u-modal v-model="show" :zoom="false"></u-modal>
API
Props
注意：需要给modal组件通过v-model绑定一个布尔值，来初始化modal的状态，随后该值被双向绑定。

参数	说明	类型	默认值	可选值
show	是否显示模态框，请赋值给v-model	Boolean	false	true
z-index	层级	String | Number	1075	-
title	标题内容	String	提示	-
width	模态框宽度，数值时单位为rpx	String | Number	600	百分比 / auto
content	模态框内容，如传入slot内容，则此参数无效	String	内容	-
show-title	是否显示标题	Boolean	true	false
show-confirm-button	是否显示确认按钮	Boolean	true	false
show-cancel-button	是否显示取消按钮	Boolean	false	true
confirm-text	确认按钮的文字	String	确认	-
cancel-text	取消按钮的文字	String	取消	-
cancel-color	取消按钮的颜色	String	#606266	-
confirm-color	确认按钮的颜色	String	#2979ff	-
border-radius	模态框圆角值，单位rpx	String | Number	16	-
title-style	自定义标题样式，对象形式	Object	-	-
content-style	自定义内容样式，对象形式	Object	-	-
cancel-style	自定义取消按钮样式，对象形式	Object	-	-
confirm-style	自定义确认按钮样式，对象形式	Object	-	-
zoom	是否开启缩放模式	Boolean	true	false
async-close	是否异步关闭，只对确定按钮有效，见上方说明	Boolean	false	true
mask-close-able	是否允许点击遮罩关闭Modal	Boolean	false	true
negative-top	往上偏移的值，以避免可能弹出的键盘重合，单位任意，数值则默认为rpx单位	String | Number	0	-
Event
事件名	说明	回调参数
confirm	点击确认按钮时触发	-
cancel	点击取消按钮时触发	-
Method
此方法需要通过ref调用，详见上方的"异步关闭"

事件名	说明
clearLoading	异步控制时，通过调用此方法，可以不关闭Modal，而单是清除loading状态
Slots
名称	说明
default	传入自定义内容，一般为富文本，见上方说明
confirm-button	传入自定义按钮，用于在微信小程序弹窗通过按钮授权的场景

## FullScreen 压窗屏

所谓压窗屏，是指遮罩能盖住原生导航栏和底部tabbar栏的弹窗，一般用于在APP端弹出升级应用弹框，或者其他需要增强型弹窗的场景。

警告

由于uni-app的Bug，在最新版的HX2.8.6(包括之前的多个版本)，此功能(组件)无效，等到uni-app修复此Bug时，我们会撤销此通告。

提示

这里的做法是在本页面打开一个新页面，同时在pages.json中配置本页面的背景为百分百透明，这样即可达到压窗效果。
由于只有APP支持设置页面背景透明度，故只有APP支持本组件做法，非APP端不支持。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	x	x	x	x	x	x
基本使用
本组件只是提供参考思路和注意事项，因为每个人在弹窗需要实现的逻辑和样式都是不一样的，请参考本文档思路，自行实行相关功能。

首先，我们需要pages.json中声明一个页面用于弹窗：


// pages.json

"pages": [
	{
		"path": "uview-pro/components/u-full-screen/u-full-screen",
		"style": {
			"navigationStyle": "custom",  // 取消本页面的导航栏
			"app-plus": {
				"animationType": "fade-in", // 设置fade-in淡入动画，为最合理的动画类型
				"background": "transparent", // 背景透明
				"backgroundColor": "rgba(0,0,0,0)", // 背景透明
				"popGesture": "none" // 关闭IOS屏幕左边滑动关闭当前页面的功能
			}
		}
	}
]
通过上面的配置，我们得到了一个页面：

这个页面去掉了导航栏
页面进入的时候，是采用淡入动画的形式
并且此页面的背景是百分比透明度，这样可以看到底层页面的内容
移除在iOS上左滑手势，避免本页被左滑关闭
触发压窗屏
我们在父页面(当前页面)通过路由方法，打开一个新页面(上面配置的压窗屏页面)，由于它是一个普通的页面，故可以通过常规方法传递参数。


<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

// 页面加载时触发
onLoad(() => {
  // 也可以在onShow生命周期打开，此为uView封装的请求方法
  uni.$u.route("/uview-pro/components/u-full-screen/u-full-screen?id=1")
})
</script>
定义压窗屏内容
当我们触发(打开)了压窗屏页面之后，将会有一个新的，背景透明的页面覆盖在本页面上，由于我们的终极目标就是要做一个弹窗，让其遮罩盖住"父页面"的导航栏和 Tabbar栏，所以这里我们可以使用uView的Popup 弹出层组件，并且将popup组件的mode参数设置center，即中部弹出的形式。

下方示例为打开一个Modal 模态框组件的示例，此组件内部用的也是popup组件。


<template>
	<u-modal v-model="show" :show-cancel-button="true" confirm-text="升级"
		title="发现新版本" @cancel="cancel" @confirm="confirm"
	>
		<view class="u-update-content">
			<rich-text :nodes="content"></rich-text>
		</view>
	</u-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义响应式数据
const show = ref<boolean>(true)

// 传递给uni-app"rich-text"组件的内容，可以使用"<br>"进行换行
const content = ref<string>(`
	1. 修复badge组件的size参数无效问题<br>
	2. 新增Modal模态框组件<br>
	3. 新增压窗屏组件，可以在APP上以弹窗的形式遮盖导航栏和底部tabbar<br>
	4. 修复键盘组件在微信小程序上遮罩无效的问题
`)

// 页面准备完成时触发
onMounted(() => {
	show.value = true
})

// 定义事件处理函数
const cancel = () => {
	closeModal()
}

const confirm = () => {
	closeModal()
}

const closeModal = () => {
	uni.navigateBack()
}
</script>

<style scoped lang="scss">
.u-full-content {
	background-color: #00C777;
}

.u-update-content {
	font-size: 26rpx;
	color: $u-content-color;
	line-height: 1.7;
	padding: 30rpx;
}
</style>
上面有一个需要注意的点，我们打开"压窗"弹窗后，可能需要通过一些按钮来关闭弹窗，这里关闭弹窗的本质意义是关闭弹出的页面(压窗屏弹框)，所以用的是uni-app带的 关闭页面的接口uni.navigateBack()，见上方示例。

注意事项
由于压窗屏其实也是一个普通的页面的，当我们关闭弹窗(顶层页面)，"父页面"(上一个页面)就会显示出来，意味着会进入onShow生命周期，如有相关特定逻辑需要 处理，可关注此处。

由于弹窗打开的实际是一个页面，而不是一个组件，所以我们无法通过props的形式传递参数，有如下方式可以行进两个页面之间的通信：

父页面通过URL参数的形式将参数传递给弹窗
当弹窗内进行某些操作之后，可以通过uni.$emit的方式发送事件，父页面中通过uni.$on的形式接收事件和参数，达到通信的效果
通过Vuex的形式共享变量
