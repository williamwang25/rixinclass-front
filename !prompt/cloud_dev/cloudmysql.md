3. 安装云开发 SDK 依赖
在小程序 app.json 所在的目录执行命令安装 npm 包。
pnpm install @cloudbase/wx-cloud-client-sdk

点击微信开发者工具工具栏上的“工具” -> “构建 npm”。
4. 从小程序中查询数据表
初始化 SDK
// app.js
const { init } = require("@cloudbase/wx-cloud-client-sdk");

App({
  onLaunch() {
    let db = null;
    this.globalData.getDB = async () => {
      if (!db) {
        wx.cloud.init({
          env: "<cloud1-1gt445eta224436c>",
        });
        db = init(wx.cloud).mysql();
      }
      return db;
    };
  },

  globalData: {},
});

在页面 js 文件中添加以下查询代码
// pages/index/index.js

Page({
  data: {
    todos: [],
  },
  onLoad() {
    this.fetchTodos();
  },
  async fetchTodos() {
    try {
      const db = await getApp().globalData.getDB();
      const { data } = await db.from("todos").select("*").range(0, 9);
      this.setData({
        todos: data,
      });
    } catch (error) {
      console.error("获取待办事项失败:", error);
    }
  },
});

在页面对应的 wxml 文件中展示数据
<!--pages/index/index.wxml-->

<view>
  <block wx:for="{{todos}}" wx:key="id">
    <text>{{item.title}}</text>
  </block>
</view>

5. 运行小程序
在微信开发者工具中，点击编译预览小程序。
注意事项
将 <云开发环境 ID> 替换为
实际的云开发环境 ID:cloud1-1gt445eta224436c

插入数据
可以通过在集合对象上调用 add 方法往集合中插入一条记录。还是用待办事项清单的例子，比如我们想新增一个待办事项：

db.collection('todos').add({
  // data 字段表示需新增的 JSON 数据
  data: {
    // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    // 为待办事项添加一个地理位置（113°E，23°N）
    location: new db.Geo.Point(113, 23),
    done: false
  },
  success: function(res) {
    // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    console.log(res)
  }
})
当然，Promise 风格也是支持的，只要传入对象中没有 success, fail 或 complete，那么 add 方法就会返回一个 Promise：

db.collection('todos').add({
  // data 字段表示需新增的 JSON 数据
  data: {
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    location: new db.Geo.Point(113, 23),
    done: false
  }
})
.then(res => {
  console.log(res)
})
数据库的增删查改 API 都同时支持回调风格和 Promise 风格调用。

在创建成功之后，我们可以在控制台中查看到刚新增的数据。

可以在 add API 文档中查阅完整的 API 定义。

查询数据
在记录和集合上都有提供 get 方法用于获取单个记录或集合中多个记录的数据。

假设我们已有一个集合 todos，其中包含以下格式记录：

[
  {
    _id: 'todo-identifiant-aleatoire',
    _openid: 'user-open-id', // 假设用户的 openid 为 user-open-id
    description: "learn cloud database",
    due: Date("2018-09-01"),
    progress: 20,
    tags: [
      "cloud",
      "database"
    ],
    style: {
      color: 'white',
      size: 'large'
    },
    location: Point(113.33, 23.33), // 113.33°E，23.33°N
    done: false
  },
  {
    _id: 'todo-identifiant-aleatoire-2',
    _openid: 'user-open-id', // 假设用户的 openid 为 user-open-id
    description: "write a novel",
    due: Date("2018-12-25"),
    progress: 50,
    tags: [
      "writing"
    ],
    style: {
      color: 'yellow',
      size: 'normal'
    },
    location: Point(113.22, 23.22), // 113.22°E，23.22°N
    done: false
  }
  // more...
]
获取一个记录的数据
我们先来看看如何获取一个记录的数据，假设我们已有一个 ID 为 todo-identifiant-aleatoire 的在集合 todos 上的记录，那么我们可以通过在该记录的引用调用 get 方法获取这个待办事项的数据：

db.collection('todos').doc('todo-identifiant-aleatoire').get({
  success: function(res) {
    // res.data 包含该记录的数据
    console.log(res.data)
  }
})
也可以用 Promise 风格调用：

db.collection('todos').doc('todo-identifiant-aleatoire').get().then(res => {
  // res.data 包含该记录的数据
  console.log(res.data)
})
获取多个记录的数据
我们也可以一次性获取多条记录。通过调用集合上的 where 方法可以指定查询条件，再调用 get 方法即可只返回满足指定查询条件的记录，比如获取用户的所有未完成的待办事项：

db.collection('todos').where({
  _openid: 'user-open-id',
  done: false
})
.get({
  success: function(res) {
    // res.data 是包含以上定义的两条记录的数组
    console.log(res.data)
  }
})
where 方法接收一个对象参数，该对象中每个字段和它的值构成一个需满足的匹配条件，各个字段间的关系是 "与" 的关系，即需同时满足这些匹配条件，在这个例子中，就是查询出 todos 集合中 _openid 等于 user-open-id 且 done 等于 false 的记录。在查询条件中我们也可以指定匹配一个嵌套字段的值，比如找出自己的标为黄色的待办事项：

db.collection('todos').where({
  _openid: 'user-open-id',
  style: {
    color: 'yellow'
  }
})
.get({
  success: function(res) {
    console.log(res.data)
  }
})
也可以用 "点表示法" 表示嵌套字段：

db.collection('todos').where({
  _openid: 'user-open-id',
  'style.color': 'yellow'
})
.get({
  success: function(res) {
    console.log(res.data)
  }
})
获取一个集合的数据
如果要获取一个集合的数据，比如获取 todos 集合上的所有记录，可以在集合上调用 get 方法获取，但通常不建议这么使用，在小程序中我们需要尽量避免一次性获取过量的数据，只应获取必要的数据。为了防止误操作以及保护小程序体验，小程序端在获取集合数据时服务器一次默认并且最多返回 20 条记录，云函数端这个数字则是 100。开发者可以通过 limit 方法指定需要获取的记录数量，但小程序端不能超过 20 条，云函数端不能超过 100 条。

db.collection('todos').get({
  success: function(res) {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res.data)
  }
})
也可以用 Promise 风格调用：

db.collection('todos').get().then(res => {
  // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
  console.log(res.data)
})
下面是在云函数端获取一个集合所有记录的例子，因为有最多一次取 100 条的限制，因此很可能一个请求无法取出所有数据，需要分批次取：

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('todos').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('todos').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}

指令
使用数据库 API 提供的 where 方法我们可以构造复杂的查询条件完成复杂的查询任务。在本节中我们还是使用上一章节中使用的示例数据。

查询指令
假设我们需要查询进度大于 30% 的待办事项，那么传入对象表示全等匹配的方式就无法满足了，这时就需要用到查询指令。数据库 API 提供了大于、小于等多种查询指令，这些指令都暴露在 db.command 对象上。比如查询进度大于 30% 的待办事项：

const _ = db.command
db.collection('todos').where({
  // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
  progress: _.gt(30)
})
.get({
  success: function(res) {
    console.log(res.data)
  }
})
API 提供了以下查询指令：

查询指令	说明
eq	等于
neq	不等于
lt	小于
lte	小于或等于
gt	大于
gte	大于或等于
in	字段值在给定数组中
nin	字段值不在给定数组中
更多具体的查询指令 API 文档可参考数据库 API 文档。

逻辑指令
除了指定一个字段满足一个条件之外，我们还可以通过指定一个字段需同时满足多个条件，比如用 and 逻辑指令查询进度在 30% 和 70% 之间的待办事项：

const _ = db.command
db.collection('todos').where({
  // and 方法用于指定一个 "与" 条件，此处表示需同时满足 _.gt(30) 和 _.lt(70) 两个条件
  progress: _.gt(30).and(_.lt(70))
})
.get({
  success: function(res) {
    console.log(res.data)
  }
})
既然有 and，当然也有 or 了，比如查询进度为 0 或 100 的待办事项：

const _ = db.command
db.collection('todos').where({
  // or 方法用于指定一个 "或" 条件，此处表示需满足 _.eq(0) 或 _.eq(100)
  progress: _.eq(0).or(_.eq(100))
})
.get({
  success: function(res) {
    console.log(res.data)
  }
})
如果我们需要跨字段进行 "或" 操作，可以做到吗？答案是肯定的，or 指令还可以用来接受多个（可以多于两个）查询条件，表示需满足多个查询条件中的任意一个，比如我们查询进度小于或等于 50% 或颜色为白色或黄色的待办事项：

const _ = db.command
db.collection('todos').where(_.or([
  {
    progress: _.lte(50)
  },
  {
    style: {
      color: _.in(['white', 'yellow'])
    }
  }
]))
.get({
  success: function(res) {
    console.log(res.data)
  }
})
具体的逻辑查询指令 API 文档可参考数据库 Command API 文档。

更新数据
在这章节我们一起看看如何使用数据库 API 完成数据更新，在本节中我们还是沿用读取数据章节中使用的数据。

更新数据主要有两个方法：

API	说明
update	局部更新一个或多个记录
set	替换更新一个记录
局部更新
使用 update 方法可以局部更新一个记录或一个集合中的记录，局部更新意味着只有指定的字段会得到更新，其他字段不受影响。

比如我们可以用以下代码将一个待办事项置为已完成：

db.collection('todos').doc('todo-identifiant-aleatoire').update({
  // data 传入需要局部更新的数据
  data: {
    // 表示将 done 字段置为 true
    done: true
  },
  success: function(res) {
    console.log(res.data)
  }
})
除了用指定值更新字段外，数据库 API 还提供了一系列的更新指令用于执行更复杂的更新操作，更新指令可以通过 db.command 取得：

更新指令	说明
set	设置字段为指定值
remove	删除字段
inc	原子自增字段值
mul	原子自乘字段值
push	如字段值为数组，往数组尾部增加指定值
pop	如字段值为数组，从数组尾部删除一个元素
shift	如字段值为数组，从数组头部删除一个元素
unshift	如字段值为数组，往数组头部增加指定值
比如我们可以将一个待办事项的进度 +10%：

const _ = db.command
db.collection('todos').doc('todo-identifiant-aleatoire').update({
  data: {
    // 表示指示数据库将字段自增 10
    progress: _.inc(10)
  },
  success: function(res) {
    console.log(res.data)
  }
})
用 inc 指令而不是取出值、加 10 再写进去的好处在于这个写操作是个原子操作，不会受到并发写的影响，比如同时有两名用户 A 和 B 取了同一个字段值，然后分别加上 10 和 20 再写进数据库，那么这个字段最终结果会是加了 20 而不是 30。如果使用 inc 指令则不会有这个问题。

如果字段是个数组，那么我们可以使用 push、pop、shift 和 unshift 对数组进行原子更新操作，比如给一条待办事项加多一个标签：

const _ = db.command
db.collection('todos').doc('todo-identifiant-aleatoire').update({
  data: {
    tags: _.push('mini-program')
  },
  success: function(res) {
    console.log(res.data)
  }
})
可能读者已经注意到我们提供了 set 指令，这个指令有什么用呢？这个指令的用处在于更新一个字段值为另一个对象。比如如下语句是更新 style.color 字段为 'blue' 而不是把 style 字段更新为 { color: 'blue' } 对象：

const _ = db.command
db.collection('todos').doc('todo-identifiant-aleatoire').update({
  data: {
    style: {
      color: 'blue'
    }
  },
  success: function(res) {
    console.log(res.data)
  }
})
如果需要将这个 style 字段更新为另一个对象，可以使用 set 指令：

const _ = db.command
db.collection('todos').doc('todo-identifiant-aleatoire').update({
  data: {
    style: _.set({
      color: 'blue'
    })
  },
  success: function(res) {
    console.log(res.data)
  }
})
如果需要更新多个数据，需在 Server 端进行操作（云函数），在 where 语句后同样的调用 update 方法即可，比如将所有未完待办事项的进度加 10%：

// 使用了 async await 语法
const cloud = require('wx-server-sdk')
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('todos').where({
      done: false
    })
    .update({
      data: {
        progress: _.inc(10)
      },
    })
  } catch(e) {
    console.error(e)
  }
}
更完整详细的更新指令可以参考数据库 Command API 文档

替换更新
如果需要替换更新一条记录，可以在记录上使用 set 方法，替换更新意味着用传入的对象替换指定的记录：

const _ = db.command
db.collection('todos').doc('todo-identifiant-aleatoire').set({
  data: {
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    style: {
      color: "skyblue"
    },
    // 位置（113°E，23°N）
    location: new db.Geo.Point(113, 23),
    done: false
  },
  success: function(res) {
    console.log(res.data)
  }
})
如果指定 ID 的记录不存在，则会自动创建该记录，该记录将拥有指定的 ID。

删除数据
在这章节我们一起看看如何使用数据库 API 完成数据删除，在本节中我们还是沿用读取数据章节中使用的数据。

删除一条记录
对记录使用 remove 方法可以删除该条记录，比如：

db.collection('todos').doc('todo-identifiant-aleatoire').remove({
  success: function(res) {
    console.log(res.data)
  }
})
删除多条记录
如果需要更新多个数据，需在 Server 端进行操作（云函数）。可通过 where 语句选取多条记录执行删除，只有有权限删除的记录会被删除。比如删除所有已完成的待办事项：

// 使用了 async await 语法
const cloud = require('wx-server-sdk')
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('todos').where({
      done: true
    }).remove()
  } catch(e) {
    console.error(e)
  }
}
在大多数情况下，我们希望用户只能操作自己的数据（自己的代表事项），不能操作其他人的数据（其他人的待办事项），这就需要引入权限控制了。


查询、更新数组/嵌套对象
我们可以对对象、对象中的元素、数组、数组中的元素进行匹配查询，甚至还可以对数组和对象相互嵌套的字段进行匹配查询/更新，下面我们从普通匹配开始讲讲如何进行匹配。

普通匹配
匹配记录中的嵌套字段
匹配数组
匹配数组
匹配数组中元素
匹配数组第 n 项元素
结合查询指令进行匹配
匹配并更新数组中的元素
匹配多重嵌套的数组和对象
普通匹配
传入的对象的每个 <key, value> 构成一个筛选条件，有多个 <key, value> 则表示需同时满足这些条件，是与的关系，如果需要或关系，可使用 [command.or]((Command.or))

比如找出未完成的进度 50 的待办事项：

db.collection('todos').where({
  done: false,
  progress: 50
}).get()
匹配记录中的嵌套字段
假设在集合中有如下一个记录：

{
  "style": {
    "color": "red"
  }
}
如果我们想要找出集合中 style.color 为 red 的记录，那么可以传入相同结构的对象做查询条件或使用 ”点表示法“ 查询：

// 方式一
db.collection('todos').where({
  style: {
    color: 'red'
  }
}).get()

// 方式二
db.collection('todos').where({
  'style.color': 'red'
}).get()
匹配数组
匹配数组
假设在集合中有如下一个记录：

{
  "numbers": [10, 20, 30]
}
可以传入一个完全相同的数组来筛选出这条记录：

db.collection('todos').where({
  numbers: [10, 20, 30]
}).get()
匹配数组中的元素
如果想找出数组字段中数组值包含某个值的记录，那可以在匹配数组字段时传入想要匹配的值。如对上面的例子，可传入一个数组中存在的元素来筛选出所有 numbers 字段的值包含 20 的记录：

db.collection('todos').where({
  numbers: 20
}).get()
匹配数组第 n 项元素
如果想找出数组字段中数组的第 n 个元素等于某个值的记录，那在 <key, value> 匹配中可以以 字段.下标 为 key，目标值为 value 来做匹配。如对上面的例子，如果想找出 number 字段第二项的值为 20 的记录，可以如下查询（注意：数组下标从 0 开始）：

db.collection('todos').where({
  'numbers.1': 20
}).get()
更新也是类似，比如我们要更新 _id 为 test 的记录的 numbers 字段的第二项元素至 30：

db.collection('todos').doc('test').update({
  data: {
    'numbers.1': 30
  },
})
结合查询指令进行匹配
在对数组字段进行匹配时，也可以使用如 lt, gt 等指令，来筛选出字段数组中存在满足给定比较条件的记录。如对上面的例子，可查找出所有 numbers 字段的数组值中存在包含大于 25 的值的记录：

const _ = db.command
db.collection('todos').where({
  numbers: _.gt(25)
}).get()
查询指令也可以通过逻辑指令组合条件，比如找出所有 numbers 数组中存在包含大于 25 的值、同时也存在小于 15 的值的记录：

const _ = db.command
db.collection('todos').where({
  numbers: _.gt(25).and(_.lt(15))
}).get()
匹配并更新数组中的元素
如果想要匹配并更新数组中的元素，而不是替换整个数组，除了指定数组下标外，还可以：

1. 更新数组中第一个匹配到的元素

更新数组字段的时候可以用 字段路径.$ 的表示法来更新数组字段的第一个满足查询匹配条件的元素。注意使用这种更新时，查询条件必须包含该数组字段。

假如有如下记录：

{
  "_id": "doc1",
  "scores": [10, 20, 30]
}
{
  "_id": "doc2",
  "scores": [20, 20, 40]
}
让所有 scores 中的第一个 20 的元素更新为 25：

// 注意：批量更新需在云函数中进行
const _ = db.command
db.collection('todos').where({
  scores: 20
}).update({
  data: {
    'scores.$': 25
  }
})
如果记录是对象数组的话也可以做到，路径如 字段路径.$.字段路径。

注意事项：

不支持用在数组嵌套数组
如果用 unset 更新操作符，不会从数组中去除该元素，而是置为 null
如果数组元素不是对象、且查询条件用了 neq、not 或 nin，则不能使用 $
2. 更新数组中所有匹配的元素

更新数组字段的时候可以用 字段路径.$[] 的表示法来更新数组字段的所有元素。

假如有如下记录：

{
  "_id": "doc1",
  "scores": {
    "math": [10, 20, 30]
  }
}
比如让 scores.math 字段所有数字加 10：

const _ = db.command
db.collection('todos').doc('doc1').update({
  data: {
    'scores.math.$[]': _.inc(10)
  }
})
更新后 scores.math 数组从 [10, 20, 30] 变为 [20, 30, 40]。

如果数组是对象数组也是可以的，假如有如下记录：

{
  "_id": "doc1",
  "scores": {
    "math": [
      { "examId": 1, "score": 10 },
      { "examId": 2, "score": 20 },
      { "examId": 3, "score": 30 }
    ]
  }
}
可以更新 scores.math 下各个元素的 score 原子自增 10：

const _ = db.command
db.collection('todos').doc('doc1').update({
  data: {
    'scores.math.$[].score': _.inc(10)
  }
})
匹配多重嵌套的数组和对象
上面所讲述的所有规则都可以嵌套使用的，假设我们在集合中有如下一个记录：

{
  "root": {
    "objects": [
      {
        "numbers": [10, 20, 30]
      },
      {
        "numbers": [50, 60, 70]
      }
    ]
  }
}
我们可以如下找出集合中所有的满足 root.objects 字段数组的第二项的 numbers 字段的第三项等于 70 的记录：

db.collection('todos').where({
  'root.objects.1.numbers.2': 70
}).get()
注意，指定下标不是必须的，比如可以如下找出集合中所有的满足 root.objects 字段数组中任意一项的 numbers 字段包含 30 的记录：

db.collection('todos').where({
  'root.objects.numbers': 30
}).get()
更新操作也是类似，比如我们要更新 _id 为 test 的 root.objects 字段数组的第二项的 numbers 字段的第三项 为 80：

db.collection('todos').doc('test').update({
  data: {
    'root.objects.1.numbers.2': 80
  },
})