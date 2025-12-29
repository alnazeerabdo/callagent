import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Call } from './types'
import { CallCard } from './components/CallCard'
import { StatsCard } from './components/StatsCard'
import { Sidebar } from './components/Sidebar'
import { Clock, Phone, CalendarCheck, Heart } from 'lucide-react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

function DashboardContent() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    fetchCalls()

    const subscription = supabase
      .channel('calls')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calls' }, () => {
        fetchCalls()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchCalls() {
    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCalls(data || [])
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: calls.length,
    duration: Math.round(calls.reduce((acc, call) => acc + (call.duration || 0), 0) / calls.length) || 0,
    meetings: calls.filter(c => c.meeting_requested).length,
    positive: calls.filter(c => c.love_the_call).length
  }

  // Filter calls based on current route
  const getFilteredCalls = () => {
    switch (location.pathname) {
      case '/meetings':
        return calls.filter(c => c.meeting_requested)
      case '/leads':
        // "Interested" logic: love_the_call is true OR meeting requested
        return calls.filter(c => c.love_the_call || c.meeting_requested) // Or strict love_the_call? User said "interested but not scheduled" implies a separate bucket, but generally "leads" covers both. Let's do love_the_call logic.
      case '/calls':
        return calls
      default:
        return calls.slice(0, 5) // Recent calls on dashboard
    }
  }

  const filteredCalls = getFilteredCalls()
  const pageTitle = {
    '/': 'لوحة التحكم',
    '/meetings': 'طلبات الاجتماع',
    '/leads': 'المهتمين',
    '/calls': 'سجل المكالمات'
  }[location.pathname] || 'لوحة التحكم'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground dir-rtl font-sans">
      {/* Sidebar */}
      <Sidebar className="w-64 hidden md:block shrink-0" />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">نظرة عامة على أداء الوكيل الصوتي</p>
        </header>

        {/* Stats Grid - Only show on main dashboard */}
        {location.pathname === '/' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="إجمالي المكالمات"
              value={stats.total}
              icon={Phone}
              description="مكالمة تم إجراؤها"
            />
            <StatsCard
              title="متوسط المدة"
              value={`${stats.duration} ثانية`}
              icon={Clock}
              description="لكل مكالمة"
            />
            <StatsCard
              title="طلبات الاجتماع"
              value={stats.meetings}
              icon={CalendarCheck}
              description="اجتماع مجدول"
            />
            <StatsCard
              title="تقييم إيجابي"
              value={stats.positive}
              icon={Heart}
              description="عملاء راضون"
            />
          </div>
        )}

        {/* Call List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {location.pathname === '/' ? 'أحدث المكالمات' : 'قائمة المكالمات'}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredCalls.length} مكالمة
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredCalls.map((call) => (
              <CallCard key={call.id} call={call} />
            ))}
            {filteredCalls.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">
                لا توجد مكالمات لعرضها
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename="/callagent">
      {/* NOTE: basename is critical for GitHub Pages subdirectory deployment */}
      <Routes>
        <Route path="*" element={<DashboardContent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
