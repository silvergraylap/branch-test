// 파일 3: /pages/api/send-reset-email.js
// (이메일을 확인하고 재설정 메일을 보내는 API 로직입니다)

// Mock Database: 실제 프로젝트에서는 이 부분을 DB 조회 코드로 변경해야 합니다.
const mockUserDatabase = [
   { id: 1, phone: '010-1234-5678', email: 'testuser@example.com', name: '홍길동' },
   { id: 2, phone: '010-9876-5432', email: 'gemini@google.com', name: '제미니' },
]

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: '허용되지 않는 메서드입니다.' })
   }

   const { phone, email } = req.body

   // 가상 DB에서 사용자 검색
   const user = mockUserDatabase.find((u) => u.phone === phone)

   if (!user) {
      return res.status(404).json({ success: false, message: '사용자 정보를 찾을 수 없습니다. 처음부터 다시 시도해주세요.' })
   }

   // 입력된 이메일과 DB의 이메일이 일치하는지 확인
   if (user.email.toLowerCase() === email.toLowerCase()) {
      // 실제로는 여기서 Nodemailer 등을 사용해 메일을 보냅니다.
      console.log(`[SUCCESS] ${user.email} 주소로 비밀번호 재설정 링크를 발송했습니다.`)
      res.status(200).json({ success: true, message: `[${user.email}] 주소로 비밀번호 재설정 안내 메일을 보냈습니다. 5분 안에 확인해주세요.` })
   } else {
      // 이메일이 일치하지 않을 경우
      res.status(400).json({ success: false, message: '입력하신 이메일 주소가 일치하지 않습니다.' })
   }
}
