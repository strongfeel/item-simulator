export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createUsers = async (id, hashedPassword, userName) => {
    const createdUser = await this.prisma.users.create({
      data: {
        id,
        password: hashedPassword,
        userName: userName,
      },
    });

    return createdUser;
  };

  findUserData = async (id) => {
    const findUserId = await this.prisma.users.findFirst({
      where: { id },
    });

    return findUserId;
  };
}
