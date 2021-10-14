const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarehouseSchema = require('./Warehouse.js');

/**
 * ParentCompanySchema is the top level object in the hierarchy.
 * name property and an array of Object IDs that are linked up with ChildCompanies
 */
const ParentCompanySchema = new Schema({
    name: String, 
    childCompanies: [{type: Schema.Types.ObjectID, ref: 'ChildCompany'}]
})

/**
 * ChildComapnySchema is the next level down.  It holds the parent's ID to signify which one it belongs to. 
 * name property and the business sector they operate in. 
 * 
 * along with a storage array which is an array of Object IDs that are linked to the WarehouseSchema
 * in the other file underneath this folder.  
 */
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


