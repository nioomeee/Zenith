-- Step 1: Create base tables first
-- Interests
INSERT INTO interests (id, name, category) VALUES
('int_1', 'Artificial Intelligence', 'Technology'),
('int_2', 'Machine Learning', 'Technology'),
('int_3', 'Web Development', 'Technology'),
('int_4', 'Data Science', 'Technology'),
('int_5', 'Entrepreneurship', 'Business'),
('int_6', 'Product Management', 'Business'),
('int_7', 'UX Design', 'Design'),
('int_8', 'Digital Marketing', 'Marketing'),
('int_9', 'Blockchain', 'Technology'),
('int_10', 'Cloud Computing', 'Technology');

-- Career Paths (Hierarchical)
INSERT INTO career_paths (id, name, parent_id, level) VALUES
('cp_1', 'Technology', NULL, 1),
('cp_2', 'Software Engineering', 'cp_1', 2),
('cp_3', 'Data Science', 'cp_1', 2),
('cp_4', 'Frontend Development', 'cp_2', 3),
('cp_5', 'Backend Development', 'cp_2', 3),
('cp_6', 'Machine Learning', 'cp_3', 3),
('cp_7', 'Business', NULL, 1),
('cp_8', 'Product Management', 'cp_7', 2),
('cp_9', 'Marketing', 'cp_7', 2),
('cp_10', 'Growth Marketing', 'cp_9', 3);

-- Mentorship Areas
INSERT INTO mentorship_areas (id, name, description) VALUES
('ma_1', 'Career Guidance', 'General career path advice and planning'),
('ma_2', 'Technical Skills', 'Programming, development, and technical expertise'),
('ma_3', 'Interview Prep', 'Technical and behavioral interview preparation'),
('ma_4', 'Resume Review', 'CV and portfolio review and optimization'),
('ma_5', 'Networking', 'Industry networking and relationship building');

-- University Groups
INSERT INTO university_groups (id, name, description) VALUES
('ug_1', 'Computer Science Society', 'Technical community for CS students'),
('ug_2', 'Entrepreneurship Club', 'Club for aspiring entrepreneurs'),
('ug_3', 'AI Research Group', 'Research group focused on AI/ML'),
('ug_4', 'Design Club', 'Community for UI/UX and graphic designers'),
('ug_5', 'Business Analytics Club', 'Club for business and data analytics');

-- Step 2: Create users
INSERT INTO users (id, email, first_name, last_name, role, graduation_year, major, current_role, company, location) VALUES
('alumni_1', 'john.doe@example.com', 'John', 'Doe', 'alumni', 2020, 'Computer Science', 'Senior Software Engineer', 'Google', 'Ahmedabad'),
('alumni_2', 'jane.smith@example.com', 'Jane', 'Smith', 'alumni', 2019, 'Computer Science', 'Product Manager', 'Microsoft', 'Ahmedabad'),
('alumni_3', 'mike.brown@example.com', 'Mike', 'Brown', 'alumni', 2018, 'Data Science', 'Data Scientist', 'Amazon', 'Mumbai'),
('student_1', 'alice.wong@example.com', 'Alice', 'Wong', 'student', 2024, 'Computer Science', NULL, NULL, 'Ahmedabad'),
('student_2', 'bob.chen@example.com', 'Bob', 'Chen', 'student', 2025, 'Computer Science', NULL, NULL, 'Ahmedabad');

-- Step 3: Create relationships after users exist
-- User Interests
INSERT INTO user_interests (user_id, interest_id) VALUES
('alumni_1', 'int_1'),
('alumni_1', 'int_2'),
('alumni_1', 'int_3'),
('alumni_2', 'int_3'),
('alumni_2', 'int_6'),
('alumni_2', 'int_7'),
('alumni_3', 'int_2'),
('alumni_3', 'int_4'),
('alumni_3', 'int_9'),
('student_1', 'int_1'),
('student_1', 'int_2'),
('student_1', 'int_7'),
('student_2', 'int_3'),
('student_2', 'int_6'),
('student_2', 'int_8');

-- User Career Paths
INSERT INTO user_career_paths (user_id, career_path_id, is_target) VALUES
('alumni_1', 'cp_1', false),
('alumni_1', 'cp_2', false),
('alumni_1', 'cp_4', false),
('alumni_2', 'cp_7', false),
('alumni_2', 'cp_8', false),
('alumni_3', 'cp_1', false),
('alumni_3', 'cp_3', false),
('alumni_3', 'cp_6', false),
('student_1', 'cp_1', true),
('student_1', 'cp_2', true),
('student_1', 'cp_4', true),
('student_2', 'cp_7', true),
('student_2', 'cp_8', true);

-- Mentorship Offerings (Alumni)
INSERT INTO mentorship_offerings (user_id, area_id) VALUES
('alumni_1', 'ma_2'),
('alumni_1', 'ma_3'),
('alumni_1', 'ma_4'),
('alumni_2', 'ma_1'),
('alumni_2', 'ma_4'),
('alumni_2', 'ma_5'),
('alumni_3', 'ma_2'),
('alumni_3', 'ma_3');

-- Mentorship Needs (Students)
INSERT INTO mentorship_needs (user_id, area_id) VALUES
('student_1', 'ma_2'),
('student_1', 'ma_3'),
('student_1', 'ma_4'),
('student_2', 'ma_1'),
('student_2', 'ma_5');

-- University Group Memberships
INSERT INTO user_university_groups (user_id, group_id, role, start_year, end_year) VALUES
('alumni_1', 'ug_1', 'member', 2016, 2020),
('alumni_2', 'ug_2', 'leader', 2015, 2019),
('alumni_3', 'ug_3', 'member', 2014, 2018),
('student_1', 'ug_1', 'member', 2020, NULL),
('student_2', 'ug_2', 'member', 2021, NULL);

-- Companies
INSERT INTO companies (id, name, description, industry, website, logo, size, founded)
VALUES
  ('company_1', 'TechCorp', 'Leading technology solutions provider', 'Technology', 'https://techcorp.com', 'https://example.com/logos/techcorp.png', '51-200', 2010),
  ('company_2', 'FinanceHub', 'Innovative financial services', 'Finance', 'https://financehub.com', 'https://example.com/logos/financehub.png', '201-500', 2005),
  ('company_3', 'HealthTech', 'Healthcare technology solutions', 'Healthcare', 'https://healthtech.com', 'https://example.com/logos/healthtech.png', '11-50', 2015),
  ('company_4', 'EduLearn', 'Educational technology platform', 'Education', 'https://edulearn.com', 'https://example.com/logos/edulearn.png', '1-10', 2020),
  ('company_5', 'GreenEnergy', 'Sustainable energy solutions', 'Energy', 'https://greenenergy.com', 'https://example.com/logos/greenenergy.png', '51-200', 2012);

-- Company Alumni (using existing alumni users)
INSERT INTO company_alumni (company_id, user_id, position, start_date, is_current, show_as_connection)
VALUES
  ('company_1', 'alumni_1', 'Senior Software Engineer', '2020-01-01', true, true),
  ('company_1', 'alumni_2', 'Product Manager', '2019-06-01', true, true),
  ('company_2', 'alumni_3', 'Financial Analyst', '2018-03-01', true, true);
-- Jobs
INSERT INTO jobs (id, title, description, company_id, poster_id, type, location, is_remote, experience_level, salary_min, salary_max, requirements, responsibilities, status, application_deadline)
VALUES
  ('job_1', 'Software Engineer', 'Join our dynamic engineering team', 'company_1', 'alumni_1', 'full-time', 'San Francisco, CA', true, 'entry', 80000, 120000, 
   '["Bachelor''s in CS or related field", "Experience with React and Node.js", "Strong problem-solving skills"]'::jsonb,
   '["Develop and maintain web applications", "Collaborate with cross-functional teams", "Write clean, maintainable code"]'::jsonb,
   'active', '2024-05-01'),
  
  ('job_2', 'Product Manager', 'Lead product development initiatives', 'company_1', 'alumni_2', 'full-time', 'New York, NY', false, 'mid', 100000, 150000,
   '["3+ years of product management experience", "Strong analytical skills", "Excellent communication"]'::jsonb,
   '["Define product strategy", "Work with stakeholders", "Drive product roadmap"]'::jsonb,
   'active', '2024-04-15'),
  
  ('job_3', 'Financial Analyst', 'Join our finance team', 'company_2', 'alumni_3', 'full-time', 'Chicago, IL', false, 'entry', 70000, 90000,
   '["Bachelor''s in Finance or related", "Excel proficiency", "Strong analytical skills"]'::jsonb,
   '["Perform financial analysis", "Prepare reports", "Support decision making"]'::jsonb,
   'active', '2024-04-30');

-- Sample job applications
INSERT INTO job_applications (id, job_id, applicant_id, status, cover_letter, resume, referrer_id)
VALUES
  ('app_1', 'job_1', 'student_1', 'pending', 'I am excited to apply...', 'resume_url_1', 'alumni_1'),
  ('app_2', 'job_2', 'student_2', 'reviewed', 'I would love to join...', 'resume_url_2', 'alumni_2'),
  ('app_3', 'job_3', 'student_2', 'pending', 'I am interested in...', 'resume_url_3', null);

-- Insert events
INSERT INTO events (title, description, date, location, is_virtual, virtual_link, max_attendees, organizer_id, image, category, status)
VALUES
  ('Alumni Networking Night', 'Join us for an evening of networking with successful GLS alumni from various industries. Share experiences, build connections, and explore career opportunities.', '2024-05-15 18:00:00', 'GLS University Main Hall', false, null, 100, 'alumni_1', 'https://images.unsplash.com/photo-1511578314322-379afb476865', 'networking', 'upcoming'),
  ('Tech Career Workshop', 'Learn about the latest trends in technology and how to prepare for a successful career in tech. Special focus on AI and Machine Learning.', '2024-05-20 14:00:00', 'Online', true, 'https://zoom.us/j/123456789', 50, 'alumni_2', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', 'workshop', 'upcoming'),
  ('Entrepreneurship Seminar', 'Discover what it takes to start and grow a successful business. Hear from experienced entrepreneurs and learn about funding opportunities.', '2024-06-01 10:00:00', 'GLS Business School Auditorium', false, null, 75, 'alumni_3', 'https://images.unsplash.com/photo-1552664730-d307ca884978', 'seminar', 'upcoming'),
  ('Resume Building Workshop', 'Get expert tips on crafting a compelling resume that stands out. Includes one-on-one review sessions with industry professionals.', '2024-06-10 15:00:00', 'Online', true, 'https://zoom.us/j/987654321', 30, 'alumni_2', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4', 'workshop', 'upcoming'),
  ('Industry Panel Discussion', 'Leading professionals discuss the future of work and emerging opportunities across different sectors.', '2024-06-15 13:00:00', 'GLS Conference Center', false, null, 150, 'alumni_1', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', 'panel', 'upcoming');
-- Insert event RSVPs
INSERT INTO event_rsvps (event_id, user_id, status)
VALUES
  ('280dc89d-ff1f-43e3-b6c2-06e2e09ff5f2', 'student_1', 'attending'),
  ('604348af-32d4-4a71-9b56-a0f04b2bd754', 'student_2', 'maybe'),
  ('280dc89d-ff1f-43e3-b6c2-06e2e09ff5f2', 'student_1', 'attending'),
  ('604348af-32d4-4a71-9b56-a0f04b2bd754', 'student_3', 'attending'),
  ('280dc89d-ff1f-43e3-b6c2-06e2e09ff5f2', 'student_2', 'attending'),
  ('914ca55d-7fc4-470c-a305-4679a653b90c', 'student_4', 'not_attending'),
  ('9fdc7333-76f4-4e51-a2e5-65f75ea4b5bf', 'student_1', 'maybe'),
  ('914ca55d-7fc4-470c-a305-4679a653b90c', 'student_3', 'attending');