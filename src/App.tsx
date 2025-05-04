
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { useState } from 'react'
import ProfilePage from './ProfilePage'
function App() {

  const [error, setError] = useState('')
  const navigate = useNavigate()

  const register = async (formData: FormData) => {
    try {

      const req = await fetch('http://localhost:3000/register', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'content-type': 'application/json'
        }
      })
      if (req.ok) {
        navigate('/login')
        return
      }
      const res = await req.json()
      setError(res.error)
    } catch (error) {

      console.log(error)
    }
  }
  const login = async (formData: FormData) => {
    try {

      const req = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'content-type': 'application/json'
        }
      })
      if (req.ok) {
        const res = await req.json()
        const token = res.token
        localStorage.setItem('token', token)
        navigate('/profile')
      }
      const res = await req.json()
      setError(res.error)
    } catch (error) {

      console.log(error)
    }
  }


  return (
    <Routes>
      <Route path='/profile' element={<>
        <ProfilePage />
      </>} />
      <Route path='/login' element={<>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            {error && <div className='bg-yellow-500 p-2 rounded-md'>{error}</div>}
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action={login} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                <div className="mt-2">
                  <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">username</label>
                <div className="mt-2">
                  <input type="username" name="username" id="username" autoComplete="username" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                  <div className="text-sm">
                  </div>
                </div>
                <div className="mt-2">
                  <input type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                </div>
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Not a member?
              <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">signup</Link>
            </p>
          </div>
        </div>
      </>} />
      <Route path='/' element={
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            {error && <div className='bg-yellow-500 p-2 rounded-md'>{error}</div>}
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action={register} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                <div className="mt-2">
                  <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">username</label>
                <div className="mt-2">
                  <input type="username" name="username" id="username" autoComplete="username" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                  <div className="text-sm">
                  </div>
                </div>
                <div className="mt-2">
                  <input type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                </div>
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              already a member?
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">login</Link>
            </p>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App
