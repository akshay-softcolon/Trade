import { sendBadRequest, sendBadRequestWith406Code } from '../../utilities/response/index.js'
import messages from '../../utilities/messages.js'
import { returnTokenError, validateAccessToken } from '../../helper/accessTokenHelper.js'
import { UserModel } from '../../models/index.js'

export const isUser = async (req, res, next, type = 1) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization
    // if token find then verify
    if (!bearerToken) return sendBadRequestWith406Code(res, messages.authTokenRequired)
    const tokenInfo = await validateAccessToken(String(bearerToken).split(' ')[1], 'USER')
    // token and token id find n  ext step
    if (!tokenInfo && !tokenInfo._id) return sendBadRequestWith406Code(res, messages.tokenFormatInvalid)

    const adminDetails = await UserModel.findOne(
      { _id: tokenInfo._id },
      {
        _id: 1,
        role: 1
      }
    )

    if (!adminDetails) {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    if (adminDetails.role !== 'USER') {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    // if (!adminDetails.accessTokenID) return sendBadRequestWith406Code(res, messages.AccessTokenAlreadyInUse)
    // if (adminDetails.accessTokenID !== tokenInfo.accessTokenID) return sendBadRequestWith406Code(res, messages.accessTokenIsNotValid)
    // if (!adminDetails.status) return sendBadRequestWith406Code(res, messages.accountBlocked)
    // if (adminDetails.deleted) return sendBadRequestWith406Code(res, messages.accountDeleted)

    // Attach Admin Info
    req.user = adminDetails
    // next for using this method only
    next()
  } catch (e) {
    const error = await returnTokenError(e, 'IS_USER')
    if (error !== messages.somethingGoneWrong) {
      return sendBadRequestWith406Code(res, error)
    } else {
      return sendBadRequest(res, error)
    }
  }
}
