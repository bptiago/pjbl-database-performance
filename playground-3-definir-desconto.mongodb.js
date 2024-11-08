const dbName = "1SUPERGRUPO";
use(dbName);

function definirDesconto(produtoId, porcentagem, dataInicio, dataTermino) {
  // Buscar a categoria e subcategoria onde o produto está
  const categoria = db.categorias.findOne({
    "subcategorias.produtos.id": produtoId
  }, {
    "subcategorias.$": 1
  });

  if (!categoria) {
    return "Erro: Produto não encontrado.";
  }

  // Encontrar o produto para obter o preço original
  const subcategoria = categoria.subcategorias.find(sub => 
    sub.produtos.some(prod => prod.id === produtoId)
  );
  const produto = subcategoria.produtos.find(prod => prod.id === produtoId);
  const precoOriginal = produto.preco;

  // Calcular o preço com desconto
  const precoComDesconto = precoOriginal * (1 - porcentagem / 100);

  // Atualizar o documento com o desconto e o preço calculado
  const resultado = db.categorias.updateOne(
    { 
      _id: categoria._id,
      "subcategorias.nome": subcategoria.nome,
      "subcategorias.produtos.id": produtoId
    },
    {
      $set: {
        "subcategorias.$[subcategoria].produtos.$[produto].desconto": {
          porcentagem: porcentagem,
          dataInicio: dataInicio,
          dataTermino: dataTermino,
          descontoAtivo: true,
          precoComDesconto: precoComDesconto
        }
      }
    },
    {
      arrayFilters: [
        { "subcategoria.nome": subcategoria.nome },
        { "produto.id": produtoId }
      ]
    }
  );

  // Verifica se a atualização foi realizada com sucesso
  return resultado.modifiedCount > 0
    ? "Produto atualizado com sucesso."
    : "Erro ao atualizar o produto.";
}

// Exemplo de uso
definirDesconto(0, 10, new Date("2024-11-05"), new Date("2024-11-12"));
