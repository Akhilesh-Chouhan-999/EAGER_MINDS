# 🎨 VS Code Configuration

This folder contains enhanced VS Code settings with modern colors and icons.

## 📋 Files

```
.vscode/
├── 📄 settings.json                  - Main VS Code configuration
├── 📄 extensions.json                - Recommended extensions
├── 📄 extensions-recommended.md       - Installation guide
└── 📄 README.md                      - This file
```

## 🎨 Current Theme Setup

```
✅ Color Theme:     One Dark Pro (production-grade)
✅ Icon Theme:      Material Icon Theme (1000+ icons)
✅ Product Icons:   Fluent (modern design)
✅ Font:            Fira Code with ligatures
✅ Font Size:       14px
```

## 🚀 Quick Start

### Option 1: Recommended (5 minutes)
Install the recommended extensions for best experience:

```bash
# Install Material Icons (1000+ file icons)
code --install-extension PKief.material-icon-theme

# Install One Dark Pro Theme
code --install-extension zhuangtongfa.Material-theme

# Install Prettier (code formatter)
code --install-extension esbenp.prettier-vscode

# Install GitLens (git integration)
code --install-extension eamodio.gitlens
```

**Or**: Open Extensions panel → Click "Show Recommended" → Install All

### Option 2: Minimal (Already Works)
The configuration works with VS Code's built-in themes:
- Just open the folder
- Colors will apply automatically
- Icons are optional

### Option 3: Use Different Theme
Edit `settings.json` line 4:
```json
"workbench.colorTheme": "Dracula"
// or: "Nord", "GitHub Dark", "Atom One Dark"
```

## 🎯 What You Get

### Colors
```
Keywords:       Blue (#569CD6)
Functions:      Yellow (#DCDCAA)
Strings:        Red (#CE9178)
Comments:       Green (#6A9955)
Types:          Cyan (#4EC9B0)
Variables:      Light Blue (#9CDCFE)
Numbers:        Light Green (#B5CEA8)
```

### UI Elements
```
Editor Background:   #1E1E1E (dark)
Sidebar:             #252526
Activity Bar:        #333333
Status Bar:          #007ACC (blue)
Tabs:                Dark with borders
Git Colors:          Green/Yellow/Red
```

### Icons (When Material Icon Theme Installed)
```
📁 Folders          → Colorful folder icons
📄 Files            → File-type specific icons
⚛️  React Components → React icons
🟨 JavaScript       → JS file icons
🔵 TypeScript       → TS file icons
🎨 Stylesheets      → CSS/SCSS icons
📦 Config Files     → Config icons
🧪 Tests            → Test file icons
🔧 Backend          → Node/API icons
```

## 🛠️ Customization

### Change Theme
```json
"workbench.colorTheme": "One Dark Pro"
```

Available themes:
- One Dark Pro
- Dracula
- Nord
- GitHub Dark
- Atom One Dark

### Change Icon Theme
```json
"workbench.iconTheme": "material-icon-theme"
```

Alternative icon themes:
- vscode-icons
- file-icons

### Adjust Font Size
```json
"editor.fontSize": 14
```

### Adjust Colors
Edit `editor.tokenColorCustomizations` section in settings.json

## 📦 Recommended Extensions (26 Total)

### Must-Have
- PKief.material-icon-theme - File icons
- zhuangtongfa.Material-theme - Color theme
- esbenp.prettier-vscode - Code formatter

### Code Quality
- dbaeumer.vscode-eslint - Linting
- usernamehw.errorlens - Inline errors

### Git & Version Control
- eamodio.gitlens - Git integration

### Development Tools
- ritwickdey.LiveServer - Local server
- rangav.vscode-thunder-client - API testing
- humao.rest-client - HTTP client

### React Development
- dsznajder.es7-react-js-snippets - React snippets

### Utilities
- Gruntfuggly.todo-tree - TODO highlighting
- aaron-bond.better-comments - Colored comments

## 🔄 Troubleshooting

**Icons not showing?**
1. Install Material Icon Theme: `code --install-extension PKief.material-icon-theme`
2. Reload: `Ctrl+Shift+P` → "Reload Window"

**Colors look wrong?**
1. Install One Dark Pro: `code --install-extension zhuangtongfa.Material-theme`
2. Select theme: `Ctrl+Shift+P` → "Color Theme" → "One Dark Pro"

**Extensions not visible?**
1. Go to Extensions panel (Ctrl+Shift+X)
2. Click "Show Recommended"
3. Install from there

## 📊 Settings Breakdown

### Editor UI
```
✅ Minimap enabled (file overview)
✅ Word wrap enabled
✅ Smooth scrolling
✅ Smooth cursor animation
✅ Render line highlights
✅ Bracket pair colorization
```

### Formatting
```
✅ Format on save
✅ Format on paste
✅ Auto save (1 second delay)
✅ Trim whitespace
✅ Prettier as default formatter
```

### IntelliSense
```
✅ Quick suggestions enabled
✅ Auto imports enabled
✅ Tab completion
✅ Smart case in search
```

### Terminal
```
✅ Smooth scrolling
✅ Cursor blinking
✅ Same font as editor
```

## 🎓 Next Steps

1. **Install Extensions** (Recommended)
   ```bash
   code --install-extension material-icon-theme
   code --install-extension zhuangtongfa.Material-theme
   code --install-extension esbenp.prettier-vscode
   ```

2. **Reload VS Code**
   ```
   Ctrl+Shift+P → "Reload Window"
   ```

3. **Verify**
   - See colorful file icons in Explorer
   - See highlighted syntax in code
   - See modern color theme

4. **Customize** (Optional)
   - Edit `settings.json` to change colors
   - Edit `extensions.json` to add/remove extensions

## 💡 Pro Tips

- **Switch Theme**: `Ctrl+Shift+P` → "Color Theme"
- **Font Ligatures**: Already enabled (=>becomes ⇒)
- **Command Palette**: `Ctrl+Shift+P` - your best friend
- **Settings Search**: `Ctrl+,` - find settings by name
- **Format Code**: `Shift+Alt+F` - auto-format current file
- **Git Integration**: Click source control icon (left sidebar)

## 📞 Need Help?

- See `extensions-recommended.md` for detailed installation
- Check `settings.json` for all available options
- VS Code docs: https://code.visualstudio.com/docs

---

**Last Updated**: 2026-06-08  
**Status**: ✅ Ready to Use  
**Theme Version**: One Dark Pro  
**Icons Version**: Material Icon Theme v4.25+
