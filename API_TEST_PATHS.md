# Mozakra Backend — API Test Paths

## Base URL

http://localhost:5000/api

---

# Variables

BASE_URL=http://localhost:5000/api

ACCESS_TOKEN=YOUR_ACCESS_TOKEN

INSTRUCTOR_ACCESS_TOKEN=YOUR_INSTRUCTOR_ACCESS_TOKEN

STUDENT_ACCESS_TOKEN=YOUR_STUDENT_ACCESS_TOKEN

COURSE_ID=YOUR_COURSE_ID

LESSON_ID=YOUR_LESSON_ID

SESSION_ID=YOUR_SESSION_ID

QUIZ_ID=YOUR_QUIZ_ID

---

# 1. AUTHENTICATION

## Register

POST
{{BASE_URL}}/auth/register

Body:

{
  "name": "Mohamed Test",
  "email": "mohamed.test@example.com",
  "password": "Password123!"
}


## Login

POST
{{BASE_URL}}/auth/login

Body:

{
  "email": "mohamed.test@example.com",
  "password": "Password123!"
}


## Get Current User

GET
{{BASE_URL}}/auth/me

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


## Refresh Token

POST
{{BASE_URL}}/auth/refresh-token


## Logout

POST
{{BASE_URL}}/auth/logout

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


---

# 2. SESSIONS

## Get My Sessions

GET
{{BASE_URL}}/sessions

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


## Revoke Session

DELETE
{{BASE_URL}}/sessions/{{SESSION_ID}}

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


## Revoke All Sessions

DELETE
{{BASE_URL}}/sessions

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


---

# 3. USERS

## Get Profile

GET
{{BASE_URL}}/users/me

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


## Update Profile

PATCH
{{BASE_URL}}/users/me

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}

Body:

{
  "name": "Mohamed Updated"
}


## Change Password

PATCH
{{BASE_URL}}/users/me/password

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}

Body:

{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}


## Delete Account

DELETE
{{BASE_URL}}/users/me

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


---

# 4. COURSES

## Create Course

POST
{{BASE_URL}}/courses

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}

Body:

{
  "title": "Flutter Clean Architecture",
  "description": "Learn Flutter Clean Architecture",
  "thumbnail": "https://example.com/flutter.jpg",
  "price": 100,
  "isPublished": true
}


## Get My Courses

GET
{{BASE_URL}}/courses/my

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}


## Get Course

GET
{{BASE_URL}}/courses/{{COURSE_ID}}

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


## Update Course

PATCH
{{BASE_URL}}/courses/{{COURSE_ID}}

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}

Body:

{
  "title": "Flutter Clean Architecture Updated",
  "description": "Updated description",
  "price": 150
}


## Delete Course

DELETE
{{BASE_URL}}/courses/{{COURSE_ID}}

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}


---

# 5. LESSONS

## Create Lesson

POST
{{BASE_URL}}/courses/{{COURSE_ID}}/lessons

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}

Body:

{
  "title": "Introduction to Clean Architecture",
  "description": "Understanding Clean Architecture",
  "videoUrl": "https://example.com/video1",
  "duration": 600,
  "order": 1
}


## Get Course Lessons

GET
{{BASE_URL}}/courses/{{COURSE_ID}}/lessons

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


## Get Lesson

GET
{{BASE_URL}}/lessons/{{LESSON_ID}}

Headers:

Authorization: Bearer {{ACCESS_TOKEN}}


## Update Lesson

PATCH
{{BASE_URL}}/lessons/{{LESSON_ID}}

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}

Body:

{
  "title": "Introduction to Clean Architecture Updated",
  "duration": 720
}


## Delete Lesson

DELETE
{{BASE_URL}}/lessons/{{LESSON_ID}}

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}


---

# 6. ENROLLMENTS

## Get My Enrollments

GET
{{BASE_URL}}/

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


NOTE:
Current route mounting is:

apiRouter.use('/', enrollmentRouter)

Therefore this route currently resolves to:

GET /api/


Recommended later:

apiRouter.use('/enrollments', enrollmentRouter)

Then it becomes:

GET /api/enrollments


## Enroll In Course

POST
{{BASE_URL}}/courses/{{COURSE_ID}}/enroll

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


## Get Course Enrollment

GET
{{BASE_URL}}/courses/{{COURSE_ID}}/enrollment

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


## Unenroll From Course

DELETE
{{BASE_URL}}/courses/{{COURSE_ID}}/enroll

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


---

# 7. PROGRESS

## Update Lesson Progress

PATCH
{{BASE_URL}}/lessons/{{LESSON_ID}}/progress

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}

Body:

{
  "progress": 50
}


## Get Lesson Progress

GET
{{BASE_URL}}/lessons/{{LESSON_ID}}/progress

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


## Get Course Progress

GET
{{BASE_URL}}/courses/{{COURSE_ID}}/progress

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


---

# 8. QUIZZES

## Create Quiz

POST
{{BASE_URL}}/lessons/{{LESSON_ID}}/quiz

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}

Body:

{
  "title": "Clean Architecture Quiz",
  "description": "Test your understanding",
  "passingScore": 60
}


## Get Quiz By ID

GET
{{BASE_URL}}/quizzes/{{QUIZ_ID}}

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


## Get Quiz By Lesson

GET
{{BASE_URL}}/lessons/{{LESSON_ID}}/quiz

Headers:

Authorization: Bearer {{STUDENT_ACCESS_TOKEN}}


## Update Quiz

PATCH
{{BASE_URL}}/quizzes/{{QUIZ_ID}}

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}

Body:

{
  "title": "Clean Architecture Quiz Updated",
  "passingScore": 70
}


## Delete Quiz

DELETE
{{BASE_URL}}/quizzes/{{QUIZ_ID}}

Headers:

Authorization: Bearer {{INSTRUCTOR_ACCESS_TOKEN}}


---

# COMPLETE TEST FLOW

1. Register Instructor

POST /auth/register

2. Login Instructor

POST /auth/login

Save:

INSTRUCTOR_ACCESS_TOKEN

3. Get Current User

GET /auth/me

4. Create Course

POST /courses

Save:

COURSE_ID

5. Get My Courses

GET /courses/my

6. Create Lesson

POST /courses/:courseId/lessons

Save:

LESSON_ID

7. Get Course Lessons

GET /courses/:courseId/lessons

8. Get Lesson

GET /lessons/:lessonId

9. Register Student

POST /auth/register

10. Login Student

POST /auth/login

Save:

STUDENT_ACCESS_TOKEN

11. Enroll Student

POST /courses/:courseId/enroll

12. Get Enrollment

GET /courses/:courseId/enrollment

13. Update Lesson Progress

PATCH /lessons/:lessonId/progress

14. Get Lesson Progress

GET /lessons/:lessonId/progress

15. Get Course Progress

GET /courses/:courseId/progress

16. Instructor Creates Quiz

POST /lessons/:lessonId/quiz

Save:

QUIZ_ID

17. Get Quiz

GET /quizzes/:quizId

18. Get Quiz By Lesson

GET /lessons/:lessonId/quiz

19. Update Quiz

PATCH /quizzes/:quizId

20. Delete Quiz

DELETE /quizzes/:quizId

---

# AUTHORIZATION HEADER

For protected routes:

Authorization: Bearer YOUR_ACCESS_TOKEN

Example:

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...


# CONTENT TYPE

For requests containing JSON:

Content-Type: application/json