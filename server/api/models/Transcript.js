/**
* Transcript.js
*
* @description :: transcript
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    owner: {
      model: 'user'
    },
    rsid: { //random string id
      type: 'string',
      unique: true,
      required: true,
      index: true
    },
    annotates: {
      model: 'multimedia'
    },
    cues: {
      collection: 'cue',
      via: 'belongsTo'
    },
    lang: { //TODO: use npm langauges to see if the langugage is valid
      type: 'string',
      size: 255,
      defaultsTo: 'en'
    }
  }
};

