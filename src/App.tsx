import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PlatformsGrid } from './components/PlatformsGrid';
import { FreeDownloads } from './components/FreeDownloads';
import { CoursesSection } from './components/CoursesSection';
import { PhilosophySection } from './components/PhilosophySection';
import { FeedbackAndRequestForm } from './components/FeedbackAndRequestForm';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { BoostyModal } from './components/BoostyModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AdminContentModal } from './components/AdminContentModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { VideoModal } from './components/VideoModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { ResourceItem, CourseTrack } from './types';
import { getStoredCourses } from './services/contentManager';
import { isAdminLoggedIn, logoutAdmin, subscribeToAdminAuth } from './services/adminAuth';

export default function App() {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseTrack | null>(null);
  const [isBoostyOpen, setIsBoostyOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Admin state & modals
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminLoggedIn());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminDefaultTab, setAdminDefaultTab] = useState<'sheet' | 'plugins' | 'courses' | 'waitlist'>('sheet');
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  });

  // Subscribe to auth state updates
  useEffect(() => {
    const unsub = subscribeToAdminAuth((loggedIn) => {
      setIsAdmin(loggedIn);
    });
    return unsub;
  }, []);

  // Deep linking to courses (#course=...) and admin (#admin) via URL hash
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#course=')) {
        const courseId = hash.replace('#course=', '');
        const courses = getStoredCourses();
        const target = courses.find((c) => c.id === courseId);
        if (target) {
          setSelectedCourse(target);
        }
      } else if (hash === '#admin' || hash === '#login') {
        if (isAdminLoggedIn()) {
          setIsAdminOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const handleOpenAdmin = (tab: 'sheet' | 'plugins' | 'courses' | 'waitlist' = 'sheet') => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    setAdminDefaultTab(tab);
    setIsAdminOpen(true);
  };

  const handleOpenVideo = (url: string, title: string) => {
    setVideoModal({
      isOpen: true,
      url,
      title
    });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top author notification bar (ONLY visible when admin is logged in) */}
      {isAdmin && (
        <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs border-b border-amber-500/40 sticky top-0 z-50 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono font-bold text-amber-300">РЕЖИМ АВТОРА САЙТА АКТИВЕН</span>
            <span className="text-slate-400 hidden md:inline">• Вам видны кнопки управления и настройки</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenAdmin('sheet')}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Панель управления
            </button>
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                setIsAdminOpen(false);
              }}
              className="text-slate-400 hover:text-rose-400 transition-colors underline cursor-pointer text-xs"
            >
              Выйти
            </button>
          </div>
        </div>
      )}

      {/* Sticky Header with navigation & CTA */}
      <Header
        onOpenBoostyModal={() => setIsBoostyOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      <main className="flex-1">
        {/* Block 1: Hero Section (Light, Personal & Engineering) */}
        <Hero
          onScrollToSection={handleScrollToSection}
          onOpenBoostyModal={() => setIsBoostyOpen(true)}
          onSelectResource={setSelectedResource}
          onOpenAdminModal={isAdmin ? handleOpenAdmin : undefined}
          onOpenVideoModal={handleOpenVideo}
          isAdmin={isAdmin}
        />

        {/* Block 2: Platforms & Social Channels (Rutube, VK, TenChat, Dzen, MAX, Boosty) */}
        <PlatformsGrid onOpenBoostyModal={() => setIsBoostyOpen(true)} />

        {/* Block 3: Free Downloadable Plugins & Scripts Catalog */}
        <FreeDownloads
          onSelectResource={setSelectedResource}
          onOpenAdminModal={isAdmin ? handleOpenAdmin : undefined}
          isAdmin={isAdmin}
        />

        {/* Block 4: Courses & Learning Tracks (Revit, AutoCAD, Archicad, Twinmotion) */}
        <CoursesSection
          onOpenBoostyModal={() => setIsBoostyOpen(true)}
          onOpenVideoModal={handleOpenVideo}
          onOpenAdminModal={isAdmin ? handleOpenAdmin : undefined}
          onOpenCourseDetail={(course) => setSelectedCourse(course)}
          isAdmin={isAdmin}
        />

        {/* Block 5: "Why Free?" & Community Principles */}
        <PhilosophySection />

        {/* Block 6: Feedback & Suggest a Plugin Form */}
        <FeedbackAndRequestForm />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenBoostyModal={() => setIsBoostyOpen(true)}
        onScrollToSection={handleScrollToSection}
        onOpenAdminModal={isAdmin ? handleOpenAdmin : undefined}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={logoutAdmin}
        isAdmin={isAdmin}
      />

      {/* Interactive Modals */}
      <DownloadModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      <BoostyModal
        isOpen={isBoostyOpen}
        onClose={() => setIsBoostyOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Admin Content Management & Google Sheets Sync */}
      <AdminContentModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        defaultTab={adminDefaultTab}
      />

      {/* Admin Login Modal (password: 2026) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdmin(true);
          setIsAdminOpen(true);
        }}
      />

      {/* Dedicated Detailed Course Page Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onSelectCourse={(course) => setSelectedCourse(course)}
        allCourses={getStoredCourses()}
        onOpenVideoModal={handleOpenVideo}
      />

      {/* Video Presentation Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        videoUrl={videoModal.url}
        title={videoModal.title}
        onClose={() => setVideoModal({ isOpen: false, url: '', title: '' })}
      />
    </div>
  );
}
