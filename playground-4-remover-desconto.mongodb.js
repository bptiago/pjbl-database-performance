const dbName = "1SUPERGRUPO";
use(dbName);

function atualizarStatusDescontoProduto(produtoId) {
  // Atualizar o produto específico para desativar o desconto sem considerar a data de término
  const resultado = db.categorias.updateOne(
    {
      "subcategorias.produtos.id": produtoId,
      "subcategorias.produtos.desconto.descontoAtivo": true
    },
    {
      $set: {
        "subcategorias.$[].produtos.$[produto].desconto.porcentagem": 0,
        "subcategorias.$[].produtos.$[produto].desconto.descontoAtivo": false,
        "subcategorias.$[].produtos.$[produto].desconto.precoComDesconto": null
      }
    },
    {
      arrayFilters: [
        { "produto.id": produtoId, "produto.desconto.descontoAtivo": true }
      ]
    }
  );

  return resultado.modifiedCount > 0
  ? "Produto atualizado com sucesso."
  : "Erro ao atualizar o produto. Verifique se o desconto ainda está ativo.";
}

// Exemplo de chamada para desativar o desconto do produto com ID 0
atualizarStatusDescontoProduto(0);
