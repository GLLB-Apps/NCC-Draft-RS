import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { ToastProvider } from './lib/toast'
import './index.css'
import './components/public/public.css'
import './components/admin/admin.css'

import PublicLayout from './components/public/PublicLayout'
import HomePage from './pages/public/HomePage'
import BackgroundPage from './pages/public/BackgroundPage'
import TopicsPage from './pages/public/TopicsPage'
import TopicDetailPage from './pages/public/TopicDetailPage'
import NewsPage from './pages/public/NewsPage'
import NewsDetailPage from './pages/public/NewsDetailPage'
import TestimoniesPage from './pages/public/TestimoniesPage'
import MapPage from './pages/public/MapPage'
import TimelinePage from './pages/public/TimelinePage'
import DocumentsPage from './pages/public/DocumentsPage'
import MediaPage from './pages/public/MediaPage'
import PressPage from './pages/public/PressPage'
import FaqPage from './pages/public/FaqPage'
import ContactPage from './pages/public/ContactPage'

import AdminLogin from './pages/admin/AdminLogin'
import AdminGuard from './pages/admin/AdminGuard'
import AdminOverview from './pages/admin/AdminOverview'
import AdminTopics from './pages/admin/AdminTopics'
import AdminTopicEdit from './pages/admin/AdminTopicEdit'
import AdminNews from './pages/admin/AdminNews'
import AdminNewsEdit from './pages/admin/AdminNewsEdit'
import AdminTestimonies from './pages/admin/AdminTestimonies'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminDocumentEdit from './pages/admin/AdminDocumentEdit'
import AdminMedia from './pages/admin/AdminMedia'
import AdminMediaEdit from './pages/admin/AdminMediaEdit'
import AdminMap from './pages/admin/AdminMap'
import AdminMapEdit from './pages/admin/AdminMapEdit'
import AdminTimeline from './pages/admin/AdminTimeline'
import AdminTimelineEdit from './pages/admin/AdminTimelineEdit'
import AdminFaq from './pages/admin/AdminFaq'
import AdminContacts from './pages/admin/AdminContacts'
import AdminMessages from './pages/admin/AdminMessages'
import AdminSettings from './pages/admin/AdminSettings'
import AdminAdmins from './pages/admin/AdminAdmins'

function NotFound() {
  return (
    <div className="empty-state">
      <h1>Sidan hittades inte</h1>
      <p>Den sökta sidan finns inte.</p>
      <a href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Till startsidan</a>
    </div>
  )
}

function AppRoutes() {
  const { user, isAdmin, loading } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bakgrund" element={<BackgroundPage />} />
        <Route path="/amnen" element={<TopicsPage />} />
        <Route path="/amnen/:slug" element={<TopicDetailPage />} />
        <Route path="/nyheter" element={<NewsPage />} />
        <Route path="/nyheter/:slug" element={<NewsDetailPage />} />
        <Route path="/vittnesmal" element={<TestimoniesPage />} />
        <Route path="/karta" element={<MapPage />} />
        <Route path="/tidslinje" element={<TimelinePage />} />
        <Route path="/dokument" element={<DocumentsPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/fragor-och-svar" element={<FaqPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin/login" element={loading ? <div className="loading"><div className="spinner" /></div> : user && isAdmin ? <AdminLogin /> : <AdminLogin />} />
      <Route path="/admin" element={<AdminGuard />}>
        <Route index element={<AdminOverview />} />
        <Route path="amnen" element={<AdminTopics />} />
        <Route path="amnen/ny" element={<AdminTopicEdit />} />
        <Route path="amnen/:id" element={<AdminTopicEdit />} />
        <Route path="nyheter" element={<AdminNews />} />
        <Route path="nyheter/ny" element={<AdminNewsEdit />} />
        <Route path="nyheter/:id" element={<AdminNewsEdit />} />
        <Route path="vittnesmal" element={<AdminTestimonies />} />
        <Route path="dokument" element={<AdminDocuments />} />
        <Route path="dokument/ny" element={<AdminDocumentEdit />} />
        <Route path="dokument/:id" element={<AdminDocumentEdit />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="media/ny" element={<AdminMediaEdit />} />
        <Route path="media/:id" element={<AdminMediaEdit />} />
        <Route path="karta" element={<AdminMap />} />
        <Route path="karta/ny" element={<AdminMapEdit />} />
        <Route path="karta/:id" element={<AdminMapEdit />} />
        <Route path="tidslinje" element={<AdminTimeline />} />
        <Route path="tidslinje/ny" element={<AdminTimelineEdit />} />
        <Route path="tidslinje/:id" element={<AdminTimelineEdit />} />
        <Route path="faq" element={<AdminFaq />} />
        <Route path="kontakter" element={<AdminContacts />} />
        <Route path="meddelanden" element={<AdminMessages />} />
        <Route path="inställningar" element={<AdminSettings />} />
        <Route path="administratörer" element={<AdminAdmins />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
