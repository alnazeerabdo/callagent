import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Call } from './types'
import { CallCard } from './components/CallCard'
import { StatsCard } from './components/StatsCard'
import { BarChart3, Clock, Phone, CalendarCheck, Heart } from 'lucide-react'

function App() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalls()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
        },
        (payload) => {
          setCalls((current) => [payload.new as Call, ...current])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchCalls() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        setCalls(data as Call[])
      }
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalCalls = calls.length
  const totalDuration = calls.reduce((acc, call) => acc + (call.duration || 0), 0)
  const averageDuration = totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0
  const meetingRequests = calls.filter(c => c.meeting_requested).length
  const positiveFeedback = calls.filter(c => c.love_the_call).length

  return (
    <div className="min-h-screen bg-background text-foreground font-sans" dir="rtl">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <BarChart3 size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-l from-primary to-purple-400 bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
          </div>
          <div className="text-sm text-muted-foreground font-medium bg-secondary px-3 py-1.5 rounded-full">
            ElevenLabs Agent
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي المكالمات"
            value={totalCalls}
            icon={Phone}
            color="text-primary bg-primary/10"
          />
          <StatsCard
            title="متوسط المدة (ثانية)"
            value={averageDuration}
            icon={Clock}
            color="text-blue-500 bg-blue-500/10"
          />
          <StatsCard
            title="طلبات الاجتماع"
            value={meetingRequests}
            icon={CalendarCheck}
            color="text-green-500 bg-green-500/10"
          />
          <StatsCard
            title="تقييم إيجابي"
            value={positiveFeedback}
            icon={Heart}
            color="text-pink-500 bg-pink-500/10"
          />
        </div>

        {/* Recent Calls */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            أحدث المكالمات
          </h2>

          {loading ? (
            <div className="grid place-items-center py-20 text-muted-foreground animate-pulse">
              جاري التحميل...
            </div>
          ) : calls.length === 0 ? (
            <div className="text-center py-20 border rounded-xl bg-secondary/20">
              <p className="text-lg text-muted-foreground">لا توجد مكالمات مسجلة حتى الآن</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calls.map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

export default App
