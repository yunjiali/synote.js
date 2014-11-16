/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var randomstring = require("randomstring");

module.exports = {

  attributes: {
    content:{
      type:'text',
      required:true
    },
    owner:{
      model:'user'
    },
    rsid:{ //random string id
      type:'string',
      unique:true,
      required:true,
      index:true
    },
    belongsTo:{
      model:'synmark'
    }
  },
  beforeCreate:function(values,cb){
    values.rsid = randomstring.generate();
  }
};

