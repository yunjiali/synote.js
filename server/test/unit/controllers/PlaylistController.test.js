
/**
 * Created by user on 22/11/2014.
 */

var request = require('supertest-as-promised');
var async = require('async');
var should = require('should');


describe('PlaylistController', function() {

    describe.only('POST /playlist/create, /playlist/:plid/add/:mmid', function(){
        var accessToken = "";
        var mmid="";
        var plid="";
        before(function(done){
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
                    Multimedia.findOne({title:'6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPe'}, function(err,multimedia){
                        should.exist(multimedia.id);
                        mmid = multimedia.id.toString();
                        callback(null);
                    });
                },
                function(callback){
                    Playlist.findOne({title:'playlist16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPh'}, function(err,pl){
                        should.exist(pl.id);
                        plid = pl.id.toString();
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

        it('should successfully add to playlist item', function(done){
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
                        done();
                    });
                });
        });

        it('should successfully add to playlist item', function(done){
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
                        done();
                    });
                });
        });
    });

});

