const Article = require('../models/article');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.status(201).send(article))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select('+owner')
    .then((article) => {
      if (!article) {
        return Promise.reject(new NotFoundError('Artículo no encontrado'));
      }

      if (article.owner.toString() !== req.user._id) {
        return Promise.reject(
          new ForbiddenError('No puedes eliminar artículos de otro usuario'),
        );
      }

      return Article.findByIdAndDelete(req.params.articleId).then(() => res.send({ message: 'Artículo eliminado' }));
    })
    .catch(next);
};
