# Linux for IT Professionals Training Materials Generator

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![npm Version](https://img.shields.io/badge/npm-%3E%3D7.0.0-blue)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An automated document generation system that creates comprehensive training materials for a 3-day "Linux for IT Professionals" course at Rwenzori Tech Hub, Fort Portal City.

## 📋 Table of Contents

- [Overview](#overview)
- [Course Content](#course-content)
- [Installation](#installation)
- [Usage](#usage)
- [Generated Files](#generated-files)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🎯 Overview

This project consists of Node.js scripts that automatically generate professional-quality training materials for a comprehensive Linux education program. The materials are designed for IT professionals transitioning from Windows environments to Linux system administration.

### Key Features

- **Automated Generation**: Creates Word documents and PowerPoint presentations programmatically
- **Professional Formatting**: Consistent branding and layout across all materials
- **Comprehensive Coverage**: 3-day curriculum covering Linux fundamentals to automation
- **Hands-on Focus**: Extensive practical exercises and labs
- **Assessment Ready**: Includes quizzes, practical demonstrations, and certification elements

### Target Audience

- IT staff at Rwenzori Tech Hub
- Beginners to Linux with Windows experience
- System administrators and IT support personnel
- Anyone seeking Linux certification preparation

## 📚 Course Content

### Day 1: Introduction & Terminal Basics

- Linux history and distributions
- Ubuntu desktop environment
- Terminal navigation (pwd, ls, cd)
- File operations (mkdir, touch, cp, mv, rm)
- Getting help (man, --help, apropos)
- TechCorp directory setup lab

### Day 2: File System, Permissions & User Management

- Linux directory hierarchy (/, /home, /etc, /var, etc.)
- File viewing (cat, less, head, tail, grep)
- Text editing with nano
- File permissions (chmod, chown, chgrp)
- User and group management (adduser, usermod, groups)
- Shared directory setup lab

### Day 3: Packages, Networking & Shell Scripting

- Package management with APT (apt update, install, remove)
- Network diagnostics (ping, ip addr, ss)
- System monitoring (htop, df, free, ps, kill)
- Shell scripting basics (variables, echo, conditionals, loops)
- Capstone lab: RTH file server setup
- Assessment and certification

## 🚀 Installation

### Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher (comes with Node.js)

### Setup Steps

1. **Clone or download the project files** to your local machine

2. **Navigate to the project directory**:

   ```bash
   cd /path/to/rth-linux-training-materials
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

   This will install:
   - `docx` (^8.5.0) - For Word document generation
   - `pptxgenjs` (^3.12.0) - For PowerPoint presentation generation

4. **Verify installation**:
   ```bash
   node --version  # Should show v16.0.0 or higher
   npm --version   # Should show v7.0.0 or higher
   ```

## 📖 Usage

### Quick Start

Generate all training materials at once:

```bash
npm run all
```

### Individual Components

#### Generate Day 1 Lesson Plan

```bash
npm run day1
# or
node day1_lesson_plan.js
```

#### Generate Day 2 & 3 Lesson Plans

```bash
npm run day23
# or
node day23_lesson_plans.js
```

#### Generate Participant Exercise Workbooks

```bash
npm run exercises
# or
node exercises.js
```

#### Generate Presentation Slides

```bash
npm run slides
# or
node slides.js
```

### Script Execution Details

- Each script may take 5-15 seconds to execute
- Progress is logged to the console
- Files are saved in the current working directory
- No user interaction required during generation

## 📄 Generated Files

The scripts create the following output files:

### Word Documents (.docx)

- `Day1_Lesson_Plan.docx` - Detailed trainer guide for Day 1
- `Day2_Lesson_Plan.docx` - Detailed trainer guide for Day 2
- `Day3_Lesson_Plan.docx` - Detailed trainer guide for Day 3
- `Day1_Exercises.docx` - Participant workbook for Day 1
- `Day2_Exercises.docx` - Participant workbook for Day 2
- `Day3_Exercises.docx` - Participant workbook for Day 3

### PowerPoint Presentations (.pptx)

- `Day1_Slides.pptx` - Presentation slides for Day 1
- `Day2_Slides.pptx` - Presentation slides for Day 2
- `Day3_Slides.pptx` - Presentation slides for Day 3

## 📁 Project Structure

```
rth-linux-training-materials/
├── package.json                 # Project configuration and dependencies
├── README.md                    # This documentation file
├── day1_lesson_plan.js          # Day 1 lesson plan generator
├── day23_lesson_plans.js        # Day 2 & 3 lesson plans generator
├── exercises.js                 # Participant workbooks generator
├── slides.js                    # Presentation slides generator
└── node_modules/                # Installed dependencies (created by npm install)
```

## 📦 Dependencies

### Runtime Dependencies

- **docx** (^8.5.0): Library for creating Word documents programmatically
- **pptxgenjs** (^3.12.0): Library for creating PowerPoint presentations programmatically

### Development Dependencies

- None required

### Built-in Node.js Modules

- **fs**: File system operations (built into Node.js)

## 🎨 Customization

### Modifying Content

The scripts contain hardcoded content that can be edited directly:

1. **Course Content**: Edit the text strings within each script
2. **Branding**: Modify color schemes and logos in the styling sections
3. **Schedule**: Update timing and session breakdowns
4. **Exercises**: Add, remove, or modify practical activities

### Styling Changes

#### Word Documents (docx)

- Colors: Modify hex color codes in the script
- Fonts: Change font family and size parameters
- Layout: Adjust margins, spacing, and table structures

#### PowerPoint Presentations (pptxgenjs)

- Color Palette: Update the `C` object with new hex colors
- Slide Layouts: Modify slide creation functions
- Fonts: Change font face and size in text elements

### Adding New Content

To add new sections or days:

1. Create new JavaScript functions for content generation
2. Add new document creation logic
3. Update the output file naming and paths
4. Add corresponding npm scripts in package.json

## 🤝 Contributing

### Ways to Contribute

1. **Content Updates**: Improve course content, add new exercises, or update Linux best practices
2. **Bug Fixes**: Report and fix issues with document generation
3. **Feature Additions**: Add new types of materials or output formats
4. **Localization**: Translate materials for additional languages
5. **Accessibility**: Improve document accessibility features

### Development Guidelines

1. **Code Style**: Follow existing patterns and use descriptive variable names
2. **Testing**: Test generated documents for formatting and content accuracy
3. **Documentation**: Update this README for any significant changes
4. **Compatibility**: Ensure scripts work with supported Node.js versions

### Reporting Issues

When reporting bugs or requesting features:

1. Include your Node.js and npm versions
2. Describe the expected vs. actual behavior
3. Provide sample output if applicable
4. Specify which script and content area is affected

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

1. **Documentation**: Check this README for usage instructions
2. **Issues**: Report bugs or request features via GitHub Issues
3. **Community**: Connect with Rwenzori Tech Hub for training-specific questions

### Troubleshooting

#### Common Issues

**"Module not found" errors**:

- Ensure you've run `npm install`
- Check that all dependencies are installed correctly

**"Permission denied" errors**:

- Ensure you have write permissions in the output directory
- Check that generated files aren't open in other applications

**"Out of memory" errors**:

- Large documents may require more memory
- Try running individual scripts instead of `npm run all`

**Formatting issues in generated files**:

- Verify Node.js version compatibility
- Check that dependencies are the correct versions

### System Requirements

- **RAM**: 512MB minimum, 1GB recommended
- **Disk Space**: 100MB for dependencies + output files
- **OS**: Linux, macOS, or Windows with Node.js support

### Training Delivery Notes

For trainers using these materials:

- **Preparation**: Run all scripts 24 hours before training
- **Testing**: Open generated files to verify formatting
- **Backup**: Keep copies of generated materials
- **Updates**: Regenerate materials if content changes are made

---

**Rwenzori Tech Hub** | **Fort Portal City** | **Linux for IT Professionals Training**

_Empowering IT professionals with Linux skills for the modern workplace._
