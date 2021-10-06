const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarehouseSchema = require('./Warehouse.js');

/**
 * referencing my WarehouseSchema here to make my db schema a little bit more readable.  
 * going to populate my
 */
const ParentCompanySchema = new Schema({
    name: String, 
    childCompanies: [{type: Schema.Types.ObjectID, ref: 'ChildCompany'}]
})

const ChildCompanySchema = new Schema({
        parentID: {
            type: Schema.Types.ObjectID, ref: "ParentCompany"
        },
        name: String,
        businessSector: String,
        storage: [{type: Schema.Types.ObjectID, ref: "Warehouse"}] 
})


const ParentCompany = mongoose.model('ParentCompany', ParentCompanySchema, 'parent-company');
const ChildCompany = mongoose.model('ChildCompany', ChildCompanySchema, 'child-company');
const Warehouse = mongoose.model('Warehouse', WarehouseSchema, 'warehouses');

module.exports = {
    ParentCompany,
    ChildCompany,
    Warehouse,
}


