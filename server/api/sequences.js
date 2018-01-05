const router = require('express').Router();
const { Sequence } = require('../db/models')

router.get('/:id', (req, res, next) => {
    Sequence.findById(req.params.id)
    .then(sequence => {
        res.json(sequence)
    })
    .catch(next);
})

router.get('/', (req, res, next) => {
    Sequence.findAll()
    .then(sequences => {
        res.json(sequences)
    })
    .catch(next);
})

router.post('/', (req, res, next) => {
    Sequence.create(req.body)
    .then(sequence => {
        res.json(sequence)
    })
    .catch(next);
})

router.put('/:id', (req, res, next) => {
    Sequence.findById(req.params.id)
    .then(sequence => {
        sequence.update(req.body);
        return sequence;
    })
    .then(newSequence => {
        res.json(newSequence);
    })
    .catch(next);
})


module.exports = router;