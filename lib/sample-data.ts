export interface SampleActivity {
  id: string
  slug: string
  name: string
  description: string
  category: string
  staff_members: string
  year_groups: string
  selection_method: string
  learning_objectives?: string
  meeting_location?: string
  contact_email?: string
  image_url?: string
  logo_url?: string
  core_committee_signup_url?: string
  is_active: boolean
}

export interface SampleEvent {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  image_url: string
  is_featured: boolean
  activities?: {
    name: string
    category: string
  }
  organizer: string
  organizer_contact?: string
  capacity: number
  rsvp_count: number
  status: "upcoming" | "past"
  agenda?: {
    time: string
    activity: string
  }[]
  requirements?: string[]
  attendees?: {
    name: string
    role: string
    avatar?: string
  }[]
  gallery?: string[]
}

export interface SampleAnnouncement {
  id: string
  title: string
  content: string
  priority: "low" | "normal" | "high" | "urgent"
  created_at: string
  activities?: {
    name: string
  }
}

export interface SampleCommittee {
  id: string
  name: string
  description: string
  focus: string
  openPositions: number
  applicationWindow: string
  meetingCadence: string
  highlights: string[]
}

export interface SampleResourceCategory {
  id: string
  title: string
  summary: string
  icon: string
  items: {
    name: string
    description: string
    link: string
  }[]
}

export interface SampleFaq {
  id: string
  category: string
  question: string
  answer: string
}

export interface SampleTestimonial {
  id: string
  name: string
  role: string
  quote: string
}

export const sampleActivities: SampleActivity[] = [
  {
    id: "basketball-club",
    slug: "basketball-club",
    name: "Basketball Club",
    description:
      "Develop your skills on and off the court with competitive play, skills clinics, and leadership opportunities.",
    category: "Sports",
    staff_members: "Mr. Johnson, Coach Rivera",
    year_groups: "7, 8, 9, 10, 11, 12, 13",
    selection_method: "Open tryouts held each August",
    learning_objectives:
      "Team collaboration, strategic thinking, physical fitness, and sportsmanship through regular competition.",
    meeting_location: "Sports Complex Court 2",
    contact_email: "basketball@school.edu",
    image_url: "/placeholder.jpg",
    logo_url: "/placeholder-logo.png",
    core_committee_signup_url: "https://example.com/basketball-committee",
    is_active: true,
  },
  {
    id: "drama-club",
    slug: "drama-club",
    name: "Drama & Theatre Society",
    description:
      "Produce inspiring performances, explore directing and stagecraft, and build confidence through creative expression.",
    category: "Arts",
    staff_members: "Ms. Chen",
    year_groups: "7, 8, 9, 10, 11, 12, 13",
    selection_method: "Open auditions per production",
    learning_objectives:
      "Communication, creativity, stage production skills, and collaborative leadership across productions.",
    meeting_location: "Auditorium",
    contact_email: "drama@school.edu",
    image_url: "/placeholder.jpg",
    logo_url: "/placeholder-logo.png",
    core_committee_signup_url: "https://example.com/drama-core",
    is_active: true,
  },
  {
    id: "robotics-club",
    slug: "robotics-club",
    name: "Robotics & Engineering",
    description:
      "Design, build, and program robots for national competitions while strengthening STEM expertise.",
    category: "STEM",
    staff_members: "Mr. Patel, Ms. Ruiz",
    year_groups: "8, 9, 10, 11, 12",
    selection_method: "Application with portfolio",
    learning_objectives:
      "Engineering design, programming fundamentals, teamwork, and problem solving in real-world contexts.",
    meeting_location: "Innovation Lab 3",
    contact_email: "robotics@school.edu",
    image_url: "/placeholder.jpg",
    logo_url: "/placeholder-logo.png",
    core_committee_signup_url: "https://example.com/robotics-leads",
    is_active: true,
  },
  {
    id: "music-ensemble",
    slug: "music-ensemble",
    name: "Symphonic Music Ensemble",
    description:
      "Perform contemporary and classical repertoires, collaborate with visiting artists, and host community concerts.",
    category: "Music",
    staff_members: "Mr. Lewis, Ms. Hart",
    year_groups: "7, 8, 9, 10, 11, 12, 13",
    selection_method: "Instrumental audition and placement interview",
    learning_objectives:
      "Musicianship, ensemble communication, performance readiness, and creative leadership in music.",
    meeting_location: "Performing Arts Studio",
    contact_email: "music@school.edu",
    image_url: "/placeholder.jpg",
    logo_url: "/placeholder-logo.png",
    core_committee_signup_url: "https://example.com/music-ensemble-committee",
    is_active: true,
  },
]

export const sampleEvents: SampleEvent[] = [
  {
    id: "science-fair-2024",
    title: "Science Fair 2024",
    description:
      "Our annual celebration of curiosity where students present sustainability-focused scientific innovations and prototypes.",
    event_date: "2024-03-15",
    event_time: "9:00 AM - 4:00 PM",
    location: "Main Hall",
    image_url: "/placeholder.jpg",
    is_featured: true,
    activities: { name: "Science Society", category: "Academic" },
    organizer: "Science Department",
    organizer_contact: "science@school.edu",
    capacity: 200,
    rsvp_count: 145,
    status: "upcoming",
    agenda: [
      { time: "9:00 AM", activity: "Registration and setup" },
      { time: "10:00 AM", activity: "Project presentations open" },
      { time: "12:00 PM", activity: "Lunch and networking" },
      { time: "1:00 PM", activity: "Judging period" },
      { time: "3:00 PM", activity: "Awards ceremony" },
    ],
    requirements: [
      "Projects must be registered by March 10",
      "Display boards should fit within allocated tables",
      "Students must wear school lanyards at all times",
    ],
    attendees: [
      { name: "Sarah Chen", role: "Participant" },
      { name: "Marcus Johnson", role: "Judge" },
      { name: "Emma Rodriguez", role: "Volunteer" },
    ],
    gallery: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
  },
  {
    id: "basketball-finals",
    title: "Inter-House Basketball Finals",
    description:
      "Cheer on the top teams as they compete for the championship in a high-energy finals showcase.",
    event_date: "2024-03-20",
    event_time: "3:00 PM - 5:00 PM",
    location: "Sports Complex",
    image_url: "/placeholder.jpg",
    is_featured: false,
    activities: { name: "Basketball Club", category: "Sports" },
    organizer: "Athletics Department",
    capacity: 300,
    rsvp_count: 287,
    status: "upcoming",
    requirements: [
      "Spectators must remain in designated seating",
      "Athletes check in 45 minutes before tip-off",
      "House colors encouraged for the spirit contest",
    ],
  },
  {
    id: "spring-drama-showcase",
    title: "Spring Drama Showcase",
    description:
      "An original production featuring student playwrights, performers, and stage managers from the Drama Society.",
    event_date: "2024-03-25",
    event_time: "7:00 PM - 9:00 PM",
    location: "Auditorium",
    image_url: "/placeholder.jpg",
    is_featured: false,
    activities: { name: "Drama & Theatre Society", category: "Arts" },
    organizer: "Drama & Theatre Society",
    organizer_contact: "drama@school.edu",
    capacity: 150,
    rsvp_count: 98,
    status: "upcoming",
    agenda: [
      { time: "6:15 PM", activity: "Lobby opens with student art display" },
      { time: "7:00 PM", activity: "Curtain up" },
      { time: "8:30 PM", activity: "Talkback with cast and crew" },
    ],
    requirements: [
      "Doors close at 7:05 PM for the opening scene",
      "Photography is limited to intermission",
    ],
  },
]

export const sampleAnnouncements: SampleAnnouncement[] = [
  {
    id: "announcement-1",
    title: "Welcome to Eventure",
    content: "Explore upcoming events and CCAs from a single dashboard designed for our school community.",
    priority: "normal",
    created_at: new Date().toISOString(),
    activities: { name: "Student Life" },
  },
  {
    id: "announcement-2",
    title: "CCA Leadership Applications Open",
    content: "Interested in leading a core committee? Submit your application by April 10 to be considered.",
    priority: "high",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    activities: { name: "CCA Council" },
  },
  {
    id: "announcement-3",
    title: "New Creative Studios",
    content: "Our refurbished studios now include soundproof practice rooms, collaborative editing bays, and 3D printers.",
    priority: "low",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    activities: { name: "Facilities" },
  },
]

export const sampleCommittees: SampleCommittee[] = [
  {
    id: "student-council",
    name: "Student Council",
    description:
      "Lead student representation, coordinate campus-wide initiatives, and partner with administration on policy improvements.",
    focus: "Leadership",
    openPositions: 2,
    applicationWindow: "Applications close 15 April",
    meetingCadence: "Weekly on Mondays after school",
    highlights: [
      "Hosts termly town halls",
      "Manages the student leadership summit",
      "Allocates activity grants to student-led projects",
    ],
  },
  {
    id: "environmental-committee",
    name: "Environmental Sustainability Committee",
    description:
      "Drive sustainability projects, oversee recycling campaigns, and coordinate community clean-up partnerships.",
    focus: "Service",
    openPositions: 4,
    applicationWindow: "Interviews held 12-14 April",
    meetingCadence: "Bi-weekly on Thursdays",
    highlights: [
      "Launched the campus green roof initiative",
      "Leads Earth Week programming",
      "Partners with local NGOs for river restoration",
    ],
  },
  {
    id: "technology-committee",
    name: "Technology & Innovation Committee",
    description:
      "Support digital transformation across the school, host coding nights, and mentor student app development teams.",
    focus: "Technology",
    openPositions: 3,
    applicationWindow: "Rolling applications open through April",
    meetingCadence: "Weekly on Wednesdays",
    highlights: [
      "Maintains the Eventure platform roadmap",
      "Hosts hackathons and design sprints",
      "Runs device onboarding clinics",
    ],
  },
]

export const sampleResources: SampleResourceCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    summary: "New to Eventure? These guides will help you make the most of the platform.",
    icon: "Rocket",
    items: [
      {
        name: "Eventure Orientation",
        description: "Step-by-step tour of the dashboard, notifications, and personal planner tools.",
        link: "https://example.com/orientation",
      },
      {
        name: "CCA Interest Guide",
        description: "Compare activities by category, commitment level, and leadership opportunities.",
        link: "https://example.com/cca-guide",
      },
    ],
  },
  {
    id: "leaders",
    title: "For CCA Leaders",
    summary: "Resources to help committees run smoothly and grow membership.",
    icon: "Star",
    items: [
      {
        name: "Event Planning Toolkit",
        description: "Templates for proposals, budgets, promotional plans, and risk assessments.",
        link: "https://example.com/event-toolkit",
      },
      {
        name: "Leadership Handbook",
        description: "Best practices for mentoring members, managing meetings, and tracking impact.",
        link: "https://example.com/leadership-handbook",
      },
    ],
  },
  {
    id: "support",
    title: "Help & Support",
    summary: "Need assistance? Explore help center articles and contact options.",
    icon: "LifeBuoy",
    items: [
      {
        name: "Help Center",
        description: "Browse frequently asked questions and troubleshooting guides for Eventure.",
        link: "https://example.com/help-center",
      },
      {
        name: "Contact Student Life",
        description: "Reach the Student Life office for personalized support and feedback.",
        link: "mailto:studentlife@school.edu",
      },
    ],
  },
]

export const sampleFaqs: SampleFaq[] = [
  {
    id: "faq-1",
    category: "General",
    question: "How do I join a CCA?",
    answer:
      "Visit the CCA directory, open the activity page you are interested in, and use the Join button to submit your registration or interest form.",
  },
  {
    id: "faq-2",
    category: "Events",
    question: "Where can I find my RSVPs?",
    answer:
      "All of your RSVP confirmations and upcoming events appear in your Eventure planner and will be emailed to your school address.",
  },
  {
    id: "faq-3",
    category: "Leadership",
    question: "Can I apply for more than one committee?",
    answer:
      "Yes. Submit an application for each committee you are interested in. Interviews are scheduled to avoid timing conflicts.",
  },
  {
    id: "faq-4",
    category: "Support",
    question: "Who do I contact for technical issues?",
    answer:
      "Reach out to the Student Life technology help desk at studentlife@school.edu or visit the Resources page for quick-start guides.",
  },
]

export const sampleTestimonials: SampleTestimonial[] = [
  {
    id: "testimonial-1",
    name: "Maya Thompson",
    role: "Student Council President",
    quote:
      "Eventure helped us coordinate volunteers across multiple CCAs and increased attendance at our service events by 40%.",
  },
  {
    id: "testimonial-2",
    name: "Mr. Lewis",
    role: "Director of Student Life",
    quote:
      "With Eventure we finally have a single hub for communicating opportunities to every student and family.",
  },
  {
    id: "testimonial-3",
    name: "Sasha Patel",
    role: "Robotics Captain",
    quote:
      "Managing sign-ups and communicating build schedules is effortless now that Eventure handles our messaging.",
  },
]

export const sampleNews = [
  {
    id: "news-1",
    title: "Eventure 2.0 Launch",
    summary: "A refreshed experience with personalized dashboards and real-time notifications.",
    published_at: "2024-02-20",
  },
  {
    id: "news-2",
    title: "Student Life Awards Announced",
    summary: "Celebrating exemplary leadership from CCAs and service committees.",
    published_at: "2024-01-30",
  },
]
