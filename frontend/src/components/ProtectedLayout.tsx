import { Outlet } from 'react-router'
import useAuthStore from '../stores/useAuthStore'

const ProtectedLayout = () => {
  const user = useAuthStore((state: any) => state.user)

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center font-audio">
        <div className="bg-surface shadow-md rounded-2xl p-8 text-center w-[90%] max-w-md">
          <h1 className="text-2xl font-semibold text-text-primary mb-3">
            You’re not signed in
          </h1>
          <p className="text-accent mb-6">
            Please log in to access this page.
          </p>
          <a
            href="/auth/login"
            className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-[0.6] transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export default ProtectedLayout
