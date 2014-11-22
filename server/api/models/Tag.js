/**
* Tag.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    text:{
      type:'string',
      size:'255',
      required:true
    },
    rsid: { //random string id
      type: 'string',
      unique: true,
      required: true,
      index: true
    },
    owner:{
      model:'user'
    },
    ownermm:{
      model:'multimedia',
      required:false
    },
    ownersynmark:{
      model:'synmark',
      required:false
    }
  }
};

