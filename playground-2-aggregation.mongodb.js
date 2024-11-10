const dbName = "1SUPERGRUPO";
use(dbName);

db.transacoes.aggregate([
  {
    $lookup: {
      from: "usuarios",
      localField: "usuarioId",
      foreignField: "id",
      as: "comprador"
    }
  },
  { $unwind: "$comprador" },

  {
    $lookup: {
      from: "usuarios",
      localField: "vendedorId",
      foreignField: "id",
      as: "vendedor"
    }
  },
  { $unwind: "$vendedor" },

  {
    $addFields: {
      distancia: {
        $geoNear: {
          near: "$comprador.localizacao",
          distanceField: "distancia",
          key: "vendedor.localizacao",
          spherical: true
        }
      }
    }
  },

  {
    $group: {
      _id: null,
      mediaDistancia: { $avg: "$distancia" }
    }
  },
  {
    $project: {
      _id: 0,
      mediaDistancia: 1
    }
  }
]);

