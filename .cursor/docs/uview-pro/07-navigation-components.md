# uViewPro 导航组件

## 目录
- [Dropdown 下拉菜单](#dropdown-下拉菜单)
- [Tabbar 底部导航栏](#tabbar-底部导航栏)
- [BackTop 返回顶部](#backtop-返回顶部)
- [Navbar 导航栏](#navbar-导航栏)
- [Tabs 标签](#tabs-标签)
- [TabsSwiper 全屏选项卡](#tabsswiper-全屏选项卡)
- [Subsection 分段器](#subsection-分段器)
- [IndexList 索引列表](#indexlist-索引列表)
- [Steps 步骤条](#steps-步骤条)
- [Empty 内容为空](#empty-内容为空)
- [Link 超链接](#link-超链接)
- [Section 查看更多](#section-查看更多)

## Dropdown 下拉菜单

该组件一般用于向下展开菜单，同时可切换多个选项卡的场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
使用前说明：

该组件必须结合u-dorpdown和u-dropdown-item一起使用，展开的内容由u-dropdown-item通过传递参数或者slot提供
组件的菜单栏标题由u-dropdown-item通过title参数提供
u-dropdown-item带有默认的单选展示功能，通过options(见下方说明)配置，传入slot则会覆盖默认功能，通过v-model双向绑定options选中项的value值

<template>
	<view class="">
		<u-dropdown>
			<u-dropdown-item v-model="value1" title="距离" :options="options1"></u-dropdown-item>
			<u-dropdown-item v-model="value2" title="温度" :options="options2"></u-dropdown-item>
		</u-dropdown>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const value1 = ref<number>(1)
const value2 = ref<number>(2)

// 定义选项数据
const options1 = ref<Array<{ label: string; value: number }>>([
  {
    label: '默认排序',
    value: 1,
  },
  {
    label: '距离优先',
    value: 2,
  },
  {
    label: '价格优先',
    value: 3,
  }
])

const options2 = ref<Array<{ label: string; value: number }>>([
  {
    label: '去冰',
    value: 1,
  },
  {
    label: '加冰',
    value: 2,
  },
])
</script>
配置选项卡默认功能
如上所示，u-dropdown-item具有默认的单选功能，这里主要讲解其options和v-model参数：

options参数为一个数组，元素为对象，其中label为需要展示的提示文字，value为点击时双向绑定给v-model的值，v-model初始化时如果设置 某个options中的value，则该条目将会被默认选中：


let options = [
	{
		label: '蜀道难',
		value: 1
	},
	{
		label: '难以上青天',
		value: 2
	}
]
配置选项卡自定义功能
在选项卡默认的单选功能无法满足的时候，我们可以给u-dropw-item传递slot来自定义需要展示的内容。

问：如果自定义内容，如何实现点击其中的按钮关闭下拉菜单？

答：在u-dropdown中，有一个close()方法，可以通过ref获取实例，并调用方法进行关闭即可。


<template>
	<view class="">
		<u-dropdown ref="uDropdownRef">
			<u-dropdown-item title="属性">
				<view class="slot-content">
					<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">其他自定义内容</view>
					<u-button type="primary" @click="closeDropdown">确定</u-button>
				</view>
			</u-dropdown-item>
		</u-dropdown>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 假设 u-dropdown 组件实例类型，实际使用时需要根据具体组件定义
const uDropdownRef = ref<any>(null)

const closeDropdown = () => {
	uDropdownRef.value.close()
}
</script>
配置选项卡内容可滚动
如果我们想给自定义内容的选项中局部内容可滚动，可以通过嵌入scroll-view元素实现，需要注意的是scroll-view必须声明高度才有效，大概如下：


<template>
	<view class="">
		<u-dropdown ref="uDropdownRef">
			<u-dropdown-item title="属性">
				<view class="slot-content" style="background-color: #FFFFFF;">
					<scroll-view scroll-y="true" style="height: 200rpx;">
						<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">无言独上西楼</view>
						<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">月如钩</view>
						<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">寂寞梧桐深院锁清秋</view>
						<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">剪不断</view>
						<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">理还乱</view>
						<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">是离愁</view>
						<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">别是一般滋味在心头</view>
					</scroll-view>
					<u-button type="primary" @click="closeDropdown">确定</u-button>
				</view>
			</u-dropdown-item>
		</u-dropdown>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 假设 u-dropdown 组件实例类型，实际使用时需要根据具体组件定义
const uDropdownRef = ref<any>(null)

const closeDropdown = () => {
	uDropdownRef.value.close()
}
</script>
如何保持菜单高亮
有时候，我们可能会希望下拉菜单收起之后，标题部分可以保持高亮，组件内部可以做到这样的要求，但是如果通过自定义slot传入了内容，那么组件就不知道 收起的时候，是否该保持菜单的高亮了，因为组件不知道您在自定义的内容中是否进行了"操作"，所以我们提供了一个手动通过ref设置的highlight(index)方法， 让您自主决定是否让某个菜单高亮，可以自行结合change(dropdown-item)、open(dropdown)、close(dropdown)事件进行组合操作。


<template>
	<view class="">
		<u-dropdown ref="uDropdownRef" @open="open" @close="close">
			<u-dropdown-item v-model="value1" title="距离" :options="options1" @change="change"></u-dropdown-item>
			<u-dropdown-item v-model="value2" title="温度" :options="options2"></u-dropdown-item>
		</u-dropdown>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const value1 = ref<number>(1)
const value2 = ref<number>(2)

// 定义选项数据
const options1 = ref<Array<{ label: string; value: number }>>([
	{
		label: '默认排序',
		value: 1,
	},
	{
		label: '距离优先',
		value: 2,
	}
])

const options2 = ref<Array<{ label: string; value: number }>>([
	{
		label: '去冰',
		value: 1,
	},
	{
		label: '加冰',
		value: 2,
	},
])

// 定义组件引用
const uDropdownRef = ref<any>(null)

// 定义事件处理函数
const open = (index: number) => {
	// 展开某个下来菜单时，先关闭原来的其他菜单的高亮
	// 同时内部会自动给当前展开项进行高亮
	uDropdownRef.value?.highlight()
}

const close = (index: number) => {
	// 关闭的时候，给当前项加上高亮
	// 当然，您也可以通过监听dropdown-item的@change事件进行处理
	uDropdownRef.value?.highlight(index)
}

const change = (value: any) => {
	// 更多的细节，如有需要请自行根据业务逻辑进行处理
	// uDropdownRef.value?.highlight(xxx)
}
</script>
兼容性
由于头条小程序的兼容性原因，如果u-dropdown父元素设置了display: flex，您可能需要给组件添加u-dropdown类，如下：

<u-dropdown class="u-dropdown"></u-dropdown>
API
Dropdown Props
参数	说明	类型	默认值	可选值
active-color	标题和选项卡选中的颜色	String	#2979ff	-
inactive-color	标题和选项卡未选中的颜色	String	#606266	-
close-on-click-mask	点击遮罩是否关闭菜单	Boolean	true	false
close-on-click-self	点击当前激活项标题是否关闭菜单	Boolean	true	false
duration	选项卡展开和收起的过渡时间，单位ms	String | Number	300	-
height	标题菜单的高度，单位任意，数值默认为rpx单位	String | Number	80	-
border-bottom	标题菜单是否显示下边框	Boolean	false	true
title-size	标题的字体大小，单位任意，数值默认为rpx单位	String | Number	28	-
border-radius	菜单展开内容下方的圆角值，单位任意	String | Number	0	-
menu-icon	标题菜单右侧的图标	String	arrow-down	arrow-down-fill
menu-icon-size	标题菜单右侧的图标的大小，单位任意，数值默认为rpx单位	String | Number	26	-
Dropdown Events
|事件名|说明|回调参数| |:-|:-|:-|:-| | open | 下拉菜单被打开时触发 | (index) - 当前被打开菜单的索引 | | close | 下拉菜单被关闭时触发 | (index) - 当前被关闭菜单的索引 |

Dropdown-item Props
参数	说明	类型	默认值	可选值
v-model	双向绑定选项卡选择值	String | Number	-	-
title	菜单项标题	String	-	-
options	选项数据，如果传入了默认slot，此参数无效，数据结构见上方说明	Array[Object]	-	-
disabled	是否禁用此选项卡	Boolean	false	true
height	弹窗下拉内容的高度(内容超出将会滚动)，slot自定义内容时无效(自行使用scroll-view处理)，单位任意，默认rpx	String | Number	auto	-
Dropdown-item Slot
名称	说明
-	自定义选项卡内容
Dropdown-item Events
事件名	说明	回调参数
change	每个u-dropdown均有此回调，点击某个options选项时触发	(value) - 点击项绑定的value属性值
Dropdown-item Methods
这些为组件内部的方法，需要通过ref调用

参数	说明
highlight(index)	index为需要设置高亮的菜单项的索引(从0开始)，不写表示清空内部的高亮

## Tabbar 底部导航栏

优点：
此组件一般用于应用的底部导航，具有如下特点：

可以设置凸起的按钮，且是全端通用的
图标可以使用字体图标(内置图标和扩展图标)或者图片
可以动态切换菜单的数量以及配置
切换菜单之前，可以进行回调鉴权
可以设置角标
有效防止组件区域高度塌陷，无需给父元素额外的内边距或者外边距来避开导航的区域
缺点：
虽然优点很多，但是如果用此组件模拟 tabbar 页面的话依然是瑜不掩瑕的，因为它同样带来很多难以解决的缺点：

首先是性能问题，在 uni-app 的 vue 版本上，自定义 tabbar 让您不得不在一个 webview 内模拟出多个页面，这存在严重的性能问题
相比原生的 uni-app 的 tabbar，自定义 tabbar 让你失去了路由管理的功能
渲染的速度比不上原生的 tabbar，但是这影响不大
提示

以上的缺点，是指自定义模拟 tabbar 页面的情形，我们提供了一个解决方案，可以使用 uni-app 自带 tabbar 系统，保证性能的同时，又能尽情自定义 tabbar 导航栏，见下方实战教程说明。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ 小程序
√	√	√	√	√	√	√
基本使用
在使用的时候，需要注意组件的位置，要将它放在和页面包裹所有内容的元素同级的位置，否则可能会造成组件的高度塌陷，有如下几个需要注意的点：

通过list参数配置每一个 item 的参数
如果需要配置凸起的按钮，这个按钮的配置需要在list数组的中间位置，同时需要配置mid-button参数为true
将组件放在和页面包裹所有内容的元素同级的位置
通过v-model绑定一个数值变量，用于指示当前激活项的索引
下面解释list数组中元素参数的作用：


let list = [
  {
    // 非凸起按钮未激活的图标，可以是uView内置图标名或自定义扩展图标库的图标
    // 或者png图标的【绝对路径】，建议尺寸为80px * 80px
    // 如果是中间凸起的按钮，只能使用图片，且建议为120px * 120px的png图片
    iconPath: "home",
    // 激活(选中)的图标，同上
    selectedIconPath: "home-fill",
    // 显示的提示文字
    text: "首页",
    // 红色角标显示的数字，如果需要移除角标，配置此参数为0即可
    count: 2,
    // 如果配置此值为true，那么角标将会以红点的形式显示
    isDot: true,
    // 如果使用自定义扩展的图标库字体，需配置此值为true
    // 自定义字体图标库教程：https://uviewpro.cn/zh/guide/customIcon.html
    customIcon: false,
    // 如果是凸起按钮项，需配置此值为true
    midButton: false,
    // 点击某一个item时，跳转的路径，此路径必须是pagees.json中tabBar字段中定义的路径
    pagePath: "", // 1.5.6新增，路径需要以"/"开头
  },
];
示例代码

<template>
  <view>
    <view class="u-page">
      <!-- 所有内容的容器 -->
    </view>
    <!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
    <u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义Tabbar项接口
interface TabbarItem {
  iconPath: string
  selectedIconPath: string
  text: string
  count?: number
  isDot?: boolean
  customIcon: boolean
  midButton?: boolean
}

// 定义响应式数据
const list = ref<TabbarItem[]>([
  {
    iconPath: "home",
    selectedIconPath: "home-fill",
    text: "首页",
    count: 2,
    isDot: true,
    customIcon: false,
  },
  {
    iconPath: "photo",
    selectedIconPath: "photo-fill",
    text: "放映厅",
    customIcon: false,
  },
  {
    iconPath: "https://ik.imagekit.io/anyup/uview-pro/logo/default.png",
    selectedIconPath: "https://ik.imagekit.io/anyup/uview-pro/logo/default.png",
    text: "发布",
    midButton: true,
    customIcon: false,
  },
  {
    iconPath: "play-right",
    selectedIconPath: "play-right-fill",
    text: "直播",
    customIcon: false,
  },
  {
    iconPath: "account",
    selectedIconPath: "account-fill",
    text: "我的",
    count: 23,
    isDot: false,
    customIcon: false,
  },
])

const current = ref<number>(0)
</script>
外观配置
可以通过以下参数，进行组件的整体外观配置

height配置导航栏高度，建议使用默认值即可，默认为50px，与 uni-app 自带系统导航栏高度一致
bg-color组件的背景颜色
active-color与inactive-color配置提示文字和图标的颜色(如果是字体图标的话)，可以搭配bg-color达到自定义导航栏主题的效果
切换前的回调
在点击切换之前，如果配置了before-switch参数并绑定的是一个方法的话，将会抛出点击项的索引，并执行此方法。

此回调可以返回一个promise、true，或者false，下面分别阐述三者的处理情况：

false——如果返回false，将不会切换tab项
true——如果返回true，将会切换tab项
promise——如果返回的是一个promise，如果进入then回调，就会和返回true的情况一样，如果进入catch回调，就会和返回false的情况一样
下面举例说明：

由于篇幅问题，以下示例可不直接运行，仅作举例作用。

1. 普通返回

<template>
  <u-tabbar :before-switch="beforeSwitch"></u-tabbar>
</template>

<script setup lang="ts">
// 定义切换前的回调函数
const beforeSwitch = (index: number): boolean => {
  // 只能切换偶数项
  if (index % 2 == 0) return true;
  else return false;
}
</script>
2. 请求之后再返回

<template>
  <u-tabbar :before-switch="beforeSwitch"></u-tabbar>
</template>

<script setup lang="ts">
// 定义切换前的异步回调函数
const beforeSwitch = async (index: number): Promise<boolean> => {
  // await等待一个请求，请求回来后再返回true，再进行切换
  // let data = await uni.$u.post("url");
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true; // 或者根据逻辑返回false
}
</script>
3. 返回一个 Promise

<template>
  <u-tabbar :before-switch="beforeSwitch"></u-tabbar>
</template>

<script setup lang="ts">
// 定义切换前返回Promise的回调函数
const beforeSwitch = (index: number): Promise<void> => {
  // 返回一个promise
  return new Promise((resolve, reject) => {
    // 模拟异步请求
    setTimeout(() => {
      // 模拟请求成功的情况
      const success = Math.random() > 0.5; // 50%概率成功
      
      if (success) {
        // resolve()之后，将会进入promise的组件内部的then回调，相当于返回true
        resolve();
      } else {
        // reject()之后，将会进入promise的组件内部的catch回调，相当于返回false
        reject();
      }
    }, 1000);
  });
}
</script>
边框
组件默认带了顶部边框，如果有配置中部凸起按钮的话，此按钮同时也会有外层边框，如果不需要，配置border-top为false即可。

实战教程
自定义 tabbar 场景，我们不建议在一个页面内通过几个组件，用v-if切换去模拟各个页面，而应该使用 uni-app 自带的 tabbar 系统，同时隐藏原生的 tabbar， 再引入自定导航栏，这样可以保证原有性能，同时又能自定义 tabbar，思路如下：

在 pages.json 中正常定义 tabbar 逻辑和字段，只需配置tabBar字段list中的pagePath(需以"/"开头)属性即可
在各个 tabbar 页面引入u-tabbar组件，组件会默认自动通过uni.hideTabBar()隐藏系统 tabbar
通过vuex引用同一份 tabbar 组件的list参数，这样可以做到修改某一个页面的u-tabbar数据，其他页面的u-tabbar也能同步更新
组件内部会自动处理各种跳转的逻辑，同时需要注意以下两点：
要在list参数中配置pagePath路径，此路径为pages.json中定义的 tabbar 字段的路径
此种方式，无需通过v-model绑定活动项，内部会自动进行判断和跳转
我们为此做了一个演示demo，您可以在下载页找到对应的资源，下载运行即可，点此跳转下载页

API
Table Props
参数	说明	类型	默认值	可选值
list	各项的配置参数，见顶部说明，数组形式	Array	-	-
show	是否显示组件	Boolean	true	false
v-model	双向绑定的激活项的索引值	String | Number	0	-
bg-color	组件的背景颜色	String	#ffffff	-
height	高度，单位任意，数值则为 rpx 单位，不建议修改	String | Number	50px	-
icon-size	非中部凸起图标的大小，单位任意，数值则为 rpx 单位	String | Number	40	-
mid-button-size	凸起的图标的大小，单位任意，数值则为 rpx 单位	String | Number	90	-
active-color	文字和字体图标激活时的颜色	String	#303133	-
inactive-color	文字和字体图标未激活时的颜色	String	#606266	-
mid-button	是否需要中部凸起的按钮，配置了此值，依然需要配置list参数中需凸起项的midButton为true，见上方说明	Boolean	false	true
before-switch	切换之前的回调钩子，见上方说明	Function	-	-
border-top	是否显示顶部的边框	Boolean	true	false
hide-tab-bar	是否隐藏原生 tabbar	Boolean	true	false
Events
事件名	说明	回调参数
change	切换选项时触发	index：当前要切换项的索引

## BackTop 返回顶部

该组件一个用于长页面，滑动一定距离后，出现返回顶部按钮，方便快速返回顶部的场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
由于返回顶部需要实时监听滚动条的位置，从而判断返回的按钮该出现还是隐藏，由于组件无法得知页面的滚动条信息，只能在页面的onPageScroll生命周期 中获得滚动条的位置，故需要在页面监听onPageScroll生命周期，实时获得滚动条的位置，通过Props传递给组件。


<template>
	<view class="wrap">
		<text>滑动页面，返回顶部按钮将出现在右下角</text>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)

// 页面滚动事件处理
onPageScroll: function(e) {
	console.log("滚动距离为：" + e.scrollTop);
	scrollTop.value = e.scrollTop
}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 200vh;
	}
</style>
改变返回顶部按钮的出现时机
可以通过top参数，修改页面滚动多少距离时，出现返回顶部的按钮


<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
自定义返回顶部的图标和提示
通过icon修改返回顶部按钮的图标，可以是uView内置的图标，或者图片路径
通过tips参数修改返回顶部按钮的文字提示信息，如果需要修改文字的颜色和大小，可以通过custom-style参数

<u-back-top :scroll-top="scrollTop" icon="arrow-up" tips="返回"></u-back-top>
其他自定义样式
通过icon-style参数自定义图标的样式，比如颜色，大小等
通过custom-style修改返回按钮的背景颜色，大小等
通过mode修改按钮的形状，circle为圆形，square为方形
注意：如果通过icon参数传入图片路径的话，需要通过icon-style参数设置图片的width和height属性


<template>
	<view class="wrap">
		<text>滑动页面，返回顶部按钮将出现在右下角</text>
		<u-back-top :scrollTop="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const scrollTop = ref(0)
const mode = ref('square')
const iconStyle = reactive({
	fontSize: '32rpx',
	color: '#2979ff'
})

// 页面滚动事件处理
onPageScroll: function(e) => {
	scrollTop.value = e.scrollTop
}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 200vh;
	}
</style>
API
Props
参数	说明	类型	默认值	可选值
mode	按钮形状	String	circle	square
icon	uView内置图标名称，或图片路径	String	arrow-upward	-
tips	返回顶部按钮的提示文字	String	-	-
duration	返回顶部过程中的过渡时间，单位ms	String | Number	100	-
scroll-top	页面的滚动距离，通过onPageScroll生命周期获取	String | Number	0	-
top	滚动条滑动多少距离时显示，单位rpx	String | Number	400	-
bottom	返回按钮位置到屏幕底部的距离，单位rpx	String | Number	200	-
right	返回按钮位置到屏幕右边的距离，单位rpx	String | Number	40	-
z-index	返回顶部按钮的层级	String | Number	9	-
icon-style	图标的样式，对象形式	Object	-	-
Slot
名称	说明
-	自定义返回按钮的所有内容

## Navbar 导航栏

此组件一般用于在特殊情况下，需要自定义导航栏的时候用到，一般建议使用 uni-app 带的导航栏。

提示

右侧的演示中，导航栏上方有圆角，也有顶部的手机模型状态栏内容，以及返回图标和文字不对齐的情况。这是因为网页演示导致，实际中无此情况，请通过右上角的“演示”扫码查看实际效果。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ 小程序
√	√	√	√	√	√	√
基本使用
默认情况下，该组件只有向左的箭头，点击可以返回上一页，如果您想将自定义导航栏用在 tabbar(不存在要返回的逻辑)页面，应该将is-back设置为false， 这样会隐藏左边的返回图标区域。

如果想在返回箭头的右边自定义类似"返回"字样，可以将back-text设置为"返回"，前提是is-back要为true(默认)
通过title参数传入需要显示的标题，通过title-width(rpx)设置标题区域的宽度，文字超出会通过省略号隐藏
通过is-fixed配置是否将导航栏固定在顶部
说明

在小程序中，导航栏会自动适配导航栏右侧的胶囊位置，避开该区域
组件底部默认有一条下边框，如您不需要，可以设置border-bottom为false即可

<template>
  <view>
    <u-navbar back-text="返回" title="剑未配妥，出门已是江湖"></u-navbar>
    <view class="content">
      <!-- 正文内容 -->
    </view>
  </view>
</template>
注意事项
既然是要自定义导航栏，那么首先就要取消系统自带的导航栏，需要在 uni-app 目的根目录的"pages.json"中设置，同时在此设置状态栏字体的颜色(H5 无效)， 自定义导航栏后，如果想通过"uni.setNavigationBarColor"动态设置导航栏颜色相关参数，是可能会出问题的，请勿使用此方式。


// pages.json

"pages": [
	// navbar-自定义导航栏
	{
		"path": "/pages/navbar/index",
		"style": {
			"navigationStyle": "custom" ,// 隐藏系统导航栏
			"navigationBarTextStyle": "white" // 状态栏字体为白色，只能为 white-白色，black-黑色 二选一
		}
	}
]
导航栏高度
可以通过height(单位px，默认 44，和 uni-app 统导航栏高度一致)配置导航栏的高度，此高度为导航栏内容的高度，不含状态栏的高度，组件内部会自动 加上状态栏的高度，并填充状态栏的占位区域。

注意上方说的 uni-app 方的高度，这里指的是 H5，和 APP。至于各家小程序，由于受导航栏右侧胶囊的影响，目前组件内部给安卓设定的导航栏高度为48px，iOS 设定的导航栏高度为44，这是结合了大量的 实践的出来的结果，具备完好的兼容性。

自定义导航栏内容
一般需要自定义导航栏内部的内容的时候，分几种情况：

is-back为false可以去除导航栏左侧默认的返回图标和文字。
如有必要，将title设置空字符串，同时将会去除导航栏中间显示标题的占位区域。
当将is-back设置为false，title设置为空字符串之后，导航栏将不会有任何默认的内容，您可以通过slot传入任意自定义内容，在 APP 和小程序上，导航栏 会自动添加状态栏的占位区域。

注意： 通过自定义slot传入的内容，为了能在导航栏中垂直居中，您可能需要注意下方示例的 css 的slot-wrap类的内容：


<template>
  <view>
    <u-navbar :is-back="false" title="">
      <view class="slot-wrap"> ...... </view>
    </u-navbar>
    <view class="content">
      <!-- 正文内容 -->
    </view>
  </view>
</template>

<style scoped lang="scss">
  .slot-wrap {
    display: flex;
    align-items: center;
    /* 如果您想让slot内容占满整个导航栏的宽度 */
    /* flex: 1; */
    /* 如果您想让slot内容与导航栏左右有空隙 */
    /* padding: 0 30rpx; */
  }
</style>
自定义导航栏背景颜色
uView 提供了一个background参数(需对象形式)，可以自定义导航栏的背景颜色：

这个颜色，在 APP 和小程序上，包括状态的颜色在内
如果是定义纯色的背景，可以设置backgroundColor属性
如果是定义渐变的背景，可以设置backgroundImage属性
如果是定义背景图，可以设置background属性，还可以加上其他属性，比如no-repeat，center等

<template>
  <view>
    <u-navbar :is-back="false" title="" :background="background"> </u-navbar>
    <view class="content">
      <!-- 正文内容 -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// 定义响应式背景数据
const background = reactive({
  backgroundColor: "#001f3f",

  // 导航栏背景图
  // background: 'url(https://cdn.uviewpro.cn/uview/xxx.jpg) no-repeat',
  // 还可以设置背景图size属性
  // backgroundSize: 'cover',

  // 渐变色
  // backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
})
</script>
API
Props
参数	说明	类型	默认值	可选值
height	导航栏高度(不包括状态栏高度在内，内部自动加上)，注意这里的单位是px	String | Number	44	-
back-icon-color	左边返回图标的颜色	String	#606266	-
back-icon-name	左边返回图标的名称，只能为 uView 自带的图标，1.5.5起由 arrow-left 调整为 nav-back	String	nav-back	-
back-icon-size	左边返回图标的大小，单位 rpx	String | Number	30	-
back-text	返回图标右边的辅助提示文字	String	-	-
back-text-style	返回图标右边的辅助提示文字的样式，对象形式	Object		-
title	导航栏标题，如设置为空字符，将会隐藏标题占位区域	String	-	-
title-width	导航栏标题的最大宽度，内容超出会以省略号隐藏，单位 rpx	String | Number	250	-
title-color	标题的颜色	String	#606266	-
title-size	导航栏标题字体大小，单位 rpx，1.5.5起由 32 调整为 44	String | Number	44	-
z-index	固定在顶部时的z-index值	String | Number	980	-
is-back	是否显示导航栏左边返回图标和辅助文字	Boolean	true	false
background	导航栏背景设置(APP 和小程序上包括状态栏的颜色)，见上方说明	Object		-
is-fixed	导航栏是否固定在顶部	Boolean	true	false
border-bottom	导航栏底部是否显示下边框，如定义了较深的背景颜色，可取消此值	Boolean	true	false
custom-back	自定义返回逻辑方法，如传入，点击返回按钮执行函数，否则正常返回上一页，注意模板中不需要写方法参数的括号	Function	-	-
immersive	沉浸式，允许 fixed 定位后导航栏塌陷，仅 fixed 定位下生效	Boolean	false	true
title-bold	导航栏标题字体是否加粗	Boolean	false	true
Slot
名称	说明
-	自定义中间部分的内容
right	自定义右侧部分内容

## Tabs 标签

该组件，是一个tabs标签组件，在标签多的时候，可以配置为左右滑动，标签少的时候，可以禁止滑动。 该组件的一个特点是配置为滚动模式时，激活的tab会自动移动到组件的中间位置。

uView中，共有2个组件可以实现tabs标签切换，分别是tabs组件，tabsSwiper组件，他们的异同点是：

tabs组件可以不结合uni-appswiper轮播组件使用，tabsSwiper组件是必须要结uni-appswiper轮播组件才能使用的。
tabs组件使用更简洁明了(这也是其存在的理由)，tabsSwiper组件配置相对复杂一些。
tabsSwiper组件相比tabs组件，由于搭配了uni-appswiper轮播组件，获得了滑块跟随，标签颜色渐变等效果(请在演示中扫码查看效果)，而tabs组件是不具备的。
总的来说，二者配置参数和功能都差不多，看用户的需求自行衡量该使用哪一个组件。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过设置is-scroll(默认为true)，配置tabs组件的内容是否可以左右拖动，一般4个标签以下时，无需拖动，设置为false，5个标签以上，建议可以左右拖动。
tabs标签的切换，需要绑定current值，在change事件回调中可以得到index，将其赋值给current即可。
具体的标签，通过list参数配置，该参数要求为数组，元素为对象，对象要有name属性，见示例：

说明

is-scroll参数很重要，如果您的tabs项只有几个，且不想tabs导航栏可以被左右滑动的话，请一定要设置is-scroll为false，因为它默认为true。


<template>
	<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义Tab项接口
interface TabItem {
	name: string
	count?: number
}

// 定义响应式数据
const list = ref<TabItem[]>([
	{
		name: '待收货'
	}, {
		name: '待付款'
	}, {
		name: '待评价',
		count: 5
	}
])

const current = ref<number>(0)

// 定义change事件回调函数
const change = (index: number) => {
	current.value = index
}
</script>
控制组件读取的数组元素属性名
某些情况下，数据可能是从后端获取的，list所需的数组中不一定会有name属性，比如可能为cate_name，如果这种情况还需一定要提供name属性 会导致用户需要循环一遍，把cate_name改成name，显然不人性的，所以uView给tabsSwiper组件提供了一个name参数，您可以设置其值为cate_name，组件内部会读取数组中的cate_name属性，而不是默认的name属性。

新增的count属性，您可以设置其值为cate_count，组件内部会读取数组中的cate_count属性，而不是默认的count属性。


<template>
	<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义Tab项接口
interface TabItem {
	name: string
	count?: number
}

// 定义响应式数据
const list = ref<TabItem[]>([
	{
		name: '待收货'
	}, {
		name: '待付款'
	}, {
		name: '待评价',
		count: 5
	}
])

const current = ref<number>(0)

// 定义change事件回调函数
const change = (index: number) => {
	current.value = index
}
</script>
手动配置激活的标签
可以通过current控制tabs当前的第几个tab处于激活状态


<u-tabs ref="uTabsRef" :list="list" current="2"></u-tabs>
控制tabs组件的宽度
有时候我们并不想让tabs组件占满整个屏幕的宽度，如果有此需求，可以给tabs外面嵌套一个view元素，控制这个view的宽度或者内外边距，view里面的tabs组件 宽度也会相应的发生变化。


<view style="width: 400rpx;">
	<u-tabs ref="uTabsRef" :list="list" current="2"></u-tabs>
</view>
控制底部滑块的样式
可以通过active-color控制颜色(同时为当前活动tab文字颜色和滑块的颜色)。
bar-width控制滑块的长度(rpx)。
bar-height控制滑块高度。

<u-tabs ref="uTabsRef" :list="list" bar-height="6" bar-width="40" active-color="#2979ff"></u-tabs>
控制tabs组件的活动tab样式
通过active-color和inactive-color控制tabs的激活和非激活颜色。
font-size为tabs文字大小。
current为初始化tabs的激活tab索引，默认为0。gutter为单个tab标签的左右内边距之和，即左右各占gutter的一半。

<u-tabs ref="uTabsRef" :list="list" active-color="#2979ff" inactive-color="#606266" font-size="30" :current="current"></u-tabs>
API
Props
参数	说明	类型	默认值	可选值
is-scroll	tabs是否可以左右拖动	Boolean	true	false
list	标签数组，元素为对象，如[{name: '推荐'}]	Array	-	-
current	指定哪个tab为激活状态	String | Number	0，即list的第一项	-
height	导航栏的高度，单位rpx	String | Number	80	-
font-size	tab文字大小，单位rpx	String | Number	30	-
duration	滑块移动一次所需的时间，单位秒	String | Number	0.5	-
active-color	滑块和激活tab文字的颜色	String	#2979ff	-
inactive-color	tabs文字颜色	String	#303133	-
bar-width	滑块宽度，单位rpx	String | Number	40	-
bar-height	滑块高度，单位rpx	String | Number	6	-
gutter	单个tab标签的左右内边距之和，单位rpx	String | Number	40	-
bg-color	tabs导航栏的背景颜色	string	#ffffff	-
name	组件内部读取的list参数中的属性名（tab名称），见上方说明	string	name	-
bold	激活选项的字体是否加粗	Boolean	true	false
show-bar	是否显示底部的滑块	Boolean	true	false
bar-style	底部滑块的样式，对象形式	Object	{}	-
active-item-style	当前活动Item的样式，对象形式	Object	{}	-
item-width	标签的宽度，单位rpx	String | Number	auto	-
count	组件内部读取的list参数中的属性名（badge徽标数），用法与name一致，见上方说明	string	count	-
offset	设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，单位rpx。	Array	[5, 20]	-
Events
事件名	说明	回调参数	版本
change	点击标签时触发	index: 点击了第几个tab，索引从0开始	-

## TabsSwiper 全屏选项卡

该组件内部实现主要依托于uni-appscroll-view和swiper组件，主要特色是切换过程中，tabsSwiper文字的颜色可以渐变，底部滑块可以 跟随式滑动，活动tab滚动居中等。应用场景可以用于需要左右切换页面，比如商城的订单中心(待收货-待付款-待评价-已退货)等应用场景。

uView中，共有2个组件可以实现tabs标签切换，分别是tabs组件，tabsSwiper组件，他们的异同点是：

tabs组件可以不结合uni-appswiper轮播组件使用，tabsSwiper组件是必须要结uni-appswiper轮播组件才能使用的。
tabs组件使用更简洁明了(这也是其存在的理由)，tabsSwiper组件配置相对复杂一些。
tabsSwiper组件相比tabs组件，由于搭配了uni-appswiper轮播组件，获得了滑块跟随，标签颜色渐变等效果(请在演示中扫码查看效果)，而tabs组件是不具备的。
总的来说，二者配置参数和功能都差不多，看用户的需求自行衡量该使用哪一个组件。


注意

由于支付宝小程序不支持uni的swiper组件transition事件的dx参数，故此组件不支持支付宝小程序
此组件目前为uView的vue版本，非nvue版本(制作中)，内部使用uni-appswiper组件为基础，swiper是单页组件， 适合做简单列表左右滑动，因为性能问题，用swiper做复杂长列表，需要较高的优化技巧以及接受一些限制。如果要实现类似腾讯新闻APP首页可以左右 滑动复杂的多个tab切换，不建议使用本组件，如果使用，请自行测试列表很长时的切换流畅度。后续uView会对nvue进行兼容，增强此组件在APP上的能力。
官方有一个nvue新闻模板示例，内有左右滑动tab功能，具体参考：
插件市场新闻模板示例
平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	x	√	√	√
基本使用
通过设置is-scroll(默认为true)，配置tabsSwiper组件的内容是否可以左右拖动，一般4个标签以下时，无需拖动，设置为false，5个标签以上，建议可以左右拖动。 具体的标签，通过list参数配置，该参数要求为数组，元素为对象，对象要有name属性，见示例：

说明

is-scroll参数很重要，如果您的tabs项只有几个，且不想tabs导航栏可以被左右滑动的话，请一定要设置is-scroll为false，因为它默认为true。


<template>
	<u-tabs-swiper ref="uTabsSwiperRef" :list="list" :is-scroll="false"></u-tabs-swiper>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义Tab项接口
interface TabItem {
	name: string
	count?: number
}

// 定义响应式数据
const list = ref<TabItem[]>([
	{
		name: '待收货'
	}, {
		name: '待付款'
	}, {
		name: '待评价',
		count: 5
	}
])
</script>
控制组件读取的数组元素属性名
某些情况下，数据可能是从后端获取的，list所需的数组中不一定会有name属性，比如可能为cate_name，如果这种情况还需一定要提供name属性 会导致用户需要循环一遍，把cate_name改成name，显然不人性的，所以uView给tabsSwiper组件提供了一个name参数，您可以设置其值为cate_name，组件内部 会读取数组中的cate_name属性，而不是默认的name属性。

同理，count属性，您可以设置其值为cate_count，组件内部会读取数组中的cate_count属性，而不是默认的count属性。


<template>
  <u-tabs-swiper
    ref="uTabsSwiperRef"
    name="cate_name"
    count="cate_count"
    :list="list"
    :is-scroll="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CateTab {
  cate_name: string
  cate_count?: number
}

const list = ref<CateTab[]>([
  { cate_name: '待收货' },
  { cate_name: '待付款' },
  { cate_name: '待评价', cate_count: 5 }
])
</script>
控制底部滑块的样式
可以通过active-color控制颜色(同时为当前活动tab文字颜色和滑块的颜色)。
bar-width控制滑块的长度(rpx)。
bar-height控制滑块高度。

<u-tabs-swiper ref="uTabsSwiperRef" :list="list" bar-height="6" bar-width="40" active-color="#2979ff"></u-tabs-swiper>
控制tabsSwiper组件的活动tab样式
通过active-color和inactive-color控制tabsSwiper的激活和非激活颜色。
font-size为tabsSwiper文字大小。
current为初始化tabsSwiper的激活tab索引，默认为0。gutter为单个tab标签的左右内边距之和，即左右各占gutter的一半。

<u-tabs-swiper ref="uTabsSwiperRef" :list="list" active-color="#2979ff" inactive-color="#606266" font-size="30" current="0"></u-tabs-swiper>
使用案例
该组件必须搭配uni-appswiper组件才能使用，可以实现左右滑动，同时还可以搭配uView的loadmore实现底部加载更多的功能，注意：

必须要给组件设置ref属性，因为结合uni的swiper组件时需要调用tabsSwiper内部的方法，详见示例。
本示例中在swiper-item中嵌套了可选的uni-appscroll-view组件，uni官方不建议在APP-vue和小程序中scroll-view中使用map、video等原生组件，
必须将组件的current参数，设置为animationfinish中的返回值。
具体请参考：uni的scroll-view组件文档

注意：由于tabsSwiper组件需要结合uni的swiper组件使用，过程较为复杂，故此示例代码仅作参考使用，请勿直接复制粘贴使用， 具体使用方法请下载查阅uView的tabsSwiper案例。


<template>
  <view>
    <view>
      <u-tabs-swiper
        ref="uTabsRef"
        :list="list"
        :current="current"
        @change="tabsChange"
        :is-scroll="false"
        swiperWidth="750"
      ></u-tabs-swiper>
    </view>
    <swiper
      :current="swiperCurrent"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in list"
        :key="index"
      >
        <scroll-view
          scroll-y
          style="height: 800rpx;width: 100%;"
          @scrolltolower="onreachBottom"
        >
          ...
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TabItem {
  name: string
}

const list = ref<TabItem[]>([
  { name: '十年' },
  { name: '青春' },
  { name: '之约' }
])

// tabs组件的current值，表示当前活动的tab选项
const current = ref(0)
// swiper组件的current值，表示当前那个swiper-item是活动的
const swiperCurrent = ref(0)
const uTabsRef = ref()

function tabsChange(index: number) {
  swiperCurrent.value = index
}

function transition(e: any) {
  const dx = e.detail.dx
  uTabsRef.value?.setDx(dx)
}

// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
// swiper滑动结束，分别设置tabs和swiper的状态
function animationfinish(e: any) {
  const curr = e.detail.current
  uTabsRef.value?.setFinishCurrent(curr)
  swiperCurrent.value = curr
  current.value = curr
}

function onreachBottom() {
  // scroll-view到底部加载更多
}
</script>
API
Props
参数	说明	类型	默认值	可选值
is-scroll	tabs是否可以左右拖动	Boolean	true	false
list	标签数组，元素为对象，如[{name: '推荐'}]	Array	-	-
current	指定哪个tab为激活状态	String | Number	0，即list的第一项	-
height	导航栏的高度，单位rpx	String | Number	80	-
font-size	tab文字大小，单位rpx	String | Number	30	-
swiper-width	tabs组件外部swiper的宽度，默认为屏幕宽度，单位rpx	string | Number	750	-
active-color	滑块和激活tab文字的颜色	String	#2979ff	-
inactive-color	tabs文字颜色	String	#303133	-
bar-width	滑块宽度，单位rpx	String | Number	40	-
bar-height	滑块高度，单位rpx	String | Number	6	-
gutter	单个tab标签的左右内边距之和，单位rpx	String | Number	40	-
bg-color	tabs导航栏的背景颜色	string	#ffffff	-
name	组件内部读取的list参数中的属性名（tab名称），见上方说明	string	name	-
bold	激活选项的字体是否加粗	Boolean	true	false
show-bar	是否显示底部的滑块	Boolean	true	false
bar-style	底部滑块的样式，对象形式	Object	{}	-
active-item-style	当前活动Item的样式，对象形式	Object	{}	-
count	组件内部读取的list参数中的属性名（badge徽标数），用法与name一致，见上方说明	string	count	-
offset	设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，单位rpx。	Array	[5, 20]	-
Events
事件名	说明	回调参数	版本
change	点击标签时触发	index: 点击了第几个tab，索引从0开始	-

## Subsection 分段器
该分段器一般用于用户从几个选项中选择某一个的场景

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过list数组参数传递分段的选项
通过current指定初始化时激活的选项

<template>
	<u-subsection :list="list" :current="1"></u-subsection>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义分段器选项接口
interface SubsectionItem {
	name: string
}

// 定义响应式数据
const list = ref<SubsectionItem[]>([
	{
		name: '待发货'
	}, 
	{
		name: '待付款'
	}, 
	{
		name: '待评价'
	}
])

// 定义当前选中索引
const current = ref<number>(1)
</script>
模式选择
通过mode设置分段器的模式

值为button时为按钮类型
值为subsection时为分段器形式

<u-subsection :list="list" :current="1"></u-subsection>
是否开启动画效果
animation(默认为true)设置为true的话，分段器的三种模式滑块移动时都会有动画效果


<u-subsection :animation="true"></u-subsection>
颜色配置
通过active-color配置激活选项的文字颜色，mode为subsection时无效，此时默认为白色：
通过bgColor配置背景颜色
通过buttonColor配置按钮颜色，mode为button时有效

<u-subsection active-color="#ff9900"></u-subsection>
注意事项
如果想通过一个变量绑定current值，需要在change事件回调中修改此值，否则可能会由于props的限制，前后两次设置current为相同的值， 而导致无法通过修改current值触发分段器的变化。


<template>
	<view>
		<u-subsection :list="list" :current="curNow" @change="sectionChange"></u-subsection>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义分段器选项接口
interface SubsectionItem {
	name: string
}

// 定义响应式数据
const list = ref<SubsectionItem[]>([
	{
		name: '待发货'
	}, 
	{
		name: '待付款'
	}, 
	{
		name: '待评价'
	}
])

const curNow = ref<number>(0)

// 定义分段器变化回调函数
const sectionChange = (index: number) => {
	curNow.value = index
}
</script>
API
Props
参数	说明	类型	默认值	可选值
list	选项的数组，形式见上方"基本使用"	Array	-	-
current	初始化时默认选中的选项索引值	String | Number	0	-
active-color	激活时的颜色	String	#303133	-
inactive-color	未激活时的颜色	String	#606266	-
mode	模式选择，见上方"模式选择"说明	String	button	subsection
font-size	字体大小，单位rpx	String | Number	28	-
height	组件高度，单位rpx	String | Number	70	-
animation	是否开启动画效果，见上方说明	Boolean	true	false
bold	激活选项的字体是否加粗	Boolean	true	false
bg-color	组件背景颜色，mode为button时有效	String	#eeeeef	-
button-color	按钮背景颜色，mode为button时有效	String	#ffffff	-
Events
事件名	说明	回调参数
change	分段器选项发生改变时触发	index：选项的index索引值，从0开始

## IndexList 索引列表
通过折叠面板收纳内容区域

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
外层包裹一个index-list组件，内部锚点通过index-anchor组件传入，其余内容可以自定义

可以通过index-list参数自定义索引字符列表
需要监听页面的onPageScroll事件，将当前滚动条高度传入index-list组件

<template>
	<u-index-list :scrollTop="scrollTop">
		<view v-for="(item, index) in indexList" :key="index">
			<u-index-anchor :index="item" />
			<view class="list-cell">
				列表1
			</view>
			<view class="list-cell">
				列表2
			</view>
			<view class="list-cell">
				列表3
			</view>
		</view>
	</u-index-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

// 定义响应式数据
const scrollTop = ref<number>(0)
const indexList = ref<Array<string>>([
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
	"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
])

// 页面滚动事件处理
onPageScroll((e) => {
	scrollTop.value = e.scrollTop
})
</script>

<style lang="scss" scoped>
.list-cell {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 10px 24rpx;
	overflow: hidden;
	color: #323233;
	font-size: 14px;
	line-height: 24px;
	background-color: #fff;
}
</style>
自定义锚点样式
index-anchor锚点组件默认显示index参数的值，可以通过设置use-slot为true，传入自定义内容，同时设定 自己的样式


<template>
	<u-index-list :scrollTop="scrollTop">
		<view v-for="(item, index) in indexList" :key="index">
			<u-index-anchor :use-slot="true">
				<text class="anchor-text">{{item}}</text>
			</u-index-anchor>
			<view class="list-cell">
				列表1
			</view>
			<view class="list-cell">
				列表2
			</view>
			<view class="list-cell">
				列表3
			</view>
		</view>
	</u-index-list>
</template>

<style lang="scss" scoped>
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
	
	.anchor-text {
		color: red;
	}
</style>
自定义导航栏
默认情况下，组件的锚点是吸附在导航栏下方的，如果您修改了导航栏，比如取消导航栏、或者自定义了导航栏，就需要指定吸顶的高度，也就是offset-top 的值，注意这个值的单位为rpx：

如果取消导航栏，需要将offset-top为0
如果自定义了导航栏，需要offset-top设置为导航栏的高度
API
IndexBar Props
参数	说明	类型	默认值	可选值
scroll-top	当前滚动高度，自定义组件无法获得滚动条事件，所以依赖接入方传入	Number | String	-	-
index-list	索引字符列表，数组	Array[string | number]	A-Z	-
z-index	锚点吸顶时的层级	Number | String	965	-
sticky	是否开启锚点自动吸顶	Boolean	true	false
offset-top	锚点自动吸顶时与顶部的距离，单位rpx，见上方"自定义导航栏"说明	Number | String	0	-
active-color	锚点和右边索引字符高亮颜色	String	#2979ff	-
IndexAnchor Props
参数	说明	类型	默认值	可选值
use-slot	是否使用自定义内容的插槽	Boolean	false	true
index	索引字符，如果定义了use-slot，此参数自动失效	String | Number	-	-
IndexBar Events
事件名	说明	回调参数	版本
select	选中右边索引字符时触发	index: 索引字符	-
IndexAnchor Slots
名称	说明
default	锚点位置显示内容，默认为索引字符

## Steps 步骤条

该组件一般用于完成一个任务要分几个步骤，标识目前处于第几步的场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过list参数传入一个数组，标识步骤的总数
通过current参数标识目前处于第几步，从0开始

<template>
	<view>
		<u-steps :list="numList" :current="1"></u-steps>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义步骤项接口
interface StepItem {
	name: string
}

// 定义响应式数据
const numList = ref<StepItem[]>([
	{
		name: '下单'
	}, 
	{
		name: '出库'
	}, 
	{
		name: '运输'
	}, 
	{
		name: '签收'
	}
])
</script>
设置步骤条的主题
type值可选的有primary(默认)、success、info、warning、error
type值和active-color(默认为空)为互斥关系，如果设置了active-color，会优先起作用

<u-steps :list="numList" active-color="#fa3534"></u-steps>
设置步骤条的模式
mode可以设置为dot(圆点，默认值)或者number(数字)，二者有不同形式，见示例


<u-steps :list="numList" mode="number"></u-steps>
API
Props
参数	说明	类型	默认值	可选值
mode	设置模式	String	dot	number
list	数轴条数据，数组。具体见上方示例	Array	[ ]	-
type(1.3.7起已废弃)	type主题	String	primary	info / success / error / warning
current	设置当前处于第几步	Number | String	0	-
direction	row-横向，column-竖向	String	row	column
active-color	已完成步骤的激活颜色，如设置，type值会失效	String	-	-
un-active-color	未激活的颜色，用于表示未完成步骤的颜色	String	#606266	-
icon	mode = number时的自定义图标	String	checkmark	-
## Empty 内容为空

该组件用于需要加载内容，但是加载的第一页数据就为空，提示一个"没有内容"的场景， 我们精心挑选了十几个场景的图标，方便您使用。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
提示

新版本移除了此组件内置的图片，因为这些图片太大，影响了组件库的大小。改用字体图标的形式提供，缺点是字体图标只能是单色的，形状与原来的图片也有些许出入。 基于以上，我们的专业设计师精心为您准备了一套精美缺省图，带有图片和Sketch文件，您可以下载或修改后再使用：资源下载

通过text参数配置提示的文字内容
通过mode(默认为data)参数配置要显示的图标

<u-empty text="所谓伊人，在水一方" mode="list"></u-empty>
内置图标
这些图标已内置，直接通过mode参数引用即可

名称	说明
car	购物车为空
page	页面不存在
search	没有搜索结果
address	没有收货地址
wifi	没有WiFi
order	订单为空
coupon	没有优惠券
favor	无收藏
permission	无权限
history	无历史记录
news	无新闻列表
message	消息列表为空
list	列表为空(通用)
data	数据为空(默认，通用)
API
Props
参数	说明	类型	默认值	可选值
color	文字颜色	String	#c0c4cc	-
text	文字提示	String	无内容	-
icon-color	icon的颜色，字体图标时有效	String	#c0c4cc	-
icon-size	icon的大小，单位rpx，如果src为图片路径，此参数可以设置图片的尺寸	String | Number	120	-
src	图标名称或者图片路径(绝对路径)，如定义，mode参数会失效	String	-	-
font-size	提示文字的大小，单位rpx	String | Number	28	-
mode	内置的图标，见上方说明	String	data	-
img-width 
已废弃	图标的宽度，单位rpx	String | Number	240	-
img-height 
已废弃	图标的高度，单位rpx	String	auto	-
show	是否显示组件	Boolean	true	false
margin-top	组件到上一个元素的间距,单位rpx	String | Number	0	-
Slot
名称	说明
bottom	给组件底部传入slot内容

## Link 超链接

[Link 组件文档将从官网获取...]

## Section 查看更多

该组件一般用于分类信息有很多，但是限于篇幅只能列出一部分，让用户通过"查看更多"获得更多信息的场景，实际效果见演示。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
说明：此组件会在最左边显示一个竖条

通过title参数设置主标题
通过sub-title参数设置副标题

<u-section title="今日热门" sub-title="查看更多"></u-section>
是否显示右边内容
可以通过设置right为false来隐藏右边的内容


<u-section title="今日热门" :right="false"></u-section>
API
Props
参数	说明	类型	默认值	可选值
title	左边主标题	String	-	-
sub-title	右边副标题	String	更多	-
right	是否显示右边的内容	Boolean	true	false
show-line	是否显示左边的竖条	Boolean	true	false
font-size	主标题的字体大小	String | Number	28	-
bold	主标题是否加粗	Boolean	true	false
color	主标题颜色	String	#303133	-
sub-color	右边副标题的颜色(右箭头同此颜色)	String	#909399	-
line-color	左边竖线的颜色，默认同color参数值	String	-	-
arrow	是否显示右边箭头	Boolean	true	false
Events
事件名	说明	回调参数	版本
click	组件右侧的内容被点击时触发，用于跳转"更多"	-	-
Slot
名称	说明
right	自定义右侧内容