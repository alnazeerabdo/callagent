import { useState } from 'react'
import type { Call } from '../types'
import { Phone, Clock, Heart, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface CallCardProps {
    call: Call
}

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function CallCard({ call }: CallCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="bg-card text-card-foreground rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">مكالمة واردة</h3>
                            <p className="text-xs text-muted-foreground font-medium">
                                {format(new Date(call.created_at), 'PPP p', { locale: ar })}
                            </p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${call.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {call.status === 'completed' ? 'مكتملة' : call.status}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 flex-1 content-start">
                    <div className="bg-secondary/50 p-2.5 rounded-lg flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <span className="text-sm font-medium">{formatDuration(call.duration)}</span>
                    </div>
                    {call.love_the_call && (
                        <div className="bg-pink-500/10 text-pink-500 p-2.5 rounded-lg flex items-center gap-2 font-bold justify-center">
                            <Heart size={16} fill="currentColor" />
                            حب المكالمة
                        </div>
                    )}
                    {call.meeting_requested && (
                        <div className="bg-blue-500/10 text-blue-500 p-2.5 rounded-lg flex items-center gap-2 font-bold justify-center col-span-2">
                            <Calendar size={16} />
                            طلب اجتماع
                        </div>
                    )}
                </div>

                <div className="pt-4 mt-auto border-t border-border/50">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-full py-2 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-lg transition-colors text-sm font-bold flex items-center justify-center gap-2"
                    >
                        عرض التفاصيل
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-lg rounded-xl border shadow-lg p-6 relative animate-in zoom-in-95 duration-200 text-right" dir="rtl">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute left-4 top-4 text-muted-foreground hover:text-foreground p-1"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">تفاصيل المكالمة</h2>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 rounded-lg bg-secondary/50">
                                    <span className="block text-muted-foreground mb-1">المدة</span>
                                    <span className="font-bold">{formatDuration(call.duration)}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/50">
                                    <span className="block text-muted-foreground mb-1">الحالة</span>
                                    <span className="font-bold">{call.status}</span>
                                </div>
                            </div>

                            {call.recording_url && (
                                <div>
                                    <h3 className="font-semibold mb-2 text-sm">التسجيل الصوتي</h3>
                                    <audio controls className="w-full rounded-lg border bg-secondary/20">
                                        <source src={call.recording_url} type="audio/mpeg" />
                                    </audio>
                                </div>
                            )}

                            {call.transcript && (
                                <div>
                                    <h3 className="font-semibold mb-2 text-sm">نص المكالمة</h3>
                                    <div className="bg-secondary/20 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                                        {call.transcript}
                                    </div>
                                </div>
                            )}

                            {call.metadata && (
                                <details className="text-xs text-muted-foreground cursor-pointer">
                                    <summary>بيانات تقنية (Metadata)</summary>
                                    <pre className="mt-2 p-2 bg-secondary/30 rounded overflow-x-auto text-[10px]" dir="ltr">
                                        {JSON.stringify(call.metadata, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
