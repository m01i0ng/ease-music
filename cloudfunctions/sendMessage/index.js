// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { blogId, content, formId } = event

  try {
    return await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: `/pages/blog-comment/blog-comment?blogId=${blogId}`,
      lang: 'zh_CN',
      data: {
        thing1: {
          value: content,
        },
        time2: {
          value: Date.now(),
        },
        templateId: 'XfJftLAwtmoRIYukB3AOH9maUioSkd_w30giCAjJbZg',
      },
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
