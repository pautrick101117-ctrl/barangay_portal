import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

// 🧍 USER COMPONENTS
import UserLayout from './components/layouts/UserLayout';
import Home from './components/UserComponents/Home';
import Login from './components/UserComponents/Login';
import Register from './components/UserComponents/Register';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './components/UserComponents/Dashboard';
import About from './components/UserComponents/About';
import NavLayout from './components/layouts/NavLayout';
import News from './components/UserComponents/News';
import FundRecords from './components/UserComponents/FundRecords';
import ProjectSuggestion from './components/UserComponents/ProjectSuggestion';
import FAQs from './components/UserComponents/FAQs';
import Contact from './components/UserComponents/Contact';

// 🧑‍💼 ADMIN COMPONENTS
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import FundsPage from './components/admin/FundsPage';
import NewsPage from './components/admin/NewsPage';
import OfficialsPage from './components/admin/OfficialsPage';
import ProjectsPage from './components/admin/ProjectsPage';
import ComplaintsPage from './components/admin/ComplaintPage'; // ✅ ADD THIS
import AdminProtectedRoute from './auth/AdminProtectedRoute';
import AdminLayout from './components/admin/Sidebar';
import AdminProjectSuggestionsPage from './components/admin/AdminProjectSuggestionsPage';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* ========= USER ROUTES ========= */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
          <Route path="news" element={<News />} />

          {/* Protected routes for normal users */}
          <Route
            element={
              <ProtectedRoute>
                <NavLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="fund-records" element={<FundRecords />} />
            <Route path="project-suggestion" element={<ProjectSuggestion />} />
            <Route path="faqs" element={<FAQs />} />
          </Route>
        </Route>

        {/* ========= ADMIN ROUTES ========= */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="officials" element={<OfficialsPage />} />
          <Route path="funds" element={<FundsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="complaints" element={<ComplaintsPage />} /> {/* ✅ NEW */}
          <Route path="project-suggestions" element={<AdminProjectSuggestionsPage />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
