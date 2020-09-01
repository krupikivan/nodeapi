exports.createPostValidator = (req, res, next) => {
    // Title
    req.check('title', 'Write a title').notEmpty()
    req.check('title', 'Title is too short').isLength({
        min: 4,
        max: 150
    });
    // Body
    req.check('body', 'Write a body').notEmpty()
    req.check('body', 'Body is too short').isLength({
        min: 4,
        max: 2000
    });

    // Check for errors
    const errors = req.validationErrors()
    if (errors) {
        // If has error, show just the first error
        const firstError = errors.map((err) => err.msg)[0]
        return res.status(400).json({
            error: firstError
        });
    }
    next();
}

exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email not valid')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 2000
        })

    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({
            min: 6
        })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}