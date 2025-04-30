"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.ok) {
      window.location.href = "/"
    } else {
      setErrorMessage(res?.error || "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl">Sign In</h2>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          type="email"
          id="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block">Password</label>
        <input
          type="password"
          id="password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn">Sign In</button>
    </form>
  )
}

export default SignIn
