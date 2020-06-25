// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

cloud.init()
const db = cloud.database()

const playlistCollection = db.collection('playlist')

function getDifferenceSet(arr1, arr2, typeName) {
  return Object.values(
    arr1.concat(arr2).reduce((acc, cur) => {
      if (
        acc[cur[typeName]] &&
        acc[cur[typeName]][typeName] === cur[typeName]
      ) {
        delete acc[cur[typeName]]
      } else {
        acc[cur[typeName]] = cur
      }
      return acc
    }, {})
  )
}

// 云函数入口函数
exports.main = async (event, context) => {
  const countData = await playlistCollection.count()
  const total = countData.total

  if (total === 0) {
    const res = await rp(URL)
    const playlist = JSON.parse(res).result

    playlist.forEach(async item => {
      try {
        await playlistCollection.add({
          data: {
            ...item,
            createTime: db.serverDate(),
          },
        })
        console.log('插入成功')
      } catch (e) {
        console.error(e)
      }
    })
  } else {
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
      listData = (await Promise.all(tasks)).reduce((acc, cur) =>
        acc.concat(cur.data)
      )
    }

    const list = listData.data.map(item => {
      delete item._id
      return item
    })

    const res = await rp(URL)
    const playlist = JSON.parse(res).result

    const newData = getDifferenceSet(list, playlist, 'id')

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
        console.error(e)
      }
    })
  }
}
