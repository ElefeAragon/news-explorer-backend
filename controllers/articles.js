const Article = require("../models/article");

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

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
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select("+owner")
    .then((article) => {
      if (!article) {
        return res.status(404).send({ message: "Artículo no encontrado" });
      }

      if (article.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .send({ message: "No puedes eliminar artículos de otro usuario" });
      }

      return Article.findByIdAndDelete(req.params.articleId).then(() => {
        res.send({ message: "Artículo eliminado" });
      });
    })
    .catch(next);
};