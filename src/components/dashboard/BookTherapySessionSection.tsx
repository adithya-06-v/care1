import { DoctorCard } from '@/components/dashboard/DoctorCard';

// Each therapist has their own Supabase auth UUID set in .env
const THERAPIST_IDS = {
  priya:  import.meta.env.VITE_BOOKING_THERAPIST_PRIYA  ?? '',
  rahul:  import.meta.env.VITE_BOOKING_THERAPIST_RAHUL  ?? '',
  anjali: import.meta.env.VITE_BOOKING_THERAPIST_ANJALI ?? '',
  arjun:  import.meta.env.VITE_BOOKING_THERAPIST_ARJUN  ?? '',
  kavita: import.meta.env.VITE_BOOKING_THERAPIST_KAVITA ?? '',
};

const MOCK_DOCTORS = [
  {
    name: 'Dr. Priya Sharma',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80',
    qualification: 'M.S. Speech Therapy',
    experience: '8+ years experience',
    specialization: 'Fluency & Stammering',
    tag: 'fluency',
    therapistId: THERAPIST_IDS.priya,
  },
  {
    name: 'Dr. Rahul Mehta',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80',
    qualification: 'M.S. Speech-Language Pathology',
    experience: '6+ years experience',
    specialization: 'Accent & Intonation',
    tag: 'accent',
    therapistId: THERAPIST_IDS.rahul,
  },
  {
    name: 'Dr. Anjali Verma',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80',
    qualification: 'M.A. Speech & Hearing',
    experience: '10+ years experience',
    specialization: 'Child Speech & Language',
    tag: 'child_development',
    therapistId: THERAPIST_IDS.anjali,
  },
  {
    name: 'Dr. Arjun Reddy',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format&q=80',
    qualification: 'Ph.D. Communicative Disorders',
    experience: '12+ years experience',
    specialization: 'Pronunciation & Articulation',
    tag: 'pronunciation',
    therapistId: THERAPIST_IDS.arjun,
  },
  {
    name: 'Dr. Kavita Nair',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80',
    qualification: 'M.S. Speech & Language Pathology',
    experience: '5+ years experience',
    specialization: 'Voice Therapy & Resonance',
    tag: 'vocabulary',
    therapistId: THERAPIST_IDS.kavita,
  },
] as const;

interface BookTherapySessionSectionProps {
  userGoals?: string[];
}

export const BookTherapySessionSection = ({ userGoals = [] }: BookTherapySessionSectionProps) => {
  const filteredDoctors = MOCK_DOCTORS.filter((doctor) => {
    // If no goals selected or no match, show all (or could be strict)
    if (userGoals.length === 0) return true;
    return userGoals.includes(doctor.tag);
  });

  // If after filtering we have nothing (unlikely with defaults), show all as fallback
  const displayDoctors = filteredDoctors.length > 0 ? filteredDoctors : MOCK_DOCTORS;

  return (
    <section
      id="book-therapy-session"
      aria-labelledby="book-therapy-heading"
      className="mt-10 w-full scroll-mt-24 border-t border-border pt-10"
    >
      <h2
        id="book-therapy-heading"
        className="mb-2 text-xl font-semibold text-foreground"
      >
        Book a Therapy Session
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        Connect with licensed speech therapists for personalized guidance based on your selected goals.
      </p>
      <div className="grid w-full min-w-0 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {displayDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.name}
            name={doctor.name}
            image={doctor.image}
            qualification={doctor.qualification}
            experience={doctor.experience}
            specialization={doctor.specialization}
            therapistId={doctor.therapistId}
          />
        ))}
      </div>
    </section>
  );
};
