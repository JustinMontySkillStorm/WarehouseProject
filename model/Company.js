const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarehouseSchema = require('./Warehouse.js');

/**
 * referencing my WarehouseSchema here to make my db schema a little bit more readable.  
 * going to populate my
 */
const CompanySchema = new Schema({
    name: String, 
    childCompanies: [{
        name: String,
        businessSector: String,
        storage: [{type: Schema.Types.ObjectID, ref: "Warehouse"}] 
    }]
})


const Company = mongoose.model('Company', CompanySchema, 'companies');
const Warehouse = mongoose.model('Warehouse', WarehouseSchema, 'warehouses');

module.exports = {
    Company,
    Warehouse,
}


