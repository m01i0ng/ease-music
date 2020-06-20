// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

cloud.init()
const db = cloud.database()

const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  const countData = await playlistCollection.count()
  const total = countData.total
  const times = Math.ceil(total / 100)

  const tasks = []
  for (let i = 0; i < times; i++) {
    const promise = playlistCollection
      .skip(i * 100)
      .limit(100)
      .get()
    tasks.push(promise)
  }

  let listData

  if (tasks.length > 0) {
    listData = (await Promise.all(tasks)).reduce((acc, cur) => {
      data: acc.data.concat(cur.data)
    })
  }

  const list = listData.data

  const res = await rp(URL)
  const playlist = JSON.parse(res).result

  const newData = list.filter(l => playlist.every(p => l.id !== p.id))

  newData.forEach(async item => {
    try {
      await playlistCollection.add({
        data: {
          ...item,
          createTime: db.serverDate(),
        },
      })
      console.log('插入成功')
    } catch (e) {
      console.log('插入失败')
      throw e
    }
  })
}
