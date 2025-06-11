# FocusFlow UI/UX Principles

## Overarching Goal
To create an app that acts as a compassionate, intuitive, and effective external executive function support system, minimizing cognitive load, promoting self-awareness, and maximizing positive reinforcement for users with ADHD.

## Core Principles

### 1. Clarity & Minimalism (Reduce Cognitive Overload)

**Principle:** Designs should be clean, uncluttered, and utilize ample white space. Information should be presented with a clear visual hierarchy, guiding the user's eye to the most important elements.

**Why for ADHD:** ADHD brains can be easily overwhelmed by visual noise and too much information presented at once, leading to distraction, decision paralysis, or abandonment. Minimalism reduces sensory input and makes it easier to process information.

**Implementation:**
- **Color System**
  - Primary: #2F95DC (Focus blue)
  - Secondary: #34C759 (Success green)
  - Accent: #FF9500 (Reward orange)
  - Background: #FFFFFF (Light) / #000000 (Dark)
  - Text: #000000 (Light) / #FFFFFF (Dark)

- **Typography**
  - Headings: SF Pro Display, 20-24pt
  - Body: SF Pro Text, 16-18pt
  - Labels: SF Pro Text, 14pt
  - Line height: 1.5x for readability

- **Layout**
  - 16px standard padding
  - 8px grid system
  - 24px section spacing
  - Card-based content blocks

**Examples:**
- Today screen uses card-based layout with clear visual hierarchy
- Focus screen maintains minimal interface during sessions
- Settings organized in collapsible sections

### 2. Consistency & Predictability

**Principle:** UI elements, navigation patterns, and interaction behaviors should be consistent throughout the entire app.

**Implementation:**
- **Navigation**
  - Bottom tab bar with 4 main sections
  - Consistent back button placement
  - Standard header height (44pt)
  - Predictable gesture patterns

- **Components**
  - Standard button styles
  - Consistent card designs
  - Uniform input fields
  - Standard modal presentations

**Examples:**
- Routine items use consistent card design
- All modals follow same animation pattern
- Settings use standard toggle switches

### 3. Action-Oriented & Low Friction

**Principle:** Guide users directly to their next action with minimal steps.

**Implementation:**
- **Quick Actions**
  - FAB for primary actions
  - Swipe gestures for common tasks
  - One-tap completions
  - Shortcut buttons

- **Task Flow**
  - Maximum 3 steps to complete task
  - Pre-filled options where possible
  - Smart defaults
  - Progressive disclosure

**Examples:**
- Quick add button for new tasks
- Swipe to complete routine items
- One-tap focus session start

### 4. Visual Reinforcement & Immediate Feedback

**Principle:** Provide immediate, clear feedback for every action.

**Implementation:**
- **Rewards System**
  - Completion animations
  - Progress indicators
  - Achievement badges
  - Streak counters

- **Feedback Mechanisms**
  - Haptic feedback
  - Visual confirmations
  - Progress bars
  - Celebration animations

**Examples:**
- Particle effects on task completion
- Progress rings for focus sessions
- Streak badges for habits

### 5. Non-Judgmental & Flexible

**Principle:** Supportive, empathetic design language.

**Implementation:**
- **Language**
  - Positive reinforcement
  - Encouraging messages
  - Flexible deadlines
  - Progress celebration

- **Features**
  - Snooze options
  - Override capabilities
  - Custom schedules
  - Adaptive reminders

**Examples:**
- "Great job!" instead of "Task completed"
- Flexible routine timing
- Snooze options for reminders

### 6. Sensory Regulation & Customization

**Principle:** Allow users to manage their sensory environment.

**Implementation:**
- **Visual Customization**
  - Light/Dark mode
  - Color themes
  - Animation controls
  - Font size options

- **Audio Customization**
  - Sound effects
  - Background music
  - Notification sounds
  - Focus sounds

**Examples:**
- Customizable notification sounds
- Adjustable animation intensity
- Theme selection

### 7. Chunking & Modularity

**Principle:** Present information in digestible chunks.

**Implementation:**
- **Content Organization**
  - Card-based layout
  - Collapsible sections
  - Progressive disclosure
  - Step-by-step flows

- **Task Management**
  - Subtask breakdown
  - Milestone tracking
  - Progress indicators
  - Visual timelines

**Examples:**
- Routine builder step-by-step flow
- Collapsible habit sections
- Progress tracking cards

## Implementation Guidelines

### Component Library
- Use ThemedView for consistent backgrounds
- ThemedText for typography
- Standard button components
- Reusable card designs

### Animation Standards
- 300ms standard duration
- Ease-in-out timing
- Subtle transitions
- Purposeful motion

### Accessibility
- Minimum touch target size: 44x44pt
- High contrast ratios
- Screen reader support
- Keyboard navigation

### Performance
- Optimize animations
- Lazy load content
- Efficient rendering
- Smooth transitions
