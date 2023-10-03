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
      name: data.name
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

    // get symbol exist or not
    const symbolDetails = await SymbolModel.findOne({
      id: req.params.symbolId
    })

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
      }).select('name')
      return sendSuccess(res, symbol)
    }
    if (req.query.search) {
      options.name = {
        $regex: req.query.search,
        $options: 'i'
      }
    }
    const symbols = await SymbolModel.find(options).select('name')
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
