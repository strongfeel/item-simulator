# item-simulator

## ERD

![스크린샷 2024-10-03 194322](https://github.com/user-attachments/assets/01ed772c-d4c3-40b8-895e-0182fde04abc)


## 질문과 답변

#### 1. 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?

단방향 입니다. 복호화 불가능하여 원본을 알 수 없는 것을 단방향이라고 합니다.

#### 2. 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?

보안성: 실제 비밀번호가 아닌 Hash 암호화된 값을 저장하므로, 비밀번호가 유출되더라도 사용자의 정보를 보호할 수 있습니다.
개인정보 보호: 각 사용자의 비밀번호를 비교할 수 없으므로 개인정보 보호에 도움이 됩니다.

#### 3. JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요? 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?

문제점:

- Access Token이 노출되면 인증된 사용자로 가장할 수 있습니다.
- 공격자가 Access Token을 사용하여 허가되지 않은 작업을 수행할 수 있습니다.
- Access Token에는 사용자의 정보가 포함되어 있어, 이를 통해 개인정보 침해가 발생할 수 있습니다.

보완 방법:

- Refresh Token 사용합니다
  Access Token과 함께 Refresh Token을 발급하고 관리합니다. Access Token이 만료되면 Refresh Token으로 새로운 Access Token을 발급 받습니다.

- 단기 Access Token 사용합니다.
  Access Token의 유효 기간을 최소화하여 토큰 노출 시 피해를 줄입니다.
  사용자가 지속적으로 인증을 받아야 하므로 사용성이 낮아질 수 있습니다.

#### 4. 인증과 인가가 무엇인지 각각 설명해 주세요. 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?

인증이란: 유저가 누구인지 확인하는 절차, 회원 가입 하고 로그인 하는 것 입니다.
인가란: 유저에 대한 권한을 허락하는 것 입니다.
인증을 필요로 하는 api는 사용자의 개인정보를 이용하여 작업 할 수 있도록 하는 것이고,
필요로 하지 않는 api는 공개적인 정보 만을 조회하는 작업에 해당 합니다.

#### 5. 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?

아이템이라는 데이터는 불변의 데이터 이거니 와 공통적으로 사용하는 데이터 입니다. 그래서 기본 유저들이 마음대로 아이템을 생성하거나 하면 문제가 발생 하기 때문에 관리자 권한을 받은 사람만이 할 수 있는 부분이라고 생각 합니다.

#### 6. 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.

200 조회 성공
201 생성 성공
202 삭제 성공
400 요청에 문제가 있음 (비밀번호 글자 수 등)
401 승인된 사용자가 아닐 경우
404 조회 실패
500 서버 에러

#### 7. 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다. - 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요? - 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?

캐릭터 테이블에는 다양한 정보들이 존재 합니다. 캐릭터의 스탯과 같은 데이터를 수정하다가 재화 부분을 잘 못 재정의 하는 문제가 발생 할 수 있다고 생각 합니다. 그래서 데이터 테이블을 따로 나누어 재화와 스탯을 분리해서 관리하는 것이 나을 것 같다.

#### 8. 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?

가격을 조작하여 이득을 보는 경우가 생길 것입니다.
