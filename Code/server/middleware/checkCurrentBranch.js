const checkCurrentBranch = (role) => (req, res, next) => {
    if (req.headers['x-current-branch']) {
        req.currentBranch = req.headers['x-current-branch'];
        next();
    }
    else {
        return res.status(401).json({ status: false, message: 'There is some error please try again later' });
    }
};

module.exports = checkCurrentBranch;