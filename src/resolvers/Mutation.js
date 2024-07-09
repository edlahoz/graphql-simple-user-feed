const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserId, signToken } = require("../utils");

async function signup(parent, args, { prisma }, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10);

  // 2
  const user = await prisma.user.create({
    data: { ...args, password },
  });

  // 3
  const token = signToken(user.id);

  // 4
  return {
    token,
    user,
  };
}

async function login(parent, args, { prisma }, info) {
  // 1
  const user = await prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = signToken(user.id);

  // 3
  return {
    token,
    user,
  };
}

async function postLink(parent, args, { prisma, userId }, info) {
  return await prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

async function updateLink(parent, args, { prisma, userId }, info) {
  return await prisma.link.update({
    where: { id: parseInt(args.id) },
    data: { url: args.url, description: args.description },
  });
}

async function deleteLink(parent, args, { prisma, userId }, info) {
  return await prisma.link.delete({
    where: { id: parseInt(args.id) },
  });
}

async function deleteUser(parent, args, { prisma, userId }, info) {
  const userIdToDelete = parseInt(args.id);

  try {
    // Start a transaction to ensure atomicity
    const transaction = await prisma.$transaction(async (prisma) => {
      // Delete all links associated with the user
      await prisma.link.deleteMany({
        where: { postedById: userIdToDelete },
      });

      // Delete the user
      return await prisma.user.delete({
        where: { id: userIdToDelete },
      });
    });

    return transaction;
  } catch (error) {
    console.error("Error deleting user and links: ", error);
    throw new Error("Failed to delete user and their associated links");
  }
}

module.exports = {
  signup,
  login,
  postLink,
  updateLink,
  deleteLink,
  deleteUser,
};
