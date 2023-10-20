export const authenticate = async (req, res, next) => {
  // const token = req.cookies.Authorization || req.headers.authorization
  // if (token) {
  //   try {
  //     const userExist = await auth.findByToken(token)
  //     if (userExist) {
  //       const user = await User.findOne({ _id: userExist._id, verified: { $ne: false } }).select({ username: 1, role: 1, plan: 1, countryOfResidence: 1, topicOfInterests: 1, token: 1, settings: 1, contacts: 1 })
  //       if (user && user.token == token) {
  //         req.user = user
  //         req.role = await Role.findById(user.role)
  //         if (user.plan) { req.plan = await Plan.findById(user.plan) }
  //         if (req.role.isAdmin) {
  //           req.isAdmin = true
  //         }
  //         return next()
  //       }
  //     }
  //   } catch (err) {
  //     return response.sendError(res, messages.unauthorized_login)
  //   }
  // }
  // return response.sendError(res, messages.unauthorized_login)
  next()
}
