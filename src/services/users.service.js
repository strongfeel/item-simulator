import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  createUser = async (id, password, confirmPassword, userName) => {
    // 유저 아이디 중복 조사
    const isExistUser = await this.usersRepository.findUserData(id);

    if (isExistUser) {
      throw new Error("이미 존재하는 아이디 입니다.");
    }

    // 아이디 생성시 영어 소문자 + 숫자조합 구성
    const regex = /^[a-z|0-9]+$/;

    if (!regex.test(id)) {
      throw new Error("영어 소문자와 숫자조합으로 아이디를 작성하여 주세요.");
    }

    if (password.length < 6) {
      throw new Error("비밀번호는 6자리 이상 작성해 주세요.");
    }

    if (password !== confirmPassword) {
      throw new Error("비밀번호가 일치 하지 않습니다.");
    }

    // 비밀번호 암호화 처리
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.createUsers(id, hashedPassword, userName);
  };

  getUserId = async (id, password, res) => {
    // 유저 아이디 존재여부 확인
    const user = await this.usersRepository.findUserData(id);

    if (!user) {
      throw new Error("존재하지 않은 아이디입니다.");
    }

    // 비밀번호 확인 작업
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    // 유저아이디 정보를 할당하고 custom-secret-key 방식으로 사용
    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);

    // 쿠키할당
    res.cookie("authorization", `Bearer ${token}`);
  };
}
