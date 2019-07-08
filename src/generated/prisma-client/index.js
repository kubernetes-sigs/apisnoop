"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Event",
    embedded: false
  },
  {
    name: "ResponseStatus",
    embedded: false
  },
  {
    name: "UserInfo",
    embedded: false
  },
  {
    name: "ObjectReference",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://us1.prisma.sh/zz/snoop_v3/dev`
});
exports.prisma = new exports.Prisma();
