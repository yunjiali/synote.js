/**
 * Created by user on 07/03/15.
 */


var request = require('supertest-as-promised');
var async = require('async');
var should = require('should');

describe('TagController', function() {

    describe.only('GET /tag/list', function(){
        var accessToken = "";
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
                }
            ],function(err, results){
                done();
            });
        });

        it('should not get tags if access token is missing', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .get('/tag/list')
                .expect(403)
                .end(function(err,res){
                    res.statusCode.should.equal(403);
                    done();
                })
        });

        it('should successfully get all tags', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .get('/tag/list?access_token='+accessToken)
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    resObj.tags.length.should.greaterThan(0); //we have already put some tags
                    done();
                });
        });

        it('should successfully get all synmark tags in jqcloud format', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .get('/tag/list/synmark/jqcloud?access_token='+accessToken)
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    resObj.tags.length.should.greaterThan(0); //we have already put some tags
                    done();
                });
        });
    });
});
