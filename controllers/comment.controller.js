
const Company = require("../model/company.model"); 
const Comment = require("../model/comment.model"); 

// Agregar un comentario
exports.addComment = async (req, res) => {
  try {
    const { company } = req.body;

    // Verifica si la empresa existe
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    // Crea y guarda el comentario
    const comment = new Comment(req.body);
    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error al agregar comentario:", error.message);
    res.status(500).json({ error: "Error al agregar comentario", details: error.message });
  }
};


// Obtener todos los comentarios
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find(); 
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};


// Buscar por nombre de empresa o ID

// Obtener comentarios de una empresa con detalles y promedio general
exports.getCommentByCompanyOrId = async (req, res) => {
  const { id, companyName } = req.query;

  try {
    let query = {};

    if (id) {
      // Buscar comentarios por ID de empresa
      query.company = id;
    } else if (companyName) {
      // Buscar empresas por nombre
      const companies = await Company.find({
        name: { $regex: companyName, $options: "i" },
      });

      if (!companies.length) {
        return res.status(404).json({ error: "No se encontraron empresas con ese nombre" });
      }

      // Obtener IDs de las empresas encontradas
      const companyIds = companies.map((company) => company._id);
      query.company = { $in: companyIds };
    } else {
      return res.status(400).json({ error: "Debes proporcionar un ID de empresa o un nombre" });
    }

    // Buscar comentarios con la consulta generada
    const comments = await Comment.find(query)
      .populate("company", "name industry address employeesCount")
      .populate("user", "name email");

    if (!comments.length) {
      return res.status(404).json({ message: "No se encontraron comentarios" });
    }

    // Calcular promedios
    const totalRatings = comments.reduce(
      (totals, comment) => {
        return {
          workLifeBalance: totals.workLifeBalance + comment.ratings.workLifeBalance,
          salary: totals.salary + comment.ratings.salary,
          growthOpportunities: totals.growthOpportunities + comment.ratings.growthOpportunities,
          workEnvironment: totals.workEnvironment + comment.ratings.workEnvironment,
          professionalDevelopment: totals.professionalDevelopment + comment.ratings.professionalDevelopment,
        };
      },
      {
        workLifeBalance: 0,
        salary: 0,
        growthOpportunities: 0,
        workEnvironment: 0,
        professionalDevelopment: 0,
      }
    );

    const averageRatings = {
      workLifeBalance: (totalRatings.workLifeBalance / comments.length).toFixed(2),
      salary: (totalRatings.salary / comments.length).toFixed(2),
      growthOpportunities: (totalRatings.growthOpportunities / comments.length).toFixed(2),
      workEnvironment: (totalRatings.workEnvironment / comments.length).toFixed(2),
      professionalDevelopment: (totalRatings.professionalDevelopment / comments.length).toFixed(2),
    };

    const overallAverage = (
      Object.values(averageRatings).reduce((sum, value) => sum + parseFloat(value), 0) /
      Object.values(averageRatings).length
    ).toFixed(2);

    // Preparar respuesta
    const companyDetails = comments[0]?.company; 
    const response = {
      company: {
        name: companyDetails.name,
        description: `Rubro de ${companyDetails.industry}. Ubicada en ${companyDetails.address}, cuenta con ${companyDetails.employeesCount} empleados.`,
        totalComments: comments.length,
        averageRatings,
        overallAverage,
      },
      comments: comments.map((comment) => ({
        id: comment._id,
        content: comment.content,
        rating: comment.ratings, // Incluye todas las métricas de calificación
        isAnonymous: comment.isAnonymous,
        user: comment.isAnonymous ? "Anónimo" : { id: comment.user?._id, name: comment.user?.name, email: comment.user?.email },
        comment:comment.comment,
        createdAt: comment.createdAt,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error al obtener los comentarios:", error.message);
    res.status(500).json({ error: "Error al obtener los comentarios", details: error.message });
  }
};





//promedio de empresas
exports.getAverageRatingsByCompanyId = async (req, res) => {
  const { id } = req.query; // ID de la empresa

  if (!id) {
    return res.status(400).json({ error: "Debes proporcionar el ID de la empresa" });
  }

  try {
    // Buscar comentarios por ID de empresa
    const comments = await Comment.find({ company: id });

    if (!comments.length) {
      return res.status(404).json({ message: "No se encontraron comentarios para esta empresa" });
    }

    // Calcular el promedio de las calificaciones
    const totalRatings = comments.reduce(
      (totals, comment) => {
        return {
          workLifeBalance: totals.workLifeBalance + comment.ratings.workLifeBalance,
          salary: totals.salary + comment.ratings.salary,
          growthOpportunities: totals.growthOpportunities + comment.ratings.growthOpportunities,
          workEnvironment: totals.workEnvironment + comment.ratings.workEnvironment,
          professionalDevelopment: totals.professionalDevelopment + comment.ratings.professionalDevelopment,
        };
      },
      {
        workLifeBalance: 0,
        salary: 0,
        growthOpportunities: 0,
        workEnvironment: 0,
        professionalDevelopment: 0,
      }
    );

    const averageRatings = {
      workLifeBalance: (totalRatings.workLifeBalance / comments.length).toFixed(2),
      salary: (totalRatings.salary / comments.length).toFixed(2),
      growthOpportunities: (totalRatings.growthOpportunities / comments.length).toFixed(2),
      workEnvironment: (totalRatings.workEnvironment / comments.length).toFixed(2),
      professionalDevelopment: (totalRatings.professionalDevelopment / comments.length).toFixed(2),
    };

    res.status(200).json({ averageRatings, totalComments: comments.length });
  } catch (error) {
    console.error("Error al calcular el promedio de las calificaciones:", error.message);
    res.status(500).json({ error: "Error al calcular el promedio de las calificaciones", details: error.message });
  }
};


//calificaciones finales
exports.getOverallAverageRatingByCompanyId = async (req, res) => {
  const { id } = req.query; // ID de la empresa

  if (!id) {
    return res.status(400).json({ error: "Debes proporcionar el ID de la empresa" });
  }

  try {
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "No se encontró la empresa con el ID proporcionado" });
    }
    // Buscar comentarios por ID de empresa
    const comments = await Comment.find({ company: id });

    if (!comments.length) {
      return res.status(404).json({ message: "No se encontraron comentarios para esta empresa" });
    }

    // Calcular el promedio de las calificaciones por métrica
    const totalRatings = comments.reduce(
      (totals, comment) => {
        return {
          workLifeBalance: totals.workLifeBalance + comment.ratings.workLifeBalance,
          salary: totals.salary + comment.ratings.salary,
          growthOpportunities: totals.growthOpportunities + comment.ratings.growthOpportunities,
          workEnvironment: totals.workEnvironment + comment.ratings.workEnvironment,
          professionalDevelopment: totals.professionalDevelopment + comment.ratings.professionalDevelopment,
        };
      },
      {
        workLifeBalance: 0,
        salary: 0,
        growthOpportunities: 0,
        workEnvironment: 0,
        professionalDevelopment: 0,
      }
    );

    const averageRatings = {
      workLifeBalance: totalRatings.workLifeBalance / comments.length,
      salary: totalRatings.salary / comments.length,
      growthOpportunities: totalRatings.growthOpportunities / comments.length,
      workEnvironment: totalRatings.workEnvironment / comments.length,
      professionalDevelopment: totalRatings.professionalDevelopment / comments.length,
    };

    // Calcular el promedio general
    const overallAverage =
      (averageRatings.workLifeBalance +
        averageRatings.salary +
        averageRatings.growthOpportunities +
        averageRatings.workEnvironment +
        averageRatings.professionalDevelopment) /
      5;

      res.status(200).json({
        company: {
          id: company._id,
          name: company.name,
          description: `Rubro de ${company.industry}. Ubicada en ${company.address}, cuenta con ${company.employeesCount} empleados.`,
        },
        averageRatings,
      overallAverage: overallAverage.toFixed(2),
      totalComments: comments.length,
    });
  } catch (error) {
    console.error("Error al calcular el promedio general:", error.message);
    res.status(500).json({ error: "Error al calcular el promedio general", details: error.message });
  }
};


///
exports.getCompanyData = async (req, res) => {
  try {
   
    const companies = await Company.find();

    // Promete resolver los datos de cada empresa
    const companyData = await Promise.all(
      companies.map(async (company) => {
        // Busca los comentarios relacionados con la empresa
        const comments = await Comment.find({ company: company._id });

        // Calcula el promedio de calificaciones
        const totalRatings = comments.reduce(
          (totals, comment) => {
            return {
              workLifeBalance: totals.workLifeBalance + comment.ratings.workLifeBalance,
              salary: totals.salary + comment.ratings.salary,
              growthOpportunities: totals.growthOpportunities + comment.ratings.growthOpportunities,
              workEnvironment: totals.workEnvironment + comment.ratings.workEnvironment,
              professionalDevelopment: totals.professionalDevelopment + comment.ratings.professionalDevelopment,
            };
          },
          {
            workLifeBalance: 0,
            salary: 0,
            growthOpportunities: 0,
            workEnvironment: 0,
            professionalDevelopment: 0,
          }
        );

        const averageRating =
          comments.length > 0
            ? (
                (totalRatings.workLifeBalance +
                  totalRatings.salary +
                  totalRatings.growthOpportunities +
                  totalRatings.workEnvironment +
                  totalRatings.professionalDevelopment) /
                (5 * comments.length)
              ).toFixed(2)
            : 0;

        // Devuelve los datos necesarios
        return {
          id: company._id,
          name: company.name,
          description: `Rubro de ${company.industry} . Ubicada en ${company.address}, cuenta con ${company.employeesCount} empleados `,
          averageRating: averageRating,
          totalComments: comments.length,
        };
      })
    );

    res.status(200).json(companyData);
  } catch (error) {
    console.error("Error al obtener datos de las empresas:", error.message);
    res.status(500).json({ error: "Error al obtener datos de las empresas", details: error.message });
  }
};
