# Database Schema Documentation

This document provides comprehensive information about all database schemas used in the Clarity Cycle Hub application.

## Overview

The application uses MongoDB with Mongoose ODM and includes three main models:
- **Task**: Manages user tasks and their progress
- **PomodoroSession**: Tracks individual pomodoro sessions
- **User**: User accounts and preferences (for future authentication)

## Task Schema

### Purpose
Manages user tasks with pomodoro tracking, priorities, and status management.

### Fields

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `title` | String | ✅ | - | 1-100 chars | Task title |
| `description` | String | ❌ | - | 0-500 chars | Task description |
| `status` | String | ✅ | "todo" | enum | Task status |
| `priority` | String | ✅ | "medium" | enum | Task priority |
| `dueDate` | Date | ❌ | - | Future date | Due date |
| `estimatedPomodoros` | Number | ❌ | 1 | 1-50 | Estimated pomodoros |
| `completedPomodoros` | Number | ❌ | 0 | 0+ | Completed pomodoros |
| `tags` | [String] | ❌ | [] | 0-20 chars each | Task tags |
| `createdAt` | Date | ✅ | Auto | - | Creation timestamp |
| `updatedAt` | Date | ✅ | Auto | - | Update timestamp |

### Enums

**Status:**
- `"todo"` - Task not started
- `"in-progress"` - Task in progress
- `"completed"` - Task completed

**Priority:**
- `"low"` - Low priority
- `"medium"` - Medium priority
- `"high"` - High priority

### Virtual Properties

- `progressPercentage`: Calculated progress based on completed/estimated pomodoros
- `isOverdue`: Boolean indicating if task is past due date
- `isCompleted`: Boolean indicating if task is completed

### Indexes

- `{ status: 1, createdAt: -1 }` - For status-based queries
- `{ priority: 1, dueDate: 1 }` - For priority and due date queries
- `{ tags: 1 }` - For tag-based queries
- `{ completedPomodoros: 1, estimatedPomodoros: 1 }` - For progress queries

### Static Methods

- `findByStatus(status)`: Find tasks by status
- `findOverdue()`: Find overdue tasks

### Instance Methods

- `markComplete()`: Mark task as completed
- `addPomodoro()`: Increment completed pomodoros

### Pre-save Middleware

- Validates completed pomodoros don't exceed estimated
- Auto-completes task when all pomodoros are done

## PomodoroSession Schema

### Purpose
Tracks individual pomodoro sessions with timing, interruptions, and efficiency metrics.

### Fields

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `duration` | Number | ✅ | - | 1-120 min | Session duration (seconds) |
| `taskId` | ObjectId | ❌ | - | - | Reference to Task |
| `completed` | Boolean | ✅ | false | - | Session completion status |
| `startTime` | Date | ✅ | now | - | Session start time |
| `endTime` | Date | ❌ | - | After startTime | Session end time |
| `notes` | String | ❌ | - | 0-1000 chars | Session notes |
| `interruptions` | Number | ❌ | 0 | 0+ | Number of interruptions |
| `breakDuration` | Number | ❌ | 0 | 0-60 min | Break time (seconds) |
| `createdAt` | Date | ✅ | Auto | - | Creation timestamp |
| `updatedAt` | Date | ✅ | Auto | - | Update timestamp |

### Virtual Properties

- `durationMinutes`: Duration in minutes
- `actualDuration`: Actual time spent (including breaks)
- `efficiency`: Efficiency percentage (planned vs actual)
- `status`: Session status ("completed", "interrupted", "active")

### Indexes

- `{ taskId: 1, startTime: -1 }` - For task-based queries
- `{ completed: 1, startTime: -1 }` - For completion queries
- `{ startTime: 1 }` - For time-based queries
- `{ duration: 1, completed: 1 }` - For duration queries

### Static Methods

- `findByTask(taskId)`: Find sessions for a specific task
- `findCompleted()`: Find all completed sessions
- `findToday()`: Find today's sessions

### Instance Methods

- `completeSession(notes?)`: Mark session as completed
- `interruptSession()`: Mark session as interrupted
- `addBreakTime(minutes)`: Add break time to session

### Pre-save Middleware

- Auto-sets end time when completed
- Validates break duration doesn't exceed session duration

## User Schema

### Purpose
Manages user accounts, preferences, and statistics (for future authentication).

### Fields

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `username` | String | ✅ | - | 3-30 chars, alphanumeric | Unique username |
| `email` | String | ✅ | - | Valid email | Unique email |
| `password` | String | ✅ | - | 8+ chars | Hashed password |
| `firstName` | String | ❌ | - | 0-50 chars | First name |
| `lastName` | String | ❌ | - | 0-50 chars | Last name |
| `avatar` | String | ❌ | - | - | Avatar URL |
| `preferences` | Object | ✅ | Defaults | - | User preferences |
| `stats` | Object | ✅ | Defaults | - | User statistics |
| `isActive` | Boolean | ✅ | true | - | Account status |
| `lastLoginAt` | Date | ❌ | - | - | Last login time |
| `createdAt` | Date | ✅ | Auto | - | Account creation |
| `updatedAt` | Date | ✅ | Auto | - | Last update |

### Preferences Object

```javascript
{
  defaultPomodoroDuration: 25,    // minutes
  defaultBreakDuration: 5,        // minutes
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationsEnabled: true,
  theme: "system"                 // "light" | "dark" | "system"
}
```

### Stats Object

```javascript
{
  totalPomodoros: 0,
  totalTasks: 0,
  totalCompletedTasks: 0,
  totalFocusTime: 0,              // minutes
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null
}
```

### Virtual Properties

- `fullName`: Combined first and last name
- `completionRate`: Task completion percentage
- `averageFocusTime`: Average focus time per pomodoro

### Indexes

- `{ email: 1 }` - For email lookups
- `{ username: 1 }` - For username lookups
- `{ "stats.lastActiveDate": -1 }` - For activity queries
- `{ "stats.currentStreak": -1 }` - For streak queries

### Static Methods

- `findByEmail(email)`: Find user by email
- `findByUsername(username)`: Find user by username
- `findActiveUsers()`: Find all active users

### Instance Methods

- `updateStats()`: Update last active date
- `incrementStreak()`: Increment current streak
- `resetStreak()`: Reset current streak

### Pre-save Middleware

- Validates completed tasks don't exceed total tasks
- Updates longest streak if current streak is longer

## Relationships

### Task ↔ PomodoroSession
- **One-to-Many**: One task can have multiple pomodoro sessions
- **Reference**: `PomodoroSession.taskId` references `Task._id`
- **Population**: Sessions can be populated with task details

### User ↔ Task (Future)
- **One-to-Many**: One user can have multiple tasks
- **Reference**: `Task.userId` will reference `User._id`

### User ↔ PomodoroSession (Future)
- **One-to-Many**: One user can have multiple sessions
- **Reference**: `PomodoroSession.userId` will reference `User._id`

## Data Validation

### Built-in Validators
- **Required fields**: Ensured by Mongoose schema
- **String length**: Min/max length validation
- **Number ranges**: Min/max value validation
- **Enums**: Restricted to specific values
- **Regex patterns**: Email, username format validation

### Custom Validators
- **Due date**: Cannot be in the past
- **End time**: Cannot be before start time
- **Break duration**: Cannot exceed session duration
- **Completed pomodoros**: Cannot exceed estimated

### Pre-save Hooks
- **Auto-completion**: Tasks auto-complete when all pomodoros done
- **Streak management**: Longest streak updated automatically
- **Stats validation**: Ensures logical consistency

## Performance Considerations

### Indexes
- Strategic indexes on frequently queried fields
- Compound indexes for common query patterns
- Text indexes for search functionality (future)

### Virtual Properties
- Calculated fields for common computations
- Reduces need for additional queries
- Improves application performance

### Population
- Efficient loading of related data
- Reduces number of database queries
- Improves API response times

## Future Enhancements

### Planned Features
- **Search functionality**: Full-text search on tasks
- **Analytics**: Advanced user statistics
- **Collaboration**: Shared tasks and teams
- **Notifications**: Real-time updates
- **Backup**: Automated data backup

### Schema Extensions
- **Task templates**: Reusable task structures
- **Time tracking**: Detailed time logging
- **Goal setting**: Long-term objectives
- **Achievements**: Gamification elements

## Migration Strategy

### Version Control
- Schema changes tracked in version control
- Migration scripts for data updates
- Backward compatibility maintained

### Data Integrity
- Validation at application and database level
- Consistent data across all collections
- Error handling for invalid data

## Security Considerations

### Data Protection
- Password hashing (future implementation)
- Input sanitization
- Output encoding

### Access Control
- User-based data isolation (future)
- Role-based permissions (future)
- API rate limiting (future) 