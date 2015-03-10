
/**
 * Created by user on 22/11/2014.
 */

var request = require('supertest-as-promised');
var async = require('async');
var should = require('should');


describe('PlaylistController', function() {
    describe('POST /playlist/create, /playlist/:plid/add/:mmid', function(){
        var accessToken = "";
        var mmid= "";
        var plid= ""
        before(function(done){
            mmid= global.bootstrap.multimedia.mmid3;
            plid= global.bootstrap.playlist.plid1;
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
                }
            ],function(err, results){
                done();
            });
        });

        it('should not be successful if token is not presented', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/playlist/create')
                .send({
                    title:'playlist1',
                    description:'This is playlist1 test'
                })
                .expect(403)
                .end(function(err,res){
                    res.statusCode.should.equal(403);
                    done();
                })
        });

        it('should successfully create playlist', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/playlist/create?access_token='+accessToken)
                .send({
                    title:'playlist1',
                    description:'This is playlist1 test'
                })
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check tags
                    Playlist.findOne({id:resObj.plid}).exec(function(err, pl){
                        should.exist(pl);
                        pl.toJSON().should.have.property('title');
                        done();
                    });
                })
        });

        it('should successfully add playlist item', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/playlist/'+plid+'/add/'+mmid+'?access_token='+accessToken)
                .send()
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check tags
                    PlaylistItem.findOne({id:resObj.pliid}).exec(function(err, pli){
                        should.exist(pli);
                        pli.ind.should.greaterThan(1);
                        done();
                    });
                });
        });
    });

    describe('POST /playlist/get/:plid ', function(){
        var accessToken = "";
        var mmid="";
        var plid="";
        before(function(done){
            var agent = request.agent(sails.hooks.http.app);
            var mmid= global.bootstrap.multimedia.mmid1;
            var plid= global.bootstrap.playlist.plid1;
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
                }
            ],function(err, results){
                done();
            });
        });

        it('should get playlist info with permission view', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .get('/playlist/get/'+plid)
                .expect(200)
                .end(function(err,res){
                    res.statusCode.should.equal(200);
                    res.title.should.equal('playlist1');
                    done();
                })
        });
    });

    describe('GET /playlist/list ', function(){
        var accessToken = "";
        var plid="";
        before(function(done){
            var agent = request.agent(sails.hooks.http.app);
            var plid= global.bootstrap.playlist.plid1;
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
                }
            ],function(err, results){
                done();
            });
        });

        it('should get a list of playlist', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .get('/playlist/list?access_token='+accessToken)
                .expect(200)
                .end(function(err,res){
                    res.statusCode.should.equal(200);
                    var resObj = JSON.parse(res.text);
                    resObj.length.should.greaterThan(0);
                    done();
                })
        });
    });

    describe('POST /playlist/save/:plid ', function(){
        var accessToken = "";
        var plid="";
        before(function(done){
            plid= global.bootstrap.playlist.plid1;
            done();
        });

        it('should edit playlist successfully', function(done){
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
                        .post('/playlist/save/'+plid+'?access_token='+accessToken)
                        .send({title:'playlist16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdd', description:'Playlist 1 has been changed'})
                        .expect(200)
                        .end(function(err,res){
                            res.statusCode.should.equal(200);
                            var resObj = JSON.parse(res.text);
                            should.exist(resObj.plid);
                            Playlist.findOne({id:resObj.plid}).exec(function(err, pl){
                                should.exist(pl);
                                pl.title.should.equal('playlist16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdd');
                                callback(null);
                            });

                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should not be permitted to edit playlist', function(done){
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic2@synote.com', password: 'hellowaterlock'})
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
                        .post('/playlist/save/'+plid+'?access_token='+accessToken)
                        .send({title:'playlist16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdduu', description:'Playlist 1 has been changed by some other users.'})
                        .expect(403)
                        .end(function(err,res){
                            res.statusCode.should.equal(403);
                            callback(null);
                        })
                }
            ],function(err, results){
                done();
            });
        });
    });

    describe('POST /playlist/:plid/save', function(){
        var accessToken = "";
        var plid1=""; //get all of them from bootstrap
        var pliid1="";
        var pliid2="";
        var pliid3="";

        before(function(done){
            plid1= global.bootstrap.playlist.plid1;
            pliid1= global.bootstrap.playlistitem.pliid1;
            pliid2= global.bootstrap.playlistitem.pliid2;
            pliid3= global.bootstrap.playlistitem.pliid3;
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
                }
            ],function(err, results){
                done();
            });
        });

        it('should edit playlist succefully, index should be changed and items should be removed', function(done) {
            var agent = request.agent(sails.hooks.http.app);

            agent
                .post('/playlist/'+plid1+'/save?access_token=' + accessToken)
                //according to bootstrap data, we do the following: move ind1 to ind2, ind3 to ind1 and remove ind2
                .send([{id:pliid1, ind:2},{id:pliid3, ind:1}])
                .expect(200)
                .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    res.statusCode.should.equal(200);

                    async.waterfall([
                        function(callback){
                            PlaylistItem.findOne({id:pliid1}).exec(function (err, item) {
                                item.ind.should.equal(2);
                                callback(null);
                            });
                        }
                        ,function(callback){
                            PlaylistItem.findOne({id:pliid2}).exec(function (err, item) {
                                should.not.exist(item);
                                callback(null);
                            });
                        },function(callback){
                            PlaylistItem.findOne({id:pliid3}).exec(function (err, item) {
                                item.ind.should.equal(1);
                                callback(null);
                            });
                        }], function(err){
                        done();
                    });
                });
        });
    });
});

