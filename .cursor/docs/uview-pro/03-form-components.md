# uViewPro 表单组件

## 目录
- [Input 输入框](#input-输入框)
- [Form 表单](#form-表单)
- [Calendar 日历](#calendar-日历)
- [Select 列选择器](#select-列选择器)
- [Keyboard 键盘](#keyboard-键盘)
- [Picker 选择器](#picker-选择器)
- [Rate 评分](#rate-评分)
- [Search 搜索](#search-搜索)
- [NumberBox 步进器](#numberbox-步进器)
- [Upload 上传](#upload-上传)
- [VerificationCode 验证码倒计时](#verificationcode-验证码倒计时)
- [Field 输入框](#field-输入框)
- [Checkbox 复选框](#checkbox-复选框)
- [Radio 单选框](#radio-单选框)
- [Switch 开关选择器](#switch-开关选择器)
- [Slider 滑动选择器](#slider-滑动选择器)

## Input 输入框 
此组件为一个输入框，默认没有边框和样式，是专门为配合表单组件u-form而设计的，利用它可以快速实现表单验证，输入内容，下拉选择等功能。

注意： 当您仅是需要一个输入框的话，可以考虑使用u-field组件，而如果是一个表单组，比如有多个输入框一起，且需要验证功能的时候， 应该在u-form中嵌套u-form-item，再嵌套u-input去实现。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过v-model绑定输入框的值
通过type设置输入框的类型
通过border配置是否显示输入框的边框

<template>
	<u-input v-model="value" :type="type" :border="border" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const value = ref<string>('')
const type = ref<string>('text')
const border = ref<boolean>(true)
</script>
输入框的类型
综述：此组件通过配置type参数有两种形态：

一是长文本内容输入的textarea类型。
二是类似普通输入框的text类型，在普通输入框时，由于HTML5或者小程序等一些特殊场景，此 type参数又可以设置为text、number、idcard、digit等值， 这些参数跟各个平台的兼容性有关，详见uni-app文档：Input 组件。
Textarea模式
此模式需要将type参数设置为textarea，有如下两个需要注意的参数：

auto-height参数可以配置为textarea输入框的高度是否随着行数增加，而自动增加输入框的高度。
height参数可以配置输入框的初始高度。

<template>
	<u-input v-model="value" :type="type" :border="border" :height="height" :auto-height="autoHeight" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const value = ref<string>('')
const type = ref<string>('textarea')
const border = ref<boolean>(true)
const height = ref<number>(100)
const autoHeight = ref<boolean>(true)
</script>
Text模式
将type设置为text，此种情况为一个单纯的输入框，但是还可以将其设置为number、idcard、digit等值，需要考虑兼容性，见上方说明。


<template>
	<u-input v-model="value" :type="type" :border="border" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const value = ref<string>('')
const type = ref<string>('text')
const border = ref<boolean>(true)
</script>
Password模式
type参数可以设置为password，此时输入内容将会用点替代：

如果设置password-icon设置为true，右侧将会出现一个可以切换密码与普通字符的图标。

<template>
	<u-input v-model="value" :type="type" :border="border" :password-icon="passwordIcon" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const value = ref<string>('')
const type = ref<string>('password')
const passwordIcon = ref<boolean>(true)
const border = ref<boolean>(true)
</script>
Select下拉选择模式
如果将type设置为select，此时组件将会在外观上呈现出Select选择器的形态，主要体现在右侧多了一个下三角图标，但是此时组件并没有内置下拉的功能， 主要是考虑到移动端的特殊性和uView内置组件的关联性，因为想实现下拉选择，不同场景可能会使用不同的组件，比如uView的Picker 选择器、 ActionSheet 操作菜单、Select 列选择器等，您可以根据情况自由选择合适的组件做搭配。

以上说的可以配合的组件，它们都有一个共同的通过v-model绑定弹出与收起的参数，可以同时将此参数赋值给Input组件的select-open参数， 当此参数为true(也即Select选择器打开时)，右侧的下三角图标会翻转，为false时，恢复原位。
监听组件的@click事件，在此将绑定选择器的参数修改为true即可。

<template>
	<view class="">
		<u-input v-model="value" :type="type" :border="border" @click="show = true" />
		<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const value = ref<string>('')
const type = ref<string>('select')
const show = ref<boolean>(false)
const border = ref<boolean>(true)

const actionSheetList = ref<Array<{ text: string }>>([
	{
		text: '男'
	},
	{
		text: '女'
	},
	{
		text: '保密'
	}
])

// 定义事件处理函数
const actionSheetCallback = (index: number) => {
	value.value = actionSheetList.value[index].text
}
</script>
API
Props
参数	说明	类型	默认值	可选值
type	模式选择，见上方说明	String	text	select / password / textarea / number
clearable	是否显示右侧的清除图标，type = select时无效	Boolean	true	false
v-model	用于双向绑定输入框的值	-	-	-
input-align	输入框文字的对齐方式	String	left	center / right
placeholder	placeholder显示值	String	请输入内容	-
disabled	是否禁用输入框	Boolean	false	true
maxlength	输入框的最大可输入长度	Number | String	140	-
placeholder-style	placeholder的样式，字符串形式，如"color: red;"	String	"color: #c0c4cc;"	-
confirm-type	设置键盘右下角按钮的文字，仅在type为text时生效	String	done	-
focus	是否自动获得焦点	Boolean	false	true
fixed	如果type为textarea，且在一个"position:fixed"的区域，需要指明为true	Boolean	false	true
password-icon	type为password时，是否显示右侧的密码查看图标	Boolean	true	false
border	是否显示边框	Boolean	false	true
border-color	输入框的边框颜色	String	#dcdfe6	-
auto-height	是否自动增高输入区域，type为textarea时有效	Boolean	true	false
height	高度，单位rpx	Number | String	text类型时为70，textarea时为100	-
cursor-spacing	指定光标与键盘的距离，单位px	Number | String	0	-
selection-start	光标起始位置，自动聚焦时有效，需与selection-end搭配使用	Number | String	-1	-
selection-end	光标结束位置，自动聚焦时有效，需与selection-start搭配使用	Number | String	-1	-
trim	是否自动去除两端的空格	Boolean	true	false
show-confirmbar	是否显示键盘上方带有”完成“按钮那一栏	Boolean	true	false
adjust-position	弹出键盘时是否自动调节高度	Boolean	true	false

## Form 表单 
此组件一般用于表单场景，可以配置Input输入框，Select弹出框，进行表单验证等。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
此组件一般是用于表单验证使用，每一个表单域由一个u-form-item组成，表单域中可以放置u-input、u-checkbox、u-radio、u-switch等。

在表单组中，通过model参数绑定一个对象，这个对象的属性为各个u-form-item内组件的对应变量。
由于表单验证和绑定表单规则时，需要通过ref操作，故这里需要给form组件声明ref="uFormRef"属性。
关于u-from-item内其他可能包含的诸如input、radio等组件，请见各自组件的相关文档说明。
下方为一个经典表单的示例，包含input、textarea、radio、checkbox、switch的组合使用：


<template>
	<u-form :model="form" ref="uFormRef">
		<u-form-item label="姓名"><u-input v-model="form.name" /></u-form-item>
		<u-form-item label="简介"><u-input v-model="form.intro" /></u-form-item>
		<u-form-item label="性别"><u-input v-model="form.sex" type="select" /></u-form-item>
		<u-form-item label="水果">
			<u-checkbox-group>
				<u-checkbox
					v-for="(item, index) in checkboxList"
					:key="index"
					v-model="item.checked"
					:name="item.name"
				>
					{{ item.name }}
				</u-checkbox>
			</u-checkbox-group>
		</u-form-item>
		<u-form-item label="味道">
			<u-radio-group v-model="radio">
				<u-radio
					v-for="(item, index) in radioList"
					:key="index"
					:name="item.name"
					:disabled="item.disabled"
				>
					{{ item.name }}
				</u-radio>
			</u-radio-group>
		</u-form-item>
		<u-form-item label="开关">
			<template #right>
				<u-switch v-model="switchVal"></u-switch>
			</template>
		</u-form-item>
	</u-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const uFormRef = ref();
const form = reactive({
	name: '',
	intro: '',
	sex: ''
});
const checkboxList = reactive([
	{ name: '苹果', checked: false, disabled: false },
	{ name: '雪梨', checked: false, disabled: false },
	{ name: '柠檬', checked: false, disabled: false }
]);
const radioList = reactive([
	{ name: '鲜甜', disabled: false },
	{ name: '麻辣', disabled: false }
]);
const radio = ref('');
const switchVal = ref(false);
</script>
Form-item组件说明
此组件一般需要搭配Form组件使用，也可以单独搭配Input等组件使用，由于此组件参数较多，这里只对其中参数最简要介绍，其余请见底部的API说明：

prop为传入Form组件的model中的属性字段，如果需要表单验证，此属性是必填的。
label-position可以配置左侧"label"的对齐方式，可选为left和top。
border-bottom是否显示表单域的下划线，如果给Input组件配置了边框，可以将此属性设置为false，从而隐藏默认的下划线。
如果想在表单域配置左右的图标(或小图片，1.3.0开始，Icon 图标可以配置图片)，可以通过left-icon和right-icon参数实现。
表单验证
uView Pro的表单组件具备完整的验证功能，在开始之前，需要了解如下几个注意事项，方面您快速上手：

Form组件绑定model参数
model参数为一个对象，对象属性为需要验证的变量名。
通过ref，在onMounted生命周期调用组件的setRules方法绑定验证规则，无法通过props传递变量，是因为微信小程序会过滤掉对象中的方法，导致自定义验证规则无效。

<template>
	<view>
		<u-form :model="form" ref="uFormRef">
			<u-form-item label="姓名" prop="name">
				<u-input v-model="form.name" />
			</u-form-item>
			<u-form-item label="简介" prop="intro">
				<u-input v-model="form.intro" />
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const uFormRef = ref();
const form = reactive({
	name: '',
	intro: ''
});
const rules = {
	name: [
		{
			required: true,
			message: '请输入姓名',
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['change', 'blur']
		}
	],
	intro: [
		{
			min: 5,
			message: '简介不能少于5个字',
			trigger: 'change'
		}
	]
};

function submit() {
	uFormRef.value?.validate((valid: boolean) => {
		if (valid) {
			console.log('验证通过');
		} else {
			console.log('验证失败');
		}
	});
}

onMounted(() => {
	uFormRef.value?.setRules(rules);
});
</script>
u-form-item绑定label和prop
此组件最大的作用是与u-form和u-input等组件进行交互，在表单验证时，需要绑定prop参数，此参数为u-form组件的model对象中的属性名， 目的是在验证时，通过这个prop属性名将父组件u-form的model和rules规则关联起来。

注意点：

通过prop绑定对应的属性名，这里是字符串，而不是一个变量。
通过label参数设置左边显示的提示文字，另外通过label-position可以配置label在左边还是上方。

<template>
	<u-form :model="form" ref="uFormRef">
		<u-form-item label="姓名" prop="name">
			<u-input v-model="form.name" />
		</u-form-item>
		<u-form-item label="简介" prop="intro">
			<u-input v-model="form.intro" />
		</u-form-item>
	</u-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const uFormRef = ref();
const form = reactive({
	name: '',
	intro: ''
});
const rules = {
	name: [
		{
			required: true,
			message: '请输入姓名',
			// 可以单个或者同时写两个触发验证方式
			trigger: ['blur', 'change']
		}
	],
	intro: [
		{
			min: 5,
			message: '简介不能少于5个字',
			trigger: 'change'
		}
	]
};

onMounted(() => {
	uFormRef.value?.setRules(rules);
});
</script>
从上面的示例我们可以看到，rules中的属性名和form的属性名是一致的，同时传递给u-form-item的prop参数绑定的也是相同的属性名，注意这里prop参数绑定的是 字符串(属性名)，而不是一个变量。

验证规则
组件验证部分采用了async-validator，一个字段可以设置多个内置规则，以及自定义规则，触发方式等， 每个字段的验证规则为一个数组，数组的每一个元素对象为其中一条规则(一个字段的验证可以配置多个规则)，如下：


const rules = {
	name: [
		// 对name字段进行长度验证
		{
			min: 5,
			message: '简介不能少于5个字',
			trigger: 'change'
		},
		// 对name字段进行必填验证
		{
			required: true,
			message: '请填写姓名',
			trigger: ['change', 'blur']
		}
	]
};
验证规则属性
每一个验证规则中，可以配置多个属性，下面对常用的属性进行讲解，更具体的可以查看async-validator的文档说明：

trigger{String | Array}：触发校验的方式有2种：

change：字段值发生变化时校验
blur：输入框失去焦点时触发
如果同时监听两种方式，需要写成数组形式：['change', 'blur']
type
内置校验规则，如这些规则无法满足需求，可以使用正则匹配、或者使用validator自定义方法并结合uView自带验证规则。

string：必须是 string 类型，默认类型
number：必须是 number 类型
boolean：必须是 boolean 类型
method：必须是 function 类型
regexp：必须是 regexp 类型，这里的正则，指的是判断字段的内容是否一个正则表达式，而不是用这个正则去匹配字段值
integer：必须是整数类型
float：必须是浮点数类型
array：必须是 array 类型
object：必须是 object 类型
enum：必须出现在 enmu 指定的值中
date：必须是 date 类型
url：必须是 url 类型
hex：必须是 16 进制类型
email：必须是 email 类型
any：任意类型
required
布尔值，是否必填，配置此参数不会显示输入框左边的必填星号，如需要，请配置u-form-item的required为true

pattern
要求此参数值为一个正则表达式，如： /\d+/，不能带引号，如："/\d+/"，组件会对字段进行正则判断，返回结果。

min
最小值，如果字段类型为字符串和数组，会取字符串长度与数组长度(length)与min比较，如果字段是数值，则直接与min比较。

max
最大值，规则同min参数

len
指定长度，规则同min，优先级高于min和max

enum 指定的值，配合 type: 'enum' 使用

whitespace
如果字段值内容都为空格，默认无法通过required: true校验，如果要允许通过，需要将此参数设置为true

transform，校验前对值进行转换，函数的参数为当前值，返回值为改变后的值，参数如如下：

value：当前校验字段的值
message
校验不通过时的提示信息

validator：自定义同步校验函数，参数如下：

rule：当前校验字段在 rules 中所对应的校验规则
value：当前校验字段的值
callback：校验完成时的回调，一般无需执行callback，返回true(校验通过)或者false(校验失败)即可
asyncValidator：自定义异步校验函数，参数如下：

rule：当前校验字段在 rules 中所对应的校验规则
value：当前校验字段的值
callback：校验完成时的回调，执行完异步操作(比如向后端请求数据验证)，如果不通过，需要callback(new Error('提示错误信息'))，如果校验通过，执行callback()即可
uView Pro自带验证规则
uView在JS板块的Test 规则校验中有大量内置的验证规则，这些规则对表单验证来说，属于自定义规则，故需要用到上方规则属性的 validator自定义验证函数，这里做一个详细说明。

我们知道uView有自带的判断手机号的验证方法uni.$u.test.mobile(value)，但是async-validator没有 内置判断手机号的规则，所以将二者结合使用：


const rules = {
	// 字段名称
	mobile: [
		{
			required: true,
			message: '请输入手机号',
			trigger: ['change', 'blur']
		},
		{
			// 自定义验证函数，见上说明
			validator: (rule: any, value: string, callback: Function) => {
				// uni.$u.test.mobile()就是返回true或者false的
				return uni.$u.test.mobile(value);
			},
			message: '手机号码不正确',
			trigger: ['change', 'blur']
		}
	]
};
综合实战
上面讲述了async-validator的规则和配置，以及uView内置规则的结合使用，下面我们进行一个综合 实战示例，要入对某一个字段进行如下验证(验证实现有多种方法，下方仅为引导示例，非唯一，或最优做法)：

必填，同时可接受change和blur触发校验：配置required参数为true，同时配置trigger为[change, bulr]
必须为字母或字符串，校验前先将字段值转为字符串类型：通过pattern参数配置正则：/^[0-9a-zA-Z]*$/g，通过transform参数在校验前对字段值转换为字符串
长度6-8个字符之间：通过 配置min为6，max为8
需要包含字母"A"：使用uView的uni.$u.test.contains()方法，并结合validator自定义函数实现
异步校验，输入完账号，输入框失去焦点时，向后端请求该账号是否已存在：通过上方的asyncValidator异步函数进行验证。
综上，我们可以得出如下的一个配置规则(仅为综合演示，非最优做法)：


const rules = {
	name: [
		// 必填规则
		{
			required: true,
			message: '此为必填字段',
			// blur和change事件触发检验
			trigger: ['blur', 'change']
		},
		// 正则判断为字母或数字
		{
			pattern: /^[0-9a-zA-Z]*$/g,
			// 正则检验前先将值转为字符串
			transform(value: any) {
				return String(value);
			},
			message: '只能包含字母或数字'
		},
		// 6-8个字符之间的判断
		{
			min: 6,
			max: 8,
			message: '长度在6-8个字符之间'
		},
		// 自定义规则判断是否包含字母"A"
		{
			validator: (rule: any, value: string, callback: Function) => {
				return uni.$u.test.contains(value, "A");
			},
			message: '必须包含字母"A"'
		},
		// 校验用户是否已存在
		{
			asyncValidator: (rule: any, value: string, callback: Function) => {
				uni.$u.post('/xxx/xxx', { name: value }).then((res: any) => {
					// 如果验证不通过，需要在callback()抛出new Error('错误提示信息')
					if (res.error) {
						callback(new Error('姓名重复'));
					} else {
						// 如果校验通过，也要执行callback()回调
						callback();
					}
				});
			}
			// 如果是异步校验，无需写message属性，错误的信息通过Error抛出即可
			// message: 'xxx'
		}
	]
};
校验错误提示方式
uView提供了多种校验的错误提示方式，这些值需要包含在数组(可以填写多个值，同时进行多种提示)中，传递给Form组件的error-type参数：

message：默认为输入框下方用文字进行提示
none：只要包含此值，将不会进行任何提示
border-bottom：配置作用域底部的下划线显示为红色
border：配置输入框的边框为红色进行提示 -- 如果有配置显示Input组件显示边框的话
toast：以"toast"提示的方式弹出错误信息，每次只弹出最前面的那个表单域的错误信息(1.3.5新增)

<template>
	<u-form :error-type="errorType">
		<!-- ... -->
	</u-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const errorType = ref(['message']);
// 不提示
// const errorType = ref(['none']);
// 文字和下划线提示
// const errorType = ref(['message', 'border-bottom']);
</script>
校验
进行了上方的配置和讲解后，进入到最后一步，执行验证：
需要通过ref调用Form组件的validate方法，该方法回调函数的参数为一个布尔值，true为校验通过，否则反之。


<template>
	<view>
		<u-form :model="form" ref="uFormRef">
			<u-form-item label="姓名" prop="name">
				<u-input v-model="form.name" />
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const uFormRef = ref();
const form = reactive({
	name: ''
});
const rules = {
	name: [
		{
			required: true,
			message: '请输入姓名',
			trigger: ['blur', 'change']
		}
	]
};

function submit() {
	uFormRef.value?.validate((valid: boolean) => {
		if (valid) {
			console.log('验证通过');
		} else {
			console.log('验证失败');
		}
	});
}

onMounted(() => {
	uFormRef.value?.setRules(rules);
});
</script>
API
Form Props
参数	说明	类型	默认值	可选值
model	表单数据对象	Object	-	-
rules	通过ref设置，见上方说明	Object	-	-
error-type	错误的提示方式，数组形式，见上方说明	Array	['message', 'toast']	-
border-bottom	是否显示表单域的下划线边框	Boolean	true	-
label-position	表单域提示文字的位置，left-左侧，top-上方	String	left	top
label-width	提示文字的宽度，单位rpx	String | Number	90	数值 / auto
label-style	lable的样式，对象形式	Object	-	-
label-align	lable的对齐方式	String	left	center / right
Form Methods
此方法如要通过ref手动调用

名称	说明	参数
setRules	调用此方法，设置校验规则	Function(rules)
resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果	-
validate	对整个表单进行校验的方法	Function(callback: Function(boolean))
Form-item Props
参数	说明	类型	默认值	可选值
label	左侧提示文字	String	-	-
prop	表单域model对象的属性名，在使用 validate、resetFields 方法的情况下，该属性是必填的	String	-	-
border-bottom	是否显示下边框，如不需要下边框，需同时将u-form的同名参数设置为false	Boolean	true	true / false
label-position	表单域提示文字的位置，left-左侧，top-上方，如设置，将覆盖u-form的同名参数	String	-	left / top
label-width	提示文字的宽度，单位rpx，如设置，将覆盖u-form的同名参数	String | Number	-	-
label-style	lable的样式，对象形式，如设置，将覆盖u-form的同名参数	Object	-	-
label-align	lable的对齐方式，如设置，将覆盖u-form的同名参数	String	-	-
right-icon	右侧自定义字体图标(限uView内置图标)或图片地址	String	-	
left-icon	左侧自定义字体图标(限uView内置图标)或图片地址	String	-	
left-icon-style	左侧图标的样式，对象形式	Object	-	-
right-icon-style	右侧图标的样式，对象形式	Object	-	-
required	是否显示左边的"*"号，这里仅起展示作用，如需校验必填，请通过rules配置必填规则	Boolean	false	true
Form-item Slot
名称	说明
-	Form Item 的内容
right	右侧自定义内容，可以在此传入一个按钮，用于获取验证码等场景

## Calendar 日历 
此组件用于单个选择日期，范围选择日期等，日历被包裹在底部弹起的容器中。

注意： 此组件与Picker 选择器的日期选择模式有一定的重合之处，区别在于本组件为更专业的日期选择场景，能选择日期范围等。 另外Picker组件的日期模式可以配置更多的参数，如时、分、秒等，可以根据不同的使用场景进行选择。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过v-model绑定一个布尔变量用于打开或收起日历弹窗。
通过mode参数指定选择单个日期，还是选择日期范围。

<template>
	<view>
		<u-calendar v-model="show" :mode="mode"></u-calendar>
		<u-button @click="show = true">打开</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarMode } from 'uview-pro/types/global'

const show = ref(false)
const mode = ref<CalendarMode>('date')

</script>
日历模式
mode为date只能选择单个日期
mode为range可以选择日期范围
单个日期模式
选择日期后，需要点击底部的确定按钮才能触发回调事件，回调参数为一个对象，有如下属性：


{
	day: 4, // 选择了哪一天
	days: 30, // 这个月份有多少天
	isToday: true, // 选择的日期是否今天
	month: 6, // 选择的月份
	result: "2020-06-04", // 选择的日期整体值
	week: "星期四", // 选择日期所属的星期数
	year: 2020 , // 选择的年份
}
示例代码：


<template>
	<u-calendar v-model="show" :mode="mode" @change="change"></u-calendar>
</template>

<script setup>
import { ref } from 'vue'
import type { CalendarChangeDate, CalendarChangeRange, CalendarMode } from 'uview-pro/types/global'

const show = ref(true)
const mode = ref<CalendarMode>('date')

function change(e: CalendarChangeRange | CalendarChangeDate) { 
	console.log(e)
}
</script>
日期范围模式
此模式用于选择一个日期范围，比如住酒店的入住到离店的日期范围，有如下可配置的参数：

active-bg-color参数配置起始/结束日期按钮的背景色
active-color参数配置起始/结束日期按钮的字体颜色
range-bg-color参数配置起始/结束日期之间的区域的背景颜色，默认为rgba(41,121,255,0.13)，为浅蓝色
start-text参数用于设置起始日期底部的提示文字，如"住店"
end-text参数用于设置结束日期底部的提示文字，如"离店"
此模式的返回参数如下：


{
	endDate: "2020-06-04", // 选择的结束日期
	endDay: 4, // 结束日期是哪一天
	endMonth: 6, // 结束日期的月份
	endWeek: "星期四", // 结束日期的星期数
	endYear: 2020, // 结束日期的年份
	startDate: "2020-06-01", // 选择的起始日期
	startDay: 1, // 起始日期是哪一天
	startMonth: 6, // 起始日期的月份
	startWeek: "星期一", // 起始日期的星期数
	startYear: 2020 // 起始日期的年份
}
示例代码：


<template>
	<u-calendar v-model="show" :mode="mode" @change="change"></u-calendar>
</template>

<script setup>
import { ref } from 'vue'
import type { CalendarChangeDate, CalendarChangeRange, CalendarMode } from 'uview-pro/types/global'

const show = ref(true)
const mode = ref<CalendarMode>('range')

function change(e: CalendarChangeRange | CalendarChangeDate) { 
	console.log(e)
}
</script>
显示农历模式 
v 0.2.1 +
支持农历选择和回调，配置的参数：

show-lunar是否显示农历
单个日期模式的返回参数如下：


{
	day: 4, // 选择了哪一天
	days: 30, // 这个月份有多少天
	isToday: true, // 选择的日期是否今天
	month: 6, // 选择的月份
	result: "2020-06-04", // 选择的日期整体值
	week: "星期四", // 选择日期所属的星期数
	year: 2020 , // 选择的年份
	lunar: { 
		dayCn: '十三', // 农历的日
        monthCn: '四月', // 农历的月
		weekCn: "星期四", // 选择日期所属的星期数
        day: '13', // 农历的日
        month: '4', // 农历的月
		week: 4, // 选择日期所属的星期数
        year: 2020 // 农历的年份
	},
}
日期范围模式的返回参数如下：


{
	endDate: "2020-06-04", // 选择的结束日期
	endDay: 4, // 结束日期是哪一天
	endMonth: 6, // 结束日期的月份
	endWeek: "星期四", // 结束日期的星期数
	endYear: 2020, // 结束日期的年份
	startDate: "2020-06-01", // 选择的起始日期
	startDay: 1, // 起始日期是哪一天
	startMonth: 6, // 起始日期的月份
	startWeek: "星期一", // 起始日期的星期数
	startYear: 2020, // 起始日期的年份
	startLunar: { 
		dayCn: '初十',
        monthCn: '四月',
		weekCn: "星期一",
        day: '13',
        month: '4',
		week: 1,
        year: 2020
	},
	endLunar: { 
		dayCn: '十三',
        monthCn: '四月',
		weekCn: "星期四",
        day: '13',
        month: '4',
		week: 4,
        year: 2020
	},
}
示例代码：


<template>
	<view>
		<u-calendar v-model="show" :mode="mode" :show-lunar="showLunar" @change="change"></u-calendar>
		<view>{{ result }}</view>
		<view>{{ lunarResult }}</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import type { CalendarChangeDate, CalendarChangeRange, CalendarMode } from 'uview-pro/types/global'

const show = ref(true)
const result = ref('')
const lunarResult = ref('')
const mode = ref<CalendarMode>('date')
const showLunar = ref(true)


function change(e: CalendarChangeRange | CalendarChangeDate) {
    if (mode.value === 'range') {
        const range = e as CalendarChangeRange;
        result.value = range.startDate + ' - ' + range.endDate;
        if (showLunar.value && range.startLunar && range.endLunar) {
            lunarResult.value = `${range.startLunar.monthCn ?? ''}${range.startLunar.dayCn ?? ''}` + ' - ' + `${range.endLunar.monthCn ?? ''}${range.endLunar.dayCn ?? ''}`;
        } else {
            lunarResult.value = '';
        }
    } else {
        const single = e as CalendarChangeDate;
        result.value = single.result;
        if (showLunar.value && single.lunar) {
            lunarResult.value = `${single.lunar.monthCn ?? ''}${single.lunar.dayCn ?? ''}`;
        } else {
            lunarResult.value = '';
        }
    }
}
</script>
自定义内容
组件有一个默认插槽，名为tooltip，传入的内容将会显示在键盘的顶部位置，如使用，需要为传入的内容自定义样式。


<template>
	<u-calendar v-model="show" :mode="mode" @change="change">
		<template #tooltip>
			<view class="title">
				请选择住店/离店时间
			</view>
		</template>
	</u-calendar>
</template>

<script setup>
import { ref } from 'vue'
import type { CalendarChangeDate, CalendarChangeRange, CalendarMode } from 'uview-pro/types/global'

const show = ref(true)
const mode = ref<CalendarMode>('range')

function change(e: CalendarChangeRange | CalendarChangeDate) { 
	console.log(e)
}
</script>

<style lang="scss" scoped>
	.title{
		color: $u-type-primary;
		text-align: center;
		padding: 20rpx 0 0 0;
	}
</style>
API
Props
参数	说明	类型	默认值	可选值
mode	选择日期的模式，date-为单个日期，range-为选择日期范围	String	date	range
v-model	布尔值变量，用于控制日历的弹出与收起	Boolean	false	true
show-lunar 
v 0.2.1 +	是否显示农历	Boolean	false	true
safe-area-inset-bottom	是否开启底部安全区适配	Boolean	false	true
change-year	是否显示顶部的切换年份方向的按钮	Boolean	true	false
change-month	是否显示顶部的切换月份方向的按钮	Boolean	true	false
max-year	可切换的最大年份	Number | String	2050	-
min-year	可切换的最小年份	Number | String	1950	-
min-date	最小可选日期	Number | String	1950-01-01	-
max-date	最大可选日期	Number | String	当前日期	-
border-radius	弹窗顶部左右两边的圆角值，单位rpx	Number | String	20	-
mask-close-able	是否允许通过点击遮罩关闭日历	Boolean	true	false
month-arrow-color	月份切换按钮箭头颜色	String	#606266	-
year-arrow-color	年份切换按钮箭头颜色	String	#909399	-
color	日期字体的默认颜色	String	#303133	-
active-bg-color	起始/结束日期按钮的背景色	String	#2979ff	-
z-index	弹出时的z-index值	String | Number	10075	-
active-color	起始/结束日期按钮的字体颜色	String	#ffffff	-
range-bg-color	起始/结束日期之间的区域的背景颜色	String	rgba(41,121,255,0.13)	-
range-color	选择范围内字体颜色	String	#2979ff	-
start-text	起始日期底部的提示文字	String	开始	-
end-text	结束日期底部的提示文字	String	结束	-
btn-type	底部确定按钮的主题	String	primary	default / success / info/ warning / error
toolTip	顶部提示文字，如设置名为tooltip的slot，此参数将失效	String	选择日期	-
closeable	是否显示右上角的关闭图标	Boolean	true	false
Slot
名称	说明
tooltip	自定义日历顶部的内容
Event
事件名	说明	回调参数
change	点击右上角确定按钮时触发	选择日期相关的返回参数

## Select 列选择器 
此选择器用于单列，多列，多列联动的选择场景。

注意： 新版本不建议使用Picker组件的单列和多列模式，Select组件是专门为列选择而构造的组件，更简单易用。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
所有的配置模式中，都要求传入数组的元素(对象)中含有value和label属性(可以通过value-name和label-name参数自定义)， value用于在回调时，区别选择了哪一个(针对开发者)，label用于展示在选择器中，供用户选择和查看(针对用户)。

通过v-model绑定一个布尔值变量，用于控制组件的弹出与收起。
组件共有3种模式，通过配置mode参数实现，如下：
mode = single-column，为单列选择模式。
mode = mutil-column，为多列选择模式。
mode = mutil-column-auto，为多列联动模式，多列联动的数据格式比较特殊，见下方说明。

<template>
	<view>
		<u-select v-model="show" :list="list"></u-select>
		<u-button @click="show = true">打开</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义列表项接口
interface ListItem {
	value: string
	label: string
}

// 定义响应式数据
const show = ref<boolean>(false)
const list = ref<ListItem[]>([
	{
		value: '1',
		label: '江'
	},
	{
		value: '2',
		label: '湖'
	}
])
</script>
单列模式
此方式使用较为简单，需要传入一个一维数组，数组的元素为对象，要求必须有value和label属性，这两个值也将会在回调中被返回。


<template>
	<u-select v-model="show" mode="single-column" :list="list" @confirm="confirm"></u-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义列表项接口
interface ListItem {
	value: string
	label: string
}

// 定义响应式数据
const show = ref<boolean>(true)
const list = ref<ListItem[]>([
	{
		value: '1',
		label: '江'
	},
	{
		value: '2',
		label: '湖'
	}
])

// 定义确认回调函数
const confirm = (e: any[]) => {
	// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
	console.log(e)
}
</script>
多列模式
此模式类似于单列模式，不同之处在于list参数为二维数组，同样要求数组的元素必须要有value和label属性，回调参数为包含多个元素的数组， 分别表示每一列的选择情况。


<template>
	<u-select v-model="show" mode="mutil-column" :list="list" @confirm="confirm"></u-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义列表项接口
interface ListItem {
	value: string
	label: string
}

// 定义二维数组类型
type MultiColumnList = ListItem[][]

// 定义响应式数据
const show = ref<boolean>(true)
const list = ref<MultiColumnList>([
	[
		{
			value: '1',
			label: '江'
		},
		{
			value: '2',
			label: '湖'
		}
	],
	[
		{
			value: '3',
			label: '夜'
		},
		{
			value: '4',
			label: '雨'
		}
	]
])

// 定义确认回调函数
const confirm = (e: any[]) => {
	// 回调参数为包含多个元素的数组，每个元素分别反应每一列的选择情况
	console.log(e)
}
</script>
多列联动模式
由于需要多列联动，此模式和上面的"多列模式"基本相同，但是也有区别的地方，因为需要"联动"，需要在每个对象中多一个children属性，用于标识 它的子列(后一列)的可选值，回调参数和"多列模式"一致。


<template>
	<u-select v-model="show" mode="mutil-column-auto" :list="list" @confirm="confirm"></u-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义联动列表项接口
interface LinkedListItem {
	value: number
	label: string
	children?: LinkedListItem[]
}

// 定义响应式数据
const show = ref<boolean>(true)
const list = ref<LinkedListItem[]>([
	{
		value: 1,
		label: '中国',
		children: [
			{
				value: 2,
				label: '广东',
				children: [
					{
						value: 3,
						label: '深圳'
					},
					{
						value: 4,
						label: '广州'
					}
				]
			},
			{
				value: 5,
				label: '广西',
				children: [
					{
						value: 6,
						label: '南宁'
					},
					{
						value: 7,
						label: '桂林'
					}
				]
			}
		]
	},
	{
		value: 8,
		label: '美国',
		children: [
			{
				value: 9,
				label: '纽约',
				children: [
					{
						value: 10,
						label: '皇后街区'
					}
				]
			}
		]
	}
])

// 定义确认回调函数
const confirm = (e: any[]) => {
	console.log(e)
}
</script>
默认值
此组件的所有模式，都可以设置默认值，通过default-value数组参数配置，数组元素的0表示选中每列的哪个值(从0开始)，下面分别对几种模式进行说明：

注意： default-value数组的长度，必须与列数相同，否则无效。

单列模式
如设置default-value为[1]表示默认选中第2个(从0开始)，[5]表示选中第6个。

多列模式
如设置default-value为[1, 3]表示第一列默认选中第2个，第二列默认选中第4个。

多列联动模式
配置方法同"多列模式"，见上。


回调参数
注意： 如果您觉得回调的value和label属性还无法满足您的需求，您可以在传递给list的参数中多带一个extra属性，如果有此属性， 在回调中将会多返回一个extra属性值(1.3.6新增)。

单列模式
此模式点击确定或取消按钮，会返回一个只有一个元素的数组，此元素即为回调结果，数组内容可能如下：


res = [
	{
		label: '雪月夜',
		value: '1',
		// 如果传递给"list"的对象中有extra属性，将会在此返回
		// extra: 'xxx'
	}
]
多列模式
此模式点击确定或取消按钮，会返回一个有多个元素的数组，元素的数量和列数相等，第0个元素(索引从0开始)与第一列(也可以认为是第0列)相匹配，以此类推， 返回结果可能如下：


res = [
	{
		label: '雪月夜',
		value: '1'
	},
	{
		label: '冷夜雨',
		value: '2'
	},
]
多列联动
返回结果同上方的"多列模式"。

API
Props
参数	说明	类型	默认值	可选值
mode	模式选择，"single-column"-单列模式，"mutil-column"-多列模式，"mutil-column-auto"-多列联动模式	String	single-column	mutil-column / mutil-column-auto
list	列数据，数组形式，见上方说明	Array	-	-
v-model	布尔值变量，用于控制选择器的弹出与收起	Boolean	false	true
safe-area-inset-bottom	是否开启底部安全区适配	Boolean	false	true
cancel-color	取消按钮的颜色	String	#606266	-
confirm-color	确认按钮的颜色	String	#2979ff	-
default-value	提供的默认选中的下标，见上方说明	Array	-	-
mask-close-able	是否允许通过点击遮罩关闭Picker	Boolean	true	false
z-index	弹出时的z-index值	String | Number	10075	-
value-name	自定义list数据的value属性名	String	value	-
label-name	自定义list数据的label属性名	String	label	-
child-name	自定义list数据的children属性名，只对多列联动模式有效	String	children	-
title	顶部中间的标题	String	-	-
confirm-text	确认按钮的文字	String	确认	-
cancel-text	取消按钮的文字	String	取消	-
Events
事件名	说明	回调参数	版本
confirm	点击确定按钮，返回当前选择的值	Array: 见上方"回调参数"部分说明	-
cancel	点击取消按钮，返回当前选择的值	Array: 见上方"回调参数"部分说明	-

## Picker 选择器 
此选择器有四种弹出模式

一是时间模式，可以配置年，日，月，时，分，秒参数
二是地区模式，可以配置省，市，区参数
三是单列模式
四是多列模式
说明

不再建议使用此组件的单列和多列模式，因为已经有更友好，简单易用，专门用于处理列选择的Select 列选择器组件， 以后此组件将专注于时间和地区的选择。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过mode参数设置为time、region、selector、multiSelector，区分时间、地区、单列，多列模式。
通过v-model双向绑定一个值为布尔值的变量，来打开或者收起picker。

<template>
	<view>
		<u-picker v-model="show" mode="time"></u-picker>
		<u-button @click="show = true">打开</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const show = ref<boolean>(false)
</script>
一、时间和地区模式
1. 设置默认值
如果mode为time，可以通过default-time参数设置打开时的默认时间，格式如"2025-07-02 13:01:00"、"2025-07-02 13:01"
如果mode为region，可以通过default-region(Array格式)中文的省市区名称，如：["河北省", "秦皇岛市", "北戴河区"]，或者代号的 省市区，如：["13", "1303", "130304"]。
注意：这些省市区的名称和代码，须是uView的Picker组件自身提供的，否则可能无法匹配


<template>
	<u-picker mode="time" v-model="show"></u-picker>
	
	<u-picker mode="region" v-model="show" :area-code='["13", "1303", "130304"]'></u-picker>
</template>
2. 设置需要显示的参数
时间模式时：通过params参数传入一个对象给组件，给需要显示的参数属性置为true，可选的参数有：year、month、day、hour、minute、second。 其中，hour、minute、second值默认为false，其他值默认为true
地区模式时：可选的参数有：province、city、area，默认都为true
下方示例时间模式，只会显示年，月，日3个参数可供选择：


<template>
	<u-picker mode="time" v-model="show" :params="params"></u-picker>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 定义响应式数据
const show = ref<boolean>(false)

// 定义响应式参数对象
const params = reactive({
	year: true,
	month: true,
	day: true,
	hour: false,
	minute: false,
	second: false
})
</script>
3. 回调参数
当点击picker的"取消"或者"确定"按钮时，会分别产生回调事件cancel和confirm，均为会返回组件内部的当前值。回调的参数为一个对象，属性和传递给picker组件的params对象为true的属性一致。

注意：mode为region时，回调对象属性为一个对象，分别有label和value属性，见如下说明：


// 组件内部parmas参数默认值：
let params = {
	year: true,
	month: true,
	day: true,
	hour: false,
	minute: false,
	second: false,
	province: true,
	city: true,
	area: true,
	timestamp: true,
}


// 如果params值如下(时间选择模式)：：
let params = {
	year: true,
	month: true,
	day: true,
	hour: false,
	minute: false,
	second: false,
	// 选择时间的时间戳
	timestamp: true,
}

// 那么回调的参数可能如下：
{
	year: '2020',
	month: '05',
	day: '10'
}


// 如果params值如下(地区选择模式)：
let params = {
	province: true,
	city: true,
	area: true
}

// 那么回调的参数可能如下：
{
	area: {
		label: "宝安区",
		value: "440306"
	},
	city: {
		label: "深圳市",
		value: "4403"
	},
	province: {
		label: "广东省",
		value: "44"
	},
}
二、单列和多列模式
不再建议使用此组件的单列和多列模式，因为已经有更友好，简单易用，专门用于处理列选择的Select 列选择器组件。

1. 设置默认值
如果mode为selector(单列)，可以通过设置default-selector为单元素的数组，表示选中单列中的第几个(索引从0开始)，如: [1]表示选中单列的第二个。
如果mode为multiSelector(多列)，可以通过设置default-selector为多元素的数组(元素数量等于列数)，分别表示选中每一列的第几个(索引从0开始)，如[0, 1, 2] 表示共有3列，分别选中第一列的第一个，第二列的第二个，第三列的第三个。

<template>
	<u-picker mode="selector" v-model="show"  :default-selector="[0]"></u-picker>
	
	<u-picker mode="multiSelector" v-model="show"  :default-selector='[0, 1, 3]'></u-picker>
</template>
2. 设置数据
由于单列和多列模式不像时间和地区模式，没有内置数据，故需要您手动传入可选值，通过range参数(数组)传入对应的数据，单列时为一维数组，多列时为二维数组。

如果您数组中的元素为对象的话，可以通过指定range-key参数，让组件内部知道您想把对象的哪个属性当做要显示的值。


<template>
	<view class="">
		<u-picker mode="selector" v-model="show" :default-selector="[0]" :range="selector"></u-picker>
		
		<u-picker mode="selector" v-model="show" :default-selector="[0]" :range="selectorObj" range-key="cateName"></u-picker>
		
		<u-picker mode="multiSelector" v-model="show" :default-selector="[0, 1]" :range="multiSelector"></u-picker>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 定义响应式数据
const show = ref<boolean>(true)

// 定义选择器数据
const selector = ref<number[]>([1, 2, 3])

// 定义多列选择器数据
const multiSelector = ref<number[][]>([
	[1, 2, 3], 
	[4, 5, 6]
])

// 定义对象选择器数据
const selectorObj = reactive([
	{
		cateName: '1',
		id: 1
	},
	{
		cateName: '2',
		id: 2
	}
])
</script>
3. 回调参数
当点击picker的"取消"或者"确定"按钮时，会分别产生回调事件cancel和confirm，均为会返回组件内部的当前值。回调的参数为一个数组，分别表示 当前各列选中的列索引值(从0开始)。

单列模式
回调参数可能为[3]，表示选中传入数组的第四个值(从0开始)

多列模式
回调参数可能为[1, 0, 3]，表示3列中，第一列选中了第二个值，第二列选中了第一个值，第三列选中了第四个值。

其中，我们使用多列模式，一般都需要联动选择，在多列模式下，有一个columnchange事件，任意列改变都会触发该事件，回调参数为{column: column, index: index}， column表示第几列发生了变化(从0开始)，index表示当前的下标值，如{column: 1, index: 2}表示第二列(从0开始)发生了变化，下标变成了2，您可以 根据这个回调，对应的修改default-selector参数，让多列中的其他列联动起来。

此处演示较为复杂，请见uView的演示代码，在安装页下载演示项目方式，内有所有演示的示例，是一个完整的HX工程。

API
Props
注意：props中没有控制Picker打开与收起的参数，因为这是通过v-model绑定变量实现的，见上方说明。

参数	说明	类型	默认值	可选值
params	需要显示的参数，见上方说明，mode=region或mode=time时有效	Object	-	-
mode	模式选择，region-地区模式，time-时间模式，selector-单列模式，multiSelector-多列模式	String	time	region / selector / multiSelector
start-year	可选的开始年份，mode=time时有效	String | Number	1950	-
end-year	可选的结束年份，mode=time时有效	String | Number	2050	-
safe-area-inset-bottom	是否开启底部安全区适配	Boolean	false	true
cancel-color	取消按钮的颜色	String	#606266	-
confirm-color	确认按钮的颜色	String	#2979ff	-
default-time	默认选中的时间，mode=time时有效，需在onReady生命周期赋值，见顶部说明	String	-	-
default-region	默认选中的地区，中文形式，mode=region时有效，需在onReady生命周期赋值，见顶部说明	Array	-	-
area-code	默认选中的地区，编号形式，mode=region时有效	Array	-	-
default-selector	数组形式，其中每一项表示选择了range对应项中的第几个(下标从0开始)，见上方说明	Array	[]	-
mask-close-able	是否允许通过点击遮罩关闭Picker	Boolean	true	false
show-time-tag	时间模式时，是否显示后面的年月日中文提示	Boolean	true	false
z-index	弹出时的z-index值	String | Number	10075	-
range	自定义选择的数据，mode=selector或mode=multiSelector时有效	Array	[]	-
range-key	当range参数的元素为对象时，指定Object中的哪个key的值作为选择器显示内容，见上方说明	String	-	-
title	顶部中间的标题	String	-	-
confirm-text	确认按钮的文字	String	确认	-
cancel-text	取消按钮的文字	String	取消	-
Events
事件名	说明	回调参数	版本
confirm	点击确定按钮，返回当前选择的值	Object: 见上方"回调参数"部分说明	-
cancel	点击取消按钮，返回当前选择的值	Object: 见上方"回调参数"部分说明	-
columnchange	列发生改变时触发，只对mode = multiSelector时有效	{column: column, index: index}: 见上方"回调参数"部分说明 -

## Field 输入框 
借助此组件，可以实现表单的输入， 有"text"和"textarea"类型的，此外，借助uView的picker和actionSheet组件可以快速实现上拉菜单，时间，地区选择等， 为表单解决方案的利器。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
通过v-model，可以双向绑定输入框的值
通过label设置输入框左边的提示文字
通过placeholder指定个性化的提示语

<template>
	<view>
		<u-field
			v-model="mobile"
			label="手机号"
			placeholder="请填写手机号"
		>
		</u-field>
		<u-field
			v-model="code"
			label="验证码"
			placeholder="请填写验证码"
		>
		</u-field>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const mobile = ref<string>('')
const code = ref<string>('')
</script>
自定义输入框类型
我们可以通过type参数来自定义输入框的类型，如果为text(默认)内部为input输入框，如果为textarea值，内部为textarea输入框，相比input输入框， 它的默认高度约为两个input的高度，且可以换行，同时组件高度也会自动增高，适用于需要多行输入的场景。


<template>
	<view class="">
		<u-field
			v-model="mobile"
			label="手机号"
			placeholder="请填写手机号"
		>
		</u-field>
		
		<u-field
			v-model="mobile"
			label="手机号"
			placeholder="请填写手机号"
			type="textarea"
		>
		</u-field>
	</view>
</template>
必填和错误提示
通过设置required，可以给输入框左边添加一个红色的"*"号，它只起提示作用，uView内部不会判断用户是否输入了值，您需要提交的时候，通过v-model绑定的值自行判断
通过设置error-message，会在输入框下方给用红色给出错误提示

<template>
	<view class="">
		<u-field
			v-model="mobile"
			label="手机号"
			required
			:error-message="errorMessage"
		>
		</u-field>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const mobile = ref<string>('')
const errorMessage = ref<string>('剑未配妥，出门已是江湖')
</script>
在输入框尾部插入按钮
此为在表单填写时，可能需要用户发送验证码的场景，可以通过slot插入一个uView的button组件，通过结合uView的VerificationCode， 可以简单，迅速的将功能集成


<template>
	<view class="">
		<u-field
			v-model="code"
			label="验证码"
			placeholder="请填写验证码"
		>
			<template #right>
				<u-button size="mini" type="success" @click="getCode">{{codeText}}</u-button>
			</template>
		</u-field>
		<u-verification-code ref="uCodeRef" @change="codeChange"></u-verification-code>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const mobile = ref<string>('')
const code = ref<string>('')
const codeText = ref<string>('')

// 定义组件引用
const uCodeRef = ref<any>(null)

// 定义事件处理函数
const codeChange = (text: string) => {
	codeText.value = text
}

const getCode = () => {
	if (uCodeRef.value?.canGetCode) {
		// 模拟向后端请求验证码
		uni.showLoading({
			title: '正在获取验证码'
		})
		setTimeout(() => {
			uni.hideLoading()
			// 通知验证码组件内部开始倒计时
			uCodeRef.value?.start()
		}, 1000)
	} else {
		uni.$u.toast('倒计时结束后再发送')
	}
}
</script>
如何与Picker或者actionSheet等组件结合
某些场景，比如需要用用户选择性别，或者时间，地区选择等，我们可以结合uView的ActionSheet和Picker组件解决， 这种情况，一般都是要求field组件是不可输入内容的，我们需要设置disabled参数为true，既然是需要弹出选择框，field组件右边应该要有一个实心向下的 三角形图标，配置为right-icon为arrow-down-fill，同时监听click即可。这一切，uView都帮您想到，并且做好了。


<template>
	<view class="">
		<u-field @click="showAction" v-model="sex" 
		:disabled="true" label="性别" placeholder="请选择性别"
		right-icon="arrow-down-fill"
		>
		</u-field>
		<u-action-sheet @click="clickItem" :list="sexList" v-model="show"></u-action-sheet>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义响应式数据
const sex = ref<string>('')
const show = ref<boolean>(false)

// 定义性别选项列表
const sexList = ref<Array<{ text: string }>>([
	{
		text: '男',
	},
	{
		text: '女'
	},
	{
		text: '保密'
	}
])

// 定义事件处理函数
const showAction = () => {
	show.value = true
}

const clickItem = (index: number) => {
	sex.value = sexList.value[index].text
}
</script>
API
Props
参数	说明	类型	默认值	可选值
type	输入框的类型	String	text	textarea
icon	label左边的图标，限uView的图标名称	String	-	-
border-bottom	是否显示field的下边框	Boolean	true	false
border-top	是否显示field的上边框	Boolean	false	true
icon-style	icon的样式，对象形式	Object	-	-
right-icon	输入框右边的图标名称，限uView的图标名称	String	-	-
required	是否必填，左边显示红色"*"号	Boolean	false	true
label	输入框左边的文字提示	String	-	-
password	是否密码输入方式(用点替换文字)，type为text时有效	Boolean	false	true
clearable	是否显示右侧清空内容的图标控件(输入框有内容，且获得焦点时才显示)，点击可清空输入框内容	Boolean	true	false
label-width	label的宽度，单位rpx	Number | String	130	-
label-align	label的文字对齐方式	String	left	center / right
input-align	输入框内容对齐方式	String	left	center / right
icon-color	左边通过icon配置的图标的颜色	String	#606266	-
clear-size	清除图标的大小，单位rpx	Number | String	30	-
field-style	输入框的样式，对象形式	Object	-	-
auto-height	是否自动增高输入区域，type为textarea时有效	Boolean	true	false
error-message	显示的错误提示内容，如果为空字符串或者false，则不显示错误信息	String \ Boolean	-	-
placeholder	输入框的提示文字	String	-	-
placeholder-style	placeholder的样式(内联样式，字符串)，如"color: #ddd"	String	-	-
focus	是否自动获得焦点	Boolean	false	true
fixed	如果type为textarea，且在一个"position:fixed"的区域，需要指明为true	Boolean	false	true
disabled	是否不可输入	Boolean	false	true
maxlength	最大输入长度，设置为 -1 的时候不限制最大长度	Number | String	140	-
confirm-type	设置键盘右下角按钮的文字，仅在type="text"时生效	String	done	-
trim	是否自动去除两端的空格	Boolean	true	false
Slot
名称	说明
icon	自定义左侧的图标
right	自定义右侧内容
Events
事件名	说明	回调参数
input	输入框内容发生变化时触发	value：输入框的内容，建议通过v-model双向绑定输入值，而不是监听此事件的形式
focus	输入框获得焦点时触发	-
blur	输入框失去焦点时触发	-
confirm	点击完成按钮时触发	value：输入框的内容，建议通过v-model双向绑定输入值，而不是监听此事件的形式
right-icon-click	通过right-icon生成的图标被点击时触发	
click	输入框被点击或者通过right-icon生成的图标被点击时触发，这样设计是考虑到传递右边的图标，一般都为需要弹出"picker"等操作时的场景，点击倒三角图标，理应发出此事件，见上方说明	-

## Checkbox 复选框 
复选框组件一般用于需要多个选择的场景，该组件功能完整，使用方便

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
该组件无需强制搭配checkboxGroup组件使用(视情况而定)，可以单个独立使用u-checkbox组件
通过v-model给checkbox绑定一个变量，这个绑定的变量是双向的(初始值只能是true或者false)，也就是说，您可以无需监听checkbox或者checkboxGroup组件的change事件，也能知道哪个复选框 被勾选了

<template>
	<view class="">
		<u-checkbox-group @change="checkboxGroupChange">
			<u-checkbox 
				@change="checkboxChange" 
				v-model="item.checked" 
				v-for="(item, index) in list" :key="index" 
				:name="item.name"
			>{{item.name}}</u-checkbox>
		</u-checkbox-group>
		<u-button @click="checkedAll">全选</u-button>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface CheckboxItem {
  name: string
  checked: boolean
  disabled: boolean
}

const list = reactive<CheckboxItem[]>([
  {
    name: 'apple',
    checked: false,
    disabled: false
  },
  {
    name: 'banner',
    checked: false,
    disabled: false
  },
  {
    name: 'orange',
    checked: false,
    disabled: false
  }
])

// 选中某个复选框时，由checkbox时触发
const checkboxChange = (e: any) => {
  //console.log(e);
}

// 选中任一checkbox时，由checkbox-group触发
const checkboxGroupChange = (e: any) => {
  // console.log(e);
}

// 全选
const checkedAll = () => {
  list.map(val => {
    val.checked = true;
  })
}
</script>
禁用checkbox
设置disabled为true，即可禁用某个组件，让用户无法点击，禁用分为两种状态，一是未勾选前禁用，这时只显示一个灰色的区域。二是已勾选后 再禁用，会有灰色的已勾选的图标，但此时依然是不可操作的。


<u-checkbox-group>
	<u-checkbox v-model="checked" :disabled="false">天涯</u-checkbox>
</u-checkbox-group>
自定义形状
可以通过设置shape为square或者circle，将复选框设置为方形或者圆形


<u-checkbox-group>
	<u-checkbox v-model="checked" shape="circle">明月</u-checkbox>
</u-checkbox-group>
自定义颜色
此处所指的颜色，为checkbox选中时的背景颜色，参数为active-color


<u-checkbox-group>
	<u-checkbox v-model="checked" active-color="red">光影</u-checkbox>
</u-checkbox-group>
文本是否可点击
设置label-disabled为false，点击文本时，无法操作checkbox


<u-checkbox-group>
	<u-checkbox v-model="checked" :label-disabled="false">剑舞</u-checkbox>
</u-checkbox-group>
API
Checkbox Props
注意：需要给checkbox组件通过v-model绑定一个布尔值，来初始化checkbox的状态，随后该值被双向绑定， 当用户勾选复选框时，该值在checkbox内部被修改为true，并反映到父组件，否则为false，换言之，您无需监听checkbox的change事件，也能 知道某一个checkbox是否被选中的状态

注意：checkbox和checkbox-group二者同名参数中，checkbox的参数优先级更高。

参数	说明	类型	默认值	可选值
v-model	双向绑定某一个checkbox的值，如果将该变量设置为true，将会被选中	String \ Number	-	-
size	组件整体的大小，单位rpx	String \ Number	-	-
label-size	label字体大小，单位rpx	String \ Number	-	-
icon-size	图标大小，单位rpx	String \ Number	-	-
name	checkbox组件的标示符	String \ Number	-	-
shape	形状，见上方说明	String	-	square
disabled	是否禁用	Boolean	-	false / true
label-disabled	是否禁止点击文本操作checkbox	Boolean	-	false / true
active-color	选中时的颜色，如设置CheckboxGroup的active-color将失效	String	-	-
CheckboxGroup Props
参数	说明	类型	默认值	可选值
max	最多能选中多少个checkbox	String \ Number	999	-
disabled	是否禁用所有checkbox	Boolean	false	true
icon-size	图标大小，单位rpx	String \ Number	20	-
size	组件整体的大小，单位rpx	String \ Number	34	-
shape	形状，见上方说明	String	circle	square
active-color	选中时的颜色，应用到所有子Checkbox组件	String	#2979ff	-
label-disabled	是否禁止点击文本操作checkbox	Boolean	false	true
width	checkbox的宽度，需带单位，如50%，150rpx	String	auto	-
wrap	是否每个checkbox占一行	Boolean	false	true
Checkbox Event
事件名	说明	回调参数	版本
change	某个checkbox状态发生变化时触发，回调为一个对象	detail = {value: [true或者false，true为被选中，否则反之], name: [通过props传递的name参数] }	-
CheckboxGroup Event
事件名	说明	回调参数	版本
change	任一个checkbox状态发生变化时触发，回调为一个对象	detail = array( [元素为被选中的checkbox的name] )	-

## Radio 单选框 
单选框用于有一个选择，用户只能选择其中一个的场景。

平台差异说明
App	H5	微信小程序	支付宝小程序	百度小程序	头条小程序	QQ小程序
√	√	√	√	√	√	√
基本使用
该组件需要搭配radioGroup组件使用，以便用户进行操作时，获得当前单选框组的选中情况，当然，您也可以单独对某个radio进行事件监听
通过v-model给radioGroup组件绑定一个变量，这个绑定的变量是双向的(初始值只能是true或者false)，也就是说，您可以无需监听radio或者radioGroup组件的change事件，也能知道哪个 被勾选了
注意： 由于radio组件需要由radioGroup组件提供参数值，这些父子组件间通过Vue的"provide/inject"特性注入依赖， 所以您必须使用radioGroup包裹radio组件才能正常使用。


<template>
	<view class="">
		<u-radio-group v-model="value" @change="radioGroupChange">
			<u-radio 
				@change="radioChange" 
				v-for="(item, index) in list" :key="index" 
				:name="item.name"
				:disabled="item.disabled"
			>
				{{item.name}}
			</u-radio>
		</u-radio-group>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义列表数据接口
interface RadioItem {
	name: string
	disabled: boolean
}

// 定义响应式数据
const list = ref<RadioItem[]>([
	{
		name: 'apple',
		disabled: false
	},
	{
		name: 'banner',
		disabled: false
	},
	{
		name: 'orange',
		disabled: false
	}
])

const value = ref<string>('orange')

// 定义事件处理函数
const radioChange = (e: any) => {
	// console.log(e);
}

const radioGroupChange = (e: any) => {
	// console.log(e);
}
</script>
禁用radio
设置disabled为true，即可禁用某个组件，让用户无法点击，禁用分为两种状态，一是未勾选前禁用，这时只显示一个灰色的区域。二是已勾选后 再禁用，会有灰色的勾选的图标，但此时依然是不可操作的。


<u-radio-group v-model="value">
	<u-radio :disabled="true">明月几时有</u-radio>
</u-radio-group>
自定义形状
可以通过设置shape为square或者circle，将单选框设置为方形或者圆形


<u-radio-group v-model="value">
	<u-radio shape="circle">月明人倚楼</u-radio>
</u-radio-group>
自定义颜色
此处所指的颜色，为radio选中时的背景颜色，参数为active-color


<u-radio-group v-model="value">
	<u-radio active-color="red">思悠悠，恨悠悠，恨到归时方始休</u-radio>
</u-radio-group>
文本是否可点击
设置label-disabled为true，点击文本时，无法操作radio


<u-radio-group v-model="value">
	<u-radio :label-disabled="false">门掩黄昏，无计留春住</u-radio>
</u-radio-group>
API
Radio Props
注意：radio和radio-group二者同名参数中，radio的参数优先级更高。

参数	说明	类型	默认值	可选值
icon-size	图标大小，单位rpx	String | Number	-	-
label-size	label字体大小，单位rpx	String | Number	-	-
name	radio组件的标示符	String | Number	-	-
shape	形状，见上方说明	String	-	circle / square
disabled	是否禁用	Boolean	-	false / true
label-disabled	是否禁止点击文本操作radio	Boolean	-	true / false
active-color	选中时的颜色，如设置radioGroup的active-color将失效	String	-	-
radioGroup Props
注意：需要给radioGroup组件通过v-model绑定一个变量，来初始化radio的状态，随后该值被双向绑定， 当用户勾单选框时，该值在radio内部被修改为name值，并反映到父组件，换言之，您无需监听radio的change事件，也能知道哪个radio被选中了。

参数	说明	类型	默认值	可选值
v-model	被选中radio双向绑定的值，如果初始值为某一个radio的name，该radio将会默认被选中	String \ Number	-	-
disabled	是否禁用所有radio	Boolean	false	true
label-disabled	是否禁止点击文本操作radio	Boolean	false	true
shape	形状，见上方说明	String	circle	square
icon-size	图标大小，单位rpx	String \ Number	20	-
active-color	选中时的颜色，应用到所有子Radio组件	String	#2979ff	-
size	radio组件整体的大小，单位rpx	String \ Number	34	-
width	radio的宽度，需带单位，如50%，150rpx	String | Number	auto	-
wrap	是否每个radio占一行	Boolean	false	true
radio Event
事件名	说明	回调参数	版本
change	某个radio状态发生变化时触发(选中状态)	name: 通过props传递的name参数	-
radioGroup Event
事件名	说明	回调参数	版本
change	任一个radio状态发生变化时触发	name: 值为radio通过props传递的name值	-

