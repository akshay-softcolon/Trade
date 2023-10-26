import constant from '../../utilities/constant.js'
import logger from '../../utilities/logger.js'
import messages from '../../utilities/messages.js'
import { sendBadRequest, sendSuccess } from '../../utilities/response/index.js'
import { SymbolModel } from '../symbol/model.js'
import { ExchangeModel } from './model.js'
import { UserModel } from '../admin/model.js'

export const createExchange = async (req, res) => {
  try {
    const data = req.body
    const exchangeDetails = await ExchangeModel.findOne({ name: data.name })
    if (exchangeDetails) return sendBadRequest(res, messages.exchangeIsAlreadyExist)

    for (const symbol of data?.symbols) {
      const symbolDetails = await SymbolModel.findOne({ _id: symbol })
      if (!symbolDetails) return sendBadRequest(res, messages.symbolNotFound)
      const exchangeDetailsForSymbol = await ExchangeModel.findOne().where('symbols').equals(symbol)
      if (exchangeDetailsForSymbol) return sendBadRequest(res, messages.symbolIsAlreadyTaken)
    }

    const exchange = await new ExchangeModel({
      name: data.name,
      symbols: data.symbols,
      status: constant.EXCHANGE_STATUS.includes(data?.status) ? data.status : undefined,
      stopLoss: Object.keys(data).includes('stopLoss') ? data?.stopLoss : undefined
    }).save()

    const administrator = await UserModel.find({ role: constant.ROLE[0] })
    if (administrator.length > 0) {
      administrator.forEach(async (admin) => {
        admin.allowedExchange.push(exchange._id)
        await admin.save()
      })
    }

    return sendSuccess(res, exchange, messages.exchangeCreated)
  } catch (e) {
    logger.error('CREATE_EXCHANGE')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const updateExchange = async (req, res) => {
  try {
    // Body Data
    const data = req.body
    // get symbol exist or not
    const exchangeDetails = await ExchangeModel.findOne({
      _id: req.params.exchangeId
    })

    // if exist then give error
    if (!exchangeDetails) return sendBadRequest(res, messages.exchangeNotFound)
    if (data?.name?.toString().trim()) {
      const getExchangeDetails = await ExchangeModel.findOne({
        name: data.name
      })
      if (getExchangeDetails) { return sendBadRequest(res, messages.ThisNameIsAlreadyTaken) }
      exchangeDetails.name = data?.name?.toString().trim()
        ? data.name
        : undefined
    }
    if (constant.EXCHANGE_STATUS.includes(data?.status)) {
      exchangeDetails.status = data?.status
    }
    if (Object.keys(data).includes('stopLoss')) {
      exchangeDetails.stopLoss = data?.stopLoss
    }
    await exchangeDetails.save()
    return sendSuccess(res, messages.exchangeUpdated)
  } catch (e) {
    logger.error('UPDATE_EXCHANGE')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const getExchange = async (req, res) => {
  try {
    const options = {}
    if (req.query.id) {
      const exchange = await ExchangeModel.findOne({
        _id: req.query.id
      }).select('name').populate('symbols', 'name')
      return sendSuccess(res, exchange)
    }
    if (req.query.search) {
      options.name = {
        $regex: req.query.search,
        $options: 'i'
      }
    }

    const exchanges = await ExchangeModel.find(options).select('name status stopLoss createdAt updatedAt').populate('symbols', 'name')
    return sendSuccess(res, exchanges)
  } catch (e) {
    logger.error('GET_EXCHANGE')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const deleteExchange = async (req, res) => {
  try {
    const exchangeDetails = await ExchangeModel.findOne({
      _id: req.params?.exchangeId
    })
    if (!exchangeDetails) return sendBadRequest(res, messages.exchangeNotFound)

    const users = await UserModel.find({ allowedExchange: req.params?.exchangeId })
    if (users.length > 0) {
      users.forEach(async (user) => {
        await user.allowedExchange.splice(user.allowedExchange.findIndex((i) => i.equals(req.params?.exchangeId)), 1)
        await user.save()
      })
    }
    await exchangeDetails.delete()
    return sendSuccess(res, messages.exchangeDeleted)
  } catch (e) {
    logger.error('DELETE_EXCHANGE_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const exchangeInAddSymbols = async (req, res) => {
  try {
    const data = req.body
    const exchangeDetails = await ExchangeModel.findOne({
      _id: req.params?.exchangeId
    })
    if (!exchangeDetails) return sendBadRequest(res, messages.exchangeNotFound)

    for (const symbol of data?.symbols) {
      const symbolDetails = await SymbolModel.findOne({ _id: symbol })
      if (!symbolDetails) return sendBadRequest(res, messages.symbolNotFound)
      const exchangeDetailsForSymbol = await ExchangeModel.findOne({ _id: req.params.exchangeId }).where('symbols').equals(symbol)
      if (exchangeDetailsForSymbol) return sendBadRequest(res, messages.symbolIsAlreadyTaken)
      await exchangeDetails.symbols.push(symbol)
    }
    console.log(exchangeDetails)
    await exchangeDetails.save()
    return sendSuccess(res, messages.symbolsAddedInExchange)
  } catch (e) {
    logger.error('EXCHANGE_IN_ADD_SYMBOL_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const exchangeInRemoveSymbols = async (req, res) => {
  try {
    const data = req.body
    const param = req.params?.exchangeId
    const exchangeDetails = await ExchangeModel.findOne({
      _id: param
    })
    if (!exchangeDetails) return sendBadRequest(res, messages.exchangeNotFound)

    for (const symbol of data?.symbols) {
      const symbolDetails = await SymbolModel.findOne({ _id: symbol })
      if (!symbolDetails) return sendBadRequest(res, messages.symbolNotFound)
      const exchangeDetailsForSymbol = await ExchangeModel.findOne({ _id: param }).where('symbols').equals(symbol)
      if (!exchangeDetailsForSymbol) return sendBadRequest(res, messages.symbolIsNotExistInExchangeDetails)
      await exchangeDetails.symbols.splice(exchangeDetails.symbols.findIndex((i) => i.equals(symbol)), 1)
    }
    await exchangeDetails.save()
    return sendSuccess(res, messages.symbolsRemovedInExchange)
  } catch (e) {
    logger.error('EXCHANGE_IN_REMOVE_SYMBOL_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}
