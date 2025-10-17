# uViewPro 数据组件

## 目录
- [CircleProgress 圆形进度条](#circleprogress-圆形进度条)
- [LineProgress 线形进度条](#lineprogress-线形进度条)
- [Table 表格](#table-表格)
- [CountDown 倒计时](#countdown-倒计时)
- [CountTo 数字滚动](#countto-数字滚动)

## CircleProgress 圆形进度条

展示操作或任务的当前进度，比如上传文件，是一个圆形的进度环。

内部实现
组件内部通过canvas实现，有更好的性能和通用性。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过percent设置当前的进度值，该值区间为0-100
通过active-color设置圆环的颜色，也可以直接设置type主题颜色，使用预置值
通过默认slot传入内容，将会显示在圆环的内部

<template>
	<u-circle-progress active-color="#2979ff" :percent="80">
		<view class="u-progress-content">
			<view class="u-progress-dot"></view>
			<text class='u-progress-info'>查找中</text>
		</view>
	</u-circle-progress>
</template>

<style lang="scss" scoped>
	.u-progress-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.u-progress-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #fb9126;
	}
	
	.u-progress-info {
		font-size: 28rpx;
		padding-left: 16rpx;
		letter-spacing: 2rpx
	}
</style>
设置圆环的动画时间
通过duration设置圆环从0递增到100%(也即一圆周)所需的时间，如需动态修改进度值时会用到，比如用户进行某一个操作之后， 需要把进度值从30%改为80%，这里增加了50%(80% - 30% = 50%)，也即半个圆周，所需时间为duration的一半，因为duration值为一个圆周的时间。


<u-circle-progress type="primary" :percent="30" duration="2000"></u-circle-progress>
API
Props
参数	说明	类型	默认值	可选值
percent	圆环进度百分比值，为数值类型，0-100	String | Number	-	-
inactive-color	圆环的底色，默认为灰色(该值无法动态变更)	String	#ececec	-
active-color	圆环激活部分的颜色(该值无法动态变更)	String	#19be6b	-
width	整个圆环组件的宽度，高度默认等于宽度值，单位rpx	String | Number	200	-
border-width	圆环的边框宽度，单位rpx	String | Number	14	-
duration	整个圆环执行一圈的时间，单位ms	String | Number	1500	-
type	如设置，active-color值将会失效	String	-	success / primary / error / info / warning
bg-color	整个组件背景颜色，默认为白色	String	#ffffff	-

## LineProgress 线形进度条

展示操作或任务的当前进度，比如上传文件，是一个线形的进度条。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过percent设置当前的进度值，该值区间为0-100.
通过active-color设置进度条的颜色，也可以直接设置type主题颜色(优先起作用)，使用预置值

<u-line-progress active-color="#2979ff" :percent="70"></u-line-progress>
设置进度条动画效果
该效果会在已完成的百分比部分显示移动的条纹(具体见示例效果)

striped参数配置是否显示条纹
striped-active参数配置条纹是否具有动态效果

<u-line-progress :striped="true" :percent="70" :striped-active="true"></u-line-progress>
设置进度条内部显示百分比值
参数为show-percent

说明：进度条可以通过height设置高度，如果高度太小的话，是无法在内部显示当前的百分比值的

<u-line-progress :percent="70" :show-percent="true"></u-line-progress>
修改进度条的样式
active-color参数修改激活部分的颜色
round参数设置进度条两端是否为半圆

<u-line-progress :percent="70" :round="false" active-color="#ff9900"></u-line-progress>
API
Props
参数	说明	类型	默认值	可选值
percent	进度条百分比值，为数值类型，0-100	String | Number	-	-
round	进度条两端是否为半圆	Boolean	true	false
type	如设置，active-color值将会失效	String	-	success / primary / error / info / warning
active-color	进度条激活部分的颜色	String	#19be6b	-
inactive-color	进度条的底色，默认为灰色	String	#ececec	-
show-percent	是否在进度条内部显示当前的百分比值数值	Boolean	true	false
height	进度条的高度，单位rpx	String | Number	28	-
striped	是否显示进度条激活部分的条纹	Boolean	false	true
striped-active	条纹是否具有动态效果	Boolean	false	true
Slots
名称	说明
default	传入自定义的显示内容，将会覆盖默认显示的百分比值

## Table 表格

表格组件一般用于展示大量结构化数据的场景

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
本组件标签类似HTML的table表格，由table、tr、th、td四个组件组成

table组件裹在最外层，可以配置一些基础参数
tr组件用于显示"行"数据
th组件用于显示表头内容，类似td，不同之处在于字体加粗了，也带有背景颜色，也可以直接用td替代th
td组件不是最小单位，为了合并单元格时，内部可以嵌入tr和td组件

<template>
	<u-table>
		<u-tr>
			<u-th>学校</u-th>
			<u-th>班级</u-th>
			<u-th>年龄</u-th>
		</u-tr>
		<u-tr>
			<u-td>浙江大学</u-td>
			<u-td>二年级</u-td>
			<u-td>22</u-td>
		</u-tr>
		<u-tr>
			<u-td>清华大学</u-td>
			<u-td>05班</u-td>
			<u-td>20</u-td>
		</u-tr>
	</u-table>
</template>
兼容性
由于头条小程序的兼容性问题，您需要给表格相关的组件(u-tr、u-th、u-td)写上对应的类名才有效，如下：


<u-table>
	<u-tr class="u-tr">
		<u-th class="u-th">姓名</u-th>
		<u-th class="u-th">年龄</u-th>
		<u-th class="u-th">籍贯</u-th>
		<u-th class="u-th">性别</u-th>
	</u-tr>
	<u-tr class="u-tr">
		<u-td class="u-td">吕布</u-td>
		<u-td class="u-td">22</u-td>
		<u-td class="u-td">楚河</u-td>
		<u-td class="u-td">男</u-td>
	</u-tr>
</u-table>
API
Table Props
参数	说明	类型	默认值	可选值
border-color	表格边框的颜色	String	#e4e7ed	-
bg-color	表格的背景颜色	String	#ffffff	-
align	单元格的内容对齐方式，作用类似css的text-align	String	center	left / right
padding	单元格的内边距，同css的padding写法	String	10rpx 0	-
font-size	单元格字体大小，单位rpx	String | Number	28	-
color	单元格字体颜色	String	#606266	-
th-style	th单元格的样式，对象形式(将th所需参数放在table组件，是为了避免每一个th组件要写一遍)	Object	{}	-
Td Props
参数	说明	类型	默认值	可选值
width	单元格宽度百分比或者具体带单位的值，如30%， 200rpx等，一般使用百分比，单元格宽度默认为均分tr的长度	String | Number	auto	-
Th Props
参数	说明	类型	默认值	可选值
width	标题单元格宽度百分比或者具体带单位的值，如30%， 200rpx等，一般使用百分比，单元格宽度默认为均分tr的长度	String | Number	-	-

## CountDown 倒计时


## CountTo 数字滚动

