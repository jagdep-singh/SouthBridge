# SouthBridge
### Submission by Jagdeep Singh

This project is my implementation of the Southbridge Frontend Take-Home assignment.  
It includes a streaming AI chat interface on the left and a fully interactive file viewer on the right, matching every requirement from the official specification.

---

## What I Built

### **1. Chat Window**
I implemented a full chat interface that supports:

- Token-level streaming for incoming messages  
- Separate visual styling for reasoning, assistant, and user messages  
- A scroll-to-bottom button that appears only when the user scrolls up  
- Automatic stick-to-bottom behaviour when at the bottom  
- Stable scroll position when streaming messages arrive (no layout shifts)  
- A simple way to simulate messages to test streaming behaviour

---

### **2. File Viewer**
The right side includes:

- A sidebar with nested folders and files  
- Clicking a file opens it in the main viewer  
- Optional syntax highlighting  
- No iframes anywhere — everything is embedded  
- State management built using a clean context provider

---

### **3. Layout + Resizing**
The layout is split into three resizable vertical sections:

- Chat  
- Code Viewer  
- File System  

Dragging the separators adjusts widths, with safe minimum widths on each section.

---

## Tech Stack I Used

- Next.js  
- React 19  
- Tailwind CSS 4  
- Lucide Icons  
- Shiki (optional syntax highlighting)  
- Context providers for file-state management

---

## How to Run the Project

```bash
npm install
npm run dev
```

---

## Notes on AI Use
I used AI assistance while working on parts of this project.  
I reviewed and refined all generated code, ensuring correctness and quality.  
All final architecture, structure, and decisions are mine.
Files contain the comment ```//AI used``` where ai was used 



#### And this README is formated using chatgpt 😅
