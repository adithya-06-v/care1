import { DoctorCard } from '@/components/dashboard/DoctorCard';

const therapistId = import.meta.env.VITE_BOOKING_THERAPIST_PRIYA;

const MOCK_DOCTORS = [
  {
    name: 'Dr. Priya Sharma',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80',
    qualification: 'M.S. Speech Therapy',
    experience: '8+ years experience',
    specialization: 'Fluency & Stammering',
  },
  {
    name: 'Dr. Rahul Mehta',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80',
    qualification: 'M.S. Speech-Language Pathology',
    experience: '6+ years experience',
    specialization: 'Accent & Intonation',
  },
  {
    name: 'Dr. Anjali Verma',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80',
    qualification: 'M.A. Speech & Hearing',
    experience: '10+ years experience',
    specialization: 'Child Speech & Language',
  },
  {
    name: 'Dr. Arjun Reddy',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format&q=80',
    qualification: 'Ph.D. Communicative Disorders',
    experience: '12+ years experience',
    specialization: 'Pronunciation & Articulation',
  },
  {
    name: 'Dr. Kavita Nair',
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80',
    qualification: 'M.S. Speech & Language Pathology',
    experience: '5+ years experience',
    specialization: 'Voice Therapy & Resonance',
  },
] as const;

export const BookTherapySessionSection = () => {
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
        Connect with licensed speech therapists for personalized guidance alongside your practice.
      </p>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {MOCK_DOCTORS.map((doctor) => (
          <DoctorCard
            key={doctor.name}
            name={doctor.name}
            image={doctor.image}
            qualification={doctor.qualification}
            experience={doctor.experience}
            specialization={doctor.specialization}
            therapistId={therapistId ?? ''}
          />
        ))}
      </div>
    </section>
  );
};
