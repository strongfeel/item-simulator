import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

const router = express.Router();

// 회원가입 API 구현
router.post("/sign-up", async (req, res, next) => {
  try {
    const { id, password, confirmPassword, userName } = req.body;

    // 유저 아이디 중복 조사
    const isExistUser = await prisma.users.findFirst({
      where: { id },
    });

    if (isExistUser) {
      return res.status(405).json({ message: "이미 존재하는 아이디 입니다." });
    }

    // 아이디 생성시 영어 소문자 + 숫자조합 구성
    const regex = /^[a-z|0-9]+$/;

    if (!regex.test(id)) {
      return res.status(406).json({
        message: "영어 소문자와 숫자조합으로 아이디를 작성하여 주세요.",
      });
    }

    if (password.length < 6) {
      return res
        .status(404)
        .json({ message: "비밀번호는 6자리 이상 작성해 주세요." });
    }

    if (password !== confirmPassword) {
      return res
        .status(404)
        .json({ message: "비밀번호가 일치 하지 않습니다." });
    }

    // 비밀번호 암호화 처리
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, userinfo] = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.create({
          data: {
            id,
            password: hashedPassword,
            confirmPassword: null,
          },
        });

        const userinfo = await tx.userInfos.create({
          data: {
            userId: user.userId,
            userName,
          },
        });

        return [user, userinfo];
      },
      {
        // 격리수준 설정
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );
    return res.status(201).json({ message: "회원가입이 완료되었습니다!" });
  } catch (err) {
    next(err);
  }
});

// 로그인 API 구현
router.post("/sign-in", async (req, res, next) => {
  const { id, password } = req.body;
  const user = await prisma.users.findFirst({
    where: {
      id,
    },
  });
  if (!user)
    return res.status(401).json({ message: "존재하지 않은 아이디입니다." });
  // 비밀번호 확인 작업
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(402).json({ message: "비밀번호가 일치하지 않습니다." });

  // 유저아이디 정보를 할당하고 custom-secret-key 방식으로 사용
  const token = jwt.sign({ userId: user.userId }, "custom-secret-key");

  // 쿠키할당
  res.cookie("authorization", `Bearer ${token}`);

  return res.status(200).json({ message: "로그인에 성공하였습니다." });
});

export default router;
