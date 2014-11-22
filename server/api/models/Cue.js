/**
* Cue.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    belongsTo:{
      model:'transcript'
    },
    owner:{
      model:'user'
    },
    rsid: { //random string id
      type: 'string',
      unique: true,
      required: true,
      index: true
    },
    content:{
      type:'text'
    },
    st:{
      type:'integer',
      defaultsTo:0,
      min:0,
      required:true
    },
    et:{
      type:'integer',
      defaultsTo:0,
      min:0,
      required:true
    },
    ind:{ //cue index
      type:'integer',
      required:true,
      min:1
    },
    settings:{ //used for WebVTT
      type:'string',
      size:'1024'
    }
  }
};

