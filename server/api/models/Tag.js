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
    ind:{ //the index of the tag in the multimedia or synmark resource
      type:'integer',
      required:true,
      min:1,
      defaultsTo:1
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

