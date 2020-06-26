// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()
const db = cloud.database()

const blogCollection = db.collection('blog')
const commentCollection = db.collection('comment')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({ event })

  app.router('list', async (ctx, next) => {
    const { start, count, keyword } = event
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

  app.router('detail', async (ctx, next) => {
    const { blogId } = event

    try {
      const detailRes = await blogCollection
        .where({
          _id: blogId,
        })
        .get()
      const detail = detailRes.data[0]

      const countRes = await blogCollection.count()
      const total = countRes.total

      let comment = []

      if (total > 0) {
        const times = Math.ceil(total / 100)
        const tasks = []

        for (let i = 0; i < times; i++) {
          const promise = commentCollection
            .skip(i * 100)
            .limit(100)
            .where({
              blogId,
            })
            .orderBy('createTime', 'desc')
            .get()

          tasks.push(promise)
        }

        if (tasks.length > 0) {
          const commentRes = (await Promise.all(tasks)).reduce((acc, cur) =>
            acc.concat(cur.data)
          )
          comment = commentRes.data
        }

        ctx.body = {
          detail,
          comment,
        }
      }
    } catch (err) {
      console.error(err)
      throw err
    }

    next()
  })

  app.router('my', async (ctx, next) => {
    const { OPENID } = cloud.getWXContext()
    const { start, count } = event
    try {
      const res = await blogCollection
        .where({
          _openid: OPENID,
        })
        .skip(start)
        .limit(count)
        .orderBy('createTime', 'desc')
        .get()

      ctx.body = res.data
    } catch (err) {
      console.error(err)
      throw err
    }

    next()
  })

  return app.serve()
}
