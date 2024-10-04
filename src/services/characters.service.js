export class CharactersService {
  constructor(charactersRepository) {
    this.charactersRepository = charactersRepository;
  }

  createCharacter = async (userId, characterName, health, power, money) => {
    // 캐릭터 닉네임 중복 조사
    const character = await this.charactersRepository.findCharacterName(
      characterName
    );

    if (character) {
      throw new Error("이미 존재하는 닉네임 입니다.");
    }

    const createCharacter = await this.charactersRepository.createCharacter(
      userId,
      characterName,
      health,
      power,
      money
    );

    return {
      userId: createCharacter.userId,
      characterName: createCharacter.characterName,
      health: createCharacter.health,
      power: createCharacter.power,
      money: createCharacter.money,
    };
  };

  deleteCharacter = async (userId, characterId) => {
    const character = await this.charactersRepository.findCharacterData(
      characterId
    );
    if (!character) {
      throw new Error("캐릭터가 존재하지 않습니다.");
    }

    if (character.userId !== userId) {
      throw new Error("해당 캐릭터를 삭제할 권한이 없습니다.");
    }

    await this.charactersRepository.deleteCharacter(userId, characterId);
  };

  getCharacter = async (characterId, userId) => {
    const character = await this.charactersRepository.findCharacterData(
      characterId
    );

    if (!character) {
      throw new Error("캐릭터가 존재하지 않습니다.");
    }

    const isOwner = character.userId === userId;

    const characterData = {
      characterName: character.characterName,
      characterHealth: character.health,
      characterPower: character.power,
    };

    if (isOwner) {
      characterData.money = character.money;
    }

    return characterData;
  };
}
