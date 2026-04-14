export interface UserContext {
  time: string;
  dayOfWeek: string;
  activeProject: string;
  recentTasks: Array<{ id: string; title: string; status: 'completed' | 'pending' }>;
  batteryLevel?: number; // Optional hardware context 
}

export const gatherUserContext = (): UserContext => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // In a real app, this might pull from Google Calendar, Google Drive, or Chrome APIs.
  // For the challenge, we simulate this dynamic context engine.
  return {
    time: now.toLocaleTimeString(),
    dayOfWeek: days[now.getDay()],
    activeProject: "Prompt Wars Challenge",
    recentTasks: [
      { id: '1', title: 'Initialize Vite App', status: 'completed' },
      { id: '2', title: 'Build Assistant UI', status: 'pending' },
      { id: '3', title: 'Connect to Google Services', status: 'pending' }
    ]
  };
};
