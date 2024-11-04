const db = "1SUPERGRUPO";
use(db);

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "address", "password"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 3,
          description: "must be a string with at least 3 characters",
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+\\..+$",
          description: "must be a valid email address format",
        },
        address: {
          bsonType: "string",
          minLength: 5,
          description: "must be a valid address",
        },
        password: {
          bsonType: "string",
          minLength: 8,
          description: "must be a string with at least 8 characters",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
