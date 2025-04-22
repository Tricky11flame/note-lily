'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    const fn = isSignUp ? supabase.auth.signUp : supabase.auth.signInWithPassword
    const { error } = await fn({ email, password })
    if (!error) router.push('/dashboard')
    else alert(error.message)
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold text-center">{isSignUp ? 'Sign Up' : 'Log In'}</h1>
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleAuth} className="w-full">
        {isSignUp ? 'Create Account' : 'Log In'}
      </Button>
      <Button variant="ghost" onClick={() => setIsSignUp(!isSignUp)} className="w-full text-sm">
        {isSignUp ? 'Already have an account?' : 'Create new account'}
      </Button>
    </div>
  )
}
