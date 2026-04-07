const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        LevelFormat, PageNumber } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "2E86AB" };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: "1A3A4A" })],
    spacing: { before: 320, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E86AB", space: 4 } }
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color: "2E86AB" })],
    spacing: { before: 240, after: 120 }
  });
}
function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: "1A3A4A" })],
    spacing: { before: 180, after: 80 }
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 22, ...opts })],
    spacing: { before: 60, after: 60 }
  });
}
function bullet(text, bold_prefix = "") {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [
      bold_prefix ? new TextRun({ text: bold_prefix, font: "Arial", size: 22, bold: true }) : null,
      new TextRun({ text: bold_prefix ? text : text, font: "Arial", size: 22 })
    ].filter(Boolean),
    spacing: { before: 40, after: 40 }
  });
}
function sub_bullet(text) {
  return new Paragraph({
    numbering: { reference: "sub_bullets", level: 0 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: "444444" })],
    spacing: { before: 20, after: 20 }
  });
}
function spacer() { return new Paragraph({ children: [new TextRun("")], spacing: { before: 80, after: 80 } }); }

function infoBox(label, text, fillColor = "E8F4FD") {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1400, 7960],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: headerBorders,
        width: { size: 1400, type: WidthType.DXA },
        shading: { fill: "2E86AB", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        verticalAlign: "center",
        children: [new Paragraph({ children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })]
      }),
      new TableCell({
        borders,
        width: { size: 7960, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 140, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 21 })] })]
      })
    ]})],
    margins: { bottom: 160 }
  });
}

function scheduleTable(rows) {
  const headerRow = new TableRow({
    children: ["Time", "Topic", "Content Summary", "Method"].map((h, i) => new TableCell({
      borders: headerBorders,
      width: { size: [1300, 1500, 4560, 2000][i], type: WidthType.DXA },
      shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
    }))
  });
  const dataRows = rows.map((r, idx) => new TableRow({
    children: r.map((cell, i) => new TableCell({
      borders,
      width: { size: [1300, 1500, 4560, 2000][i], type: WidthType.DXA },
      shading: { fill: idx % 2 === 0 ? "F8FBFE" : "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })]
    }))
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [1300, 1500, 4560, 2000], rows: [headerRow, ...dataRows] });
}

function cmdTable(rows) {
  const headerRow = new TableRow({
    children: ["Command", "Description", "Example / Notes"].map((h, i) => new TableCell({
      borders: headerBorders,
      width: { size: [2200, 3000, 4160][i], type: WidthType.DXA },
      shading: { fill: "2E86AB", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
    }))
  });
  const dataRows = rows.map((r, idx) => new TableRow({
    children: r.map((cell, i) => new TableCell({
      borders,
      width: { size: [2200, 3000, 4160][i], type: WidthType.DXA },
      shading: { fill: i === 0 ? "EBF5FB" : (idx % 2 === 0 ? "F8FBFE" : "FFFFFF"), type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20, bold: i === 0 })] })]
    }))
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [2200, 3000, 4160], rows: [headerRow, ...dataRows] });
}

function mistakesTable(rows) {
  const headerRow = new TableRow({
    children: ["Common Mistake", "Why It Happens", "How to Address"].map((h, i) => new TableCell({
      borders: headerBorders,
      width: { size: [2800, 2800, 3760][i], type: WidthType.DXA },
      shading: { fill: "C0392B", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
    }))
  });
  const dataRows = rows.map((r, idx) => new TableRow({
    children: r.map((cell, i) => new TableCell({
      borders,
      width: { size: [2800, 2800, 3760][i], type: WidthType.DXA },
      shading: { fill: idx % 2 === 0 ? "FEF9F9" : "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })]
    }))
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [2800, 2800, 3760], rows: [headerRow, ...dataRows] });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "sub_bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 32, bold: true, font: "Arial" }, paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 26, bold: true, font: "Arial" }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    children: [
      // Title Block
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" }, bottom: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" }, left: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" }, right: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" } },
          shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
          margins: { top: 200, bottom: 200, left: 300, right: 300 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "LINUX FOR IT PROFESSIONALS", font: "Arial", size: 36, bold: true, color: "FFFFFF" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day 1 Detailed Lesson Plan — Introduction & Terminal Basics", font: "Arial", size: 24, color: "A8D8EA" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Rwenzori Tech Hub, Fort Portal City", font: "Arial", size: 20, color: "CCDDEE", italics: true })] }),
          ]
        })] })]
      }),
      spacer(),
      infoBox("GOAL", "Participants become comfortable with the Linux environment and can use core terminal navigation and file management commands confidently by end of Day 1."),
      spacer(),
      infoBox("AUDIENCE", "IT Staff — Beginners to Linux. May have Windows experience but limited or no terminal experience.", "FEF9E7"),
      spacer(),
      infoBox("DURATION", "Full day — 08:30 to 16:00. Approximately 6 hours of instruction + labs, including breaks and lunch.", "EAFAF1"),
      spacer(),

      h1("1. Day 1 Learning Objectives"),
      p("By the end of Day 1, participants will be able to:"),
      bullet("Explain what Linux is and describe at least two common distributions"),
      bullet("Open and navigate the Ubuntu terminal confidently"),
      bullet("Use pwd, ls, cd to navigate the file system"),
      bullet("Create, copy, move, and delete files and directories using mkdir, touch, cp, mv, rm"),
      bullet("Use tab completion and command history to work more efficiently"),
      bullet("Access help using man pages and the --help flag"),
      spacer(),

      h1("2. Session Schedule"),
      scheduleTable([
        ["08:30 – 09:00", "Welcome & Intro", "Trainer introductions, participant expectations, training overview, schedule and ground rules.", "Discussion"],
        ["09:00 – 09:45", "What is Linux?", "History of Linux, Linus Torvalds, GNU/Linux. Common distros: Ubuntu, Fedora, CentOS. Linux vs Windows comparison. Real-world IT use cases.", "Presentation + Q&A"],
        ["09:45 – 10:00", "Break", "—", "—"],
        ["10:00 – 10:45", "Ubuntu Desktop", "Navigating the GNOME desktop environment. Files manager, settings, application launcher. Finding and opening the Terminal.", "Demo + Practice"],
        ["10:45 – 11:30", "Terminal Intro", "Why use the terminal? Command syntax: command [options] [arguments]. First commands: pwd, ls, cd, man. Tab completion and arrow keys.", "Demo + Hands-on"],
        ["11:30 – 12:00", "File Operations I", "Creating structure with mkdir and touch. Copying with cp, moving/renaming with mv, deleting with rm. Safety with rm -i.", "Hands-on Exercise"],
        ["12:00 – 13:00", "Lunch Break", "—", "—"],
        ["13:00 – 14:00", "File Operations II", "Wildcards: *, ?, []. Tab completion deep dive. history, !!, !n. clear command. Intro to aliases. Chaining commands with ; and &&.", "Hands-on Exercise"],
        ["14:00 – 14:45", "Getting Help", "man pages: navigation, sections, searching. --help flag. info command. apropos for keyword search. Online resources (linuxjourney.com).", "Demo + Practice"],
        ["14:45 – 15:00", "Break", "—", "—"],
        ["15:00 – 15:45", "Lab: TechCorp Setup", "Guided lab: Build the TechCorp directory structure, create files, copy and organise reports. Participants work individually or in pairs.", "Group Lab"],
        ["15:45 – 16:00", "Day 1 Review", "Recap key commands. Open Q&A. Preview Day 2: file permissions and users. Assign optional reading.", "Discussion"],
      ]),
      spacer(),

      h1("3. Detailed Session Notes"),

      h2("3.1 Welcome & Introduction (08:30 – 09:00)"),
      h3("Trainer Actions"),
      bullet("Write your name and the training title on a whiteboard or flip chart"),
      bullet("Ask participants to introduce themselves: name, role, Linux experience level"),
      bullet("Distribute printed exercise workbooks (from Linux_Training_Exercises.docx)"),
      bullet("Go through the 3-day schedule so participants know what to expect"),
      h3("Ice-Breaker Prompt"),
      infoBox("ASK", "\"Have you ever typed a command into a computer? What was it, and what happened?\" — This surfaces prior knowledge and eases nerves about the terminal.", "FEF9E7"),
      spacer(),

      h2("3.2 What is Linux? (09:00 – 09:45)"),
      h3("Key Points to Cover"),
      bullet("Linux was created by Linus Torvalds in 1991 as a free, open-source OS kernel"),
      bullet("A Linux distribution = kernel + software. Ubuntu is the most beginner-friendly"),
      bullet("96% of the world's web servers run Linux — it is an essential skill"),
      bullet("Linux is free, highly secure, and gives you full control via the terminal"),
      bullet("Android is built on the Linux kernel — participants already use Linux without knowing it"),
      h3("Discussion Points"),
      sub_bullet("\"What operating systems have you worked with at RTH?\""),
      sub_bullet("\"Where do you think Linux might be running in our building right now?\""),
      infoBox("TIP", "Use Slide 3 (Why Linux?) for a visual reference. Pause after each bullet and invite reactions. Real-world relevance keeps beginners engaged.", "E8F8F5"),
      spacer(),

      h2("3.3 Terminal Introduction (10:45 – 11:30)"),
      h3("Live Demo Script"),
      p("Open a terminal and type these commands one at a time. Narrate each step:"),
      bullet("Type pwd — ask \"What does this show?\""),
      bullet("Type ls — show the file list. Then ls -la — point out hidden files (starting with .)"),
      bullet("Type cd /etc — navigate there. Type ls. Ask \"Can you guess what these files are?\""),
      bullet("Type cd ~ — return home. Show participants how ~ is a shortcut"),
      bullet("Press Tab mid-word — demonstrate auto-completion"),
      bullet("Press Up arrow — show command history navigation"),
      h3("Common Participant Questions"),
      infoBox("Q&A", "Q: \"What if I type something wrong?\" → A: Nothing breaks! Most commands either do something or show an error. Press Ctrl+C to cancel any running command.", "FEF9E7"),
      spacer(),

      h2("3.4 File Operations I & II (11:30 – 14:00)"),
      h3("Key Concepts"),
      bullet("mkdir creates directories; touch creates empty files"),
      bullet("cp copies (original stays); mv moves OR renames (original disappears)"),
      bullet("rm permanently deletes — there is no Recycle Bin! Use rm -i for confirmation"),
      bullet("Wildcards: *.txt matches all .txt files; cp *.txt /backup/ copies them all"),
      h3("Demonstration Scenario"),
      p("Use the TechCorp scenario: \"You are the IT admin at TechCorp. Set up their folder structure.\""),
      infoBox("DEMO", "mkdir -p ~/TechCorp/{Reports,Backups,Scripts} — show one-line folder creation using brace expansion as a bonus tip.", "E8F8F5"),
      spacer(),

      h1("4. Hands-on Lab: TechCorp Directory Setup"),
      p("Participants complete Exercise 1.2 and 1.3 from the workbook. The expected outcome:"),
      bullet("~/TechCorp/ with subdirectories: Reports/, Backups/, Scripts/"),
      bullet("Files: Reports/January.txt, Reports/February.txt, README.txt"),
      bullet("January.txt copied to Backups/, February.txt renamed to March.txt"),
      bullet("Run: ls -R ~/TechCorp to verify the complete structure"),
      h3("Support Strategy"),
      sub_bullet("Walk the room constantly during lab time"),
      sub_bullet("Pair faster participants with those who are stuck"),
      sub_bullet("If most participants are stuck on the same step, pause and demo it on the projector"),
      spacer(),

      h1("5. Command Reference — Day 1"),
      cmdTable([
        ["pwd", "Print Working Directory — shows your current location in the file system", "$ pwd → /home/alice"],
        ["ls", "List files in current directory", "ls -la lists all files with permissions, size, and dates"],
        ["cd [dir]", "Change Directory — navigate the file system", "cd ~ (home), cd .. (up one), cd /etc (absolute path)"],
        ["mkdir [name]", "Make Directory — create a new folder", "mkdir -p a/b/c creates nested directories at once"],
        ["touch [file]", "Create an empty file (or update file timestamp)", "touch report.txt creates an empty file"],
        ["cp [src] [dst]", "Copy a file or directory", "cp -r folder/ backup/ copies entire directory recursively"],
        ["mv [src] [dst]", "Move or rename a file/directory", "mv old.txt new.txt renames; mv file.txt /backup/ moves"],
        ["rm [file]", "Remove (delete) a file permanently", "rm -r removes directory; rm -i asks for confirmation each time"],
        ["man [cmd]", "Open the manual page for a command", "Press q to quit, / to search inside the manual"],
        ["history", "Show list of recent commands typed", "!! repeats last command; !50 repeats command #50"],
        ["clear", "Clear the terminal screen", "Keyboard shortcut: Ctrl + L does the same thing"],
        ["Tab key", "Auto-complete file/directory names", "Press Tab once to complete, twice to show all options"],
      ]),
      spacer(),

      h1("6. Common Mistakes & How to Handle Them"),
      mistakesTable([
        ["Typing rm -r without checking the path first", "Participants are used to a Recycle Bin safety net", "Always show ls [path] before rm -r [path]. Emphasise: no undo!"],
        ["Forgetting spaces between command parts", "New users treat the command like a sentence without separators", "Remind: every part of a command needs a space. Show example: lsla vs ls -la"],
        ["Using Windows-style backslashes (\\)", "Muscle memory from Windows file paths", "Linux uses forward slashes (/). C:\\Users becomes /home/username"],
        ["Confusing cp and mv behaviour", "Both seem to 'send' a file somewhere", "cp = photocopier (original stays); mv = scissors (original disappears)"],
        ["Getting lost in directory structure", "The file system feels invisible without a GUI", "Use pwd frequently. Draw the tree structure on the whiteboard."],
      ]),
      spacer(),

      h1("7. Pacing Guidance"),
      infoBox("FAST GROUP", "If the group is moving ahead of schedule, introduce: ls -lh (human-readable sizes), file [filename] to identify file types, cp -r for recursive copies, mkdir -p for nested directory creation in one command.", "EAFAF1"),
      spacer(),
      infoBox("SLOW GROUP", "If the group is behind: skip the 'Getting Help' session detail (leave as self-study), and cut the wildcards deep-dive from File Operations II. Focus on ensuring everyone can do pwd, ls, cd, mkdir, touch, cp, mv, rm — the core seven.", "FEF2F2"),
      spacer(),

      h1("8. Day 1 Wrap-up Checklist"),
      p("Before dismissing participants, confirm each person can:"),
      bullet("Open a terminal on Ubuntu"),
      bullet("Navigate to /home, /etc, and back to ~ using cd"),
      bullet("Create a directory and a file inside it"),
      bullet("Copy and move a file to another directory"),
      bullet("Delete a file using rm"),
      bullet("Look up a command using man"),
      spacer(),
      infoBox("PREVIEW DAY 2", "\"Tomorrow we go deeper: you'll learn how Linux controls who can read and write each file, and how to create and manage user accounts. These are essential sysadmin skills.\"", "E8F4FD"),
      spacer(),
      new Paragraph({
        children: [new TextRun({ text: "Rwenzori Tech Hub  |  Linux for IT Professionals  |  Day 1 Lesson Plan", font: "Arial", size: 18, color: "888888", italics: true })],
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 8 } },
        spacing: { before: 160 }
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('./Day1_Lesson_Plan.docx', buf);
  console.log('Done: Day1_Lesson_Plan.docx');
});
