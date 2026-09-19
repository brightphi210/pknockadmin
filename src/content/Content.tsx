import { Navigate, Route, Routes } from "react-router-dom";
import Analytics from "../pages/Dashboard/Analytics";
import Inspection from "../pages/Dashboard/Inspection";
import Notifications from "../pages/Dashboard/Notifications";
import Overview from "../pages/Dashboard/Overview";
import Payments from "../pages/Dashboard/Payments";
import Property from "../pages/Dashboard/Property";
import PropertyOwners from "../pages/Dashboard/PropertyOwners";
import Settings from "../pages/Dashboard/Settings";
import SingleProperty from "../pages/Dashboard/SingleProperty";
import SinglePropertyOwners from "../pages/Dashboard/SinglePropertyOwners";
import SingleUser from "../pages/Dashboard/SingleUser";
import SingleVerificationOfficer from "../pages/Dashboard/SingleVerificationOfficer";
import SupportComplaints from "../pages/Dashboard/SupportComplaints";
import Users from "../pages/Dashboard/Users";
import VerificationOfficers from "../pages/Dashboard/VerificationOfficers.";

const Content = () => {
    return (
        <div className="main-content h-[98vh] w-full overflow-y-scroll">
            <Routes>
                <Route path="/" element={<Navigate to="/admin/overview" />} />
                <Route path="/admin/overview" element={<Overview />} />
                <Route path="/admin/properties" element={<Property />} />
                <Route path="/admin/properties/:id" element={<SingleProperty />} />
                <Route path="/admin/property-owners" element={<PropertyOwners />} />
                <Route
                    path="/admin/property-owners/:id"
                    element={<SinglePropertyOwners />}
                />
                <Route
                    path="/admin/verification-officers"
                    element={<VerificationOfficers />}
                />
                <Route
                    path="/admin/verification-officers/:id"
                    element={<SingleVerificationOfficer />}
                />
                <Route path="/admin/inspections" element={<Inspection />} />

                {/* New routes */}
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/users/:id" element={<SingleUser />} />
                <Route path="/admin/payments" element={<Payments />} />
                <Route
                    path="/admin/complaints"
                    element={<SupportComplaints />}
                />

                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/notifications" element={<Notifications />} />
                <Route path="/admin/settings" element={<Settings />} />
            </Routes>
        </div>
    );
};

export default Content;