const { Post } = require('../models/postSchema');
const { User } = require('../models/userSchema');
const auth = require('./auth');
const router = require('express').Router();

//New post by authenticated user
router.post('/', auth, async (req, res) => {
    try {
        const { email: currentUserEmail } = req.user;
        const { title, desc } = req.body;
        const user = await User.findOne({ email: currentUserEmail });
        const { _id } = user._doc;
        const post = new Post({ title, desc, ownerId: _id });
        await post.save();
        res.status(200).send("Successfully saved post");
    } catch (err) {
        res.status(500).send(`Internal server error ${err.message}`);
    }
})

//Delete post by authenticated user
router.delete('/:id', auth, async (req, res) => {
    try {
        const { email: currentUserEmail } = req.user;
        const post = await Post.findById(req.params.id);
        const user = await User.findOne({ email: currentUserEmail });
        const { _id } = user._doc;
        if (post.ownerId.toString() !== _id.toString())
            res.status(401).send('Unauthorized you can only delete your post');
        await post.remove();
        res.status(200).send("Successfully deleted post");
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});

//Like a particular post, you can only like once
router.post('/like/:id', auth, async (req, res) => {
    try {
        const { email: currentUserEmail } = req.user;
        const user = await User.findOne({ email: currentUserEmail });
        const post = await Post.findById(req.params.id);
        if (!post) res.status(404).send("Post not found");
        if (await post.likes.includes(user.id))
            return res.status(400).send('You already liked this post');
        await post.likes.push(user.id);
        await post.save();
        res.status(200).send('Post successfully liked');
    }
    catch (err) {
        res.status(500).send(`Internal server error ${err.message}`);
    }
});

//Dislike a particular post, you can only like once
router.post('/dislike/:id', auth, async (req, res) => {
    try {
        const { email: currentUserEmail } = req.user;
        const user = await User.findOne({ email: currentUserEmail });
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(user.id))
            return res.status(400).send('You have not liked this post earlier');
        await post.likes.pull(user.id);
        await post.save();
        return res.status(200).send('Post successfully unliked');
    }
    catch (err) {
        res.status(500).send(`Internal server error ${err.message}`);
    }
});


//Comment on a particular post
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const { comment } = req.body;
        const { email: currentUserEmail } = req.user;
        const user = await User.findOne({ email: currentUserEmail });
        const post = await Post.findById(req.params.id);
        await post.comments.push({ comment: comment, commentedBy: user._id })
        post.save();

        res.status(200).send(`Commented successfully on post id: ${post._id} `);
    } catch (err) {
        res.status(500).send("Internal server error ");
    }
});

//Delete a comment on a particular post
router.post('/uncomment/:id', auth, async (req, res) => {
    try {
        const { commentId } = req.body;
        const post = await Post.findById(req.params.id);
        await post.comments.pull({ _id: commentId })
        post.save();
        res.status(200).send(`Comment deleted successfully with comment Id: ${commentId} `);
    } catch (err) {
        res.status(500).send("Internal server error ");
    }
});


//Get a particular post, 
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) res.status(404).send("Post not found");
        res.status(200).send(post);
    }
    catch (err) {
        res.status(500).send(`Internal server error ${err.message} `);
    }
});

//Get list of post made by authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const { email: currentUserEmail } = req.user;
        const user = await User.findOne({ email: currentUserEmail });
        const post = await Post.find({ ownerId: user._id });
        if (!post) res.status(404).send("Post not found");
        res.status(200).send(post);
    }
    catch (err) {
        res.status(500).send(`Internal server error ${err.message} `);
    }
});


module.exports = router;