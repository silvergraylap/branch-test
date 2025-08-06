// javascript
// 파일 2: /pages/api/find-user-by-phone.js
// (전화번호로 사용자를 찾는 API 로직입니다)

// Mock Database: 실제 프로젝트에서는 이 부분을 MySQL, PostgreSQL, MongoDB 등 DB 조회 코드로 변경해야 합니다.
const mockUserDatabase = [
   { id: 1, phone: '010-1234-5678', email: 'testuser@example.com', name: '홍길동' },
   { id: 2, phone: '010-9876-5432', email: 'gemini@google.com', name: '제미니' },
]

// 이메일 마스킹 함수
const maskEmail = (email) => {
   if (!email || !email.includes('@')) {
      return '이메일 정보가 올바르지 않습니다.'
   }
   const [localPart, domain] = email.split('@')
   const [domainName, domainTld] = domain.split('.')

   const maskedLocal = localPart.length > 1 ? localPart[0] + '*'.repeat(localPart.length - 1) : localPart
   const maskedDomain = domainName.length > 1 ? domainName[0] + '*'.repeat(domainName.length - 1) : domainName

   return `${maskedLocal}@${maskedDomain}.${domainTld}`
}

export default async function handler(req, res) {
   // POST 요청만 처리
   if (req.method !== 'POST') {
      return res.status(405).json({ message: '허용되지 않는 메서드입니다.' })
   }

   const { phone } = req.body

   // 가상 DB에서 사용자 검색 (실제로는 DB를 쿼리해야 합니다)
   const user = mockUserDatabase.find((u) => u.phone === phone)

   if (user) {
      // 사용자를 찾았으면 마스킹된 이메일과 함께 성공 응답
      res.status(200).json({ success: true, maskedEmail: maskEmail(user.email) })
   } else {
      // 사용자를 찾지 못했으면 에러 응답
      res.status(404).json({ success: false, message: '해당 전화번호로 가입된 회원이 없습니다.' })
   }
}
