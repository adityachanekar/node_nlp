const express = require('express');
const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const stopword = require('stopword');

const router = express.Router();

router.post('/s-analyzer', function (req, res, next) {
    const { review } = req.body;
    const lexedReview = aposToLexForm(review).toLowerCase().replace(/[^a-zA-Z\s]+/g, '');

    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer()

    let token = tokenizer.tokenize(lexedReview);
    let filteredReview = stopword.removeStopwords(token);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);

    res.status(200).json({ analysis });
});

module.exports = router;