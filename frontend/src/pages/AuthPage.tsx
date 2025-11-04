import { Outlet } from 'react-router'

const AuthPage = () => {
  return (
    <>
    <div className="app-container">
        <Outlet />
    </div>
    </>
  )
}

export default AuthPage