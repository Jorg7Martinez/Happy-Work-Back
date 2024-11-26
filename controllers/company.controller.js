const Company = require("../model/company.model");
const Comment = require("../model/comment.model");

// Obtener lista de empresas con promedio de calificaciones en orden descendente
exports.getAllCompaniesWithAverage = async (req, res) => {
  try {
    const companies = await Company.find();

    if (!companies.length) {
      return res.status(404).json({ message: "No se encontraron empresas" });
    }

    const result = await Promise.all(
      companies.map(async (company) => {
        const comments = await Comment.find({ company: company._id });

        if (comments.length === 0) {
          return {
            id: company._id,
            name: company.name,
            description: `Rubro de ${company.industry}. Ubicada en ${company.address}, cuenta con ${company.employeesCount} empleados.`,
            averageRating: 0,
          };
        }

        // Calcular los promedios por metrica
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

        // Promedio general
        const averageRatings = {
          workLifeBalance: totalRatings.workLifeBalance / comments.length,
          salary: totalRatings.salary / comments.length,
          growthOpportunities: totalRatings.growthOpportunities / comments.length,
          workEnvironment: totalRatings.workEnvironment / comments.length,
          professionalDevelopment: totalRatings.professionalDevelopment / comments.length,
        };

        const overallAverage =
          (averageRatings.workLifeBalance +
            averageRatings.salary +
            averageRatings.growthOpportunities +
            averageRatings.workEnvironment +
            averageRatings.professionalDevelopment) / 5;

        return {
          id: company._id,
          name: company.name,
          description: `Rubro de ${company.industry}. Ubicada en ${company.address}, cuenta con ${company.employeesCount} empleados.`,
          averageRating: parseFloat(overallAverage.toFixed(2)), 
        };
      })
    );

    // Ordenar las empresas por el promedio general en orden descendente
    const sortedResult = result.sort((a, b) => b.averageRating - a.averageRating);

    res.status(200).json(sortedResult);
  } catch (error) {
    console.error("Error al obtener empresas con promedio:", error.message);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
};
