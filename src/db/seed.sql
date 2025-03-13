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