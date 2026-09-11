import { useState } from 'react'
// import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashNavbar from './components/DashNavbar'
import DashSideBar from './components/DashSideBar'
import Content from './content/Content'
import './index.css'
import Login from './pages/Login'
import AuthProvider from './providers/AuthProvider'
import ProtectedRoute from './providers/ProtectedRoute'

const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-slate-50">
            <DashSideBar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <DashNavbar onOpenMobileSidebar={() => setMobileOpen(true)} />
                <Content />
            </div>
        </div>
    )
}

const App = () => {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="*" element={<ProtectedRoute element={<Dashboard />} />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    )
}

export default App