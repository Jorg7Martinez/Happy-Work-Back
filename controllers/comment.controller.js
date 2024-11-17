// src/controllers/commentController.js
const Comment = require("../model/comment.model");

// Agregar un comentario
exports.addComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(201).json({ message: "Comentario agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar comentario" });
  }
};

// Obtener todos los comentarios
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

// Obtener comentarios por empresa
exports.getCommentsByCompany = async (req, res) => {
  try {
    const comments = await Comment.find({ company: req.params.company });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener comentarios de la empresa" });
  }
};
