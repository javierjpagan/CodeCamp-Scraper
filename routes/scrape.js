var cheerio = require("cheerio");
var axios = require("axios");
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
var Save = require("../models/Save");



module.exports = function (app) {

    app.get("/scrape", function(req, res) {
        axios.get("https://www.freecodecamp.org/news/").then(function(response) {
            var $ = cheerio.load(response.data);
        
            $("article.post-card").each(function(i, element) {
                var result = {};
                result.title = $(element).attr("header.post-card-header");
                result.link = $(element).attr("header.post-card-header").children("a.href");
                result.image = $(element).children("img.srcset");
        
                if (result.title && result.link) {
                    var entry = new Article(result);
                    Article.update(
                        {link: result.link},
                        result,
                        { upsert: true },
                        function (error, doc){
                            if (error) {
                                console.log(error);
                            }
                        }
                    );
                }
            });
        
            res.json({"code" : "success"});
            });
    });


    app.get("/articles", function (req, res) {
        Article.find({}, function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });

    app.get("/articles/:id", function (req, res) {
        Article.find({
                "_id": req.params.id
            })
            .populate("comment")
            .exec(function (error, doc) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(doc);
                }
            });
    });

    app.get("/saved/all", function (req, res) {
        Save.find({})
            .populate("comment")
            .exec(function (error, data) {
                if (error) {
                    console.log(error);
                    res.json({"code" : "error"});
                } else {
                    res.json(data);
                }
            });
    });

    app.post("/save", function (req, res) {
        var result = {};
        result.id = req.body._id;
        result.summary = req.body.summary;
        result.title = req.body.title;
        result.link = req.body.link;
        var entry = new Save(result);

        entry.save(function (err, doc) {
            if (err) {
                console.log(err);
                res.json(err);
            }
            else {
                res.json(doc);
            }
        });
    });

    app.delete("/delete", function (req, res) {
        var result = {};
        result._id = req.body._id;
        Save.findOneAndRemove({
            '_id': req.body._id
        }, function (err, doc) {
            if (err) {
                console.log("error:", err);
                res.json(err);
            }
            else {
                res.json(doc);
            }
        });
    });

    app.get("/comments/:id", function (req, res) {
        if(req.params.id) {
            Comment.find({
                "article_id": req.params.id
            })
            .exec(function (error, doc) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(doc);
                }
            });
        }
    });


    app.post("/comments", function (req, res) {
        if (req.body) {
            var newComment = new Comment(req.body);
            newComment.save(function (error, doc) {
                if (error) {
                    console.log(error);
                } else {
                    res.json(doc);
                }
            });
        } else {
            res.send("Error");
        }
    });

    app.get("/commentpopulate", function (req, res) {
        Comment.find({
            "_id": req.params.id
        }, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                res.send(data);
            }
        });
    });

    app.delete("/deletecomment", function (req, res) {
        var result = {};
        result._id = req.body._id;
        Comment.findOneAndRemove({
            '_id': req.body._id
        }, function (err, data) {
            if (err) {
                console.log("error:", err);
                res.json(err);
            }
            else {
                res.json(data);
            }
        });
    });
}