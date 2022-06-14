module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports.isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('denied-route')
    } else {
        next()
    }
}

module.exports.checkRole = (role) => (req, res, next) => {
    if (!req.user) {
        if (req.url.includes('company') || req.url.includes('offer')) {
            res.redirect('/company-login');
        } else if (req.url.includes('candidate')) {
            res.redirect('/candidate-login');
        } else if (req.url.includes('apply')) {
            res.redirect('/candidate-login')
        }
    } else if (req.user.role === 'COMPANY') {
        if (req.isAuthenticated && req.user.role === role) {
            next();
        } else {
            res.redirect('/candidate-login');
        }
    } else if (req.user.role === 'CANDIDATE') {
        if (req.isAuthenticated && req.user.role === role) {
            next();
        } else {
            res.redirect('/company-login');
        }
    } else {
        next();
    }
}