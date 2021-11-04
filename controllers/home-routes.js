const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment, Vote } = require("../models");

// get all posts for homepage
router.get("/", (req, res) => {
  console.log(req.session);
  console.log("======================");
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));

      res.render("homepage", {
        posts, // posts: posts is available in the homepage.handlebars file as posts (this is the same as posts: posts) and the data is passed to the homepage.handlebars file
        loggedIn: req.session.loggedIn, // check if user is logged in or not in homepage view (if logged in, show logout button)
      });
    })
    .catch((err) => {
      // catch errors
      console.log(err); // log error to console
      res.status(500).json(err); // send error status and error message
    });
});

//route that renders the homepage
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    //if user is logged in, redirect to homepage
    res.redirect("/"); //if user is logged in, redirect to homepage
    return; //returns to homepage if user is logged in
  }
  res.render("login"); //renders login page
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      //serialize the data
      const post = dbPostData.get({ plain: true });

      //pass data to template
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn, //passes loggedIn status to single-post.handlebars
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
