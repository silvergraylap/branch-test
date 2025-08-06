// 파일 1: /pages/find-password.js
// (사용자가 접속할 프론트엔드 페이지입니다)

import React, { useState } from 'react'

// --- React Frontend Component ---
// Next.js에서는 이 컴포넌트를 default로 export하면 자동으로 페이지가 됩니다.
export default function FindPasswordPage() {
   const [step, setStep] = useState(1) // 1: 전화번호 입력, 2: 이메일 입력, 3: 완료
   const [phone, setPhone] = useState('')
   const [email, setEmail] = useState('')
   const [maskedEmail, setMaskedEmail] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [message, setMessage] = useState({ type: '', text: '' })

   // 1단계: 전화번호 제출 및 API 호출
   const handlePhoneSubmit = async (e) => {
      e.preventDefault()
      if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
         setMessage({ type: 'error', text: '올바른 전화번호 형식(010-1234-5678)을 입력해주세요.' })
         return
      }
      setIsLoading(true)
      setMessage({ type: '', text: '' })

      try {
         const response = await fetch('/api/find-user-by-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
         })

         const data = await response.json()

         if (response.ok) {
            setMaskedEmail(data.maskedEmail)
            setStep(2)
            setMessage({ type: 'info', text: '회원님의 이메일 정보를 확인했습니다. 아래에 전체 이메일 주소를 입력해주세요.' })
         } else {
            setMessage({ type: 'error', text: data.message })
         }
      } catch (error) {
         setMessage({ type: 'error', text: '서버와 통신 중 오류가 발생했습니다.' })
      } finally {
         setIsLoading(false)
      }
   }

   // 2단계: 이메일 제출 및 API 호출
   const handleEmailSubmit = async (e) => {
      e.preventDefault()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         setMessage({ type: 'error', text: '올바른 이메일 형식을 입력해주세요.' })
         return
      }
      setIsLoading(true)
      setMessage({ type: '', text: '' })

      try {
         const response = await fetch('/api/send-reset-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, email }),
         })

         const data = await response.json()

         if (response.ok) {
            setStep(3) // 완료 단계
            setMessage({ type: 'success', text: data.message })
         } else {
            setMessage({ type: 'error', text: data.message })
         }
      } catch (error) {
         setMessage({ type: 'error', text: '서버와 통신 중 오류가 발생했습니다.' })
      } finally {
         setIsLoading(false)
      }
   }

   // 처음으로 돌아가기
   const resetProcess = () => {
      setStep(1)
      setPhone('')
      setEmail('')
      setMaskedEmail('')
      setIsLoading(false)
      setMessage({ type: '', text: '' })
   }

   // 메시지 스타일
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
      <div className="bg-slate-100 flex items-center justify-center min-h-screen font-sans">
         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-slate-800">비밀번호 찾기</h1>

            <div style={messageStyle}>{message.text}</div>

            {step === 1 && (
               <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                     <label htmlFor="phone" className="block text-sm font-medium text-slate-600">
                        가입 시 등록한 전화번호
                     </label>
                     <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="010-1234-5678"
                        className="w-full px-4 py-3 mt-1 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        disabled={isLoading}
                     />
                  </div>
                  <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-all duration-300" disabled={isLoading}>
                     {isLoading ? '계정 확인 중...' : '이메일 찾기'}
                  </button>
               </form>
            )}

            {step === 2 && (
               <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                     <p className="text-slate-600">아래 이메일 정보가 맞는지 확인해주세요.</p>
                     <p className="text-lg font-bold text-slate-800 my-2">{maskedEmail}</p>
                  </div>
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-slate-600">
                        이메일 주소 전체 입력
                     </label>
                     <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 mt-1 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        disabled={isLoading}
                     />
                  </div>
                  <div className="flex space-x-2">
                     <button
                        type="button"
                        onClick={resetProcess}
                        className="w-1/2 py-3 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:bg-slate-300 transition-all duration-300"
                        disabled={isLoading}
                     >
                        뒤로
                     </button>
                     <button type="submit" className="w-1/2 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-all duration-300" disabled={isLoading}>
                        {isLoading ? '전송 중...' : '재설정 메일 받기'}
                     </button>
                  </div>
               </form>
            )}

            {step === 3 && (
               <div className="text-center space-y-4">
                  <p className="text-slate-700">성공적으로 요청이 완료되었습니다.</p>
                  <button onClick={resetProcess} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
                     처음으로 돌아가기
                  </button>
               </div>
            )}
         </div>
      </div>
   )
}

// --- 아래 부분은 Next.js에서는 필요 없으므로 삭제합니다. ---
// window.addEventListener(...)
// createRoot(...)
