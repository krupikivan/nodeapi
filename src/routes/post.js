const express = require('express')
const { getPosts, createPost, postByUser, postById, isPoster, deletePost, updatePost } = require('../controllers/post')
const { requireSignin } = require('../controllers/auth')
const { createPostValidator } = require('../validator')
const { userById } = require('../controllers/user')

const router = express.Router()

router.get('/posts', getPosts);
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get("/posts/by/:userId", requireSignin, postByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

// Any route containing :userId, our app will first execute userById
router.param('userId', userById);
router.param('postId', postById);

module.exports = router;