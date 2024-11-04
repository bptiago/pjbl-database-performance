const dbName = "1SUPERGRUPO";
use(dbName);

// Coleções

db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "email", "endereco", "senha"],
      properties: {
        nome: {
          bsonType: "string",
          minLength: 3,
          description: "deve ser uma string com pelo menos 3 caracteres",
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+\\..+$",
          description: "deve estar em um formato válido de endereço de email",
        },
        endereco: {
          bsonType: "string",
          minLength: 5,
          description: "deve ser um endereço válido",
        },
        senha: {
          bsonType: "string",
          minLength: 8,
          description: "deve ser uma string com pelo menos 8 caracteres",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "subcategorias"],
      properties: {
        nome: {
          bsonType: "string",
          description: "deve ser o nome da categoria principal",
        },
        subcategorias: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id", "nome"],
            properties: {
              _id: {
                bsonType: "objectId",
                description: "ID único para a subcategoria",
              },
              nome: {
                bsonType: "string",
                description: "nome da subcategoria",
              },
            },
          },
          description: "lista de subcategorias dentro da categoria",
        },
      },
    },
  },
});

db.createCollection("produtos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "nome",
        "descricao",
        "preco",
        "quantidadeEmEstoque",
        "categoria",
      ],
      properties: {
        nome: {
          bsonType: "string",
          minLength: 3,
          description: "deve ser uma string com pelo menos 3 caracteres",
        },
        descricao: {
          bsonType: "string",
          minLength: 10,
          description: "deve ser uma string com pelo menos 10 caracteres",
        },
        preco: {
          bsonType: "double",
          minimum: 0.5,
          description: "deve ser um número decimal positivo",
        },
        quantidadeEmEstoque: {
          bsonType: "int",
          minimum: 0,
          description: "deve ser um número inteiro não negativo",
        },
        subcategoriaId: {
          bsonType: "objectId",
          description: "deve ser o ObjectId de uma subcategoria referenciada",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

db.createCollection("avaliacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nota", "comentario", "usuarioId"],
      properties: {
        nota: {
          bsonType: "double",
          minimum: 0.0,
          maximum: 5.0,
          description: "deve ser uma nota entre zero e cinco",
        },
        comentario: {
          bsonType: "string",
          minLength: 0,
        },
        usuarioId: {
          bsonType: "objectId",
          description: "deve ser o ObjectId de usuário existente",
        },
      },
    },
  },
});

db.createCollection("transacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["produtoId", "usuarioId"],
      properties: {
        produtoId: {
          bsonType: "objectId",
          description: "deve ser o ObjectId de um produto existente",
        },
        usuarioId: {
          bsonType: "objectId",
          description: "deve ser o ObjectId de um usuário existente",
        },
      },
    },
  },
});
