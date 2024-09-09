export default function (err, req, res, next) {
  // 에러를 출력합니다.
  console.error(err);

  // 클라이언트에게 에러 메시지를 전달합니다.
  res.status(500).json({ errorMessage: "서버 내부 에러가 발생했습니다." });
  res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  res.status(404).json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
}
