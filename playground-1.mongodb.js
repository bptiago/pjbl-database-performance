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

db.createCollection("subcategorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome"],
      properties: {
        nome: {
          bsonType: "string",
          minLength: 3,
          description: "deve ser uma string com pelo menos 3 caracteres",
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
          minLength: 3,
          description: "deve ser uma string com pelo menos 3 caracteres",
        },
        subcategorias: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["subcategoriaId"],
            properties: {
              subcategoriaId: {
                bsonType: "objectId",
                description:
                  "deve ser o object ID para uma subcategoria existente",
              },
            },
          },
          description: "lista de subcategorias dentro da categoria",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
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
      required: ["nota", "comentario", "usuarioId", "produtoId"],
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
        produtoId: {
          bsonType: "objectId",
          description: "deve ser o ObjectId de produto existente",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
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
  validationLevel: "strict",
  validationAction: "error",
});

// Índices
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.categorias.createIndex({ nome: 1 }, { unique: true });
db.categorias.createIndex({ "subcategorias.nome": 1 }, { unique: true });

// Inserções
db.usuarios.insertMany([
  {
    nome: "Tiago Prestes",
    email: "tiago@gmail.com",
    endereco: "Rua Cachorro Doce 131",
    senha: "senha123",
  },
  {
    nome: "Henrique Grigoli",
    email: "henrique@gmail.com",
    endereco: "Rua Cachorro Quente 1099",
    senha: "senha123",
  },
  {
    nome: "Felipe Kureski",
    email: "felipe@gmail.com",
    endereco: "Avenida Cristóvão Colombo 420",
    senha: "senha123",
  },
  {
    nome: "Danilo Garabetti",
    email: "danilo@gmail.com",
    endereco: "Rua Gato Preto 10",
    senha: "senha123",
  },
  {
    nome: "Jeffrey Beijos",
    email: "amazon@gmail.com",
    endereco: "Rua Amazonas Utópico 37",
    senha: "senha123",
  },
]);
