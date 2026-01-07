import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BrowseRecipes from './pages/BrowseRecipes';
import ExploreChefs from './pages/ExploreChefs';
import ChefProfile from './pages/ChefProfile';
import About from './pages/About';
import VideosPage from './pages/VideosPage';
import VideoDetail from './pages/VideoDetail';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetail from './pages/CourseDetail';

// Protected Routes
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/user/UserDashboard';
import UserBookings from './pages/user/UserBookings';
import SavedRecipes from './pages/user/SavedRecipes';
import UserProfile from './pages/user/UserProfile';
import BookSession from './pages/user/BookSession';
import MyCourses from './pages/user/MyCourses';
import WatchHistory from './pages/user/WatchHistory';

// Chef Routes
import ChefDashboard from './pages/chef/ChefDashboard';
import ChefSessions from './pages/chef/ChefSessions';
import CreateSession from './pages/chef/CreateSession';
import ChefProfileManage from './pages/chef/ChefProfileManage';
import ChefEarnings from './pages/chef/ChefEarnings';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/recipes" element={<BrowseRecipes />} />
              <Route path="/chefs" element={<ExploreChefs />} />
              <Route path="/chefs/:id" element={<ChefProfile />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/videos/:id" element={<VideoDetail />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/about" element={<About />} />

              {/* User Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
              <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
              <Route path="/watch-history" element={<PrivateRoute><WatchHistory /></PrivateRoute>} />
              <Route path="/bookings" element={<PrivateRoute><UserBookings /></PrivateRoute>} />
              <Route path="/saved" element={<PrivateRoute><SavedRecipes /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
              <Route path="/book-session/:sessionId" element={<PrivateRoute><BookSession /></PrivateRoute>} />

              {/* Chef Protected Routes */}
              <Route path="/chef/dashboard" element={<PrivateRoute role="chef"><ChefDashboard /></PrivateRoute>} />
              <Route path="/chef/sessions" element={<PrivateRoute role="chef"><ChefSessions /></PrivateRoute>} />
              <Route path="/chef/sessions/create" element={<PrivateRoute role="chef"><CreateSession /></PrivateRoute>} />
              <Route path="/chef/profile" element={<PrivateRoute role="chef"><ChefProfileManage /></PrivateRoute>} />
              <Route path="/chef/earnings" element={<PrivateRoute role="chef"><ChefEarnings /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

