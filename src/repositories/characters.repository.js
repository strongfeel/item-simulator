export class CharactersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findCharacterName = async (characterName) => {
    const findCharacterName = await this.prisma.characters.findFirst({
      where: { characterName: characterName },
    });

    return findCharacterName;
  };

  findCharacterData = async (characterId) => {
    const findCharacterData = await this.prisma.characters.findFirst({
      where: { characterId: +characterId },
    });

    return findCharacterData;
  };

  createCharacter = async (userId, characterName, health, power, money) => {
    const createCharacter = await this.prisma.characters.create({
      data: {
        userId: +userId,
        characterName: characterName,
        health: 500,
        power: 100,
        money: 10000,
      },
    });

    return createCharacter;
  };

  deleteCharacter = async (userId, characterId) => {
    const deleteCharacter = await this.prisma.characters.delete({
      where: {
        userId: +userId,
        characterId: +characterId,
      },
    });

    return deleteCharacter;
  };
}
