import { Navigate, Route, Routes } from 'react-router-dom'
import Overview from '../pages/Dashboard/Overview'

const Content = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                <Route path='/' element={<Navigate to="/admin/overview" />} />
                <Route path='/admin/overview' element={<Overview />} />
            </Routes>
        </div>
    )
}

export default Content