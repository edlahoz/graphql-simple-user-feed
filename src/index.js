const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
  },
  Mutation: {
    postLink: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
    updateLink: (parent, args, context) => {
      return context.prisma.link.update({
        where: { id: parseInt(args.id) },
        data: { url: args.url, description: args.description },
      });
    },
    deleteLink: (parent, args, context) => {
      return context.prisma.link.delete({
        where: { id: parseInt(args.id) },
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: { prisma },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
