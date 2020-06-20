// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')

const BASE_URL = 'http://musicapi.xiecheng.live'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { start, count, playlistId } = event

  const app = new TcbRouter({ event })

  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud
      .database()
      .collection('playlist')
      .skip(start)
      .limit(count)
      .orderBy('createTime', 'desc')
      .get()

    next()
  })

  app.use('musiclist', async (ctx, next) => {
    const res = await rp(`${BASE_URL}/playlist/detail?id=${playlistId}`)
    ctx.body = JSON.parse(res)
    next()
  })

  return app.serve()
}
