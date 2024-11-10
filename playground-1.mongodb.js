const dbName = "1SUPERGRUPO";
use(dbName);

// Coleções

db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "nome", "email", "endereco", "senha", "localizacao"],
      properties: {
        id: {
          bsonType: "int",
          minimum: 0,
          description: "o ID do usuário deve ser um número inteiro positivo",
        },
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
        localizacao: {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: {
              bsonType: "string",
              enum: ["Point"],
              description: "Deve ser uma string com o valor 'Point'",
            },
            coordinates: {
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: { bsonType: "double" },
              description: "Coordenadas no formato [longitude, latitude]",
            },
          },
        },
      },
    },
  },
});


db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "subcategorias"],
      properties: {
        nome: { bsonType: "string" },
        subcategorias: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["nome", "produtos"],
            properties: {
              nome: { bsonType: "string" },
              produtos: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: [
                    "id",
                    "nome",
                    "descricao",
                    "preco",
                    "quantidadeEmEstoque",
                    "localizacao",
                  ],
                  properties: {
                    id: { bsonType: "int" },
                    nome: { bsonType: "string" },
                    descricao: { bsonType: "string", minLength: 10 },
                    preco: { bsonType: "double", minimum: 0 },
                    quantidadeEmEstoque: { bsonType: "int", minimum: 0 },
                    localizacao: {
                      bsonType: "object",
                      required: ["type", "coordinates"],
                      properties: {
                        type: {
                          bsonType: "string",
                          enum: ["Point"],
                        },
                        coordinates: {
                          bsonType: "array",
                          minItems: 2,
                          maxItems: 2,
                          items: { bsonType: "double" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

db.createCollection("avaliacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nota", "usuarioId", "produtoId"],
      properties: {
        nota: {
          bsonType: "int",
          minimum: 0,
          maximum: 5,
          description: "deve ser um número inteiro entre zero e cinco",
        },
        comentario: {
          bsonType: ["string", "null"],
          description: "o comentário deve ser uma string ou ser nulo",
        },
        usuarioId: {
          bsonType: "int",
          minimum: 0,
          description: "deve ser o ID (número inteiro e positivo) de um usuário existente",
        },
        produtoId: {
          bsonType: "int",
          minimum: 0,
          description: "deve ser o ID (número inteiro e positivo) de um produto existente",
        },
        respostaVendedor: {
          bsonType: ["string", "null"],
          description: "a resposta do vendedor deve ser uma string ou ser nula",
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
      required: ["id", "usuarioId", "produtoId"],
      properties: {
        id: {
          bsonType: "int",
          minimum: 0,
          description: "deve ser o ID (número inteiro e positivo) da transação",
        },
        usuarioId: {
          bsonType: "int",
          minimum: 0,
          description:
            "deve ser o ID (número inteiro e positivo) de um usuário existente",
        },
        produtoId: {
          bsonType: "int",
          minimum: 0,
          description:
            "deve ser o ID (número inteiro e positivo) de um produto existente",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// Índices
db.usuarios.createIndex({ id: 1 }, { unique: true });
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ localizacao: "2dsphere" });


db.categorias.createIndex({ nome: 1 }, { unique: true });
db.categorias.createIndex({ "subcategorias.produtos.id": 1 }, { unique: true });
db.categorias.createIndex({ "subcategorias.produtos.localizacao": "2dsphere" });


db.transacoes.createIndex({ id: 1 }, { unique: true });

// Inserções

db.usuarios.insertMany([
  {
    id: 0,
    nome: "Tiago Prestes",
    email: "tiago@gmail.com",
    endereco: "Rua Cachorro Doce 131",
    senha: "senha123",
    localizacao: {
      type: "Point",
      coordinates: [-51.2177, -30.0346]
    }
  },
  {
    id: 1,
    nome: "Henrique Grigoli",
    email: "henrique@gmail.com",
    endereco: "Rua Cachorro Quente 1099",
    senha: "senha123",
    localizacao: {
      type: "Point",
      coordinates: [-43.1729, -22.9068]
    }
  },
  {
    id: 2,
    nome: "Felipe Kureski",
    email: "felipe@gmail.com",
    endereco: "Avenida Cristóvão Colombo 420",
    senha: "senha123",
    localizacao: {
      type: "Point",
      coordinates: [-38.5222, -3.7172]
    }
  },
  {
    id: 3,
    nome: "Danilo Garabetti",
    email: "danilo@gmail.com",
    endereco: "Rua Gato Preto 10",
    senha: "senha123",
    localizacao: {
      type: "Point",
      coordinates: [-51.0501, 0.0342]
    }
  },
  {
    id: 4,
    nome: "Jeffrey Beijos",
    email: "amazon@gmail.com",
    endereco: "Rua Amazonas Utópico 37",
    senha: "senha123",
    localizacao: {
      type: "Point",
      coordinates: [-60.0212, -3.1019]
    }
  }
]);

db.categorias.insertOne({
  nome: "Eletrônicos",
  subcategorias: [
    {
      nome: "Celulares",
      produtos: [
        {
          id: 0,
          nome: "Galaxy S20",
          descricao: "Smartphone da marca coreana Samsung e com 128GB de memória!",
          preco: 2799.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 1,
          nome: "Iphone 16 Pro Max",
          descricao: "Smartphone da Apple com 1TB de memória e câmero com lente tripla!",
          preco: 13949.99,
          quantidadeEmEstoque: 5,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 2,
          nome: "iPhone 12",
          descricao: "Smartphone da Apple com 64GB de memória e câmera de alta resolução.",
          preco: 4999.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 3,
          nome: "Xiaomi Mi 10",
          descricao: "Smartphone da Xiaomi com 256GB de memória e bateria de longa duração.",
          preco: 2299.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 4,
          nome: "Huawei P30 Pro",
          descricao: "Smartphone da Huawei com zoom óptico de 5x e 128GB de memória.",
          preco: 3799.99, 
          quantidadeEmEstoque: 12,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Computadores",
      produtos: [
        {
          id: 5,
          nome: "Laptop DEF",
          descricao: "Laptop de alta performance com 16GB RAM e 512GB SSD.",
          preco: 4499.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 6,
          nome: "PC Gamer GHI",
          descricao: "PC Gamer com placa de vídeo dedicada e 32GB de RAM.",
          preco: 6999.99,
          quantidadeEmEstoque: 5,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 7,
          nome: "MacBook Pro",
          descricao: "Laptop da Apple com 16GB de RAM e 1TB SSD, ideal para profissionais criativos.",
          preco: 11999.99,
          quantidadeEmEstoque: 8,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 8,
          nome: "Dell XPS 13",
          descricao: "Ultrabook da Dell com tela infinita, 16GB de RAM e 512GB SSD.",
          preco: 8499.99,
          quantidadeEmEstoque: 12,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 9,
          nome: "Acer Aspire 5",
          descricao: "Notebook econômico com 8GB RAM e 256GB SSD, ideal para o dia a dia.",
          preco: 2999.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Televisões",
      produtos: [
        {
          id: 10,
          nome: 'Samsung QLED 55"',
          descricao: "Televisão Samsung QLED de 55 polegadas com resolução 4K e tecnologia HDR.",
          preco: 3999.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 11,
          nome: 'LG OLED 65"',
          descricao: "Televisão LG OLED de 65 polegadas, perfeita para assistir filmes com cores vibrantes.",
          preco: 7999.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 12,
          nome: 'Sony Bravia 75"',
          descricao: "Televisão Sony Bravia de 75 polegadas, com tecnologia de som surround e imagem 4K.",
          preco: 11999.99,
          quantidadeEmEstoque: 1,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 13,
          nome: 'Philips 50" Ambilight',
          descricao: "Televisão Philips de 50 polegadas com tecnologia Ambilight para uma experiência imersiva.",
          preco: 3499.99,
          quantidadeEmEstoque: 8,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 14,
          nome: 'TCL 32" Smart TV',
          descricao: "Televisão TCL de 32 polegadas com acesso a aplicativos e streaming integrado.",
          preco: 1499.99,
          quantidadeEmEstoque: 0,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Consoles de Videogame",
      produtos: [
        {
          id: 15,
          nome: "PlayStation 5",
          descricao: "Console de videogame da Sony com gráficos incríveis e suporte para jogos em 4K.",
          preco: 4499.99,
          quantidadeEmEstoque: 12,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 16,
          nome: "Xbox Series X",
          descricao: "Console da Microsoft com performance de ponta e retrocompatibilidade com jogos de Xbox One.",
          preco: 4999.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 17,
          nome: "Nintendo Switch",
          descricao: "Console da Nintendo que pode ser jogado em casa ou em modo portátil.",
          preco: 2999.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 18,
          nome: "Xbox Series S",
          descricao: "Versão compacta do Xbox Series X, ideal para jogos digitais com desempenho sólido.",
          preco: 2799.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 19,
          nome: "PlayStation 4 Pro",
          descricao: "Console da Sony que oferece gráficos aprimorados e suporte a jogos em 4K.",
          preco: 3499.99,
          quantidadeEmEstoque: 8,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    }
  ]
});


db.categorias.insertOne({
  nome: "Livros",
  subcategorias: [
    {
      nome: "Ficção",
      produtos: [
        {
          id: 20,
          nome: "O Alquimista",
          descricao: "Um romance de Paulo Coelho sobre a busca do sonho pessoal.",
          preco: 29.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 21,
          nome: "1984",
          descricao: "Um clássico de George Orwell sobre um futuro distópico.",
          preco: 44.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 22,
          nome: "A Revolução dos Bichos",
          descricao: "Uma fábula política de George Orwell.",
          preco: 24.99,
          quantidadeEmEstoque: 40,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        }
      ]
    },
    {
      nome: "Técnicos",
      produtos: [
        {
          id: 23,
          nome: "Clean Code",
          descricao: "Um guia para programadores sobre como escrever código limpo.",
          preco: 79.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 24,
          nome: "Design Patterns",
          descricao: "Um livro fundamental sobre padrões de design de software.",
          preco: 74.99,
          quantidadeEmEstoque: 8,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        },
        {
          id: 25,
          nome: "Introdução ao Machine Learning",
          descricao: "Um guia prático para iniciantes em Machine Learning.",
          preco: 89.99,
          quantidadeEmEstoque: 12,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        }
      ]
    },
    {
      nome: "Distopia",
      produtos: [
        {
          id: 26,
          nome: "Fahrenheit 451",
          descricao: "Um romance de Ray Bradbury sobre um futuro onde livros são queimados.",
          preco: 34.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 27,
          nome: "Admirável Mundo Novo",
          descricao: "Uma obra de Aldous Huxley que explora uma sociedade futurista e controlada.",
          preco: 39.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 28,
          nome: "O Conto da Aia",
          descricao: "Um romance de Margaret Atwood que retrata um regime totalitário que subjuga as mulheres.",
          preco: 49.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 29,
          nome: "Jogos Vorazes",
          descricao: "Uma série de Suzanne Collins sobre um futuro distópico onde jovens lutam pela sobrevivência.",
          preco: 59.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        },
        {
          id: 30,
          nome: "A Handmaid's Tale",
          descricao: "Uma visão sombria de um futuro onde a sociedade é governada por leis extremas sobre gênero.",
          preco: 44.99,
          quantidadeEmEstoque: 18,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        }
      ]
    }
  ]
});

db.categorias.insertOne({
  nome: "Esportes",
  subcategorias: [
    {
      nome: "Futebol",
      produtos: [
        {
          id: 31,
          nome: "Bola de Futebol Nike",
          descricao: "Bola de futebol oficial da Nike, ideal para jogos e treinos.",
          preco: 119.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 32,
          nome: "Chuteira Adidas",
          descricao: "Chuteira de gramado com tecnologia de amortecimento.",
          preco: 349.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 33,
          nome: "Camiseta de Time Barcelona",
          descricao: "Camiseta oficial do Barcelona, com tecnologia de absorção de suor.",
          preco: 199.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 34,
          nome: "Meião de Futebol",
          descricao: "Meião confortável e resistente, ideal para jogos.",
          preco: 39.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 35,
          nome: "Rede de Gol",
          descricao: "Rede de gol de futebol, fácil de instalar e durável.",
          preco: 79.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Basquete",
      produtos: [
        {
          id: 36,
          nome: "Bola de Basquete Spalding",
          descricao: "Bola de basquete oficial da NBA, ideal para quadra.",
          preco: 149.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 37,
          nome: "Tênis de Basquete Nike",
          descricao: "Tênis com tecnologia de suporte e amortecimento para atletas.",
          preco: 499.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 38,
          nome: "Camiseta de Time Los Angeles Lakers",
          descricao: "Camiseta oficial dos Los Angeles Lakers, para torcedores.",
          preco: 179.99,
          quantidadeEmEstoque: 12,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 39,
          nome: "Cano de Basquete",
          descricao: "Cano de basquete portátil para treinos em casa.",
          preco: 699.99,
          quantidadeEmEstoque: 5,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 40,
          nome: "Bolsa para Bola de Basquete",
          descricao: "Bolsa prática para transportar sua bola de basquete.",
          preco: 49.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Fitness",
      produtos: [
        {
          id: 41,
          nome: "Colchonete de Yoga",
          descricao: "Colchonete antiderrapante, ideal para yoga e pilates.",
          preco: 79.99,
          quantidadeEmEstoque: 40,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 42,
          nome: "Mancuernas Ajustáveis",
          descricao: "Conjunto de mancuernas ajustáveis de 1 a 10kg.",
          preco: 249.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 43,
          nome: "Roupas de Ginástica",
          descricao: "Conjunto de roupas leves e confortáveis para exercícios.",
          preco: 149.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 44,
          nome: "Banda Elástica de Resistência",
          descricao: "Banda elástica ideal para treino de força e flexibilidade.",
          preco: 29.99,
          quantidadeEmEstoque: 35,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 45,
          nome: "Relógio de Fitness",
          descricao: "Relógio com monitoramento de atividades e frequência cardíaca.",
          preco: 299.99,
          quantidadeEmEstoque: 8,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    }
  ]
});

db.categorias.insertOne({
  nome: "Roupas",
  subcategorias: [
    {
      nome: "Camisetas",
      produtos: [
        {
          id: 46,
          nome: "Camiseta Básica Branca",
          descricao: "Camiseta de algodão branca, confortável e ideal para o dia a dia.",
          preco: 49.99,
          quantidadeEmEstoque: 100,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 47,
          nome: "Camiseta Estampada",
          descricao: "Camiseta com estampa moderna, feita de material leve e resistente.",
          preco: 59.99,
          quantidadeEmEstoque: 80,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 48,
          nome: "Camiseta Regata",
          descricao: "Camiseta regata ideal para atividades físicas e dias quentes.",
          preco: 39.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 49,
          nome: "Camiseta Polo",
          descricao: "Camiseta polo com gola, estilo casual para diversas ocasiões.",
          preco: 79.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 50,
          nome: "Camiseta Longline",
          descricao: "Camiseta longline com design alongado, perfeita para looks modernos.",
          preco: 69.99,
          quantidadeEmEstoque: 60,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Calças",
      produtos: [
        {
          id: 51,
          nome: "Calça Jeans",
          descricao: "Calça jeans básica, ideal para combinações casuais e formais.",
          preco: 129.99,
          quantidadeEmEstoque: 40,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 52,
          nome: "Calça Moletom",
          descricao: "Calça de moletom confortável para atividades esportivas e uso diário.",
          preco: 89.99,
          quantidadeEmEstoque: 70,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 53,
          nome: "Calça Social",
          descricao: "Calça social em tecido fino, ideal para ambientes formais.",
          preco: 149.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 54,
          nome: "Calça Legging",
          descricao: "Legging de alta elasticidade, perfeita para exercícios.",
          preco: 69.99,
          quantidadeEmEstoque: 100,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 55,
          nome: "Calça Cargo",
          descricao: "Calça cargo com bolsos extras, ideal para um estilo utilitário.",
          preco: 139.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Vestidos",
      produtos: [
        {
          id: 56,
          nome: "Vestido Floral",
          descricao: "Vestido leve com estampa floral, ideal para o verão.",
          preco: 149.99,
          quantidadeEmEstoque: 60,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 57,
          nome: "Vestido Longo",
          descricao: "Vestido longo e elegante, perfeito para ocasiões especiais.",
          preco: 199.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 58,
          nome: "Vestido Curto",
          descricao: "Vestido curto básico, ideal para o dia a dia.",
          preco: 99.99,
          quantidadeEmEstoque: 80,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 59,
          nome: "Vestido Tubinho",
          descricao: "Vestido tubinho clássico, ajustado ao corpo e elegante.",
          preco: 179.99,
          quantidadeEmEstoque: 40,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 60,
          nome: "Vestido Midi",
          descricao: "Vestido midi em tecido leve, para um look casual.",
          preco: 139.99,
          quantidadeEmEstoque: 55,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Casacos",
      produtos: [
        {
          id: 61,
          nome: "Jaqueta de Couro",
          descricao: "Jaqueta de couro sintético, ideal para um look urbano.",
          preco: 249.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 62,
          nome: "Blusa de Moletom",
          descricao: "Blusa de moletom confortável para dias frios.",
          preco: 109.99,
          quantidadeEmEstoque: 70,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 63,
          nome: "Casaco de Lã",
          descricao: "Casaco de lã quentinho, ideal para o inverno.",
          preco: 299.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 64,
          nome: "Jaqueta Jeans",
          descricao: "Jaqueta jeans clássica, estilo atemporal.",
          preco: 179.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 65,
          nome: "Parka Militar",
          descricao: "Parka estilo militar, ideal para dias de frio com vento.",
          preco: 219.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Acessórios",
      produtos: [
        {
          id: 66,
          nome: "Boné Aba Reta",
          descricao: "Boné com aba reta, estilo urbano.",
          preco: 49.99,
          quantidadeEmEstoque: 100,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 67,
          nome: "Cinto de Couro",
          descricao: "Cinto de couro, ideal para complementar looks sociais.",
          preco: 89.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 68,
          nome: "Cachecol de Lã",
          descricao: "Cachecol de lã quentinho para o inverno.",
          preco: 59.99,
          quantidadeEmEstoque: 60,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 69,
          nome: "Relógio Digital",
          descricao: "Relógio digital esportivo, resistente à água.",
          preco: 149.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 70,
          nome: "Óculos de Sol",
          descricao: "Óculos de sol com proteção UV.",
          preco: 99.99,
          quantidadeEmEstoque: 80,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    }
  ]
});

db.categorias.insertOne({
  nome: "Games",
  subcategorias: [
    {
      nome: "Consoles",
      produtos: [
        {
          id: 71,
          nome: "PlayStation 5",
          descricao: "Console de última geração da Sony, com gráficos em 4K.",
          preco: 4999.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 72,
          nome: "Xbox Series X",
          descricao: "Console da Microsoft com suporte para jogos em alta resolução.",
          preco: 4799.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 73,
          nome: "Nintendo Switch",
          descricao: "Console híbrido da Nintendo, portátil e de mesa.",
          preco: 2999.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 74,
          nome: "PlayStation 4",
          descricao: "Console de geração anterior da Sony, com vasta biblioteca de jogos.",
          preco: 2499.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 75,
          nome: "Xbox One S",
          descricao: "Console da Microsoft com ótima performance e preço acessível.",
          preco: 2299.99,
          quantidadeEmEstoque: 18,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Jogos",
      produtos: [
        {
          id: 76,
          nome: "The Last of Us Part II",
          descricao: "Jogo de aventura e sobrevivência exclusivo do PlayStation.",
          preco: 199.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 77,
          nome: "Cyberpunk 2077",
          descricao: "RPG de mundo aberto situado em um futuro distópico.",
          preco: 249.99,
          quantidadeEmEstoque: 40,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 78,
          nome: "Zelda: Breath of the Wild",
          descricao: "Jogo de aventura da série Zelda para o Nintendo Switch.",
          preco: 299.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 79,
          nome: "Halo Infinite",
          descricao: "Jogo de tiro em primeira pessoa exclusivo do Xbox.",
          preco: 199.99,
          quantidadeEmEstoque: 35,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 80,
          nome: "FIFA 23",
          descricao: "Jogo de futebol com gráficos realistas e times atualizados.",
          preco: 249.99,
          quantidadeEmEstoque: 60,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Acessórios",
      produtos: [
        {
          id: 81,
          nome: "Headset Gamer",
          descricao: "Headset com som surround 7.1 e microfone embutido.",
          preco: 199.99,
          quantidadeEmEstoque: 70,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 82,
          nome: "Mouse Gamer RGB",
          descricao: "Mouse ergonômico com iluminação RGB e alta precisão.",
          preco: 149.99,
          quantidadeEmEstoque: 80,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 83,
          nome: "Teclado Mecânico",
          descricao: "Teclado com switches mecânicos, ideal para gamers.",
          preco: 249.99,
          quantidadeEmEstoque: 45,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 84,
          nome: "Volante com Pedais",
          descricao: "Volante com pedais para uma experiência de corrida realista.",
          preco: 699.99,
          quantidadeEmEstoque: 20,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 85,
          nome: "Controle Arcade",
          descricao: "Controle estilo arcade para jogos de luta.",
          preco: 299.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Cadeiras Gamer",
      produtos: [
        {
          id: 86,
          nome: "Cadeira Gamer Ergonomica",
          descricao: "Cadeira com suporte lombar e ajustes de altura.",
          preco: 899.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 87,
          nome: "Cadeira Gamer com Luz LED",
          descricao: "Cadeira gamer com iluminação LED nas bordas.",
          preco: 1099.99,
          quantidadeEmEstoque: 15,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 88,
          nome: "Cadeira Gamer Reclinável",
          descricao: "Cadeira gamer com inclinação de até 180 graus.",
          preco: 999.99,
          quantidadeEmEstoque: 25,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 89,
          nome: "Cadeira Gamer Profissional",
          descricao: "Cadeira de alta qualidade com suporte avançado.",
          preco: 1499.99,
          quantidadeEmEstoque: 10,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 90,
          nome: "Cadeira Gamer Econômica",
          descricao: "Modelo acessível, com design ergonômico.",
          preco: 499.99,
          quantidadeEmEstoque: 40,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    },
    {
      nome: "Controles",
      produtos: [
        {
          id: 91,
          nome: "Controle DualSense PS5",
          descricao: "Controle sem fio para o PlayStation 5 com feedback háptico.",
          preco: 399.99,
          quantidadeEmEstoque: 50,
          localizacao: {
            type: "Point",
            coordinates: [-46.6333, -23.5505]
          }
        },
        {
          id: 92,
          nome: "Controle Xbox Series",
          descricao: "Controle sem fio para Xbox Series X|S com empunhadura texturizada.",
          preco: 349.99,
          quantidadeEmEstoque: 45,
          localizacao: {
            type: "Point",
            coordinates: [-43.1729, -22.9068]
          }
        },
        {
          id: 93,
          nome: "Controle Pro Nintendo Switch",
          descricao: "Controle ergonômico para o Nintendo Switch.",
          preco: 299.99,
          quantidadeEmEstoque: 40,
          localizacao: {
            type: "Point",
            coordinates: [-51.2177, -30.0346]
          }
        },
        {
          id: 94,
          nome: "Controle PS4 DualShock",
          descricao: "Controle sem fio para o PlayStation 4.",
          preco: 299.99,
          quantidadeEmEstoque: 30,
          localizacao: {
            type: "Point",
            coordinates: [-38.5167, -3.7172]
          }
        },
        {
          id: 95,
          nome: "Controle Bluetooth Universal",
          descricao: "Controle compatível com diversas plataformas via Bluetooth.",
          preco: 199.99,
          quantidadeEmEstoque: 60,
          localizacao: {
            type: "Point",
            coordinates: [-60.0212, -3.1019]
          }
        }
      ]
    }
  ]
});

db.transacoes.insertMany([
  {
    id: 0,
    usuarioId: 0,
    produtoId: 15,
  },
  {
    id: 1,
    usuarioId: 0,
    produtoId: 2,
  },
  {
    id: 2,
    usuarioId: 3,
    produtoId: 50,
  },
  {
    id: 3,
    usuarioId: 2,
    produtoId: 90,
  },
  {
    id: 4,
    usuarioId: 4,
    produtoId: 2,
  },
]);

db.avaliacoes.insertMany([
  {
    nota: 4,
    usuarioId: 0,
    produtoId: 15,
    comentario:
      "Gostei muito do produto, mas a qualidade do material não é tão boa assim.",
  },
  {
    nota: 5,
    usuarioId: 0,
    produtoId: 2,
  },
  {
    nota: 1,
    usuarioId: 3,
    produtoId: 50,
    comentario: "Horrível. Me arrependi muito dessa compra!",
  },
  {
    nota: 3,
    usuarioId: 2,
    produtoId: 90,
    comentario: "Medíocre.",
  },
  {
    nota: 4,
    usuarioId: 4,
    produtoId: 2,
  },
]);

// Adicionar object de desconto em cada produto
db.categorias.updateMany(
  {},
  {
    $set: {
      "subcategorias.$[].produtos.$[].desconto": {
        porcentagem: 0,
        dataInicio: null,
        dataTermino: null,
        descontoAtivo: false,
        precoComDesconto: null,
      },
    },
  }
);

// Adicionar pontos de fidelidade para cada usuário
db.usuarios.updateMany(
  {},
  {
    $set: {
      pontosFidelidade: 0,
    },
  }
);