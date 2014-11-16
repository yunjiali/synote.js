/**
* Slide.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var randomstring = require("randomstring");

module.exports = {
  attributes: {
    owner:{
      model:'user'
    },
    rsid:{ //random string id
      type:'string',
      unique:true,
      required:true,
      index:true
    },
    ind:{ //slide index
      type:'integer',
      required:true,
      min:1
    },
    annotates:{
      model:'multimedia'
    },
    mfst:{ //media fragment start
      type:'integer',
      defaultTo:0,
      min:0,
      required:true
    },
    mfet:{
      type:'integer',
      min:function(){
        return this.mfst;
      }
    },
    timeformat:{ //time format
      type:"string",
      enum:['npt','smpte'],
      required:true,
      defaultsTo:"npt"
    },
    mfx:{
      type:'integer',
      min:0
    },
    mfy:{
      type:'integer',
      min:0
    },
    mfw:{
      type:'integer',
      min:0
    },
    mfh:{
      type:'integer',
      min:0
    },
    xywhunit:{//spatial dimension unit
      type:"string",
      enum:['pixel','percent'],
      required:true,
      defaultsTo:"percent"
    }
  },
  beforeCreate:function(values,cb){
    values.rsid = randomstring.generate();
  }
};

