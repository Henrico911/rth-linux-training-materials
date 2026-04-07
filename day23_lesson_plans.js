const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "2E86AB" };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

function h1(text, color = "1A3A4A") {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color })],
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
function p(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 22 })],
    spacing: { before: 60, after: 60 }
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
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

function infoBox(label, text, fillColor = "E8F4FD", labelColor = "2E86AB") {
  return new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [1400, 8680],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: headerBorders,
        width: { size: 1400, type: WidthType.DXA },
        shading: { fill: labelColor, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
      }),
      new TableCell({
        borders,
        width: { size: 8680, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 140, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 21 })] })]
      })
    ]})]
  });
}

function scheduleTable(rows) {
  const headerRow = new TableRow({
    children: ["Time", "Topic", "Content Summary", "Method"].map((h, i) => new TableCell({
      borders: headerBorders,
      width: { size: [1300, 1600, 4660, 2000][i], type: WidthType.DXA },
      shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
    }))
  });
  const dataRows = rows.map((r, idx) => new TableRow({
    children: r.map((cell, i) => new TableCell({
      borders,
      width: { size: [1300, 1600, 4660, 2000][i], type: WidthType.DXA },
      shading: { fill: idx % 2 === 0 ? "F8FBFE" : "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })]
    }))
  }));
  return new Table({ width: { size: 10080, type: WidthType.DXA }, columnWidths: [1300, 1600, 4660, 2000], rows: [headerRow, ...dataRows] });
}

function cmdTable(rows) {
  const headerRow = new TableRow({
    children: ["Command", "Description", "Example / Notes"].map((h, i) => new TableCell({
      borders: headerBorders,
      width: { size: [2400, 3200, 4480][i], type: WidthType.DXA },
      shading: { fill: "2E86AB", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
    }))
  });
  const dataRows = rows.map((r, idx) => new TableRow({
    children: r.map((cell, i) => new TableCell({
      borders,
      width: { size: [2400, 3200, 4480][i], type: WidthType.DXA },
      shading: { fill: i === 0 ? "EBF5FB" : (idx % 2 === 0 ? "F8FBFE" : "FFFFFF"), type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20, bold: i === 0 })] })]
    }))
  }));
  return new Table({ width: { size: 10080, type: WidthType.DXA }, columnWidths: [2400, 3200, 4480], rows: [headerRow, ...dataRows] });
}

function mistakesTable(rows) {
  const headerRow = new TableRow({
    children: ["Common Mistake", "Why It Happens", "How to Address"].map((h, i) => new TableCell({
      borders: headerBorders,
      width: { size: [3000, 3000, 4080][i], type: WidthType.DXA },
      shading: { fill: "C0392B", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
    }))
  });
  const dataRows = rows.map((r, idx) => new TableRow({
    children: r.map((cell, i) => new TableCell({
      borders,
      width: { size: [3000, 3000, 4080][i], type: WidthType.DXA },
      shading: { fill: idx % 2 === 0 ? "FEF9F9" : "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })]
    }))
  }));
  return new Table({ width: { size: 10080, type: WidthType.DXA }, columnWidths: [3000, 3000, 4080], rows: [headerRow, ...dataRows] });
}

function titleBlock(dayTitle, subtitle) {
  return new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [10080],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" }, bottom: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" }, left: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" }, right: { style: BorderStyle.SINGLE, size: 24, color: "2E86AB" } },
      shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 300, right: 300 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "LINUX FOR IT PROFESSIONALS", font: "Arial", size: 36, bold: true, color: "FFFFFF" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: dayTitle, font: "Arial", size: 24, color: "A8D8EA" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subtitle, font: "Arial", size: 20, color: "CCDDEE", italics: true })] }),
      ]
    })] })]
  });
}

function footer(day) {
  return new Paragraph({
    children: [new TextRun({ text: `Rwenzori Tech Hub  |  Linux for IT Professionals  |  ${day} Lesson Plan`, font: "Arial", size: 18, color: "888888", italics: true })],
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 8 } },
    spacing: { before: 160 }
  });
}

const numbering = {
  config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: "sub_bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] },
  ]
};
const styles = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 32, bold: true, font: "Arial" }, paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 26, bold: true, font: "Arial" }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
  ]
};
const pageProps = { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } };

// ===================== DAY 2 =====================
const day2 = new Document({ numbering, styles, sections: [{ properties: pageProps, children: [
  titleBlock("Day 2 Detailed Lesson Plan — File System, Permissions & User Management", "Rwenzori Tech Hub, Fort Portal City"),
  spacer(),
  infoBox("GOAL", "Participants understand the Linux file system hierarchy, can read and modify file permissions, view file content, and create and manage user accounts and groups."),
  spacer(),
  infoBox("PREREQUISITE", "Day 1 completed. Participants should be comfortable with pwd, ls, cd, mkdir, cp, mv, rm.", "FEF9E7", "E67E22"),
  spacer(),
  infoBox("DURATION", "Full day — 08:30 to 16:00. Approx 6 hours of instruction + labs, including breaks and lunch.", "EAFAF1", "27AE60"),
  spacer(),
  h1("1. Day 2 Learning Objectives"),
  p("By the end of Day 2, participants will be able to:"),
  bullet("Describe the Linux directory hierarchy (/, /home, /etc, /var, /bin, /tmp, /usr)"),
  bullet("Read file contents using cat, less, head, tail"),
  bullet("Search file contents using grep"),
  bullet("Edit files using the nano text editor"),
  bullet("Interpret the ls -l permission string (e.g. -rw-r--r--)"),
  bullet("Change file permissions using chmod with both octal (644) and symbolic (+x) modes"),
  bullet("Change file ownership using chown and chgrp"),
  bullet("Create, modify, and delete user accounts using adduser, passwd, deluser"),
  bullet("Create groups and assign users to groups using addgroup and usermod -aG"),
  bullet("Explain the role of /etc/passwd and /etc/group"),
  spacer(),
  h1("2. Session Schedule"),
  scheduleTable([
    ["08:30 – 08:45", "Day 1 Recap", "Quick 5-question verbal quiz on Day 1 commands. Trainer demos any commands participants are unsure about.", "Q&A"],
    ["08:45 – 09:30", "Linux File System", "Directory hierarchy: /, /home, /etc, /var, /bin, /usr, /tmp. Role of each directory. How it compares to Windows drive structure.", "Presentation + Demo"],
    ["09:30 – 10:15", "Viewing Files", "cat (whole file), less (scrollable), head -n (first lines), tail -n (last lines), tail -f (live log watching), grep (search patterns).", "Hands-on"],
    ["10:15 – 10:30", "Break", "—", "—"],
    ["10:30 – 11:15", "File Permissions", "Permission string anatomy: - rwx rwx rwx. Owner/Group/Others. r=4, w=2, x=1. chmod octal: 644, 755, 700. chmod symbolic: +x, -w, u+r.", "Demo + Hands-on"],
    ["11:15 – 12:00", "Ownership: chown/chgrp", "What ownership means. chown user:group file. chgrp group file. sudo required for changing to other users. Practical IT scenario: web server files.", "Hands-on Exercise"],
    ["12:00 – 13:00", "Lunch Break", "—", "—"],
    ["13:00 – 13:45", "Text Editing: nano", "Opening files with nano. Editing text. Ctrl+X to exit, Y to save. Ctrl+W to search. Ctrl+K to cut line. Real use: editing config files.", "Hands-on"],
    ["13:45 – 14:30", "User Management", "adduser (interactive), passwd, deluser. su (switch user), sudo (run as root). whoami, id, w. /etc/passwd file structure.", "Demo + Hands-on"],
    ["14:30 – 14:45", "Break", "—", "—"],
    ["14:45 – 15:30", "Group Management", "addgroup, usermod -aG. groups [user] to verify. /etc/group file. Why groups matter for shared folders. Set group ownership.", "Hands-on"],
    ["15:30 – 16:00", "Lab + Review", "Lab: create trainee01-trainee03 users, rthstaff group, set up shared directory with group permissions. Day 2 recap and preview of Day 3.", "Group Lab"],
  ]),
  spacer(),
  h1("3. Detailed Session Notes"),
  h2("3.1 Day 1 Recap (08:30 – 08:45)"),
  h3("Quick Quiz Questions (ask verbally)"),
  bullet("\"What command shows you where you are in the file system?\" (pwd)"),
  bullet("\"How do you list files including hidden ones?\" (ls -la)"),
  bullet("\"You want to copy a file. What command do you use?\" (cp)"),
  bullet("\"How do you create a new directory?\" (mkdir)"),
  bullet("\"What is the shortcut to go to your home directory?\" (cd ~)"),
  infoBox("TIP", "If more than half the group is uncertain on any question, do a 2-minute live demo before moving on. Never proceed with shaky foundations.", "FEF9E7", "E67E22"),
  spacer(),
  h2("3.2 Linux File System Structure (08:45 – 09:30)"),
  h3("Key Points to Cover"),
  bullet("Everything in Linux is under / (root) — one unified tree, unlike Windows drive letters"),
  bullet("/home — personal user directories (like C:\\Users in Windows)"),
  bullet("/etc — system configuration files (network settings, user database, services)"),
  bullet("/var — variable data that changes: log files, mail queues, databases"),
  bullet("/bin and /usr/bin — essential programs (ls, cp, mv live here)"),
  bullet("/tmp — temporary files, wiped on reboot — never store important data here"),
  h3("Live Navigation Demo"),
  p("Run these commands on the projector and explain each:"),
  sub_bullet("ls / — show the top-level directories"),
  sub_bullet("ls /etc | head -20 — show a sample of config files"),
  sub_bullet("cat /etc/hostname — show how config is stored as plain text"),
  sub_bullet("ls /var/log — show log files that track system events"),
  infoBox("ANALOGY", "\"Think of / like the lobby of a building. /home is the staff offices, /etc is the admin filing cabinet, /var is the post room (always changing), /tmp is a whiteboard — wiped clean every morning.\"", "E8F8F5", "2E86AB"),
  spacer(),
  h2("3.3 File Permissions (10:30 – 11:15)"),
  h3("Permission String Breakdown"),
  p("Write this on the whiteboard and walk through it character by character:"),
  infoBox("EXAMPLE", "  -  rw-  r--  r--\n  ^   ^    ^    ^\n  |  Owner Group Others\n  File type (- = file, d = directory, l = symlink)", "1A3A4A"),
  spacer(),
  bullet("r = read (4), w = write (2), x = execute (1)"),
  bullet("644 = owner rw, group r, others r — typical for documents"),
  bullet("755 = owner rwx, group rx, others rx — typical for programs/scripts"),
  bullet("700 = owner rwx only — private files (SSH keys, etc.)"),
  h3("chmod Demonstration"),
  sub_bullet("chmod 000 file.txt — remove all permissions (try to read it → permission denied)"),
  sub_bullet("chmod 600 file.txt — owner read/write only (private file)"),
  sub_bullet("chmod 644 file.txt — restore normal document permissions"),
  sub_bullet("chmod +x script.sh — add execute permission (needed to run scripts)"),
  infoBox("TIP", "The mnemonic 4-2-1: \"Read a Book, Write a Word, Execute an Order\" helps participants remember r=4, w=2, x=1.", "EAFAF1", "27AE60"),
  spacer(),
  h2("3.4 User & Group Management (13:45 – 15:30)"),
  h3("User Creation Demo"),
  p("Walk through the full interactive adduser flow on the projector:"),
  sub_bullet("sudo adduser trainee01 — follow all prompts step by step"),
  sub_bullet("grep trainee01 /etc/passwd — show the account entry"),
  sub_bullet("su trainee01 — switch to the new user"),
  sub_bullet("whoami — confirm identity"),
  sub_bullet("exit — return to original user"),
  h3("Group Management Flow"),
  sub_bullet("sudo addgroup rthstaff — create the group"),
  sub_bullet("sudo usermod -aG rthstaff trainee01 — add user to group"),
  sub_bullet("groups trainee01 — verify group membership"),
  sub_bullet("sudo chown root:rthstaff /home/rth_share — assign group ownership"),
  sub_bullet("sudo chmod 775 /home/rth_share — group can read+write, others can read"),
  infoBox("REAL-WORLD", "\"In a real RTH setup, you would create a group for each department — 'accounts', 'technical', 'management' — and use group permissions to control who can access shared project folders.\"", "FEF9E7", "E67E22"),
  spacer(),
  h1("4. Command Reference — Day 2"),
  cmdTable([
    ["cat [file]", "Display entire file contents in the terminal", "cat /etc/hostname — quick view of short files"],
    ["less [file]", "View file with scroll support (press q to quit)", "less /etc/passwd — navigate with arrow keys"],
    ["head -n [file]", "Show first n lines of a file (default 10)", "head -5 /var/log/syslog — last 5 log entries"],
    ["tail -n [file]", "Show last n lines; tail -f for live monitoring", "tail -f /var/log/syslog — watch logs in real time"],
    ["grep [pat] [file]", "Search for a pattern inside a file", "grep root /etc/passwd — find root user entries"],
    ["nano [file]", "Open file in the nano text editor", "Ctrl+X=exit, Y=save, Ctrl+W=search, Ctrl+K=cut"],
    ["chmod [mode] [file]", "Change file permissions (octal or symbolic)", "chmod 644 file.txt or chmod +x script.sh"],
    ["chown [u:g] [file]", "Change file owner (and optionally group)", "chown alice:staff report.txt"],
    ["sudo adduser [name]", "Create a new user account (interactive)", "sudo adduser trainee01"],
    ["passwd [user]", "Set or change a user's password", "sudo passwd trainee01"],
    ["su [user]", "Switch to another user account", "su trainee01 (enter their password when prompted)"],
    ["sudo addgroup [g]", "Create a new group", "sudo addgroup rthstaff"],
    ["sudo usermod -aG", "Add a user to a group (-a = append, -G = groups)", "sudo usermod -aG rthstaff trainee01"],
    ["groups [user]", "Show all groups a user belongs to", "groups trainee01"],
    ["id [user]", "Show user ID (UID) and group IDs (GIDs)", "id trainee01"],
    ["whoami", "Display the current logged-in username", "Useful after su to confirm identity"],
  ]),
  spacer(),
  h1("5. Common Mistakes — Day 2"),
  mistakesTable([
    ["chmod 777 on everything", "Participants think 'full permissions' is simpler to manage", "Explain that 777 gives everyone write access — a security risk. Teach the principle of least privilege."],
    ["Confusing chown and chmod", "Both modify file properties — easy to mix up", "chown = WHO owns it; chmod = WHAT they can do. Draw the analogy: key holder vs. lock type."],
    ["sudo vs su confusion", "Both relate to elevated privileges", "sudo = do this ONE command as root; su = switch to another user entirely. They solve different problems."],
    ["Forgetting -aG in usermod", "Typing usermod -G instead of -aG removes user from all other groups", "The -a flag means 'append'. Without it, the user loses all their existing group memberships. Always use -aG."],
    ["Can't log back in after su", "Participants forget to type exit to return to original user", "Remind: su goes 'into' a user. exit returns you. You can nest multiple su sessions."],
  ]),
  spacer(),
  h1("6. Pacing Guidance"),
  infoBox("FAST GROUP", "Extend permissions coverage with: setuid/setgid bits, sticky bit on shared directories (chmod +t), ACLs with getfacl/setfacl for per-user permissions beyond the standard model.", "EAFAF1", "27AE60"),
  spacer(),
  infoBox("SLOW GROUP", "Skip chgrp (teach only chown user:group format), skip tail -f live monitoring, and simplify group management to just addgroup and usermod -aG. Focus on chmod 644 and 755 as the two most important patterns.", "FEF2F2", "C0392B"),
  spacer(),
  infoBox("PREVIEW DAY 3", "\"Tomorrow: you'll install software, diagnose network problems, and write your first automated script. These are the tools that make Linux genuinely powerful for daily IT work.\"", "E8F4FD"),
  spacer(),
  footer("Day 2"),
]}]});

// ===================== DAY 3 =====================
const day3 = new Document({ numbering, styles, sections: [{ properties: pageProps, children: [
  titleBlock("Day 3 Detailed Lesson Plan — Packages, Networking & Shell Scripting", "Rwenzori Tech Hub, Fort Portal City"),
  spacer(),
  infoBox("GOAL", "Participants can manage software with APT, diagnose network issues, monitor system performance, and write and run a basic shell script to automate repetitive tasks."),
  spacer(),
  infoBox("PREREQUISITE", "Days 1 & 2 completed. Participants should be able to navigate the file system, set permissions, and create users.", "FEF9E7", "E67E22"),
  spacer(),
  infoBox("DURATION", "Full day — 08:30 to 16:00. Includes Capstone Lab, Written Assessment, and Certificate Ceremony.", "EAFAF1", "27AE60"),
  spacer(),
  h1("1. Day 3 Learning Objectives"),
  p("By the end of Day 3, participants will be able to:"),
  bullet("Update, install, and remove software packages using apt"),
  bullet("Test network connectivity using ping and interpret the results"),
  bullet("View and explain network interface information with ip addr"),
  bullet("Monitor real-time system resource usage with top and htop"),
  bullet("Check disk space (df -h) and memory usage (free -h)"),
  bullet("List running processes with ps aux and terminate a process with kill"),
  bullet("Write a basic shell script with a shebang, variables, and echo statements"),
  bullet("Make a script executable with chmod +x and run it"),
  bullet("Complete the Capstone Lab scenario independently"),
  spacer(),
  h1("2. Session Schedule"),
  scheduleTable([
    ["08:30 – 08:45", "Days 1&2 Recap", "5-question quick quiz covering file operations, permissions, and user management. Address any outstanding questions.", "Q&A"],
    ["08:45 – 09:30", "Package Management", "APT package manager: apt update, apt upgrade, apt install, apt remove, apt search. dpkg basics. Package cache concept.", "Demo + Hands-on"],
    ["09:30 – 10:15", "Basic Networking", "ping with -c flag, ip addr, hostname, /etc/hosts, ss and netstat, curl for quick web tests. Reading output and diagnosing issues.", "Demo + Hands-on"],
    ["10:15 – 10:30", "Break", "—", "—"],
    ["10:30 – 11:15", "System Monitoring", "top (interactive process viewer), htop (improved version), df -h (disk), du -sh (folder size), free -h (RAM/swap), uptime, ps aux, kill.", "Hands-on"],
    ["11:15 – 12:00", "Shell Scripting I", "What is a script? The shebang line (#!/bin/bash). Variables. echo. Command substitution $(). chmod +x. Running with ./script.sh.", "Demo + Practice"],
    ["12:00 – 13:00", "Lunch Break", "—", "—"],
    ["13:00 – 14:00", "Shell Scripting II", "if/else conditionals. for loops. while loops. Reading user input with read. Practical: system health report script.", "Hands-on"],
    ["14:00 – 14:45", "Capstone Lab", "Full scenario: install packages, create users, set permissions, write and run a backup/report script. Individual work.", "Group Lab"],
    ["14:45 – 15:00", "Break", "—", "—"],
    ["15:00 – 15:30", "Assessment", "Written quiz (10 questions). Practical demonstration: trainer assigns each participant a random command to demonstrate.", "Individual"],
    ["15:30 – 16:00", "Closing & Certificates", "Trainer feedback, quiz review, next steps and resources, certificate handout and group photo.", "Discussion"],
  ]),
  spacer(),
  h1("3. Detailed Session Notes"),
  h2("3.1 Package Management (08:45 – 09:30)"),
  h3("Key Points to Cover"),
  bullet("APT = Advanced Package Tool. Think of it as an app store for the terminal"),
  bullet("sudo apt update — refreshes the list of available packages from the internet (does NOT install updates)"),
  bullet("sudo apt upgrade — installs all available updates. Run update first, always"),
  bullet("sudo apt install [package] — download and install a package and its dependencies"),
  bullet("sudo apt remove [package] — remove a package (config files kept)"),
  bullet("sudo apt purge [package] — remove package AND configuration files"),
  bullet("apt search [keyword] — search available packages by name or description"),
  h3("Demo Sequence"),
  sub_bullet("sudo apt update — run and explain the output (package lists, servers)"),
  sub_bullet("sudo apt install tree — install the tree utility"),
  sub_bullet("tree ~/TechCorp — use it immediately to show the visual directory tree"),
  sub_bullet("sudo apt install htop — install htop"),
  sub_bullet("sudo apt remove tree — remove it to show the uninstall process"),
  infoBox("TIP", "Always run apt update before installing anything. In a corporate IT environment, this ensures you are getting the latest security patches, not an outdated version from a stale cache.", "E8F8F5", "2E86AB"),
  spacer(),
  h2("3.2 Basic Networking (09:30 – 10:15)"),
  h3("Key Concepts"),
  bullet("ping tests if a host is reachable — essential for diagnosing connectivity problems"),
  bullet("ping -c 4 google.com sends exactly 4 packets and stops (Ctrl+C to stop unlimited ping)"),
  bullet("ip addr shows all network interfaces and their IP addresses"),
  bullet("Look for inet under eth0 or enp3s0 (Ethernet) or wlan0 (Wi-Fi) for your IP"),
  bullet("/etc/hosts maps hostnames to IPs locally — can be used for testing without DNS"),
  bullet("curl google.com — fetches a web page from terminal (useful for API testing)"),
  h3("Networking Diagnostic Scenario"),
  infoBox("SCENARIO", "\"A client calls to say their computer can't reach the internet. Walk through: 1) ping 127.0.0.1 (loopback — is networking working at all?), 2) ping [router IP] (can you reach the gateway?), 3) ping 8.8.8.8 (can you reach the internet by IP?), 4) ping google.com (is DNS working?). Each step isolates a different layer of the problem.\"", "FEF9E7", "E67E22"),
  spacer(),
  h2("3.3 System Monitoring (10:30 – 11:15)"),
  h3("Tools to Cover"),
  bullet("top — built-in process viewer. Shows CPU%, MEM%, process list. Press q to quit, k to kill a process by PID"),
  bullet("htop — coloured, interactive version of top. F9=kill, F10=quit. Much easier to read"),
  bullet("df -h — Disk Free: shows how much space is used/free on each mounted filesystem"),
  bullet("du -sh [dir] — Disk Usage of a specific directory (useful for finding what's taking up space)"),
  bullet("free -h — shows RAM (total/used/free) and swap usage"),
  bullet("uptime — shows how long the system has been running, and load averages"),
  bullet("ps aux — snapshot of all running processes. Combine with grep: ps aux | grep nginx"),
  bullet("kill [PID] — terminate a process by its Process ID (from ps aux or top)"),
  h3("Demonstration"),
  sub_bullet("Run htop and walk through the interface: CPU bars, memory bar, process list columns"),
  sub_bullet("Run df -h and identify the main filesystem (usually mounted at /)"),
  sub_bullet("Run free -h and explain the difference between used and available memory"),
  infoBox("TIP", "kill without sudo only works on your own processes. sudo kill is needed for system processes. kill -9 [PID] is a force-kill — use as a last resort only.", "EAFAF1", "27AE60"),
  spacer(),
  h2("3.4 Shell Scripting I — Writing Your First Script (11:15 – 12:00)"),
  h3("Script Anatomy"),
  bullet("Line 1: #!/bin/bash — the shebang. Tells the system which interpreter to use"),
  bullet("Variables: NAME=\"Alice\" — no spaces around =. Use with $NAME or ${NAME}"),
  bullet("echo — prints text to the terminal. echo \"Hello $NAME\" prints Hello Alice"),
  bullet("Command substitution: DATE=$(date) — runs the command and stores the output in a variable"),
  bullet("Comments: # This is a comment — ignored by the interpreter, used for documentation"),
  h3("Live Coding Demo — sysinfo.sh"),
  p("Build the script on the projector from scratch, narrating each line:"),
  sub_bullet("Start with just #!/bin/bash and echo \"Hello World\""),
  sub_bullet("Run it: bash sysinfo.sh — works without execute permission"),
  sub_bullet("Add chmod +x and run as ./sysinfo.sh"),
  sub_bullet("Add DATE=$(date) and echo \"Date: $DATE\" line by line"),
  sub_bullet("Add df -h / section and free -h section"),
  infoBox("TIP", "Build incrementally — add one line at a time and run the script after each addition. This teaches debugging naturally and shows that scripts are just commands in a file.", "E8F8F5", "2E86AB"),
  spacer(),
  h2("3.5 Shell Scripting II — Logic and Loops (13:00 – 14:00)"),
  h3("if/else Syntax"),
  p("Write on the whiteboard and explain the structure:"),
  infoBox("SYNTAX", "if [ condition ]; then\n  echo \"Condition is true\"\nelse\n  echo \"Condition is false\"\nfi\n\nExample: if [ -f /etc/hosts ]; then echo \"hosts file exists\"; fi", "1A3A4A"),
  spacer(),
  h3("for Loop Syntax"),
  infoBox("SYNTAX", "for USER in alice bob carol; do\n  echo \"Creating account: $USER\"\n  sudo adduser $USER\ndone", "1A3A4A"),
  spacer(),
  h3("Practical Automation Script"),
  p("Have participants write a daily_report.sh that:"),
  sub_bullet("Prints the current date and time"),
  sub_bullet("Shows who is logged in (who)"),
  sub_bullet("Shows disk space (df -h /)"),
  sub_bullet("Shows memory usage (free -h)"),
  sub_bullet("Saves output to ~/TechCorp/Reports/daily_report.txt using > redirection"),
  spacer(),
  h1("4. Capstone Lab Scenario"),
  infoBox("SCENARIO", "You are setting up a small file server for Rwenzori Tech Hub. Working independently: create /home/rth_share with 775 permissions, create user accounts for user_alice, user_bob, user_carol, create the rth_team group, add all three users, assign group ownership to the directory, create shared_notes.txt as user_alice, read it as user_bob, and write daily_report.sh. Ask for help only if stuck for more than 5 minutes.", "F9EBF0", "8E44AD"),
  spacer(),
  p("Trainer evaluation criteria:"),
  bullet("Directory created with correct permissions (ls -l /home | grep rth_share)"),
  bullet("All three users exist (grep user_alice /etc/passwd)"),
  bullet("Users are in rth_team group (groups user_alice)"),
  bullet("Directory owned by root:rth_team (ls -l /home)"),
  bullet("File readable across users (su user_bob, cat /home/rth_share/shared_notes.txt)"),
  bullet("Script runs and produces correct output (./daily_report.sh)"),
  spacer(),
  h1("5. Command Reference — Day 3"),
  cmdTable([
    ["sudo apt update", "Refresh the list of available packages from repositories", "Always run before installing anything"],
    ["sudo apt upgrade", "Install all available updates for installed packages", "Run after apt update"],
    ["sudo apt install [pkg]", "Download and install a package and its dependencies", "sudo apt install htop"],
    ["sudo apt remove [pkg]", "Remove an installed package (keeps config files)", "sudo apt remove tree"],
    ["apt search [keyword]", "Search for packages matching a keyword", "apt search text-editor"],
    ["ping -c 4 [host]", "Send 4 ICMP packets to test connectivity; -c sets count", "ping -c 4 google.com"],
    ["ip addr", "Show all network interfaces and their IP addresses", "Look for inet under eth0 or wlan0"],
    ["ss -tulpn", "Show open ports and listening services (modern netstat)", "ss -tulpn | grep :80"],
    ["top / htop", "Real-time process and resource monitor (htop = coloured)", "Press q to quit, k to kill (top), F9 to kill (htop)"],
    ["df -h", "Show disk space usage in human-readable format", "df -h / shows main filesystem usage"],
    ["free -h", "Show RAM and swap usage in human-readable format", "Interpret: available column = truly free memory"],
    ["ps aux", "Snapshot list of all running processes", "ps aux | grep nginx — find nginx process"],
    ["kill [PID]", "Send termination signal to a process by its PID", "kill -9 [PID] for forced kill"],
    ["#!/bin/bash", "Shebang — first line of every bash script", "Must be line 1, no space before #!"],
    ["chmod +x [script]", "Make a script file executable", "chmod +x sysinfo.sh then run ./sysinfo.sh"],
    ["$(command)", "Command substitution — use command output as value", "DATE=$(date) stores the current date"],
  ]),
  spacer(),
  h1("6. Common Mistakes — Day 3"),
  mistakesTable([
    ["Running apt install without apt update first", "Participants skip the update step to save time", "The cache may be hours or days old. Old cache = potentially outdated or missing packages. Always update first."],
    ["Spaces around = in variable assignment", "Feels natural to write NAME = \"value\" like in maths", "Bash is strict: NAME=\"value\" (no spaces). NAME = \"value\" causes a 'command not found' error."],
    ["Missing shebang on first line", "Participants forget or put it on line 2", "Without #!/bin/bash, the script may run under sh (fewer features) or fail entirely. Always line 1."],
    ["Running script without ./ prefix", "Participants type sysinfo.sh instead of ./sysinfo.sh", "Linux doesn't search the current directory for commands. ./ means 'in the current folder'. Or use bash sysinfo.sh."],
    ["kill -9 as first attempt", "Participants discover kill -9 and use it for everything", "kill (no flag) sends SIGTERM and lets the process clean up. kill -9 is SIGKILL — force quit. Try kill first."],
  ]),
  spacer(),
  h1("7. Assessment Guide"),
  h3("Written Quiz (10 questions — see Exercises workbook)"),
  p("Suggested marking:"),
  bullet("9-10 correct: Distinction — Ready for Linux intermediate training"),
  bullet("7-8 correct: Pass — Solid foundation, continue self-study"),
  bullet("5-6 correct: Borderline — Review Day 2 permissions and Day 3 scripting"),
  bullet("Below 5: Needs support — Recommend retake or additional coaching"),
  spacer(),
  h3("Practical Demonstration"),
  p("Ask each participant to demonstrate one of the following (assign randomly):"),
  sub_bullet("Create a user and add them to a group"),
  sub_bullet("Set permissions 755 on a script and run it"),
  sub_bullet("Install a package and verify it works"),
  sub_bullet("Write a 5-line shell script that shows date and disk usage"),
  sub_bullet("Find their IP address and ping the trainer's machine"),
  spacer(),
  h1("8. Closing & Resources"),
  infoBox("RESOURCES", "Ubuntu Docs: help.ubuntu.com | Linux Command Line Book (free PDF): linuxcommand.org | Interactive Learning: linuxjourney.com | TutorialsPoint: tutorialspoint.com/unix | YouTube: 'The Linux Command Line' by tutoriaLinux", "E8F4FD"),
  spacer(),
  infoBox("TRAINER NOTE", "Remind participants that the terminal is a skill built with daily practice. Even 15 minutes per day on a personal Linux VM or Raspberry Pi will compound rapidly. Connect them to each other — a study group or WhatsApp group helps sustain momentum after training.", "EAFAF1", "27AE60"),
  spacer(),
  footer("Day 3"),
]}]});

Packer.toBuffer(day2).then(buf => { fs.writeFileSync('./Day2_Lesson_Plan.docx', buf); console.log('Done: Day2_Lesson_Plan.docx'); });
Packer.toBuffer(day3).then(buf => { fs.writeFileSync('./Day3_Lesson_Plan.docx', buf); console.log('Done: Day3_Lesson_Plan.docx'); });
