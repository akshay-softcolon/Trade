import constant from '../../utilities/constant.js'
import logger from '../../utilities/logger.js'
import messages from '../../utilities/messages.js'
import { sendBadRequest, sendSuccess } from '../../utilities/response/index.js'
import { SymbolModel } from './model.js'

export const createSymbol = async (req, res) => {
  try {
    // Body Data
    const data = req.body

    // get symbol exist or not
    const symbolDetails = await SymbolModel.findOne({
      name: data.name
    })

    // if exist then give error
    if (symbolDetails) return sendBadRequest(res, messages.symbolNameIsAlreadyExists)

    const symbol = await new SymbolModel({
      name: data.name,
      contractSize: data?.contractSize ? data?.contractSize : undefined,
      currency: constant.CURRENCY.includes(data?.currency) ? data?.currency : undefined,
      spread: Object.keys(data).includes('spread') ? data?.spread : undefined,
      stopLevel: Object.keys(data).includes('stopLevel') ? data?.stopLevel : undefined,
      tickSize: Object.keys(data).includes('tickSize') ? data?.tickSize : undefined,
      tickValue: Object.keys(data).includes('tickValue') ? data?.tickValue : undefined,
      inrialMargin: Object.keys(data).includes('inrialMargin') ? data?.inrialMargin : undefined,
      maintenanceMargin: Object.keys(data).includes('maintenanceMargin') ? data?.maintenanceMargin : undefined,
      mimVolume: Object.keys(data).includes('mimVolume') ? data?.mimVolume : undefined,
      maxVolume: Object.keys(data).includes('maxVolume') ? data?.maxVolume : undefined,
      stAndTp: Object.keys(data).includes('stAndTp') ? data?.stAndTp : undefined
    }).save()

    if (!symbol) return sendBadRequest(res, messages.symbolNotCreated)

    return sendSuccess(res, symbol, messages.symbolCreated)
  } catch (e) {
    logger.error('CREATE_SYMBOL_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const updateSymbol = async (req, res) => {
  try {
    // Body Data
    const data = req.body
    console.log(req.params)
    // get symbol exist or not
    const symbolDetails = await SymbolModel.findOne({
      _id: req.params.symbolId
    })
    console.log(symbolDetails)
    // if exist then give error
    if (!symbolDetails) return sendBadRequest(res, messages.symbolNotFound)
    if (data?.name?.toString().trim()) {
      const getSymbolDetails = await SymbolModel.findOne({
        name: data.name
      })
      if (getSymbolDetails) { return sendBadRequest(res, messages.ThisNameIsAlreadyTaken) }
      symbolDetails.name = data?.name?.toString().trim()
        ? data.name
        : undefined
    }

    if (data?.contractSize.toString().trim()) {
      symbolDetails.contractSize = data?.contractSize?.toString().trim()
        ? data.contractSize
        : undefined
    }
    if (constant.CURRENCY.includes(data.currency)) symbolDetails.currency = data.currency
    if (!isNaN(data.spread)) symbolDetails.spread = data?.spread
    if (!isNaN(data.stopLevel)) symbolDetails.stopLevel = data?.stopLevel
    if (!isNaN(data.tickSize)) symbolDetails.tickSize = data?.tickSize
    if (!isNaN(data.tickValue)) symbolDetails.tickValue = data?.tickValue
    if (!isNaN(data.inrialMargin)) symbolDetails.inrialMargin = data?.inrialMargin
    if (!isNaN(data.maintenanceMargin)) symbolDetails.maintenanceMargin = data?.maintenanceMargin
    if (!isNaN(data.mimVolume)) symbolDetails.mimVolume = data?.mimVolume
    if (!isNaN(data.maxVolume)) symbolDetails.maxVolume = data?.maxVolume
    if (Object.keys(data).includes('stAndTp')) symbolDetails.stAndTp = data.stAndTp
    await symbolDetails.save()
    return sendSuccess(res, messages.symbolUpdated)
  } catch (e) {
    logger.error('UPDATE_SYMBOL_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const getSymbol = async (req, res) => {
  try {
    const options = {}
    if (req.query.id) {
      const symbol = await SymbolModel.findOne({
        _id: req.query.id
      })
      return sendSuccess(res, symbol)
    }
    if (req.query.search) {
      options.name = {
        $regex: req.query.search,
        $options: 'i'
      }
    }
    const symbols = await SymbolModel.find(options)
    return sendSuccess(res, symbols)
  } catch (e) {
    logger.error('GET_SYMBOL_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const deleteSymbol = async (req, res) => {
  try {
    const symbolDetails = await SymbolModel.findOne({
      _id: req.params?.symbolId
    })
    if (!symbolDetails) return sendBadRequest(res, messages.symbolNotFound)
    await symbolDetails.delete()
    return sendSuccess(res, messages.symbolDeleted)
  } catch (e) {
    logger.error('DELETE_SYMBOL_ERROR')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}
