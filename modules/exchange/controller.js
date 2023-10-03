import logger from '../../utilities/logger.js'
import messages from '../../utilities/messages.js'
import { sendBadRequest, sendSuccess } from '../../utilities/response/index.js'
import { SymbolModel } from '../symbol/model.js'
import { ExchangeModel } from './model.js'

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
      symbols: data.symbols
    }).save()

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
      id: req.params.exchangeId
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

    const exchanges = await ExchangeModel.find(options).select('name').populate('symbols', 'name')
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
    await exchangeDetails.delete()
    return sendSuccess(res, messages.exchangeDeleted)
  } catch (e) {
    logger.error('DELETE_EXCHANGE_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}
