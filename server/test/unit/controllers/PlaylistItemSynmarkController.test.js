/**
 * Created by user on 18/01/15.
 */



var request = require('supertest-as-promised');
var async = require('async');
var should = require('should');

describe('PlaylistItemSynmarkController', function() {

    //'post /playlistitemsynmark/:pliid/add/synmark/:synmarkid':'PlaylistItemSynmarkController.addsynmark'
    //'delete /playlistitemsynmark/:pliid/remove/synmark/:synmarkid':'PlaylistItemSynmarkController.removesynmark'
    describe('POST /playlistitemsynmark/:pliid/add/synmark/:synmarkid', function(){
        var accessToken = "";
        var mmid1="";
        var pliid1="";
        var synmarkid1 = "";
        var synmarkid2 = "";
        before(function(done){
            mmid1=global.bootstrap.multimedia.mmid1;
            pliid1=global.bootstrap.playlistitem.pliid1;
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback(null);
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            accessToken=resObj.token;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/synmark/create?access_token='+accessToken)
                        .send({
                            title:'synmarktestdhpasudsfasldfjh;',
                            content:'This is synmarktestdhpasudsfasldfjh',
                            tags:'synmark1,test,data',
                            mfst:'70',
                            mfet:'92',
                            mmid: mmid1
                        })
                        .expect(200)
                        .end(function(err,res){
                            var resObj = JSON.parse(res.text);
                            resObj.success.should.equal(true);
                            synmarkid1 = resObj.synmarkid;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/synmark/create?access_token='+accessToken)
                        .send({
                            title:'synmarks23401qpowerupoqwierjkfndsddiuer;',
                            content:'This is synmarks23401qpowerupoqwierjkfndsddiuer',
                            tags:'synmark2,test,data',
                            mfst:'90',
                            mfet:'122',
                            mmid: mmid1
                        })
                        .expect(200)
                        .end(function(err,res){
                            var resObj = JSON.parse(res.text);
                            resObj.success.should.equal(true);
                            synmarkid2 = resObj.synmarkid;
                            callback(null);
                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should not be successful to add synmark to playlistitem if token is not presented', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/playlistitemsynmark/'+pliid1+'/add/synmark/'+synmarkid1)
                .send()
                .expect(403)
                .end(function(err,res){
                    res.statusCode.should.equal(403);
                    done();
                })
        });

        it('should successfully add synmark to playlistitem', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/playlistitemsynmark/'+pliid1+'/add/synmark/'+synmarkid1+'?access_token='+accessToken)
                .send()
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check playlistitemsynmark
                    PlaylistItemSynmark.findOne({synmark:synmarkid1,playlistItem:pliid1},function(err,plis){
                        should.exist(plis);
                        done();
                    });
                });
        });

        //TODO: shouldn't add synmark to playlistitem if it's already exisits, use the data in bootstrap
        //TODO: shouldn't add synmark if the synmark doesn't annotate the multimedia resource
    });

    describe('DELETE /playlistitemsynmark/:pliid/remove/synmark/:synmarkid', function(){
        var accessToken = "";
        var mmid1="";
        var pliid1="";
        var synmarkid1 = "";
        var synmarkid2 = "";
        var plisid1="";
        var plisid2="";
        before(function(done){
            mmid1=global.bootstrap.multimedia.mmid1;
            pliid1=global.bootstrap.playlistitem.pliid1;
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback(null);
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            accessToken=resObj.token;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/synmark/create?access_token='+accessToken)
                        .send({
                            title:'synmarktestdhpasudsfasldfjhpuqwoeiruwer',
                            content:'This is synmarktestdhpasudsfasldfjh',
                            tags:'synmark1,test,data',
                            mfst:'70',
                            mfet:'92',
                            mmid: mmid1
                        })
                        .expect(200)
                        .end(function(err,res){
                            var resObj = JSON.parse(res.text);
                            resObj.success.should.equal(true);
                            synmarkid1 = resObj.synmarkid;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/playlistitemsynmark/'+pliid1+'/add/synmark/'+synmarkid1+'?access_token='+accessToken)
                        .send()
                        .expect(200)
                        .end(function(err,res){
                            var resObj = JSON.parse(res.text);
                            resObj.success.should.equal(true);
                            plisid1 = resObj.plisid;
                            callback(null);
                        })
                },
                function(callback){
                    agent
                        .post('/synmark/create?access_token='+accessToken)
                        .send({
                            title:'synmarks23401qpowerupoqwierjkfndsddiuerqueprknlasjdfn',
                            content:'This is synmarks23401qpowerupoqwierjkfndsddiuer',
                            tags:'synmark2,test,data',
                            mfst:'90',
                            mfet:'122',
                            mmid: mmid1
                        })
                        .expect(200)
                        .end(function(err,res){
                            var resObj = JSON.parse(res.text);
                            resObj.success.should.equal(true);
                            synmarkid2 = resObj.synmarkid;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/playlistitemsynmark/'+pliid1+'/add/synmark/'+synmarkid2+'?access_token='+accessToken)
                        .send()
                        .expect(200)
                        .end(function(err,res){
                            var resObj = JSON.parse(res.text);
                            resObj.success.should.equal(true);
                            plisid2 = resObj.plisid;
                            callback(null);
                        })
                },
            ],function(err, results){
                done();
            });
        });

        it('should not be successful to delete synmark to playlistitem if token is not presented', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .delete('/playlistitemsynmark/'+pliid1+'/remove/synmark/'+synmarkid1)
                .send()
                .expect(403)
                .end(function(err,res){
                    res.statusCode.should.equal(403);
                    done();
                })
        });

        it('should successfully delete synmark from playlistitem', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .delete('/playlistitemsynmark/'+pliid1+'/remove/synmark/'+synmarkid1+'?access_token='+accessToken)
                .send()
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check playlistitemsynmark
                    PlaylistItemSynmark.findOne({synmark:synmarkid1,playlistItem:pliid1},function(err,plis){
                        should.not.exist(plis);
                        done();
                    });
                });
        });

        //TODO: shouldn't delete synmark if it's not in playlist yet
        //TODO: shouldn't delete synmark if the synmark doesn't annotate the multimedia resource
    });
});