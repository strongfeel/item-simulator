export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  createUser = async (req, res, next) => {
    try {
      const { id, password, confirmPassword, userName } = req.body;

      if (!id || !password || !confirmPassword || !userName) {
        throw new Error("InvalidParamsError");
      }

      await this.usersService.createUser(
        id,
        password,
        confirmPassword,
        userName
      );

      return res.status(201).json({ message: "회원가입이 완료되었습니다!" });
    } catch (err) {
      next(err);
    }
  };

  getUserId = async (req, res, next) => {
    try {
      const { id, password } = req.body;

      if (!id || !password) {
        throw new Error("InvalidParamsError");
      }

      await this.usersService.getUserId(id, password, res);

      return res.status(200).json({ message: "로그인에 성공하였습니다." });
    } catch (err) {
      next(err);
    }
  };
}
