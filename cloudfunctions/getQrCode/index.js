// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: OPENID,
      // page: 'pages/blog/blog',
      // lineColor: {
      //   r: 211,
      //   g: 60,
      //   b: 57,
      // },
      // isHyaline: true,
    })

    const upload = await cloud.uploadFile({
      cloudPath: `qrcode/${Date.now()}-${Math.random()}.jpg`,
      fileContent: result.buffer,
    })

    return upload.fileID
  } catch (err) {
    throw err
  }
}
