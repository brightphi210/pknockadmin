import { Navigate, Route, Routes } from 'react-router-dom'
import Overview from '../pages/Dashboard/Overview'
import Property from '../pages/Dashboard/Property'
import PropertyOwners from '../pages/Dashboard/PropertyOwners'
import SingleProperty from '../pages/Dashboard/SingleProperty'
import SinglePropertyOwners from '../pages/Dashboard/SinglePropertyOwners'

const Content = () => {
    return (
        <div className='main-content h-[98vh] w-full overflow-y-scroll'>
            <Routes>
                <Route path='/' element={<Navigate to="/admin/overview" />} />
                <Route path='/admin/overview' element={<Overview />} />
                <Route path='/admin/properties' element={<Property />} />
                <Route path='/admin/properties/:id' element={<SingleProperty />} />
                <Route path='/admin/property-owners' element={<PropertyOwners />} />
                <Route path='/admin/property-owners/:id' element={<SinglePropertyOwners />} />
            </Routes>
        </div>
    )
}

export default Content