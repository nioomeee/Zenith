export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  role: 'student' | 'alumni';
  graduationYear: number;
  major: string;
  currentRole: string | null;
  company: string | null;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  interests?: Array<{ id: string; name: string; category: string }>;
  careerPaths?: Array<{ id: string; name: string; level: number }>;
  mentorshipOfferings?: Array<{ id: string; name: string }>;
  mentorshipNeeds?: Array<{ id: string; name: string }>;
  universityGroups?: Array<{
    id: string;
    name: string;
    role: string;
    startYear: number;
    endYear: number | null;
  }>;
}
