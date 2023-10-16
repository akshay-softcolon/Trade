import dcom from 'node-dcom'

// Create a DCOM instance of the Nest Trader COM object
const nestTrader = dcom.createInstance('NestTrader.RTD')

// Connect to Nest Trader
nestTrader.connect()

// Subscribe to real-time data
nestTrader.subscribe('Price-Time Data')

// Receive real-time data
nestTrader.on('data', function (data) {
  // Store the real-time data
  // ...
  console.log(data)
})

// if (constant.ROLE[1] === data?.role) {
//     userData.ID = data?.ID?.toString().trim() ? data.ID : undefined
//     userData.name = data?.name?.toString().trim() ? data.name : undefined
//     userData.surname = data?.surname?.toString().trim() ? data.surname : undefined
//     userData.password = data?.password?.toString().trim() ? bcrypt.hashSync(data.password, 10) : undefined
//     userData.role = data.role
//     userData.createdBy = createdId
//     userData.exchangeGroup = data?.exchangeGroup
//     userData.leverageX = !isNaN(data?.leverageX) ? data.leverageX : undefined
//     userData.leverageY = !isNaN(data?.leverageY) ? data.leverageY : undefined
//     userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
//     userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
//     userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
//   await new UserModel(userData).save()
//     return true
//   }
//   if (constant.ROLE[2] === data?.role) {
//     userData.ID = data?.ID?.toString().trim() ? data.ID : undefined
//     userData.name = data?.name?.toString().trim() ? data.name : undefined
//     userData.surname = data?.surname?.toString().trim() ? data.surname : undefined
//     userData.password = data?.password?.toString().trim() ? bcrypt.hashSync(data.password, 10) : undefined
//     userData.role = data.role
//     userData.createdBy = createdId
//     userData.exchangeGroup = data?.exchangeGroup
//     userData.leverageX = !isNaN(data?.leverageX) ? data.leverageX : undefined
//     userData.leverageY = !isNaN(data?.leverageY) ? data.leverageY : undefined
//     userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
//     userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
//     userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
//     userData.limitOfAddMaster = !isNaN(data?.limitOfAddMaster) ? data.limitOfAddMaster : undefined
//     userData.limitOfAddUser = !isNaN(data?.limitOfAddUser) ? data.limitOfAddUser : undefined
//     await new UserModel(userData).save()
//     return true
//   }
//   if (constant.ROLE[3] === data.role) {
//     userData.ID = data?.ID?.toString().trim() ? data.ID : undefined
//     userData.name = data?.name?.toString().trim() ? data.name : undefined
//     userData.surname = data?.surname?.toString().trim() ? data.surname : undefined
//     userData.password = data?.password?.toString().trim() ? bcrypt.hashSync(data.password, 10) : undefined
//     userData.role = data.role
//     userData.createdBy = createdId
//     userData.exchangeGroup = data?.exchangeGroup
//     userData.leverageX = !isNaN(data?.leverageX) ? data.leverageX : undefined
//     userData.leverageY = !isNaN(data?.leverageY) ? data.leverageY : undefined
//     userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
//     userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
//     userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
//     userData.limitOfAddUser = !isNaN(data?.limitOfAddUser) ? data.limitOfAddUser : undefined
//     await new UserModel(userData).save()
//     return true
//   }
//   if (constant.ROLE[4] === data.role) {
//     userData.ID = data?.ID?.toString().trim() ? data.ID : undefined
//     userData.name = data?.name?.toString().trim() ? data.name : undefined
//     userData.surname = data?.surname?.toString().trim() ? data.surname : undefined
//     userData.password = data?.password?.toString().trim() ? bcrypt.hashSync(data.password, 10) : undefined
//     userData.investorPassword = data?.investorPassword?.toString().trim() ? data.investorPassword : undefined
//     userData.role = data.role
//     userData.createdBy = createdId
//     userData.exchangeGroup = data?.exchangeGroup
//     userData.brokerage = !isNaN(data?.brokerage) ? data?.brokerage : undefined
//     userData.leverageX = !isNaN(data?.leverageX) ? data.leverageX : undefined
//     userData.leverageY = !isNaN(data?.leverageY) ? data.leverageY : undefined
//     await new UserModel(userData).save()
//     return true
//   }
