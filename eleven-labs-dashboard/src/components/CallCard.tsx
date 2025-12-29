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
    return (
        <div className="bg-card text-card-foreground rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
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

            <div className="grid grid-cols-2 gap-3 mb-4">
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

            {(call.transcript || call.recording_url) && (
                <div className="space-y-3 pt-2 border-t border-border/50">
                    {call.recording_url && (
                        <audio controls className="w-full h-8 mb-2 opacity-80 hover:opacity-100 transition-opacity">
                            <source src={call.recording_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                    {call.transcript && (
                        <div className="relative">
                            <p className="text-sm text-muted-foreground line-clamp-3 bg-secondary/30 p-3 rounded-lg italic leading-relaxed">
                                "{call.transcript}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
