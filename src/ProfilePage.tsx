"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"

interface ProfileData {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  roles: string[]
  profilePicture: string
  mfaEnabled: boolean
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const getData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return null
      }

      const req = await fetch("https://express-starter-u69f.onrender.com/profile/me", {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + token,
        },
      })

      if (!req.ok) {
        navigate("/login")
        return null
      }

      const data = await req.json()
      console.log(data)
      return data
    } catch (error) {
      console.error("Error fetching profile:", error)
      navigate("/login")
      return null
    }
  }

  useEffect(() => {
    getData().then((data) => {
      if (data) {
        setProfile(data)
        if (data.profilePicture) {
          setImagePreview(data.profilePicture)
        }
      }
      setLoading(false)
    })
  }, [navigate])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const formData = new FormData(e.currentTarget)
      const formDataObj: Record<string, any> = {}

      // Convert FormData to a plain object
      formData.forEach((value, key) => {
        // Skip empty password field
        if (key === "password" && (value as string).trim() === "") return
        formDataObj[key] = value
      })

      // Handle profile picture
      const profilePictureFile = formData.get("profilePicture") as File
      if (profilePictureFile && profilePictureFile.size > 0) {
        // In a real app, you would upload the file to a server
        // For now, we'll use the data URL as a placeholder
        formDataObj.profilePicture = imagePreview
      } else {
        // Keep existing profile picture
        formDataObj.profilePicture = profile?.profilePicture || ""
      }

      // Handle roles as an array
      if (formDataObj.role) {
        formDataObj.roles = [formDataObj.role]
        delete formDataObj.role
      }

      // Handle address fields
      const addressFields = ["street", "city", "state", "zipCode", "country"]
      const addressObj: Record<string, string> = {}

      addressFields.forEach((field) => {
        const value = formData.get(field) as string
        if (value) {
          addressObj[field] = value
          // Remove individual address fields from the main object
          delete formDataObj[field]
        }
      })

      // Add the address object to formDataObj
      formDataObj.address = addressObj

      // Send the update request to the API
      const response = await fetch("https://express-starter-u69f.onrender.com/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formDataObj),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      // Refresh profile data
      const updatedData = await getData()
      if (updatedData) {
        setProfile(updatedData)
        setSuccess("Profile updated successfully!")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">{error}</div>}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 m-4 rounded">{success}</div>
        )}

        <div className="p-6">
          <form onSubmit={updateProfile} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 mb-4 rounded-full overflow-hidden border">
                <img
                  src={imagePreview || profile?.profilePicture || "https://via.placeholder.com/96"}
                  alt={profile?.username || "User"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer px-4 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                    />
                  </svg>
                  Upload Photo
                </label>
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  defaultValue={profile?.username || ""}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={profile?.email || ""}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  defaultValue={profile?.firstName || ""}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  defaultValue={profile?.lastName || ""}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  defaultValue={profile?.phoneNumber || ""}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="street" className="block text-xs text-gray-500">
                      Street
                    </label>
                    <input
                      id="street"
                      name="street"
                      defaultValue={profile?.address?.street || ""}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs text-gray-500">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      defaultValue={profile?.address?.city || ""}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs text-gray-500">
                      State/Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      defaultValue={profile?.address?.state || ""}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-xs text-gray-500">
                      Zip/Postal Code
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      defaultValue={profile?.address?.zipCode || ""}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-xs text-gray-500">
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      defaultValue={profile?.address?.country || ""}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  defaultValue={profile?.roles?.[0] || "user"}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <span className="inline-block mr-2 animate-spin">⟳</span>
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default ProfilePage
