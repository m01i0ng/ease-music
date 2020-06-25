// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()
const db = cloud.database()

const blogCollection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const { start, count, keyword } = event
  const app = new TcbRouter({ event })

  app.router('list', async (ctx, next) => {
    let param = {}

    if (keyword.trim()) {
      param = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i',
        }),
      }
    }

    const res = await blogCollection
      .where(param)
      .skip(start)
      .limit(count)
      .orderBy('createTime', 'desc')
      .get()
    ctx.body = res.data
    next()
  })

  return app.serve()
}
