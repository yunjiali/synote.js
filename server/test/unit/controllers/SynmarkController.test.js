/**
 * Created by user on 22/11/2014.
 */

var request = require('supertest-as-promised');
var async = require('async');
var should = require('should');

describe('SynmarkController', function() {

    describe('POST /synmark/create', function(){
        var accessToken = "";
        var mmid="";
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
                }
            ],function(err, results){
                done();
            });
        });

        it('should not be successful if token is not presented', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/synmark/create')
                .send({
                    title:'synmark1',
                    content:'This is synmark1 test',
                    tags:'synmark,test,data',
                    mfst:'30',
                    mfet:'42',
                    mmid: mmid
                })
                .expect(403)
                .end(function(err,res){
                    res.statusCode.should.equal(403);
                    done();
                })
        });

        it('should successfully create synmark with tags and tags should have index', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/synmark/create?access_token='+accessToken)
                .send({
                    title:'synmark1',
                    content:'This is synmark1 test',
                    tags:'synmark,test,data',
                    mfst:'30',
                    mfet:'42',
                    mmid: mmid
                })
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check tags
                    Synmark.findOne({id:resObj.synmarkid}).populate('tags').exec(function(err, syn){
                        should.exist(syn);
                        syn.toJSON().should.have.property('tags').with.lengthOf(3);
                        syn.toJSON().tags[1].text.should.equal('test');
                        syn.toJSON().tags[1].ind.should.equal(2);
                        done();
                    });
                });
        });
    });

    describe('POST /synmark/save', function(){
        var accessToken = "";
        var mmid="";
        var synid="";
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
                    agent
                        .post('/synmark/create?access_token='+accessToken)
                        .send({
                            title:'synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPeer',
                            content:'This is synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPeer test',
                            tags:'synmark,test,data',
                            mfst:'30',
                            mfet:'42',
                            mmid: mmid
                        })
                        .expect(200)
                        .end(function(err,res){
                            callback(null);
                        });
                },
                function(callback){
                    Synmark.findOne({title:'synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPeer'}, function(err,newsynmark){
                        should.exist(newsynmark.id);
                        synid = newsynmark.id;
                        callback(null);
                    });
                }

            ],function(err, results){
                done();
            });
        });

        it('should not be successful if token is not presented', function(done){
            Synmark.findOne({id:synid}, function(err,newsynmark){
                var synmark = newsynmark;
                synmark.title = "asdfjpasiufpqwiuerpqwoieur";
                var agent = request.agent(sails.hooks.http.app);
                agent
                    .post('/synmark/save/'+synid)
                    .send(synmark)
                    .expect(403)
                    .end(function(err,res){
                        res.statusCode.should.equal(403);
                        done();
                    });
            });
        });

        it('should successfully edit synmark with new tags and tags should have index', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/synmark/save/'+synid+'?access_token=' + accessToken)
                .send({
                    title:'synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPeer',
                    content:'This is synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPeer test',
                    tags:'synmark,test,changed,data',
                    mfst:'30',
                    mfet:'42',
                    mmid: mmid
                })
                .expect(200)
                .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check tags
                    Synmark.findOne({id: resObj.synmark.id}).populate('tags').exec(function (err, syn) {
                        should.exist(syn);
                        syn.toJSON().should.have.property('tags').with.lengthOf(4);
                        syn.toJSON().tags[2].text.should.equal('changed');
                        syn.toJSON().tags[2].ind.should.equal(3);
                        syn.annotates.toString().should.equal(mmid);
                        done();
                    });
                });

        });

        //TODO: can't edit other people's synmark
    });

    describe.only('POST /synmark/delete', function(){
        var accessToken = "";
        var mmid="";
        var synid1="";
        var synid2="";
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
                    agent
                        .post('/synmark/create?access_token='+accessToken)
                        .send({
                            title:'synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxewpqoierur',
                            content:'This is synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPeer test',
                            tags:'synmark,test,data',
                            mfst:'30',
                            mfet:'42',
                            mmid: mmid
                        })
                        .expect(200)
                        .end(function(err,res){
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/synmark/create?access_token='+accessToken)
                        .send({
                            title:'synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxeasdhflasldkfjr',
                            content:'This is synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPeer test',
                            tags:'synmark2,test2,data2',
                            mfst:'60',
                            mfet:'70',
                            mmid: mmid
                        })
                        .expect(200)
                        .end(function(err,res){
                            callback(null);
                        });
                },
                function(callback){
                    Synmark.findOne({title:'synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxewpqoierur'}, function(err,newsynmark){
                        should.exist(newsynmark.id);
                        synid1 = newsynmark.id;
                        callback(null);
                    });
                },
                function(callback){
                    Synmark.findOne({title:'synmark6sXUak6SvC2AEZ6bXdfwAoVgUPSXxeasdhflasldkfjr'}, function(err,newsynmark){
                        should.exist(newsynmark.id);
                        synid2 = newsynmark.id;
                        callback(null);
                    });
                }

            ],function(err, results){
                done();
            });
        });

        it('should not delete if token is not presented', function(done){
            Synmark.findOne({id:synid1}, function(err,newsynmark){
                var agent = request.agent(sails.hooks.http.app);
                agent
                    .delete('/synmark/delete/'+synid1)
                    .expect(403)
                    .end(function(err,res){
                        res.statusCode.should.equal(403);
                        done();
                    });
            });
        });

        it('should successfully delete synmark with tags and playlistsynmark casading', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .delete('/synmark/delete/'+synid1+'?access_token=' + accessToken)
                .expect(200)
                .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check if tags are also deleted
                    Synmark.findOne({id:synid1}, function(err, newsynmark){
                        should.not.exist(newsynmark);
                        Tag.find({ownersynmark:synid1}, function(errTag, tags){
                            tags.length.should.equal(0);
                            PlaylistItemSynmark.find({synmark:synid1}, function(errPlis, pliss){
                                pliss.length.should.equal(0);
                                done();
                            });
                        });
                    })
                });

        });

        //TODO: can't edit other people's synmark
    });

});

