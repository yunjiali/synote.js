/**
 * Created by Yunjia Li on 13/11/2014.
 */


var request = require('supertest-as-promised');
var should = require('should');
var async = require('async');

describe('UsersController', function() {

    describe('POST /user/create', function() {

        it('should register normal user successfully and logout', function (done) {

            request(sails.hooks.http.app)
                .post('/user/create')
                .send({
                    username: 'test4',
                    password: 'hellowaterlock111',
                    firstname: 'test',
                    lastname: 'one',
                    email: 'test6@synote.com'
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    done();
                });
        });

        it('should create a default favourite playlist when user registered', function (done) {

            request(sails.hooks.http.app)
                .post('/user/create')
                .send({
                    username: 'testqpwoierupoqwresjdnfskansdkflj',
                    password: 'hellowaterlock1117',
                    firstname: 'test7',
                    lastname: 'seven',
                    email: 'test7@synote.com'
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    User.findOne({username:'testqpwoierupoqwresjdnfskansdkflj'}).exec(function(errUser,user){
                        Playlist.findOne({owner:user.id,title:sails.__("Favourite")}).exec(function(errPl, playlist){
                            should.exist(playlist);
                            done();
                        });
                    });
                });
        });

        /*it('should not register user as the password is shorter than 8 characters', function (done) {

            request(sails.hooks.http.app)
                .post('/user/create')
                .send({
                    username: 'test102384ljshdflashdfj',
                    password: 'ddd',
                    firstname: 'test',
                    lastname: 'eighteight',
                    email: 'test88@synote.com'
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(false);
                    User.findOne({username:'test102384ljshdflashdfj'}).exec(function(errUser, user){
                        should.not.exist(user);
                        done();
                    })
                });
        });*/


        it('should register admin user successfully and logout', function (done) {
            request(sails.hooks.http.app)
                .post('/user/create')
                .send({
                    username: 'admin',
                    password: 'hellowaterlock',
                    firstname: 'admin',
                    lastname: 'one',
                    email: 'admin@synote.com',
                    role: 'admin'
                })
                .expect(200)
                .end(function (err, res) {
                    //if (err) return done(err);
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    done();
                });
        });

        //TODO: user with same username shouldn't be registered
        //TODO: user with same email shouldn't be registered
    });

    describe('POST /user/jwt', function() {

        //logout before any test
        before(function(done){
            request(sails.hooks.http.app)
                .post('/auth/logout')
                .expect(200)
                .end(function(err,res){
                    done();
                });
        });

        it('should not get jwt token if not logged in', function (done) {
            request(sails.hooks.http.app)
                .get('/user/jwt')
                .expect(403, done);
        });

        it('should login and get jwt token',function(done){
            var agent = request.agent(sails.hooks.http.app);
            async.series([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err,res){
                            //console.log(res);
                            callback(err, res)
                        });
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err,res){
                            //console.log(res);
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            callback();
                        });
                }
            ], function(err, results){
                done();
            });

        });
    });
});