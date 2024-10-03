export class CharactersController {
  constructor(charactersService) {
    this.charactersService = charactersService;
  }

  createCharacter = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { characterName } = req.body;

      if (!characterName) {
        throw new Error("InvalidParamsError");
      }

      const character = await this.charactersService.createCharacter(
        userId,
        characterName
      );

      return res.status(201).json({
        message: "캐릭터 생성을 완료 했습니다.",
        data: character,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteCharacter = async (req, res, next) => {
    try {
      const { characterId } = req.body;
      const { userId } = req.user;

      if (!characterId) {
        throw new Error("InvalidParamsError");
      }

      await this.charactersService.deleteCharacter(userId, characterId);

      return res
        .status(202)
        .json({ message: "캐릭터가 정상적으로 삭제 되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  getCharacter = async (req, res, next) => {
    try {
      const { characterId } = req.body;
      const { userId } = req.user;

      if (!characterId) {
        throw new Error("InvalidParamsError");
      }

      const character = await this.charactersService.getCharacter(
        characterId,
        userId
      );

      return res.status(200).json({ data: character });
    } catch (err) {
      next(err);
    }
  };
}
