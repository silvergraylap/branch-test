import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// --- Mock API: 실제로는 별도의 백엔드 서버와 통신해야 합니다 ---
const mockUserDatabase = [
   { id: 1, phone: '010-1234-5678', email: 'testuser@example.com', name: '홍길동' },
   { id: 2, phone: '010-9876-5432', email: 'gemini@google.com', name: '제미니' },
]

const maskEmail = (email) => {
   if (!email || !email.includes('@')) return '이메일 정보 오류'
   const [local, domain] = email.split('@')
   return `${local[0]}${'*'.repeat(local.length - 1)}@${domain}`
}

// --- 페이지 컴포넌트들 ---

// 1. 홈페이지 컴포넌트
function HomePage() {
   return (
      <div className="text-center">
         <h1 className="text-4xl font-bold mb-4">Vite + React 프로젝트</h1>
         <p className="mb-8">아래 링크를 눌러 비밀번호 찾기 페이지로 이동하세요.</p>
         <Link to="/find-password">
            <button className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">비밀번호 찾으러 가기</button>
         </Link>
      </div>
   )
}

// 2. 비밀번호 찾기 페이지 컴포넌트
function FindPasswordPage() {
   const [step, setStep] = useState(1)
   const [phone, setPhone] = useState('')
   const [email, setEmail] = useState('')
   const [maskedEmail, setMaskedEmail] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [message, setMessage] = useState({ type: '', text: '' })

   const handlePhoneSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      setMessage({ type: '', text: '' })

      // API 호출 시뮬레이션
      setTimeout(() => {
         const user = mockUserDatabase.find((u) => u.phone === phone)
         if (user) {
            setMaskedEmail(maskEmail(user.email))
            setStep(2)
            setMessage({ type: 'info', text: '회원님의 이메일 정보를 확인했습니다.' })
         } else {
            setMessage({ type: 'error', text: '해당 전화번호로 가입된 회원이 없습니다.' })
         }
         setIsLoading(false)
      }, 1000)
   }

   const handleEmailSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      setMessage({ type: '', text: '' })

      // API 호출 시뮬레이션
      setTimeout(() => {
         const user = mockUserDatabase.find((u) => u.phone === phone)
         if (user && user.email.toLowerCase() === email.toLowerCase()) {
            setStep(3)
            setMessage({ type: 'success', text: `[${user.email}]로 재설정 링크를 보냈습니다.` })
         } else {
            setMessage({ type: 'error', text: '입력하신 이메일 주소가 일치하지 않습니다.' })
         }
         setIsLoading(false)
      }, 1000)
   }

   const resetProcess = () => {
      setStep(1)
      setPhone('')
      setEmail('')
      setMessage({ type: '', text: '' })
   }

   const messageStyle = {
      padding: '10px',
      margin: '10px 0',
      borderRadius: '8px',
      textAlign: 'center',
      color: 'white',
      display: message.text ? 'block' : 'none',
      backgroundColor: message.type === 'error' ? '#ef4444' : message.type === 'success' ? '#22c55e' : '#3b82f6',
   }

   return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
         <h1 className="text-3xl font-bold text-center text-slate-800">비밀번호 찾기</h1>
         <div style={messageStyle}>{message.text}</div>

         {step === 1 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
               <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 mt-1 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
               />
               <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400" disabled={isLoading}>
                  {isLoading ? '확인 중...' : '이메일 찾기'}
               </button>
            </form>
         )}

         {step === 2 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-slate-600">아래 이메일이 맞는지 확인해주세요.</p>
                  <p className="text-lg font-bold text-slate-800 my-2">{maskedEmail}</p>
               </div>
               <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="전체 이메일 주소 입력"
                  className="w-full px-4 py-3 mt-1 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
               />
               <div className="flex space-x-2">
                  <button type="button" onClick={resetProcess} className="w-1/2 py-3 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300" disabled={isLoading}>
                     뒤로
                  </button>
                  <button type="submit" className="w-1/2 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400" disabled={isLoading}>
                     {isLoading ? '전송 중...' : '재설정 메일 받기'}
                  </button>
               </div>
            </form>
         )}

         {step === 3 && (
            <div className="text-center space-y-4">
               <p className="text-slate-700">성공적으로 요청이 완료되었습니다.</p>
               <button onClick={resetProcess} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  처음으로 돌아가기
               </button>
            </div>
         )}
      </div>
   )
}

// --- 전체 앱 레이아웃 및 라우터 설정 ---
export default function App() {
   return (
      <BrowserRouter>
         <div className="bg-slate-100 flex items-center justify-center min-h-screen font-sans">
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/find-password" element={<FindPasswordPage />} />
            </Routes>
         </div>
      </BrowserRouter>
   )
}
