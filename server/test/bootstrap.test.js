/**
 * Created by user on 13/11/2014.
 */


var Sails = require('sails');
var request = require('supertest-as-promised');
var async = require('async');


before(function(done) {
    Sails.lift({
        // configuration for testing purposes
    }, function(err, sails) {
        if (err) return done(err);
        // here you can load fixtures, etc.

        var agent = request.agent(sails.hooks.http.app);
        var accessToken="";
        var mmid1, mmid2, mmid3;
        var synmarkid1_1, synmarkid1_2, synmarkid1_3, synmarkid1_4;
        var synmarkid2_1, synmarkid2_2;
        var synmarkid3_1, synmarkid3_2, synmarkid3_3;
        var plid1;
        var pliid1,pliid2,pliid3;
        var plisid1,plisid2;

        //add test user
        async.waterfall([
            //add normal user
            function(callback){
                request(sails.hooks.http.app)
                    .post('/user/create')
                    .send({username:'teststatic',password:'hellowaterlock',firstname:'test',lastname:'static',email:'teststatic@synote.com'})
                    .expect(200)
                    .end(function(err,res){
                        callback(err);
                    })
            },
            //add admin user
            function(callback) {
                request(sails.hooks.http.app)
                    .post('/user/create')
                    .send({
                        username: 'adminstatic',
                        password: 'hellowaterlockadmin',
                        firstname: 'admin',
                        lastname: 'static',
                        email: 'adminstatic@synote.com',
                        role: 'admin'
                    })
                    .expect(200)
                    .end(function (err, res) {
                        callback(null);
                    })
            },
            //login
            function(callback){
                agent
                    .post('/auth/login')
                    .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                    .expect(200)
                    .end(function(err, res){
                        callback(null);
                    });
            },
            function(callback){
                agent
                    .get('/user/jwt')
                    .expect(200)
                    .end(function(err, res){
                        var resObj = JSON.parse(res.text);
                        resObj.should.have.property("token");
                        accessToken = resObj.token;
                        callback(null);
                    })
            },
            //multimedia1, 3 synmarks
            function(callback){
                agent
                    .post('/multimedia/create?access_token='+accessToken)
                    .send({
                        title:"6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPe", //find multimedia using this title
                        description:"Josh Kaufman is the author of the #1 international bestseller, 'The Personal MBA: Master the Art of Busines",
                        duration:"1167",
                        thumbnail:"https://i.ytimg.com/vi/5MgBikgcWnY/default.jpg",
                        url:"http://www.youtube.com/watch?v=5MgBikgcWnY",
                        tags:"ted,talk,ok",
                        subtitles:["srt,it,http://www.youtube.com/api/timedtext?v=5MgBikgcWnY&fmt=srt&lang=it&name=",
                            "srt,en,http://www.youtube.com/api/timedtext?v=5MgBikgcWnY&fmt=srt&lang=en&name="]
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        mmid1 = resObj.mmid;
                        //check tags
                        callback(null);
                    });
            },
            function(callback){ //synmark1_1
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark1_1',
                        content:'This is synmark1_1 test',
                        tags:'synmark1_1,test,data',
                        mfst:'30',
                        mfet:'42',
                        mmid: mmid1
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid1_1 = resObj.synmarkid;
                        callback(null);
                    })
            },
            function(callback){ //synmark1_2
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark1_2',
                        content:'This is synmark1_2 test',
                        tags:'synmark1_2,test,data',
                        mfst:'44',
                        mfet:'55',
                        mmid: mmid1
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid1_2 = resObj.synmarkid;
                        callback(null);
                    })
            },
            function(callback){ //synmark1_3
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark1_3',
                        content:'This is synmark1_3 test',
                        tags:'synmark1_3,test,data',
                        mfst:'61',
                        mfet:'70',
                        mmid: mmid1
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid1_3 = resObj.synmarkid;
                        callback(null);
                    })
            },
            //multimedia 2, synmark2
            function(callback){
                agent
                    .post('/multimedia/create?access_token='+accessToken)
                    .send({
                        title:"6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPf", //find multimedia using this title
                        description:"If you are interest on more free online course info, welcome to: http://opencourseonline.com",
                        duration:"378",
                        thumbnail:"https://i.ytimg.com/vi/b9UJ6W0jG1M/default.jpg",
                        url:"http://www.youtube.com/watch?v=b9UJ6W0jG1M",
                        tags:"NLP,sentimental,analysis,baseline algorithm"
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        mmid2 = resObj.mmid;
                        callback(null);
                    });
            },
            function(callback){ //synmark2_1
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark2_1',
                        content:'This is synmark2_1 test',
                        tags:'synmark2_1,test,data',
                        mfst:'11',
                        mfet:'21',//why??????
                        mmid: mmid2
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid1_3 = resObj.synmarkid;
                        callback(null);
                    })
            },
            function(callback){ //synmark2_2
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark2_2',
                        content:'This is synmark2_2 test',
                        tags:'synmark2_2,test,data',
                        mfst:'31',
                        mfet:'40',
                        mmid: mmid2
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid2_2 = resObj.synmarkid;
                        callback(null);
                    })
            },
            function(callback){ //multimedia3
                agent
                    .post('/multimedia/create?access_token='+accessToken)
                    .send({
                        title:"6sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPg", //find multimedia using this title
                        description:"Media fragment is important on the Web as it describes and server-side programmes to create snapshot pages for each media.",
                        duration:"378",
                        thumbnail:"https://i.ytimg.com/vi/AZeXETmatZk/default.jpg",
                        url:"http://www.youtube.com/watch?v=AZeXETmatZk",
                        tags:"synote,my,yunjiali"
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        mmid3 = resObj.mmid;
                        callback(null);
                    });
            },
            function(callback){ //synmark3_1
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark3_1',
                        content:'This is synmark3_1 test',
                        tags:'synmark3_1,test,data',
                        mfst:'31',
                        mfet:'40',
                        mmid: mmid3
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid3_1 = resObj.synmarkid;
                        callback(null);
                    })
            },
            function(callback){ //synmark3_2
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark3_2',
                        content:'This is synmark3_2 test',
                        tags:'synmark3_2,test,data',
                        mfst:'36',
                        mfet:'45',
                        mmid: mmid3
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid3_2 = resObj.synmarkid;
                        callback(null);
                    })
            },
            function(callback){ //synmark3_3
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark3_3',
                        content:'This is synmark3_3 test',
                        tags:'synmark3_3,test,data',
                        mfst:'72',
                        mfet:'80',
                        mmid: mmid3
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid3_3 = resObj.synmarkid;
                        callback(null);
                    })
            },
            function(callback){ //synmark3_4
                agent
                    .post('/synmark/create?access_token='+accessToken)
                    .send({
                        title:'synmark3_4',
                        content:'This is synmark3_4 test',
                        tags:'synmark3_4,test,data',
                        mfst:'81',
                        mfet:'90',
                        mmid: mmid3
                    })
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        synmarkid3_4 = resObj.synmarkid;
                        callback(null);
                    })
            },
            //create a playlist
            function(callback) {
                agent
                    .post('/playlist/create?access_token=' + accessToken)
                    .send({
                        title: 'playlist16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPh',
                        description: 'This is playlist1'
                    })
                    .expect(200)
                    .end(function (err, res) {
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        plid1 = resObj.plid;
                        callback(null);
                    });
            },
            //add multimedia1 to playlist
            function(callback){
                agent
                    .post('/playlist/'+plid1+'/add/'+mmid1+'?access_token='+accessToken)
                    .send()
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        pliid1 = resObj.pliid;
                        callback(null);
                    })
            },
            //add synmark1_1 to multimedia1 item
            function(callback){
                agent
                    .post('/playlistitemsynmark/'+pliid1+'/add/synmark/'+synmarkid1_1+'?access_token='+accessToken)
                    .send()
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        plisid1 = resObj.plisid;
                        callback(null);
                    })
            },
            //add synmark1_2 to multimedia1 item
            function(callback){
                agent
                    .post('/playlistitemsynmark/'+pliid1+'/add/synmark/'+synmarkid1_2+'?access_token='+accessToken)
                    .send()
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        plisid2 = resObj.plisid;
                        callback(null);

                    })
            },
            //add multimedia2 to playlist
            function(callback){
                agent
                    .post('/playlist/'+plid1+'/add/'+mmid2+'?access_token='+accessToken)
                    .send()
                    .expect(200)
                    .end(function(err,res){
                        var resObj = JSON.parse(res.text);
                        resObj.success.should.equal(true);
                        pliid2 = resObj.pliid2;
                        callback(null);
                    })
            }

        ],function(err,results){
            global.bootstrap = {};
            global.bootstrap.multimedia= {};
            global.bootstrap.multimedia.mmid1 = mmid1;
            global.bootstrap.multimedia.mmid2 = mmid2;
            global.bootstrap.multimedia.mmid3 = mmid3;

            global.bootstrap.synmark= {};
            global.bootstrap.synmark.synmarkid1_1 = synmarkid1_1;
            global.bootstrap.synmark.synmarkid1_2 = synmarkid1_2;
            global.bootstrap.synmark.synmarkid1_3 = synmarkid1_3;
            global.bootstrap.synmark.synmarkid1_4 = synmarkid1_4;
            global.bootstrap.synmark.synmarkid2_1 = synmarkid2_1;
            global.bootstrap.synmark.synmarkid2_2 = synmarkid2_2;
            global.bootstrap.synmark.synmarkid3_1 = synmarkid3_1;
            global.bootstrap.synmark.synmarkid3_2 = synmarkid3_2;
            global.bootstrap.synmark.synmarkid3_3 = synmarkid3_3;

            global.bootstrap.playlist = {};
            global.bootstrap.playlist.plid1 = plid1;

            global.bootstrap.playlistitem = {};
            global.bootstrap.playlistitem.pliid1 = pliid1;
            global.bootstrap.playlistitem.pliid2 = pliid2;
            global.bootstrap.playlistitem.pliid3 = pliid3;

            global.bootstrap.playlistitemsynmark = {};
            global.bootstrap.playlistitemsynmark.plisid1 = plisid1;
            global.bootstrap.playlistitemsynmark.plisid2 = plisid2;
            done(err,sails);
        });
    });
});

after(function(done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
});