# uViewPro 基础组件

## 目录
- [Color 色彩](#color-色彩)
- [Icon 图标](#icon-图标)
- [Image 图片](#image-图片)
- [Button 按钮](#button-按钮)
- [Layout 布局](#layout-布局)
- [Cell 单元格](#cell-单元格)
- [Badge 徽标数](#badge-徽标数)
- [Tag 标签](#tag-标签)
- [Text 文本](#text-文本)
- [RootPortal 根节点传送](#rootportal-根节点传送)

配置
uView Pro 支持 npm 和 uni_modules 两种主流安装方式，配置方式高度一致。无论采用哪种方式，均可通过 easycom 实现组件自动引入，极大提升开发效率。以下为统一的配置说明：

提示

确保你已经安装了 uView Pro，详见安装文档：uView Pro 安装

1. 引入 uView Pro 主库
在 main.ts 中引入并注册 uView Pro：


// main.ts
import { createSSRApp } from 'vue'
// npm 方式
import uViewPro from 'uview-pro'
// uni_modules 方式
// import uViewPro from "@/uni_modules/uview-pro";

export function createApp() {
  const app = createSSRApp(App)
  app.use(uViewPro)
  return {
    app
  }
}
2. 引入全局样式
在 uni.scss 中引入主题样式：


/* uni.scss */
// npm 方式
@import 'uview-pro/theme.scss';
// uni_modules 方式
// @import "@/uni_modules/uview-pro/theme.scss";
在 App.vue 首行引入基础样式：


<style lang="scss">
  // npm 方式
  @import "uview-pro/index.scss";
  // uni_modules 方式
  // @import "@/uni_modules/uview-pro/index.scss";
</style>
3. 配置自动引入组件
基于 easycom 配置自动引入组件
方案 1
在 pages.json 中配置 easycom 规则，实现组件自动引入：


// pages.json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      // npm 方式
      "^u-(.*)": "uview-pro/components/u-$1/u-$1.vue"
      // uni_modules 方式
      // "^u-(.*)": "@/uni_modules/uview-pro/components/u-$1/u-$1.vue"
    }
  },
  "pages": [
    // ...
  ]
}
注意

1.修改 easycom 规则后需重启 HX 或重新编译项目。
2.请确保 pages.json 中只有一个 easycom 字段，否则请自行合并多个规则。
3.一定要放在 custom 内，否则无效。
基于 vite 配置自动引入组件
方案 2
如果不熟悉 easycom，也可以通过 @uni-helper/vite-plugin-uni-components 实现组件的自动引入。

提醒

必须使用 @uni-helper/vite-plugin-uni-components@0.2.3 及以上版本，因为在 0.2.3 版本开始其内置了 uView Pro 的 resolver，并支持了 npm、uni_modules 方式引入。
如果使用此方案时控制台打印很多 Sourcemap for points to missing source files​ ，可以尝试将 Vite 版本升级至 4.5.x 以上版本。

npm

yarn

pnpm

npm i @uni-helper/vite-plugin-uni-components -D
npm 配置方式：

// vite.config.ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

import Components from '@uni-helper/vite-plugin-uni-components'
import { uViewProResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'

export default defineConfig({
  plugins: [
    // make sure put it before `Uni()`
    Components({
      resolvers: [uViewProResolver()]
    }),
    uni()
  ]
})
uni_modules 配置方式：
提醒

如果使用了 @ 符，务必配置别名 @ 到根目录！


// vite.config.ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

import Components from '@uni-helper/vite-plugin-uni-components'
import { uViewProResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'

export default defineConfig({
  plugins: [
    // make sure put it before `Uni()`
    Components({
      resolvers: [uViewProResolver('@/uni_modules/uview-pro')]
    }),
    uni()
  ]
})
如果你使用 pnpm ，请在根目录下创建一个 .npmrc 文件，参见 Issue。


// .npmrc
public-hoist-pattern[]=@vue*
// or
// shamefully-hoist = true
4. Volar 类型提示支持
如需在 CLI 项目中获得 Volar 的全局类型提示，请在 tsconfig.json 中添加：


{
  "compilerOptions": {
    // npm 方式
    "types": ["uview-pro/types"]
    // uni_modules 方式
    // "types": ["@/uni_modules/uview-pro/types"]
  }
}
HBuilderX 项目暂不支持 tsconfig.json 的 types 配置，CLI 项目推荐配置以获得最佳 TS 体验。

5. 组件使用
配置完成后，无需 import 和 components 注册，可直接在 SFC 中使用 uView Pro 组件：


<template>
  <u-button type="primary">按钮</u-button>
</template>


# 基础组件

## Color 色彩
uView经过大量调试和研究，得出一套专有的调色板，在各个组件内部，使用统一的配色，为您的产品带来统一又鲜明的视觉效果。

注意

uView为了更好编写css，使用了scss预处理器，使用uView之前，请确认您的Hbuilder X已经安装了scss预处理器，一般情况下，相信您已经安装了。如果没有安装， 请在 Hbuilder X->工具->插件安装 中找到找到"scss/sass编译"安装即可，安装完毕如果不生效，请重启Hbuilder X。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
主题色
primary，success，error，warning，info是uView的主题色，他们给人在视觉感受上分别对应于蓝色，绿色，红色，黄色，灰色。 而他们又有对应的disabled、dark和light状态，分别表示对应的禁止，加深和变浅的对应颜色。举例uView的button组件来说：

设置type参数为primary时，按钮显示蓝色。
按钮被按下时，使用的是primary的加深颜色，也即dark状态。
按钮设置为镂空状态(plain为true)时，背景色为primary的变浅颜色，也即light状态。
按钮处于禁止状态时，使用的是primary的稍浅颜色，也即disabled状态。
主色
蓝色作为uView主色调，表示一种鲜明，积极的态度

Primary
#2979ff
Dark
#2b85e4
Disabled
#a0cfff
Light
#ecf5ff
我们在全局样式中，通过scss提供了对应的颜色变量名，方便您在任何可写css的地方，调用这些变量，如下：


/* 变量的定义，该部分uView已全局引入，无需您编写 */
$u-type-primary: #2979ff;
$u-type-primary-light: #ecf5ff;
$u-type-primary-disabled: #a0cfff;
$u-type-primary-dark: #2b85e4;


/* 在您编写css的地方使用这些变量 */
.title {
	color: $u-type-primary;
	......
}
辅助色
除了主色外的场景色，需要在不同的场景中使用，如绿色代表成功，红色代表错误，黄色代表警示。

Error
#fa3534
Dark
#dd6161
Disabled
#fab6b6
Light
#fef0f0
Warning
#ff9900
Dark
#f29100
Disabled
#fcbd71
Light
#fdf6ec
Success
#19be6b
Dark
#18b566
Disabled
#71d5a1
Light
#dbf1e1
Info
#909399
Dark
#82848a
Disabled
#c8c9cc
Light
#f4f4f5
我们在全局样式中，通过scss提供了对应的颜色变量名，方便您在任何可写css的地方，调用这些变量，如下：


/* 变量的定义，该部分uView已全局引入，无需您编写 */

$u-type-warning: #ff9900;
$u-type-warning-disabled: #fcbd71;
$u-type-warning-dark: #f29100;
$u-type-warning-light: #fdf6ec;

$u-type-success: #19be6b;
$u-type-success-disabled: #71d5a1;
$u-type-success-dark: #18b566;
$u-type-success-light: #dbf1e1;

$u-type-error: #fa3534;
$u-type-error-disabled: #fab6b6;
$u-type-error-dark: #dd6161;
$u-type-error-light: #fef0f0;

$u-type-info: #909399;
$u-type-info-disabled: #c8c9cc;
$u-type-info-dark: #82848a;
$u-type-info-light: #f4f4f5;

/* 在您编写css的地方使用这些变量 */
.title {
	color: $u-type-info;
	......
}
文字颜色
uView中，分别提炼了4种用于文字颜色，分别是：主要文字、常规文字、次要文字、占位文字颜色。

主要文字颜色一般用于内容的标题等，如新闻列表的标题
常规文字颜色一般用于内容的主体，如新闻列表的概要
次要文字颜色一般用于内容的提示部分，如新闻列表底部的时间，评论数量的提示文字
占位文字颜色属于更浅的灰色，看场景选择使用
主要文字
#303133
常规文字
#606266
次要文字
#909399
占位文字
#c0c4cc

/* 变量的定义，该部分uView已全局引入，无需您编写 */
$u-main-color: #303133;
$u-content-color: #606266;
$u-tips-color: #909399;
$u-light-color: #c0c4cc;

/* 在您编写css的地方使用这些变量 */
.title {
	color: $u-main-color;
}
背景颜色
uView中，定义了一个背景颜色，如下：

背景颜色
#f3f4f6
我们在全局样式中，通过scss提供了对应的颜色变量名，方便您在任何可写css的地方，调用这个变量，如下：


/* 变量的定义，该部分uView已全局引入，无需您编写 */
$u-bg-color: #f3f4f6;

/* 在您编写css的地方使用这些变量 */
.title {
	color: $u-bg-color;
}
边框颜色
uView自定义了一个边框的颜色，值为#e4e7ed，如果想使用，如下：


/* 变量的定义，该部分uView已全局引入，无需您编写 */
$u-border-color: #e4e7ed;

/* 在您编写css的地方使用这个变量 */
.item {
	border: 1px solid $u-border-color;
}

##  Icon 图标 
基于字体的图标集，包含了大多数常见场景的图标。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ 小程序
√	√	√	√	√	√	√
基本使用

提示

如果您觉得内置的图标数量不够，或者不合符您的需求，别担心，我们还精心为您准备了一份简单易用的扩展自定义图标库教程：扩展自定义图标库


通过<u-icon>形式来调用，设置name参数为图标名即可


<u-icon name="photo"></u-icon>
修改图标的样式
通过color参数修改图标的颜色
通过size参数修改图标的大小，单位为 rpx

<u-icon name="photo" color="#2979ff" size="28"></u-icon>
图片图标
这里说的图片图标，指的是小图标，起作用定位为"icon"图标作用，而非大尺寸的图片展示场景，理论上，这个小图标应该为png格式的正方形图标。

上面说到，给组件的name参数传入一个图片的名称即可显示字体图标，这些名称中不能带有/斜杠符号，否则会被认为是传入了图片图标，同时，size参数 也被设置为这个图片图标的宽度，由于是图片，诸如颜色color等参数都会失效。


<u-icon
  label="uView"
  size="40"
  name="https://ik.imagekit.io/anyup/uview-pro/logo/default.png"
></u-icon>
API
Props
参数	说明	类型	默认值	可选值
name	图标名称，见示例图标集，如名称带有/，会被认为是图片图标	String	-	-
color	图标颜色	String	inherit	-
size	图标字体大小，单位 rpx	String|Number	inherit	-
index	一个用于区分多个图标的值，点击图标时通过click事件传出	String	-	-
hover-class	图标按下去的样式类，用法同 uni 的view组件的hover-class参数，详见：hover-class	String	-	-
label	图标右侧/下方的 label 文字	String	-	-
label-size	label字体大小，单位 rpx	String|Number	28	-
label-color	label字体颜色	String	#606266	-
custom-prefix	自定义字体图标库时，需要写上此值，详见：扩展自定义图标库	String	uicon	-
space 
v 0.0.4 +	label在四周时与图标的距离，权重高于 margin，单位 rpx	String|Number	-	-
margin-left	label在右方时与图标的距离，单位 rpx	String|Number	6	-
margin-top	label在下方时与图标的距离，单位 rpx	String|Number	6	-
margin-bottom	label在上方时与图标的距离，单位 rpx	String|Number	6	-
margin-right	label在左侧时与图标的距离，单位 rpx	String|Number	6	-
label-pos	label相对于图标的位置(left 和 top 为 1.4.1 新增)	String	right	bottom/top/left
width	name为图片路径时图片的宽度，单位任意，数值默认为 rpx 单位	String|Number	-	-
height	name为图片路径时图片的高度，单位任意，数值默认为 rpx 单位	String|Number	-	-
top	如果某些场景，如果图标没有垂直居中，可以调整此参数，单位任意，数值默认为 rpx 单位	String|Number	0	-
show-decimal-icon	是否为 DecimalIcon	Boolean	false	true
inactive-color	背景颜色，可接受主题色，仅 Decimal 时有效	String	#ececec	-
percent	显示的百分比，仅 Decimal 时有效	String|Number	50	-
Events
事件名	说明	回调参数	版本
click	点击图标时触发	index: 通过props传递的index值	-
图标集
level
woman
man
arrow-left-double
arrow-right-double
chat
chat-fill
red-packet
red-packet-fill
order
checkbox-mark
arrow-up-fill
arrow-down-fill
backspace
photo
photo-fill
lock
lock-fill
lock-open
lock-opened-fill
hourglass
hourglass-half-fill
home
home-fill
fingerprint
cut
star
star-fill
share
share-fill
volume-up
volume-up-fill
volume-off
volume-off-fill
trash
trash-fill
rewind-right
rewind-right-fill
rewind-left
rewind-left-fill
shopping-cart
shopping-cart-fill
question
question-circle
question-circle-fill
plus
plus-circle
plus-circle-fill
tags
tags-fill
pause
pause-circle
pause-circle-fill
play-circle
play-circle-fill
map
map-fill
phone
phone-fill
list
list-dot
man-delete
man-add
man-add-fill
person-delete-fill
info
info-circle
info-circle-fill
minus
minus-circle
minus-circle-fill
mic
mic-off
grid
grid-fill
eye
eye-fill
eye-off
file-text
file-text-fill
edit-pen
edit-pen-fill
email
email-fill
download
checkmark
checkmark-circle
checkmark-circle-fill
clock
clock-fill
close
close-circle
close-circle-fill
calendar
calendar-fill
car
car-fill
bell
bell-fill
bookmark
bookmark-fill
attach
play-right
play-right-fill
play-left
play-left-fill
error
error-circle
error-circle-fill
wifi
wifi-off
skip-back-left
skip-forward-right
search
setting
setting-fill
volume
volume-fill
more-dot-fill
more-circle
more-circle-fill
bag
bag-fill
arrow-upward
arrow-downward
arrow-leftward
arrow-rightward
arrow-up
arrow-down
arrow-left
arrow-right
rmb
rmb-circle
rmb-circle-fill
thumb-up
thumb-up-fill
thumb-down
thumb-down-fill
coupon
coupon-fill
kefu-ermai
server-fill
server-man
scan
warning
warning-fill
google
google-circle-fill
chrome-circle-fill
ie
IE-circle-fill
github-circle-fill
android-fill
android-circle-fill
apple-fill
camera
camera-fill
pushpin
pushpin-fill
minus-square-fill
plus-square-fill
heart
heart-fill
reload
account
account-fill
minus-people-fill
plus-people-fill
integral
integral-fill
zhihu
zhihu-circle-fill
gift
gift-fill
zhifubao
zhifubao-circle-fill
weixin-fill
weixin-circle-fill
twitter
twitter-circle-fill
taobao
taobao-circle-fill
weibo
weibo-circle-fill
qq-fill
qq-circle-fill
moments
moments-circel-fill
qzone
qzone-circle-fill
facebook
facebook-circle-fill
baidu
baidu-circle-fill
zhuanfa

## Image 图片 
此组件为 uni-app 的image组件的加强版，在继承了原有功能外，还支持淡入动画、加载中、加载失败提示、圆角值和形状等。
我们推荐您在任何使用图片场景的地方，都优先考虑使用这个小巧，精致而实用的组件。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ 小程序
√	√	√	√	√	√	√
基本使用
配置图片的width宽和height高，以及src路径即可使用。


<template>
  <u-image width="100%" height="300rpx" :src="src"></u-image>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const src = ref<string>("https://ik.imagekit.io/anyup/uview-pro/logo/default.png");
</script>
填充模式
通过mode参数配置填充模式，此模式用法与 uni-app 的image组件的mode参数完全一致，详见：Image


<u-image src="https://ik.imagekit.io/anyup/uview-pro/logo/default.png" mode="widthFix"></u-image>
图片形状
通过shape参数设置图片的形状，circle为圆形，square为方形
如果为方形时，还可以通过border-radius参数设置圆角值

<u-image src="https://ik.imagekit.io/anyup/uview-pro/logo/default.png" shape="circle"></u-image>
懒加载
注意：此功能只对微信小程序、App、百度小程序、字节跳动小程序有效，默认开启。


<u-image src="https://ik.imagekit.io/anyup/uview-pro/logo/default.png" :lazy-load="true"></u-image>
加载中提示
图片加载过程中，为加载中状态(默认显示一个小图标)，可以通过loading自定义插槽，结合 uView 的u-loading组件，实现加载的动画效果。


<u-image src="https://ik.imagekit.io/anyup/uview-pro/logo/default.png">
  <template #loading>
    <u-loading></u-loading>
  </template>
</u-image>
加载错误提示
图片加载失败时，默认显示一个错误提示图标，可以通过error自定义插槽，实现个性化的提示方式。


<u-image src="https://ik.imagekit.io/anyup/uview-pro/logo/default.png">
  <template #error>
    <view style="font-size: 24rpx;">加载失败</view>
  </template>
</u-image>
淡入动画
组件自带了加载完成时的淡入动画效果：

通过fade参数配置是否开启动画效果
通过duration参数配置动画的过渡时间，单位 ms

<u-image
  src="https://ik.imagekit.io/anyup/uview-pro/logo/default.png"
  :fade="true"
  duration="450"
></u-image>
事件冒泡
默认情况下，组件是允许内部向外事件冒泡的，因为很多情况下，我们都希望点击图片，同时图片所在的父元素的点击事件也能触发。
如果您想避免事件冒泡，那么您可以在组件外面嵌套一个view，同时给它加上@tap.stop即可。


<!-- 点击图片将不会触发clickHandler -->
<view @tap="clickHandler">
  <view @tap.stop>
    <u-image src="https://ik.imagekit.io/anyup/uview-pro/logo/default.png"></u-image>
  </view>
</view>
API
Props
参数	说明	类型	默认值	可选值
src	图片地址，强烈建议使用绝对或者网络路径	String	-	-
mode	裁剪模式，见上方说明	String	aspectFill	-
width	宽度，单位任意，如果为数值，则为 rpx 单位	String | Number	100%	-
height	高度，单位任意，如果为数值，则为 rpx 单位	String | Number	auto	-
shape	图片形状，circle-圆形，square-方形	String	square	circle
border-radius	圆角值，单位任意，如果为数值，则为 rpx 单位	String | Number	0	-
lazy-load	是否懒加载，仅微信小程序、App、百度小程序、字节跳动小程序有效	Boolean	true	-
show-menu-by-longpress	是否开启长按图片显示识别小程序码菜单，仅微信小程序有效	Boolean	true	-
loading-icon	加载中的图标，或者小图片	String	photo	-
error-icon	加载失败的图标，或者小图片	String	error-circle	-
show-loading	是否显示加载中的图标或者自定义的 slot	Boolean	true	false
show-error	是否显示加载错误的图标或者自定义的 slot	Boolean	true	false
fade	是否需要淡入效果	Boolean	true	false
webp	只支持网络资源，只对微信小程序有效	Boolean	false	true
duration	搭配fade参数的过渡时间，单位 ms	String | Number	500	-
bg-color	背景颜色	String	#f3f4f6	-
Slot
名称	说明
loading	自定义加载中的提示内容
error	自定义失败的提示内容
CellItem Events
事件名	说明	回调参数
click	点击图片时触发	-
error	图片加载失败时触发	err: 错误信息
load	图片加载成功时触发	-

## Button 按钮 
该组件内部实现以uni-appbutton组件为基础，进行二次封装，主要区别在于：

按钮type值有更多的主题颜色
有可选的按钮点击水波纹效果
按钮size值有更多的尺寸可选
注意

此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊，因为它有一些其他小程序平台的特定能力，请参考文档后面的参数列表，更详细说明请参uni-app方文档：
uni-app方button组件
由于微信小程序的限制，在微信小程序中设置了form-type的u-button无法触发form组件的submit事件(H5和APP正常)，详见微信小程序文档Bug & Tip部分

基本使用
文字内容通过slot传入


<u-button>月落</u-button>
设置按钮的主题
type值可选的有default(默认)、primary、success、info、warning、error


<u-button >默认按钮</u-button>
<u-button type="primary">主要按钮</u-button>
<u-button type="success">成功按钮</u-button>
<u-button type="info">信息按钮</u-button>
<u-button type="warning">警告按钮</u-button>
<u-button type="error">危险按钮</u-button>
设置按钮为半圆形
shape默认值为square(按钮为圆角矩形)，设置为circle，则按钮两边为半圆形


<u-button shape="square">乌啼</u-button>
设置尺寸
button组件的size（可选值为default(默认)，mini(小尺寸)和medium(中等尺寸)）


<u-button size="default">江湖</u-button>
<u-button size="medium">夜雨</u-button>
<u-button size="mini">十年灯</u-button>
设置按钮的镂空状态
镂空状态按钮背景为白色，边框和文字同色，通过plain来设置


<u-button plain>披荆</u-button>

<!-- 或者显式设置为true -->
<u-button :plain="true">斩棘</u-button>
设置点击按钮的水波纹效果
该效果通过给按钮绝对定位形式覆盖一个view，点击时改变view的scale，opacity样式属性，形成扩散再消失的水波纹效果。


<u-button :ripple="true">十年</u-button>

<!-- 通过rippleBgColor设置水波纹的背景颜色 -->
<u-button :ripple="true" ripple-bg-color="#909399">之约</u-button>
如何修改按钮的样式
针对非微信小程序平台，组件的根元素就是uni-appbutton组件，所以修改按钮的样式很容易，直接给组件定义类名或者嵌入内联样式即可。
如果是微信小程序，编译后页面会有组件同名的元素存在，导致样式传递有问题。
如果是为了修改按钮与其他元素之间的距离或者宽度等，可以给按钮外面套一个view元素，控制这个view与其他元素的距离或者宽度，即可达到同等效果。
所以：我们提供了一个custom-style参数，推荐用户可以用对象形式传递样式给组件内部，注意驼峰命名。


<u-button class="custom-style">雪月夜</u-button>

<style scoped>
	:deep(.custom-style) {
		color: #606266;
		width: 400rpx;
	}
</style>


/* 也可以 */
<u-button :custom-style="customStyle">雪月夜</u-button>

<script setup lang="ts">
import { reactive } from 'vue'

const customStyle = reactive({
	marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
	color: 'red'
})
</script>
各家小程序开放能力的对接
uView Pro已对接uni-app档关于uni-app方button组件的所有开放能力(截止2020-04-14)uni-app-app文档说明使用即可，如果有发现遗漏的地方，请加群反馈。

API
Props
属性名	说明	类型	默认值	可选值	平台差异说明
size	按钮的大小	String	default	medium / mini	-
ripple	是否开启点击水波纹效果	Boolean	false	true	-
ripple-bg-color	水波纹的背景色，ripple为true时有效	String	rgba(0, 0, 0, 0.15)	-	-
type	按钮的样式类型	String	default	primary / success / info/ warning / error	-
plain	按钮是否镂空，背景色透明	Boolean	false	true	-
disabled	是否禁用	Boolean	false	true	-
hair-line	是否显示按钮的细边框	Boolean	true	false	-
shape	按钮外观形状，见上方说明	String	square	circle	-
loading	按钮名称前是否带 loading 图标	Boolean	false	true	App-nvue 平台，在 ios 上为雪花，Android上为圆圈
form-type	用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件	String	-	submit / reset	-
open-type	开放能力	String	请参考uni-app方文档	-	-
hover-class	指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果	String	button-hover	-	App-nvue 平台暂不支持
hover-start-time	按住后多久出现点击态，单位毫秒	String | Number	20	-	-
hover-stay-time	手指松开后点击态保留时间，单位毫秒	String | Number	150	-	-
app-parameter	打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效	Boolean	false	true	微信小程序、QQ小程序
hover-stop-propagation	指定是否阻止本节点的祖先节点出现点击态	Boolean	false	true	微信小程序
lang	指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文	String	en	zh_CN \ zh_TW	微信小程序
session-from	会话来源，open-type="contact"时有效	String	-	-	微信小程序
send-message-title	会话内消息卡片标题，open-type="contact"时有效	String	当前标题	-	微信小程序
send-message-path	会话内消息卡片点击跳转小程序路径，open-type="contact"时有效	String	当前分享路径	-	微信小程序
send-message-img	会话内消息卡片图片，open-type="contact"时有效	String	当前页面截图	-	微信小程序
show-message-card	是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效	String	-	-	微信小程序
throttle-time	节流的时间间隔(一定时间内无论点击多少次，只会触发一次click事件)，单位ms，详见节流防抖	String | Number	500	-	-
Events
说明：目前经测试(Hbuilder X 2.6.8)，在H5，APP，可以直接对组件监听tap事件，等同组件内部发出的click事件效果，某些HX版本上， 微信小程序对组件使用tap事件可能无效，故建议对按钮组件的点击事件监听统一使用组件内部发出的click事件。

属性名	说明	类型	默认值	可选值	平台差异说明
click	按钮点击，请勿使用@tap点击事件，微信小程序无效，返回值为点击事件及参数	Handler	-		
getphonenumber	open-type="getPhoneNumber"时有效	Handler	微信小程序		
getuserinfo	用户点击该按钮时，会返回获取到的用户信息，从返回参数的detail中获取到的值同uni.getUserInfo	Handler	微信小程序		
error	当使用开放能力时，发生错误的回调	Handler	微信小程序		
opensetting	在打开授权设置页并关闭后回调	Handler	微信小程序		
launchapp	打开 APP 成功的回调	Handler	微信小程序	

## Layout 布局 
通过基础的 12 分栏，迅速简便地创建布局

注意

如需实现类似宫格的布局，请使用uView的Grid宫格组件，可以设置角标，功能更完善和灵活


基本使用
通过col组件的span设置需要分栏的比例


<template>
	<view class="wrap">
		<u-row gutter="16">
			<u-col span="3">
				<view class="demo-layout bg-purple"></view>
			</u-col>
			<u-col span="4">
				<view class="demo-layout bg-purple-light"></view>
			</u-col>
			<u-col span="5">
				<view class="demo-layout bg-purple-dark"></view>
			</u-col>
		</u-row>
		<u-row gutter="16" justify="space-between">
			<u-col span="3">
				<view class="demo-layout bg-purple"></view>
			</u-col>
			<u-col span="9">
				<view class="demo-layout bg-purple-light"></view>
			</u-col>
		</u-row>
	</view>
</template>

<style scoped lang="scss">
	.wrap {
		padding: 24rpx;
	}

	.u-row {
		margin: 40rpx 0;
	}

	.demo-layout {
		height: 80rpx;
		border-radius: 8rpx;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}
</style>
分栏间隔
通过设置row组件的gutter参数，来指定每一栏之间的间隔(最终表现为左边内边距各为gutter/2)，默认间隔为0


<u-row gutter="16">
	<u-col span="3">
		<view class="demo-layout bg-purple">
		</view>
	</u-col>
	<u-col span="9">
		<view class="demo-layout bg-purple-light">
		</view>
	</u-col>
</u-row>
分栏偏移
通过指定col组件的offset属性可以指定分栏偏移的栏数。


<u-row gutter="16">
	<u-col span="3">
		<view class="demo-layout bg-purple"></view>
	</u-col>
	<u-col span="3" offset="6">
		<view class="demo-layout bg-purple-light"></view>
	</u-col>
</u-row>
对齐方式
通过row组件的justify来对分栏进行灵活的对齐， 可选值为start(或flex-start)、end(或flex-end)、center、around(或space-around)、between(或space-between)， 其最终的表现类似于css的justify-content属性。

注意：由于持微信小程序编译后的特殊结构，此方式不支持微信小程序。


<u-row gutter="16" justify="center">
	<u-col span="3">
		<view class="demo-layout bg-purple"></view>
	</u-col>
	<u-col span="3">
		<view class="demo-layout bg-purple-light"></view>
	</u-col>
</u-row>
API
Row Props
参数	说明	类型	默认值	可选值
gutter	栅格间隔，左右各为此值的一半，单位rpx	String | Number	0	-
justify	水平排列方式(微信小程序暂不支持)	String	start(或flex-start)	end(或flex-end) / center / around(或space-around) / between(或space-between)
align	垂直排列方式	String	center	top / bottom
Col Props
参数	说明	类型	默认值	可选值
span	栅格占据的列数，总12等分	String | Number	0	1-12
offset	分栏左边偏移，计算方式与span相同	String | Number	0	-
text-align	文字水平对齐方式	String	left	center / right
Row Events
事件名	说明	回调参数
click	row被点击	-
Col Events
事件名	说明	回调参数
click	col被点击，会阻止事件冒泡到row	-

## Cell 单元格 
cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。

基本使用
该组件需要搭配cell-group使用，并由它实现列表组的上下边框，如不需要上下边框，配置cellGroup的border参数为false即可。
通过title设置左侧标题，value设置右侧内容。
通过icon字段设置图标，值为uView自带的Icon 图标名。
注意： 由于cell组件需要由cellGroup组件提供参数值，这些父子组件间通过Vue的"provide/inject"特性注入依赖， 所以您必须使用cellGroup包裹cell组件才能正常使用。


<template>
	<u-cell-group>
		<u-cell-item icon="setting-fill" title="个人设置"></u-cell-item>
		<u-cell-item icon="integral-fill" title="会员等级" value="新版本"></u-cell-item>
	</u-cell-group>
</template>
自定义内容
通过插槽icon可以自定义图标，内容会替换左边图标位置
通过插槽title定义左边标题部分
通过插槽right-icon定义右边内容部分

<u-cell-group>
	<u-cell-item  title="夕阳无限好" arrow-direction="down">
		<template #icon>
			<u-icon size="32" name="search"></u-icon>
		</template>
		<template #right-icon>
			<u-switch v-model="checked"></u-switch>
		</template>
	</u-cell-item>
	<u-cell-item icon="setting-fill" title="只是近黄昏"></u-cell-item>
</u-cell-group>
如上所示，可以给cell-item组件通过<template #right-icon></template>设定右边uView自带的badge或者switch组件：

如果搭配的是badge组件，注意设置absolute参数为false去掉绝对定位，否则其位于右侧的恰当位置，详见Badge 徽标数。
如果搭配的是switch组件，注意要通过v-model绑定一个内容为布尔值的变量，否则无法操作switch，详见Switch 开关选择器。
展示右箭头
设置arrow为true，将会显示右侧的箭头，可以通过arrow-direction控制箭头的方向


<u-cell-group>
	<u-cell-item icon="share" title="停车坐爱枫林晚" :arrow="true" arrow-direction="down"></u-cell-item>
	<u-cell-item icon="map" title="霜叶红于二月花" :arrow="false"></u-cell-item>
</u-cell-group>
分组标题
通过cell-group的title参数可以指定分组标题


<u-cell-group title="设置喜好">
	<u-cell-item icon="setting-fill" title="个人设置"></u-cell-item>
	<u-cell-item icon="integral-fill" title="会员等级" value="新版本"></u-cell-item>
</u-cell-group>
是否开启点击反馈
如果将arrow参数设置为true，意味着这是一个可点击的Cell，默认会给一个点击的反馈效果，如果您想自定义这个反馈效果，可以通过 hover-class参数传入一个样式类名，这个类必须写在全局样式中，如App.vue、或通过Apop.vue引入的全局样式中，一般建议定义反馈的背景颜色，或者是透明度即可。 如果不想要任何效果，将hover-class设置为none即可。


<u-cell-group title="设置喜好">
	<u-cell-item icon="setting-fill" title="个人设置" hover-class="cell-hover-class"></u-cell-item>
</u-cell-group>

/* App.vue */
.cell-hover-class {
	background-color: rgb(235, 237, 238);
}

/* 或者单是设置透明度 */
.cell-hover-class {
	opacity: 0.5;
}
API
CellGroup Props
参数	说明	类型	默认值	可选值
title	分组标题	String	-	-
border	是否显示外边框	Boolean	true	false
title-style	分组标题的的样式，对象形式，如{'font-size': '24rpx'} 或 {'fontSize': '24rpx'}	object	-	-
CellItem Props
参数	说明	类型	默认值	可选值
title	左侧标题	String	-	-
icon	左侧图标名，只支持uView内置图标，见Icon 图标	String	-	-
icon-style	icon的样式，对象形式	Object	-	-
value	右侧内容	String	-	-
label	标题下方的描述信息	String	-	-
border-bottom	是否显示cell的下边框	Boolean	true	false
border-top	是否显示cell的上边框	Boolean	false	true
border-gap	border-bottom为true时，Cell列表中间的条目的下边框是否与左边有一个间隔 
已废弃	Boolean	true	false
hover-class	是否开启点击反馈，none为无效果，见上方说明	String	-	none
arrow	是否显示右侧箭头，开启的话，将会默认带上点击反馈，可通过hover-class配置	Boolean	true	false
arrow-direction	箭头方向，可选值为	String	right	up / down
title-style	标题样式，对象形式	Object	-	-
required	是否显示左边表示必填的星号	Boolean	false	true
value-style	右侧内容样式，对象形式	Object	-	-
label-style	标题下方描述信息的样式，对象形式	Object	-	-
bg-color	背景颜色，默认透明背景	String	transparent	-
index	用于在click事件回调中返回，标识当前是第几个Item	String | Number	-	-
title-width	标题的宽度，单位rpx	Number | String	-	-
icon-size	左边通过icon参数传入的图标的大小，单位rpx	Number | String	34	-
center	是否使内容垂直居中	Boolean	false	true
CellItem Slot
名称	说明
title	自定义左侧标题部分的内容，如需使用，请勿定义title参数，或赋值null即可
icon	自定义左侧的图标
right-icon	自定义右侧图标内容，需设置arrow为false才起作用
label	自定义label内容，需同时设置use-label-slot为true
CellItem Event
事件名	说明	回调参数
click	点击cell列表时触发	index: 通过props传递的index参数

## Tag 标签 
该组件一般用于标记和选择，有如下特点：

mode参数可以设置3种模式，dark(深色背景)、light(浅色背景)、plain(白色背景)
shape参数可以设置多种形状，circle（两边半圆形）, square（方形，带圆角），circleLeft（左边半圆），circleRight（右边半圆）
type参数可以设置5种主题，primary，success，warning，error，info
平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过type参数设置主题类型，默认为primary
text设置标签内容

<u-tag text="雪月夜" type="success" />
设置标签的类型
通过设置mode参数，可以设置标签的类型，dark(深色背景)、light(浅色背景)、plain(白色背景)

<u-tag text="一丘之貉" mode="dark" />
<u-tag text="沆瀣一气" mode="light" />
<u-tag text="狼狈为奸" mode="plain" />
设置标签的形状
通过shape参数，可以设置标签的形状，默认是square（方形，带圆角），可选：circle（两边半圆形）, circleLeft（左边半圆），circleRight（右边半圆）


<u-tag text="主谓宾" shape="circle" />
<u-tag text="定状补" shape="circleLeft" />
设置标签是否可以关闭
设置closeable参数为true，会在标签上自动添加一个关闭图标
设置可关闭后，点击关闭按钮，会发出close事件，回调中手动设置show参数为false，可以隐藏Tag


<template>
	<u-tag text="要清楚" closeable :show="show" @close="tagClick" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(true)

function tagClick(index: number) {
	show.value = false
}
</script>
API
Props
参数	说明	类型	默认值	可选值
type	主题类型	String	primary	success / info / warning / error
size	标签大小	String	default	mini
shape	标签形状	String	square	circle / circleLeft / circleRight
text	标签的文字内容	String	-	-
bg-color	自定义标签的背景颜色	String	-	-
color	文字的颜色	String	-	-
border-color	标签的边框颜色	String	-	-
close-color	关闭按钮的颜色	String	-	-
index	点击标签时，会通过click事件返回该值	String | Number	-	-
mode	模式选择，见上方说明	String	light	dark / plain
closeable	是否可关闭，设置为true，文字右边会出现一个关闭图标	Boolean	false	true
show	标签显示与否	Boolean	true	false
Event
事件名	说明	回调参数	版本
click	点击标签触发	index: 传递的index参数值	-
close	closeable为true时，点击标签关闭按钮触发	index: 传递的index参数值	-

## Text 文本 
v 0.2.0 + 
此组件集成了文本类在项目中的常用功能，包括状态，拨打电话，格式化日期，*替换，超链接...等功能。 您大可不必在使用特殊文本时自己定义，text组件几乎涵盖您能使用的大部分场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过text参数设置文本内容。推荐您使用:text='value'的形式

<u-text text="我用十年青春,赴你最后之约"></u-text>
设置主题
通过type参数设置文本主题，我们提供了五类属性。
primary error success warning info

<u-text type="primary" text="主色"></u-text>
<u-text type="error"   text="错误"></u-text>
<u-text type="success" text="成功"></u-text>
<u-text type="warning" text="警告"></u-text>
<u-text type="info"    text="信息"></u-text>
拨打电话
通过将mode属性设置为phone即可调用拨打电话，提供加密值encrypt
除此之外还有格式化日期，姓名脱敏，超链接，千分位金额等属性，将在以下实例中展示

<u-text mode="phone" text="15019479320"></u-text>
日期格式化

<u-text mode="date" text="1612959739"></u-text>
姓名脱敏

<u-text mode="name" text="张三三" format="encrypt"></u-text>
超链接
添加href指定链接地址


<u-text mode="link" text="Go to uView docs" href="https://www.uviewui.com" ></u-text>
显示金额

<u-text mode="price" text="728732.32"></u-text>
前后图标
添加prefixIcon,suffixIcon指定图标和位置，iconStyle设置图标大小


<u-text prefixIcon="baidu" iconStyle="font-size: 19px" text="百度一下,你就知道"></u-text>
<u-text suffixIcon="arrow-leftward" iconStyle="font-size: 18px" text="查看更多"></u-text>
超出隐藏
内置了文字超出隐藏样式，设置lines属性表明几行后隐藏


<u-text 
    :lines="2" 
    text="uView Pro 是在 uView 1.8.8 官方组件库基础上，采用 Vue3 全新语法彻底重构的 uni-app 生态框架。不同于
    市面上的其他 uView 框架等兼容 Vue3 的方案，uView Pro 并非简单兼容，而是对每一个组件和工具进行源码级重构，
    充分发挥 Vue3 的响应式和组合式优势，API 设计更现代，性能更优越。">
</u-text>
小程序开放能力
针对小程序开放能力，我们提供了分享，请在小程序环境下使用


<u-text text="分享到微信" openType="share" type="success" @click="clickHandler"></u-text>
<script>
	export default {
		onLoad() {},
		methods: {
			clickHandler() {
				// #ifndef MP-WEIXIN
				uni.$u.toast('请在微信小程序内查看效果')
				// #endif
			}
		},
	}
</script>
API
List Props
参数	说明	类型	默认值	可选值
type	主题颜色	String	-	-
show	是否显示	Boolean	true	false
text	显示的值	String|Number	-	-
prefixIcon	前置图标	String	-	-
suffixIcon	后置图标	String	-	-
mode	文本处理的匹配模式text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-超链接	String	-	
href	mode=link下，配置的链接	String	-	-
format	格式化规则	String|Function	-	-
call	mode=phone时，点击文本是否拨打电话	Boolean	false	true
openType	小程序的打开方式	String	-	-
bold	是否粗体，默认normal	Boolean	false	true
block	是否块状	Boolean	false	true
lines	文本显示的行数，如果设置，超出此行数，将会显示省略号	String|Number	-	-
color	文本颜色	String	#303133	-
size	字体大小	String|Number	15	-
iconStyle	图标的样式	Object|String	15px	-
decoration	文字装饰，下划线，中划线等	String	none	underline/line-through
margin	外边距，对象、字符串，数值形式均可	Object|Number|String	-	-
lineHeight	文本行高	Number|String	-	-
align	文本对齐方式(仅block="true"方式生效)	String	left	center/right
wordWrap	文字换行	String	normal	break-word/anywhere
List Events
事件名	说明	回调参数
click	点击触发事件	-

## RootPortal 根节点传送 
v 0.2.2 + 
使整个子树从页面中脱离出来，类似于在 CSS 中使用 fixed position 的效果。主要用于制作弹窗、弹出层等。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	×	×	×
H5 端：使用 teleport 特性，详见teleport文档
微信小程序和支付宝小程序：使用 root-portal 组件，详见微信小程序root-portal和支付宝小程序root-portal
App 端：使用 renderjs 实现
其他平台：不支持此功能
提示

根节点传送组件仅支持微信小程序、支付宝小程序、APP和H5平台，组件会自动根据平台选择合适的实现方式：

这类场景最常见的例子就是全屏的模态框。理想情况下，我们希望触发模态框的按钮和模态框本身的代码是在同一个单文件组件中，因为它们都与组件的开关状态有关。但这意味着该模态框将与按钮一起渲染在应用 DOM 结构里很深的地方。这会导致该模态框的 CSS 布局代码很难写。

基本用法
使用 u-root-portal 将内容渲染到根节点，避免被父组件的样式影响。


<u-button type="primary" @click="show = true">显示弹窗</u-button>
<u-root-portal v-if="show">
  <view class="modal">
    <view class="modal-content">
      <text>这是一个全局弹窗</text>
      <u-button @click="show = false">关闭</u-button>
    </view>
  </view>
</u-root-portal>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
API
Slots
名称	说明
default	默认插槽，用于渲染传送内容