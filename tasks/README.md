# 📝 Daily Tasks Notes

A free, lightweight, browser-based task management app that stores your tasks locally. No server needed, no subscriptions, completely private.

## ✨ Features

- ✅ **Add, edit, and delete tasks** - Quick and easy task management
- 🏷️ **Categories** - Organize by Personal, Work, Health, Shopping, or Other
- 🔥 **Priority Levels** - Mark tasks as High, Medium, or Low priority
- 📅 **Due Dates** - Set deadlines and track them
- ✓ **Mark Complete** - Check off finished tasks
- 🔍 **Smart Filters** - Filter by status or category
- 📊 **Statistics** - See your total, completed, and pending tasks at a glance
- 💾 **Local Storage** - All data stored in your browser (private & secure)
- 📥 **Export/Import** - Backup your tasks as JSON
- 📱 **Responsive Design** - Works on Mac, iPad, and iPhone
- ⚡ **Offline Ready** - Works even without internet connection

## 🚀 Quick Start on Mac

### Option 1: Use Online (Easiest)
1. Open Safari, Chrome, or Firefox on your Mac
2. Go to: `https://abhishekreddy04111996.github.io/demo/tasks/`
3. Start adding tasks immediately!
4. Bookmark it for quick access

### Option 2: Run Locally on Mac

#### Method A: Using Terminal (Recommended)
```bash
# 1. Clone the repository
git clone https://github.com/abhishekreddy04111996/demo.git
cd demo

# 2. Navigate to the tasks folder
cd tasks

# 3. Start a simple server (Python 3)
python3 -m http.server 8000

# 4. Open in your browser
# Click: http://localhost:8000

# 5. Stop the server anytime
# Press: Control + C
```

#### Method B: Using Finder (No Terminal)
1. Clone or download the repo from GitHub
2. Open **Finder**
3. Navigate to the `tasks` folder
4. Right-click on `index.html`
5. Select **Open With** → **Safari** (or your browser)
6. Done!

#### Method C: Using Python (If git not installed)
1. Download ZIP from GitHub
2. Unzip the folder
3. Open **Terminal** (⌘ + Space, type "Terminal")
4. Drag the `tasks` folder into Terminal
5. Type: `python3 -m http.server 8000`
6. Open: `http://localhost:8000` in Safari

## 📖 How to Use

### Adding a Task
1. Type your task in the input field at the top
2. Select a category from the dropdown (Personal, Work, Health, Shopping, Other)
3. Choose a priority level (Low, Medium, High)
4. Pick a due date (optional)
5. Press **Enter** or click **➕ Add Task**

### Managing Tasks
- **Mark Complete**: Click the checkbox ✓ next to a task
- **Delete**: Click the 🗑️ button
- **Filter**: Use filter buttons to view All, Active, Completed, or by Category

### Backing Up Your Tasks
- **Export**: Click **📥 Export as JSON** to download your tasks as a file
- **Import**: Click **📤 Import JSON** to restore tasks from a backup

### Clearing Tasks
- **Clear Completed**: Click **🗑️ Clear Completed** to remove all finished tasks

## 💾 Data Storage

Your tasks are stored in **Safari/Browser's Local Storage** which means:
- ✅ Completely private (no server sees your data)
- ✅ Persists between browser sessions
- ✅ Works offline
- ⚠️ **Important**: Clearing Safari history/cache will delete tasks (always export backups!)

### How to Backup Your Tasks
1. Click **📥 Export as JSON**
2. A file named `tasks-YYYY-MM-DD.json` downloads
3. Store this file safely (iCloud Drive, Dropbox, etc.)
4. To restore: Click **📤 Import JSON** and select the saved file

## 🔧 Customization

To change colors or appearance:
1. Open `tasks/styles.css` in a text editor
2. Change color values under `:root { --primary: #6366f1; ... }`
3. Save and refresh your browser

## 🐛 Troubleshooting on Mac

### App not saving tasks?
- Make sure you're not using Private/Incognito mode
- Clear Safari cache: Safari → Develop → Empty Caches
- Try a different browser (Chrome, Firefox)

### Tasks disappeared after restart?
- You may have cleared browser data. Always export your tasks first!
- Restore from backup: Click **📤 Import JSON**

### Can't access http://localhost:8000?
- Make sure Terminal shows `Serving HTTP on 0.0.0.0 port 8000`
- Try port 9000 instead: `python3 -m http.server 9000`

## 📱 Using on Mac, iPad, and iPhone

The app works on all Apple devices:
- **Mac**: Open in Safari/Chrome (Bookmark for quick access)
- **iPad**: Same as Mac (Responsive design works great)
- **iPhone**: Same app, optimized for smaller screen

## 🔐 Privacy & Security

- ✅ No login required
- ✅ No data sent to servers
- ✅ No ads or tracking
- ✅ 100% free forever
- ✅ Works offline

## 📝 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Add Task | Press **Enter** in the input field |
| Focus Input | Click anywhere in the app |

## 🎨 Color Coding

- 🔴 **Red** = High Priority
- 🟡 **Yellow** = Medium Priority
- 🟢 **Green** = Low Priority

## 📚 File Structure

```
tasks/
├── index.html     (Main app)
���── styles.css     (Styling)
├── script.js      (Functionality)
└── README.md      (This file)
```

## 💡 Tips & Tricks

1. **Export weekly**: Export your tasks every Sunday for backup
2. **Use categories**: Organize personal vs work tasks
3. **Set priorities**: Focus on High priority first
4. **Review daily**: Check your tasks first thing in the morning
5. **Bookmark it**: Save to Safari Reading List or Favorites

## 🚀 Future Ideas

- Dark mode
- Recurring tasks
- Task notifications
- Sharing tasks
- Cloud sync

## 🤝 Contributing

Found a bug or have an idea? Feel free to open an issue or contribute on GitHub!

## 📄 License

Open source and free to use for personal projects.

---

**Made with ❤️ for Mac users who want a simple, free task manager**

**Questions?** Open an issue on GitHub or check the code!
