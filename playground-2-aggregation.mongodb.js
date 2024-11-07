const dbName = "1SUPERGRUPO";
use(dbName);

db.avaliacoes.aggregate([
    {
      $group: {
        _id: "$produtoId",
        mediaNota: { $avg: "$nota" }
      }
    },
    {
      $lookup: {
        from: "categorias",
        localField: "_id",
        foreignField: "subcategorias.produtos.id",
        as: "produto_info"
      }
    },
    { $unwind: "$produto_info" },
    { $unwind: "$produto_info.subcategorias" },
    { $unwind: "$produto_info.subcategorias.produtos" },
    {
      $match: {
        $expr: { $eq: ["$produto_info.subcategorias.produtos.id", "$_id"] }
      }
    },
    {
      $project: {
        _id: 0,
        produtoId: "$_id",
        produtoNome: "$produto_info.subcategorias.produtos.nome",
        mediaNota: { $round: ["$mediaNota", 2] }
      }
    }
])

db.transacoes.aggregate([
    {
      $lookup: {
        from: "categorias",
        localField: "produtoId",
        foreignField: "subcategorias.produtos.id",
        as: "categoria_info"
      }
    },
    { $unwind: "$categoria_info" },
    { $unwind: "$categoria_info.subcategorias" },
    { $unwind: "$categoria_info.subcategorias.produtos" },
    {
      $match: {
        $expr: { $eq: ["$categoria_info.subcategorias.produtos.id", "$produtoId"] }
      }
    },
    {
      $group: {
        _id: "$categoria_info.nome",
        totalVendas: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        categoria: "$_id",
        totalVendas: 1
      }
    }
])