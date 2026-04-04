export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  languages: string[];
  rating: number;
  reviews: number;
  imageUrl: string;
  about: string;
}

export const doctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Shyam Prasad M.",
    specialization: "Kayachikitsa (General Medicine)",
    experience: "15+ Years",
    languages: ["English", "Hindi", "Kannada"],
    rating: 4.9,
    reviews: 124,
    imageUrl: "https://www.samch.co.in/assets/img/speciality-clinics/kayachikitsa/Dr.SHYAM-PRASAD-M.jpg",
    about: "Expert in holistic healing and treatment of chronic systemic diseases through panchakarma and authentic Ayurvedic formulations."
  },
  {
    id: "doc-2",
    name: "Dr. Ananya Sharma",
    specialization: "Panchakarma Specialist",
    experience: "12 Years",
    languages: ["English", "Hindi"],
    rating: 4.8,
    reviews: 98,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    about: "Specializes in detoxification therapies and rejuvenation treatments to restore the body's natural balance."
  },
  {
    id: "doc-3",
    name: "Dr. Rajesh Kumar",
    specialization: "Shalya Tantra (Surgery)",
    experience: "20 Years",
    languages: ["English", "Hindi", "Marathi"],
    rating: 4.7,
    reviews: 156,
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
    about: "Renowned expert in Ayurvedic surgical procedures including Kshara Sutra therapy for anorectal disorders."
  },
  {
    id: "doc-4",
    name: "Dr. Priya Patel",
    specialization: "Prasuti Tantra (Gynecology)",
    experience: "10 Years",
    languages: ["English", "Gujarati", "Hindi"],
    rating: 4.9,
    reviews: 210,
    imageUrl: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=300&auto=format&fit=crop",
    about: "Dedicated to women's health, offering Ayurvedic solutions for menstrual disorders, PCOD, and prenatal care."
  },
  {
    id: "doc-5",
    name: "Dr. Arvind Desai",
    specialization: "Kaumarbhritya (Pediatrics)",
    experience: "18 Years",
    languages: ["English", "Hindi"],
    rating: 4.6,
    reviews: 85,
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
    about: "Compassionate care for children's holistic development, boosting immunity, and treating childhood disorders naturally."
  },
  {
    id: "doc-6",
    name: "Dr. Kavita Reddy",
    specialization: "Swasthavritta (Preventive Medicine)",
    experience: "8 Years",
    languages: ["English", "Telugu", "Hindi"],
    rating: 4.8,
    reviews: 112,
    imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=300&auto=format&fit=crop",
    about: "Focuses on diet, lifestyle modifications, and yoga to prevent illnesses and maintain optimal well-being."
  },
  {
    id: "doc-7",
    name: "Dr. Vikram Singh",
    specialization: "Rasayana (Rejuvenation Therapy)",
    experience: "22 Years",
    languages: ["English", "Hindi", "Punjabi"],
    rating: 5.0,
    reviews: 305,
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
    about: "Master in anti-aging therapies, vitality enhancement, and boosting overall immunity using rare herbs."
  },
  {
    id: "doc-8",
    name: "Dr. Neha Gupta",
    specialization: "Agada Tantra (Toxicology)",
    experience: "14 Years",
    languages: ["English", "Hindi"],
    rating: 4.7,
    reviews: 74,
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop",
    about: "Specializes in treating skin diseases, allergies, and detoxifying the body from environmental pollutants."
  }
];
