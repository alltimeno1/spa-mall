const express = require('express')
const Goods = require('../schemas/goods')
const Cart = require('../schemas/cart')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('this is root page')
})

router.get('/goods/cart', async (req, res) => {
  const carts = await Cart.find()
  const goodsId = carts.map(cart => cart.goodsId)
  const goods = await Goods.find({ goodsId })

  res.json({
    cart: carts.map(cart => ({
        quantity: cart.quantity,
        goods: goods.find(item => item.goodsId === cart.goodsId)
      }))
  })
})


router.get('/goods', async (req, res) => {
  const { category } = req.query

  const goods = await Goods.find({ category })

  res.json({
    goods
  })
})

router.get('/goods/:goodsId', async (req, res) => {
  const { goodsId } = req.params

  const [goods] = await Goods.find({ goodsId: Number(goodsId) })
  
  res.json({
    goods
  })
})

router.delete('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) })

  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId: Number(goodsId) })
  }

  res.json({ success: true })
})

router.put('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params
  const { quantity } = req.body

  if (quantity < 1) {
    return res.status(400).json({ success: false, errorMassage: '수량은 최소 1개 이상입니다.' })
  }

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) })

  if (!existsCarts.length) {
    await Cart.create({ goodsId: Number(goodsId), quantity })
  } else {
    await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } })
  }

  res.json({ success: true })
})

router.post('/goods', async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body

  const goods = await Goods.find({ goodsId })
  if (goods.length) {
    return res.status(400).json({ success: false, errorMassage: '이미 있는 데이터입니다.' })
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price })

  res.json({ goods : createdGoods })
})

module.exports = router