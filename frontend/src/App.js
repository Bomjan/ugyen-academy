import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public site
import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import Home        from "./pages/Home";
import Academics   from "./pages/Academics";
import Admissions  from "./pages/Admissions";
import Sports      from "./pages/Sports";

// Portal
import Login          from "./portal/Login";
import DashboardShell from "./portal/DashboardShell";

// Teacher
import TeacherDashboard     from "./portal/teacher/Dashboard";
import TeacherProgress      from "./portal/teacher/Progress";
import TeacherAttendance    from "./portal/teacher/Attendance";
import TeacherAnnouncements from "./portal/teacher/Announcements";

// Student
import StudentDashboard     from "./portal/student/Dashboard";
import StudentProgress      from "./portal/student/Progress";
import StudentAttendance    from "./portal/student/Attendance";
import StudentAnnouncements from "./portal/student/Announcements";
import StudentFees          from "./portal/student/Fees";

// Parent
import ParentDashboard     from "./portal/parent/Dashboard";
import ParentProgress      from "./portal/parent/Progress";
import ParentAttendance    from "./portal/parent/Attendance";
import ParentAnnouncements from "./portal/parent/Announcements";
import ParentFees          from "./portal/parent/Fees";

// Admin
import AdminDashboard from "./portal/admin/Dashboard";

// Library
import LibraryCatalog from "./portal/library/LibraryCatalog";
import LibraryIssues  from "./portal/library/LibraryIssues";
import MyBooks        from "./portal/library/MyBooks";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/portal/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/portal/${user.role}`} replace />;
  return children;
}

function Portal({ children }) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Public site ── */}
          <Route path="/"            element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/academics"   element={<PublicLayout><Academics /></PublicLayout>} />
          <Route path="/admissions"  element={<PublicLayout><Admissions /></PublicLayout>} />
          <Route path="/sports"      element={<PublicLayout><Sports /></PublicLayout>} />

          {/* ── Portal login ── */}
          <Route path="/portal/login" element={<Login />} />

          {/* ── Teacher portal ── */}
          <Route path="/portal/teacher"              element={<Portal><TeacherDashboard /></Portal>} />
          <Route path="/portal/teacher/progress"     element={<Portal><TeacherProgress /></Portal>} />
          <Route path="/portal/teacher/attendance"   element={<Portal><TeacherAttendance /></Portal>} />
          <Route path="/portal/teacher/announcements"element={<Portal><TeacherAnnouncements /></Portal>} />

          {/* ── Student portal ── */}
          <Route path="/portal/student"              element={<Portal><StudentDashboard /></Portal>} />
          <Route path="/portal/student/progress"     element={<Portal><StudentProgress /></Portal>} />
          <Route path="/portal/student/attendance"   element={<Portal><StudentAttendance /></Portal>} />
          <Route path="/portal/student/announcements"element={<Portal><StudentAnnouncements /></Portal>} />
          <Route path="/portal/student/fees"         element={<Portal><StudentFees /></Portal>} />

          {/* ── Parent portal ── */}
          <Route path="/portal/parent"              element={<Portal><ParentDashboard /></Portal>} />
          <Route path="/portal/parent/progress"     element={<Portal><ParentProgress /></Portal>} />
          <Route path="/portal/parent/attendance"   element={<Portal><ParentAttendance /></Portal>} />
          <Route path="/portal/parent/announcements"element={<Portal><ParentAnnouncements /></Portal>} />
          <Route path="/portal/parent/fees"         element={<Portal><ParentFees /></Portal>} />

          {/* ── Admin portal ── */}
          <Route path="/portal/admin" element={<Portal><AdminDashboard /></Portal>} />

          {/* ── Library portal ── */}
          <Route path="/portal/library/catalog"  element={<Portal><LibraryCatalog /></Portal>} />
          <Route path="/portal/library/issues"   element={<Portal><LibraryIssues /></Portal>} />
          <Route path="/portal/library/my-books" element={<Portal><MyBooks /></Portal>} />

          {/* ── Redirect /portal to login ── */}
          <Route path="/portal" element={<Navigate to="/portal/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
