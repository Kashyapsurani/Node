const express =require('express')

const routes =express.Router()
const {getDashboardController} =require('../Controllers/controllerDashboard')
routes.route('/').get(getDashboardController)

module.exports= routes