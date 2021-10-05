const mongoose = require('mongoose');
const { Company } = require('../model/Company.js');

const addChildCompany = ({name, ...childObj}) => {
    console.log(name, childObj);
}

module.exports = {
    addChildCompany,
}


