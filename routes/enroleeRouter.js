const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Enrolees = require('../models/enrolees');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },

    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

//file filter to decide type of file acceptable for upload 
const imageFileFilter =  (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('You can only upload .jpg, .jpeg and .png image files!'), false);
    }
    cb(null, true);
};

const upload = multer({storage:storage, fileFilter:imageFileFilter});

const enroleeRouter = express.Router();

enroleeRouter.use(bodyParser.json());

enroleeRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Enrolees.find(req.query)
    .then((enrolees) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(enrolees);
    }, (err) => next(err))
    .catch(err => {
        res.status(500).json({message: "Unable to connect"});
    });
})

.post(cors.corsWithOptions, authenticate.verifyUser, upload.single('file'), (req, res, next) => {  
    if(!req.file) {
        return res.status(500).json({ message: 'Upload fail' });
    } else {
        const url = req.protocol + '://' + req.get('host') 
        req.body.image = url + '/images/' + req.file.filename;
        Enrolees.create(req.body, function (err, enrolee) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.json(enrolee);
        });
        // .then((enrolee) => {
        //     //console.log('New Enrolee Successfully Registered', enrolee);
        //     res.statusCode = 200;
        //     res.setHeader('content-type', 'application/json');
        //     res.json(enrolee);
        // }, (err) => next(err))
        // .catch((err) => next(err));
        
    }
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {       //posts carry json info in he req. body and should be parsed
    res.statusCode = 403;
    res.end('PUT operation not supported on /enrolees');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {             //this deletes all leaders and should be used with caution
    Enrolees.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch(err => {
        res.status(500).json({message: "Unable to delete enrolees"});
    });
});


//Route to handle requests to any individual leader identified by the leader id, to GET, POST, PUT or DELETE one leader

enroleeRouter.route('/:enroleeId') 
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })   
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Enrolees.findById(req.params.enroleeId)
    .then((enrolee) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(enrolee);
    }, (err) => next(err))
    .catch(err => {
        res.status(500).json({message: "Unable to connect"});
    });
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {       //not supported. you can not add a new leader with leaderId
    res.statusCode = 403;
    res.end('POST operation not supported on /enrolees/' + req.params.enroleeId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {       //used to update a leader
    Enrolees.findByIdAndUpdate(req.params.enroleeId, { 
        $set: req.body
    }, { new: true})
    .then((enrolee) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(enrolee);
    }, (err) => next(err))
    .catch(err => {
        res.status(500).json({message: "Unable to update enrolee details"});
    });
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Enrolees.findByIdAndRemove(req.params.enroleeId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch(err => {
        res.status(500).json({message: "Unable to delete enrolee records"});
    });
});


module.exports = enroleeRouter;