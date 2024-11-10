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

// RELATÓRIO DE VENDAR POR PRODUTO
db.transacoes.aggregate([
  {
    $lookup: {
      from: "categorias",
      localField: "produtoId",
      foreignField: "subcategorias.produtos.id",
      as: "produtoDetalhes"
    }
  },
  {
    $unwind: "$produtoDetalhes"
  },
  {
    $unwind: "$produtoDetalhes.subcategorias"
  },
  {
    $unwind: "$produtoDetalhes.subcategorias.produtos"
  },
  {
    $match: {
      $expr: { $eq: ["$produtoId", "$produtoDetalhes.subcategorias.produtos.id"] }
    }
  },
  {
    $group: {
      _id: "$produtoId",
      nomeProduto: { $first: "$produtoDetalhes.subcategorias.produtos.nome" },
      totalVendas: { $sum: 1 },
      receitaTotal: { $sum: "$produtoDetalhes.subcategorias.produtos.preco" }
    }
  },
  { $sort: { receitaTotal: -1 } }
]);

//RELATÓRIO DE VENDAS POR CATEGORIA
db.transacoes.aggregate([
  {
    $lookup: {
      from: "categorias",
      localField: "produtoId",
      foreignField: "subcategorias.produtos.id",
      as: "categoriaDetalhes"
    }
  },
  {
    $unwind: "$categoriaDetalhes"
  },
  {
    $unwind: "$categoriaDetalhes.subcategorias"
  },
  {
    $unwind: "$categoriaDetalhes.subcategorias.produtos"
  },
  {
    $match: {
      $expr: { $eq: ["$produtoId", "$categoriaDetalhes.subcategorias.produtos.id"] }
    }
  },
  {
    $group: {
      _id: {
        categoria: "$categoriaDetalhes.nome",
        subcategoria: "$categoriaDetalhes.subcategorias.nome"
      },
      totalVendas: { $sum: 1 },
      receitaTotal: { $sum: "$categoriaDetalhes.subcategorias.produtos.preco" }
    }
  },
  { $sort: { "receitaTotal": -1 } }
]);

// RELATORIO DE VENDAS POR USUARIO
db.transacoes.aggregate([
  {
    $lookup: {
      from: "usuarios",
      localField: "usuarioId",
      foreignField: "id",
      as: "usuarioDetalhes"
    }
  },
  {
    $unwind: "$usuarioDetalhes"
  },
  {
    $lookup: {
      from: "categorias",
      localField: "produtoId",
      foreignField: "subcategorias.produtos.id",
      as: "produtoDetalhes"
    }
  },
  {
    $unwind: "$produtoDetalhes"
  },
  {
    $unwind: "$produtoDetalhes.subcategorias"
  },
  {
    $unwind: "$produtoDetalhes.subcategorias.produtos"
  },
  {
    $match: {
      $expr: { $eq: ["$produtoId", "$produtoDetalhes.subcategorias.produtos.id"] }
    }
  },
  {
    $group: {
      _id: "$usuarioId",
      nomeUsuario: { $first: "$usuarioDetalhes.nome" },
      totalGasto: { $sum: "$produtoDetalhes.subcategorias.produtos.preco" },
      totalCompras: { $sum: 1 }
    }
  },
  { $sort: { totalGasto: -1 } } 
]);

//PRODUTO MAIS VENDIDO
db.transacoes.aggregate([
  {
    $group: {
      _id: "$produtoId",
      totalVendas: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "categorias",
      localField: "_id",
      foreignField: "subcategorias.produtos.id",
      as: "produtoDetalhes"
    }
  },
  {
    $unwind: "$produtoDetalhes"
  },
  {
    $unwind: "$produtoDetalhes.subcategorias"
  },
  {
    $unwind: "$produtoDetalhes.subcategorias.produtos"
  },
  {
    $match: {
      $expr: { $eq: ["$_id", "$produtoDetalhes.subcategorias.produtos.id"] }
    }
  },
  {
    $project: {
      _id: 0,
      nomeProduto: "$produtoDetalhes.subcategorias.produtos.nome",
      totalVendas: 1
    }
  },
  { $sort: { totalVendas: -1 } } 
]);
