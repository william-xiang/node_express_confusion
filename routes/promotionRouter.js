const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

// import the Promotions model, which points to promos in mongodb
const Promos = require('../models/promotions');

promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Promos.find({})
            .then((promos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Promos.create(req.body)
                .then((promo) => {
                    console.log('Promotion Created ' + promo);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promo);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .put(cors.corsWithOptions, authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            res.statusCode = 403;
            res.end('Put operation not supported on /promotions');
        })
    .delete(cors.corsWithOptions, authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Promos.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        });

promotionRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Promos.findById(req.params.promoId)
            .then((promos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            res.statusCode = 403;
            res.end('Post operation not supported on /promotions/' + req.params.promoId);
        })
    .put(cors.corsWithOptions, authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Promos.findByIdAndUpdate(req.params.promoId, {
                $set: req.body
            }, { new: true })
                .then((promo) => {
                    console.log('Promotion Updated ' + promo);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promo);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .delete(cors.corsWithOptions, authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Promos.findByIdAndRemove(req.params.promoId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        })

module.exports = promotionRouter;