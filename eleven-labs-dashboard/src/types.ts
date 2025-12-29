export interface Call {
    id: string
    call_id: string
    agent_id: string | null
    status: string
    duration: number
    transcript: string | null
    recording_url: string | null
    love_the_call: boolean
    meeting_requested: boolean
    metadata: any
    created_at: string
}
