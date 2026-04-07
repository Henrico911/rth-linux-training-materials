const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const thickBorder = { style: BorderStyle.SINGLE, size: 4, color: "2E86AB" };
const thickBorders = { top: thickBorder, bottom: thickBorder, left: thickBorder, right: thickBorder };

const numbering = {
  config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ]
};
const styles = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 30, bold: true, font: "Arial" }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 26, bold: true, font: "Arial" }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
  ]
};
const pageProps = { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } };

function h1(text, color = "1A3A4A") {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Arial", size: 30, bold: true, color })],
    spacing: { before: 280, after: 140 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E86AB", space: 4 } }
  });
}
function h2(text, color = "2E86AB") {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color })],
    spacing: { before: 200, after: 100 }
  });
}
function p(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 22, ...opts })], spacing: { before: 60, after: 60 } });
}
function bullet(text) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text, font: "Arial", size: 22 })], spacing: { before: 40, after: 40 } });
}
function spacer(h = 80) { return new Paragraph({ children: [new TextRun("")], spacing: { before: h, after: h } }); }

function cmdBox(cmd) {
  return new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [10080],
    rows: [new TableRow({ children: [new TableCell({
      borders: thickBorders,
      shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: [new Paragraph({ children: [new TextRun({ text: cmd, font: "Courier New", size: 22, color: "A8D8EA", bold: true })] })]
    })] })]
  });
}

function answerBox(label = "Answer:", lines = 3) {
  const rows = [new TableRow({ children: [new TableCell({
    borders: thickBorders,
    shading: { fill: "F0F7FA", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 160, right: 160 },
    children: [
      new Paragraph({ children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: "2E86AB" })], spacing: { before: 40, after: 60 } }),
      ...Array(lines).fill(null).map(() => new Paragraph({
        children: [new TextRun({ text: "", font: "Arial", size: 22 })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "AACCDD", space: 4 } },
        spacing: { before: 20, after: 240 }
      }))
    ]
  })] })];
  return new Table({ width: { size: 10080, type: WidthType.DXA }, columnWidths: [10080], rows });
}

function infoBox(label, text, fill = "E8F4FD", labelFill = "2E86AB") {
  return new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [1400, 8680],
    rows: [new TableRow({ children: [
      new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, shading: { fill: labelFill, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, font: "Arial", size: 19, bold: true, color: "FFFFFF" })] })] }),
      new TableCell({ borders, width: { size: 8680, type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 21 })] })] })
    ]})]
  });
}

function titleBlock(day, subtitle) {
  return new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [10080],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: thickBorder, bottom: thickBorder, left: thickBorder, right: thickBorder },
      shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 300, right: 300 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "LINUX FOR IT PROFESSIONALS", font: "Arial", size: 34, bold: true, color: "FFFFFF" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${day} — Participant Exercise Workbook`, font: "Arial", size: 24, color: "A8D8EA" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subtitle, font: "Arial", size: 20, color: "CCDDEE", italics: true })] }),
      ]
    })] })]
  });
}

function nameBlock() {
  return new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [5040, 5040],
    rows: [new TableRow({ children: [
      new TableCell({ borders, shading: { fill: "F8FBFE", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 5040, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: "Participant Name: _________________________________", font: "Arial", size: 22 })] })] }),
      new TableCell({ borders, shading: { fill: "F8FBFE", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 5040, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: "Date: _______________", font: "Arial", size: 22 })] })] }),
    ]}) ]
  });
}

function footer(day) {
  return new Paragraph({
    children: [new TextRun({ text: `Rwenzori Tech Hub  |  Linux for IT Professionals  |  ${day} Participant Workbook`, font: "Arial", size: 18, color: "888888", italics: true })],
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 8 } },
    spacing: { before: 160 }
  });
}

// ===================== DAY 1 EXERCISES =====================
const ex1 = new Document({ numbering, styles, sections: [{ properties: pageProps, children: [
  titleBlock("Day 1", "Terminal Navigation & File Operations"),
  spacer(60),
  nameBlock(),
  spacer(),
  infoBox("HOW TO USE", "Work through exercises in order. Each builds on the last. Type commands exactly as shown in the shaded boxes. Write your observations in the answer spaces provided. Ask your trainer if stuck for more than 3 minutes."),
  spacer(),
  h1("Exercise 1.1 — Getting Your Bearings"),
  infoBox("OBJECTIVE", "Learn to open the terminal, navigate the file system, and understand where you are at all times."),
  spacer(60),
  p("Step 1: Open the Terminal application. Then type each command below and observe the output."),
  spacer(40),
  p("Command 1: Show your current location in the file system."),
  cmdBox("pwd"),
  answerBox("What path does pwd show? Write it below:", 2),
  spacer(40),
  p("Command 2: List the files in your current directory."),
  cmdBox("ls"),
  answerBox("What files and folders do you see?", 2),
  spacer(40),
  p("Command 3: List with full details, including hidden files."),
  cmdBox("ls -la"),
  answerBox("What does the 'd' character at the start of some lines mean?", 2),
  answerBox("What do files starting with a dot (.) have in common?", 2),
  spacer(40),
  p("Command 4: Navigate to your home directory and confirm your location."),
  cmdBox("cd ~\npwd"),
  answerBox("What is your home directory path?", 2),
  spacer(),
  p("Command 5: Navigate to the /etc directory. List its contents. Then return home."),
  cmdBox("cd /etc\nls | head -15\ncd ~"),
  answerBox("Name 3 files or folders you saw in /etc. What do you think they are for?", 3),
  spacer(),
  infoBox("BONUS", "Press the Tab key after typing the first few letters of a directory name. What happens? Press the Up arrow key. What happens?", "FEF9E7", "E67E22"),
  spacer(),

  h1("Exercise 1.2 — Building a Directory Structure"),
  infoBox("OBJECTIVE", "Practice creating directories and files to build a real-world folder structure for a fictional client called TechCorp."),
  spacer(60),
  p("Step 1: Create the main TechCorp project folder."),
  cmdBox("mkdir ~/TechCorp"),
  spacer(40),
  p("Step 2: Create three sub-folders inside TechCorp."),
  cmdBox("mkdir ~/TechCorp/Reports\nmkdir ~/TechCorp/Backups\nmkdir ~/TechCorp/Scripts"),
  spacer(40),
  p("Step 3: Create some empty files in the appropriate locations."),
  cmdBox("touch ~/TechCorp/Reports/January.txt\ntouch ~/TechCorp/Reports/February.txt\ntouch ~/TechCorp/README.txt"),
  spacer(40),
  p("Step 4: Verify your entire structure was created correctly."),
  cmdBox("ls -R ~/TechCorp"),
  answerBox("Draw or describe the directory tree structure you created:", 4),
  answerBox("How many files total did you create? How many directories?", 2),
  spacer(),
  infoBox("BONUS CHALLENGE", "Try creating all three subdirectories in one command using brace expansion:\nmkdir -p ~/TechCorp2/{Reports,Backups,Scripts,Logs}\nDoes it work? What does the -p flag do?", "EAFAF1", "27AE60"),
  spacer(),

  h1("Exercise 1.3 — Copy, Move & Delete"),
  infoBox("OBJECTIVE", "Practice the three core file management operations: copying, moving/renaming, and deleting files."),
  spacer(60),
  p("Step 1: Copy January.txt from Reports into the Backups folder."),
  cmdBox("cp ~/TechCorp/Reports/January.txt ~/TechCorp/Backups/"),
  answerBox("After the copy: does January.txt still exist in Reports? Check with ls ~/TechCorp/Reports", 2),
  spacer(40),
  p("Step 2: Rename February.txt to March.txt."),
  cmdBox("mv ~/TechCorp/Reports/February.txt ~/TechCorp/Reports/March.txt"),
  answerBox("After the move: list the Reports folder. What files are there now?", 2),
  spacer(40),
  p("Step 3: Delete the original January.txt from Reports."),
  cmdBox("rm ~/TechCorp/Reports/January.txt"),
  spacer(40),
  p("Step 4: Verify the final state of both folders."),
  cmdBox("ls ~/TechCorp/Reports\nls ~/TechCorp/Backups"),
  answerBox("What is in Reports now? What is in Backups?", 3),
  answerBox("In your own words, what is the difference between cp and mv?", 3),
  spacer(),
  infoBox("SAFETY TIP", "Linux has no Recycle Bin. rm deletes permanently. Use rm -i to be asked for confirmation before each deletion. Always double-check the path before running rm.", "FEF2F2", "C0392B"),
  spacer(),

  h1("Exercise 1.4 — Getting Help"),
  infoBox("OBJECTIVE", "Learn how to look up commands so you can figure things out independently after training."),
  spacer(60),
  p("Step 1: Open the manual page for the ls command."),
  cmdBox("man ls"),
  p("Use the arrow keys to scroll. Press / to search. Press q to quit."),
  answerBox("Find the flag that sorts files by size. What is it? (-S or --sort=size)", 2),
  spacer(40),
  p("Step 2: Use the --help flag to get quick help on mkdir."),
  cmdBox("mkdir --help"),
  answerBox("What does the -p flag do? Write the description in your own words.", 2),
  spacer(40),
  p("Step 3: Use apropos to search for commands related to 'copy'."),
  cmdBox("apropos copy"),
  answerBox("List 3 commands that appeared in the results. What do they do?", 3),
  spacer(),

  h1("Day 1 Challenge — Wildcard Operations"),
  infoBox("CHALLENGE", "This exercise uses wildcards. Work through each step independently. Ask for help only if stuck for more than 5 minutes.", "F9EBF0", "8E44AD"),
  spacer(60),
  p("Step 1: Create 5 files in ~/TechCorp/Reports/ using a single touch command."),
  cmdBox("touch ~/TechCorp/Reports/Q1.txt ~/TechCorp/Reports/Q2.txt ~/TechCorp/Reports/Q3.txt ~/TechCorp/Reports/Q4.txt ~/TechCorp/Reports/Annual.txt"),
  spacer(40),
  p("Step 2: Copy all .txt files from Reports to Backups using a wildcard."),
  cmdBox("cp ~/TechCorp/Reports/*.txt ~/TechCorp/Backups/"),
  answerBox("How many files were copied? List the Backups directory to verify.", 2),
  spacer(40),
  p("Step 3: Delete only the Q-files (Q1.txt, Q2.txt, Q3.txt, Q4.txt) from Reports using a wildcard."),
  cmdBox("rm ~/TechCorp/Reports/Q?.txt"),
  answerBox("What does Q?.txt match? Why doesn't it also delete Annual.txt?", 3),
  spacer(),
  footer("Day 1"),
]}]});

// ===================== DAY 2 EXERCISES =====================
const ex2 = new Document({ numbering, styles, sections: [{ properties: pageProps, children: [
  titleBlock("Day 2", "File Viewing, Permissions & User Management"),
  spacer(60),
  nameBlock(),
  spacer(),
  infoBox("HOW TO USE", "Day 2 exercises build directly on the TechCorp directory structure created on Day 1. If your TechCorp folder is missing, recreate it with: mkdir -p ~/TechCorp/{Reports,Backups,Scripts} and touch ~/TechCorp/README.txt"),
  spacer(),

  h1("Exercise 2.1 — Viewing & Searching File Content"),
  infoBox("OBJECTIVE", "Practice reading file contents using multiple tools, and searching for specific text inside files."),
  spacer(60),
  p("Step 1: Add content to README.txt using the nano text editor."),
  cmdBox("nano ~/TechCorp/README.txt"),
  p("Type at least 4 sentences describing TechCorp (make it up — be creative!). Then press Ctrl+X, then Y, then Enter to save and exit."),
  spacer(40),
  p("Step 2: View the file with cat."),
  cmdBox("cat ~/TechCorp/README.txt"),
  answerBox("Does the output look correct? What did cat display?", 2),
  spacer(40),
  p("Step 3: View the /etc/passwd file using less (a scrollable viewer)."),
  cmdBox("less /etc/passwd"),
  p("Scroll with arrow keys. Press q to quit."),
  answerBox("What kind of information is stored in /etc/passwd? Describe the format of each line.", 3),
  spacer(40),
  p("Step 4: Use head and tail to view portions of /etc/passwd."),
  cmdBox("head -5 /etc/passwd\ntail -5 /etc/passwd"),
  answerBox("What users appear at the top of the file? What about the bottom?", 2),
  spacer(40),
  p("Step 5: Search for your username in /etc/passwd using grep."),
  cmdBox("grep YOUR_USERNAME /etc/passwd"),
  p("Replace YOUR_USERNAME with your actual Linux username."),
  answerBox("What line did grep return? What information about your account does it contain?", 3),
  spacer(40),
  p("Step 6: Add several lines to /etc/hosts and search for localhost."),
  cmdBox("cat /etc/hosts\ngrep localhost /etc/hosts"),
  answerBox("What IP address is associated with 'localhost'?", 2),
  spacer(),
  infoBox("BONUS", "Try: grep -i 'root' /etc/passwd — what does the -i flag do? Try: grep -c 'false' /etc/passwd — what does -c do?", "EAFAF1", "27AE60"),
  spacer(),

  h1("Exercise 2.2 — File Permissions"),
  infoBox("OBJECTIVE", "Understand the Linux permission model and practise modifying permissions using chmod with both octal and symbolic modes."),
  spacer(60),
  p("Step 1: Check the current permissions on README.txt."),
  cmdBox("ls -l ~/TechCorp/README.txt"),
  answerBox("Write the full permission string shown (e.g. -rw-r--r--). Explain each part:", 3),
  spacer(40),
  p("Step 2: Remove ALL permissions from the file."),
  cmdBox("chmod 000 ~/TechCorp/README.txt"),
  spacer(40),
  p("Step 3: Try to read the file now."),
  cmdBox("cat ~/TechCorp/README.txt"),
  answerBox("What error message do you get? Why does this happen?", 2),
  spacer(40),
  p("Step 4: Restore read and write permissions for the owner only."),
  cmdBox("chmod 600 ~/TechCorp/README.txt"),
  answerBox("What does 600 mean? Who can read this file now? Who cannot?", 2),
  spacer(40),
  p("Step 5: Make the file readable by everyone, but writable only by the owner."),
  cmdBox("chmod 644 ~/TechCorp/README.txt"),
  answerBox("In your own words, what does 644 mean for Owner, Group, and Others?", 3),
  spacer(40),
  p("Step 6: Create a test script and make it executable."),
  cmdBox("echo '#!/bin/bash' > ~/TechCorp/Scripts/test.sh\necho 'echo Hello from test script' >> ~/TechCorp/Scripts/test.sh\nchmod 755 ~/TechCorp/Scripts/test.sh\n~/TechCorp/Scripts/test.sh"),
  answerBox("What output does the script produce? What does chmod 755 allow?", 2),
  spacer(),
  infoBox("PERMISSION CALCULATOR", "r=4, w=2, x=1. Add them for each group.\n644 = Owner: 4+2=6(rw), Group: 4(r), Others: 4(r)\n755 = Owner: 4+2+1=7(rwx), Group: 4+1=5(rx), Others: 4+1=5(rx)\n700 = Owner: 7(rwx), Group: 0(---), Others: 0(---)", "FEF9E7", "E67E22"),
  spacer(),
  new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [2000, 2000, 2000, 2000, 2080],
    rows: [
      new TableRow({ children: ["Octal", "Owner", "Group", "Others", "Common Use"].map((h, i) => new TableCell({ borders, width: { size: [2000,2000,2000,2000,2080][i], type: WidthType.DXA }, shading: { fill: "1A3A4A", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })] })) }),
      ...["644|rw-|r--|r--|Regular files (documents, configs)","755|rwx|r-x|r-x|Scripts and programs","700|rwx|---|---|Private files (SSH keys)","777|rwx|rwx|rwx|Avoid! Everyone can do everything","600|rw-|---|---|Very private (passwords, secrets)"].map((row, idx) => {
        const [octal, owner, group, others, use] = row.split("|");
        return new TableRow({ children: [[octal],[owner],[group],[others],[use]].map((cell, i) => new TableCell({ borders, width: { size: [2000,2000,2000,2000,2080][i], type: WidthType.DXA }, shading: { fill: idx%2===0?"F8FBFE":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: cell[0], font: "Arial", size: 20, bold: i===0 })] })] })) });
      })
    ]
  }),
  spacer(),

  h1("Exercise 2.3 — User Management"),
  infoBox("OBJECTIVE", "Create and manage user accounts and groups, simulate multi-user access, and understand the /etc/passwd and /etc/group files."),
  spacer(60),
  infoBox("NOTE", "These commands require sudo (administrator) privileges. Your trainer account should have sudo access.", "FEF2F2", "C0392B"),
  spacer(40),
  p("Step 1: Create a new user called trainee01."),
  cmdBox("sudo adduser trainee01"),
  p("Follow the prompts. Set a password (e.g., Training@2024). Leave other fields blank by pressing Enter."),
  spacer(40),
  p("Step 2: Verify the user account was created in /etc/passwd."),
  cmdBox("grep trainee01 /etc/passwd"),
  answerBox("What is the user's home directory? What shell is assigned to them?", 2),
  spacer(40),
  p("Step 3: Switch to the new user account."),
  cmdBox("su trainee01"),
  spacer(40),
  p("Step 4: Confirm your identity and check your home directory."),
  cmdBox("whoami\npwd\nls ~"),
  answerBox("What does whoami return? Where is trainee01's home directory?", 2),
  spacer(40),
  p("Step 5: Return to your original account."),
  cmdBox("exit"),
  spacer(40),
  p("Step 6: Create a group called rthstaff."),
  cmdBox("sudo addgroup rthstaff"),
  spacer(40),
  p("Step 7: Add trainee01 to the rthstaff group."),
  cmdBox("sudo usermod -aG rthstaff trainee01"),
  spacer(40),
  p("Step 8: Verify the group assignment."),
  cmdBox("groups trainee01\ngrep rthstaff /etc/group"),
  answerBox("What groups does trainee01 now belong to?", 2),
  answerBox("What would happen if you forgot the -a flag in usermod -aG? What does -a do?", 2),
  spacer(),

  h1("Day 2 Challenge — Shared Folder Setup"),
  infoBox("CHALLENGE", "Set up a shared directory where multiple users can collaborate. Work through each step independently.", "F9EBF0", "8E44AD"),
  spacer(60),
  p("Step 1: Create a shared directory."),
  cmdBox("sudo mkdir /home/rth_share"),
  spacer(40),
  p("Step 2: Set the permissions to 775 (owner+group can write, others can only read)."),
  cmdBox("sudo chmod 775 /home/rth_share"),
  spacer(40),
  p("Step 3: Create two more users: trainee02 and trainee03."),
  cmdBox("sudo adduser trainee02\nsudo adduser trainee03"),
  spacer(40),
  p("Step 4: Add both new users to the rthstaff group."),
  cmdBox("sudo usermod -aG rthstaff trainee02\nsudo usermod -aG rthstaff trainee03"),
  spacer(40),
  p("Step 5: Assign the rth_share directory to the rthstaff group."),
  cmdBox("sudo chown root:rthstaff /home/rth_share\nls -l /home | grep rth_share"),
  answerBox("What does the ownership and permission line for rth_share look like now?", 2),
  spacer(40),
  p("Step 6: Switch to trainee01 and create a shared file."),
  cmdBox("su trainee01\necho 'Hello from trainee01' > /home/rth_share/notes.txt\nexit"),
  spacer(40),
  p("Step 7: Switch to trainee02 and read the file."),
  cmdBox("su trainee02\ncat /home/rth_share/notes.txt\nexit"),
  answerBox("Could trainee02 read the file? Why or why not? What permissions made this possible?", 3),
  spacer(),
  footer("Day 2"),
]}]});

// ===================== DAY 3 EXERCISES =====================
const ex3 = new Document({ numbering, styles, sections: [{ properties: pageProps, children: [
  titleBlock("Day 3", "Packages, Networking, System Monitoring & Shell Scripting"),
  spacer(60),
  nameBlock(),
  spacer(),
  infoBox("HOW TO USE", "Day 3 exercises bring everything together. You will install software, test your network, monitor your system, and write real shell scripts. This is the most practical day — take notes on anything you want to remember after training."),
  spacer(),

  h1("Exercise 3.1 — Package Management"),
  infoBox("OBJECTIVE", "Learn to install, verify, and remove software packages using the APT package manager."),
  spacer(60),
  p("Step 1: Update the package list to get the latest available versions."),
  cmdBox("sudo apt update"),
  answerBox("How many packages can be upgraded? What servers did Ubuntu contact?", 2),
  spacer(40),
  p("Step 2: Install the 'tree' utility."),
  cmdBox("sudo apt install tree"),
  spacer(40),
  p("Step 3: Use tree to visualise your TechCorp directory structure."),
  cmdBox("tree ~/TechCorp"),
  answerBox("How does tree show the structure differently from ls -R?", 2),
  spacer(40),
  p("Step 4: Install htop (an improved process viewer)."),
  cmdBox("sudo apt install htop\nhtop"),
  p("Explore the interface. Press q to exit."),
  answerBox("What information does htop display? What do the bar graphs at the top represent?", 3),
  spacer(40),
  p("Step 5: Search for a package you might need."),
  cmdBox("apt search text-editor"),
  answerBox("List two text editor packages that appeared in the results.", 2),
  spacer(40),
  p("Step 6: Remove the tree package."),
  cmdBox("sudo apt remove tree\ntree ~/TechCorp"),
  answerBox("What error appears when you try to run tree after removing it?", 2),
  spacer(),
  infoBox("DIFFERENCE", "apt remove keeps the configuration files (so reinstalling restores your settings). apt purge removes everything including config. Use purge when you want a completely clean removal.", "FEF9E7", "E67E22"),
  spacer(),

  h1("Exercise 3.2 — Network Diagnostics"),
  infoBox("OBJECTIVE", "Test network connectivity, view your network configuration, and perform basic diagnostics."),
  spacer(60),
  p("Step 1: Test internet connectivity with ping."),
  cmdBox("ping -c 4 google.com"),
  answerBox("Are the pings successful? What is the average round-trip time (ms)? What does this tell you?", 3),
  spacer(40),
  p("Step 2: View your network interfaces."),
  cmdBox("ip addr"),
  answerBox("What is your IP address? Which interface is it on (eth0, enp3s0, wlan0, etc.)?", 2),
  spacer(40),
  p("Step 3: Check your hostname."),
  cmdBox("hostname\nhostname -I"),
  answerBox("What is your hostname? What does hostname -I return (note: capital I)?", 2),
  spacer(40),
  p("Step 4: Ping another computer on your network. Ask your trainer for an IP address."),
  cmdBox("ping -c 3 [IP_ADDRESS]"),
  answerBox("Was the ping to the other computer successful? What was the response time compared to google.com?", 2),
  spacer(40),
  p("Step 5: View open network connections."),
  cmdBox("ss -tulpn"),
  answerBox("List 3 services/ports you can see. What do you think each one is for?", 3),
  spacer(40),
  p("Step 6: View the /etc/hosts file."),
  cmdBox("cat /etc/hosts"),
  answerBox("What entries are in /etc/hosts? What is it used for?", 2),
  spacer(),
  infoBox("DIAGNOSTIC FLOW", "When troubleshooting connectivity: 1) ping 127.0.0.1 (is networking on at all?), 2) ping [your router IP] (can you reach the local network?), 3) ping 8.8.8.8 (can you reach the internet?), 4) ping google.com (is DNS working?). Each step isolates a different layer.", "EAFAF1", "27AE60"),
  spacer(),

  h1("Exercise 3.3 — System Monitoring"),
  infoBox("OBJECTIVE", "Monitor system resources including CPU, memory, disk, and running processes."),
  spacer(60),
  p("Step 1: View real-time system statistics."),
  cmdBox("htop"),
  p("Explore the interface: CPU bars, memory bar, process list. Press q when done."),
  answerBox("What percentage of CPU is being used? How much RAM is available?", 2),
  spacer(40),
  p("Step 2: Check disk space usage."),
  cmdBox("df -h"),
  answerBox("How much disk space is used on the main filesystem (/)? How much is free?", 2),
  spacer(40),
  p("Step 3: Check the size of your TechCorp directory."),
  cmdBox("du -sh ~/TechCorp"),
  answerBox("How much disk space does TechCorp use? What does du -sh do differently from df -h?", 2),
  spacer(40),
  p("Step 4: Check memory (RAM) usage."),
  cmdBox("free -h"),
  answerBox("How much total RAM does your system have? What is the difference between 'used' and 'available'?", 2),
  spacer(40),
  p("Step 5: View the system uptime and load."),
  cmdBox("uptime"),
  answerBox("How long has the system been running? What are the three load average numbers?", 2),
  spacer(40),
  p("Step 6: List all running processes and find a specific one."),
  cmdBox("ps aux | grep bash"),
  answerBox("What is the PID (Process ID) of your bash session? What do the columns in ps aux mean?", 2),
  spacer(),

  h1("Exercise 3.4 — Shell Scripting"),
  infoBox("OBJECTIVE", "Write, save, and run a shell script. Scripts are the most powerful tool for automating repetitive IT tasks."),
  spacer(60),
  p("Step 1: Create a system information script."),
  cmdBox("nano ~/TechCorp/Scripts/sysinfo.sh"),
  p("Type the following script exactly. Each line is explained after the exercise."),
  new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [10080],
    rows: [new TableRow({ children: [new TableCell({
      borders: thickBorders, shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: [
        "#!/bin/bash", "echo \"=============================\"", "echo \"  RTH System Information\"", "echo \"=============================\"",
        "echo \"Date: $(date)\"", "echo \"Hostname: $(hostname)\"", "echo \"Logged in as: $(whoami)\"", "echo \"\"",
        "echo \"--- Disk Usage ---\"", "df -h /", "echo \"\"", "echo \"--- Memory Usage ---\"", "free -h", "echo \"=============================\""
      ].map(line => new Paragraph({ children: [new TextRun({ text: line, font: "Courier New", size: 20, color: "A8D8EA" })] }))
    })] })]
  }),
  spacer(40),
  p("Step 2: Save the file (Ctrl+X, Y, Enter), then make it executable."),
  cmdBox("chmod +x ~/TechCorp/Scripts/sysinfo.sh"),
  spacer(40),
  p("Step 3: Run the script."),
  cmdBox("~/TechCorp/Scripts/sysinfo.sh"),
  answerBox("What output does your script produce? Write a sample of it below:", 4),
  spacer(40),
  p("Step 4: Add a new section to the script that shows top 5 processes by memory."),
  cmdBox("nano ~/TechCorp/Scripts/sysinfo.sh"),
  p("Add these lines before the last echo line:"),
  cmdBox("echo \"--- Top 5 Processes ---\"\nps aux --sort=-%mem | head -6"),
  spacer(40),
  p("Step 5: Run the updated script."),
  cmdBox("~/TechCorp/Scripts/sysinfo.sh"),
  answerBox("What new information appears? Which process is using the most memory?", 2),
  spacer(),
  infoBox("WHAT DOES $(command) DO?", "$(date) and $(hostname) are called 'command substitution'. Linux runs the command inside $() and replaces it with the output. So echo \"Date: $(date)\" runs date first, then prints its result as part of your message.", "E8F4FD"),
  spacer(),

  h1("Exercise 3.5 — Scripting with Logic"),
  infoBox("OBJECTIVE", "Add conditional logic and loops to your scripts to make them smarter and more flexible."),
  spacer(60),
  p("Step 1: Create a new script with an if/else statement."),
  cmdBox("nano ~/TechCorp/Scripts/diskcheck.sh"),
  p("Type this script:"),
  new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [10080],
    rows: [new TableRow({ children: [new TableCell({
      borders: thickBorders, shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: [
        "#!/bin/bash", "USAGE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')",
        "echo \"Disk usage is: $USAGE%\"",
        "if [ $USAGE -gt 80 ]; then", "  echo \"WARNING: Disk usage is above 80%!\"",
        "else", "  echo \"OK: Disk usage is within normal limits.\"", "fi"
      ].map(line => new Paragraph({ children: [new TextRun({ text: line, font: "Courier New", size: 20, color: "A8D8EA" })] }))
    })] })]
  }),
  spacer(40),
  p("Step 2: Save, make executable, and run."),
  cmdBox("chmod +x ~/TechCorp/Scripts/diskcheck.sh\n~/TechCorp/Scripts/diskcheck.sh"),
  answerBox("What message does the script print? Is your disk usage above or below 80%?", 2),
  spacer(40),
  p("Step 3: Create a script that uses a for loop to create multiple users."),
  cmdBox("nano ~/TechCorp/Scripts/create_users.sh"),
  p("Type this script:"),
  new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [10080],
    rows: [new TableRow({ children: [new TableCell({
      borders: thickBorders, shading: { fill: "1A3A4A", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: [
        "#!/bin/bash", "echo \"Creating user accounts...\"",
        "for USER in alice bob carol; do",
        "  echo \"Creating user: $USER\"",
        "  sudo adduser --disabled-password --gecos \"\" $USER",
        "done",
        "echo \"Done! All accounts created.\""
      ].map(line => new Paragraph({ children: [new TextRun({ text: line, font: "Courier New", size: 20, color: "A8D8EA" })] }))
    })] })]
  }),
  spacer(40),
  cmdBox("chmod +x ~/TechCorp/Scripts/create_users.sh\n~/TechCorp/Scripts/create_users.sh"),
  answerBox("What does the for loop do? What would you change to create 5 users instead of 3?", 3),
  spacer(),

  h1("Capstone Challenge — RTH File Server"),
  infoBox("CAPSTONE", "You are setting up a shared file server for Rwenzori Tech Hub. Complete all tasks below without assistance. Ask for help only if stuck for more than 5 minutes. This is your practical assessment.", "F9EBF0", "8E44AD"),
  spacer(60),
  p("Task 1: Create /home/rth_share and set permissions to 775."),
  answerBox("Commands used:", 2),
  spacer(40),
  p("Task 2: Create user accounts for user_alice, user_bob, and user_carol."),
  answerBox("Commands used:", 2),
  spacer(40),
  p("Task 3: Create a group called rth_team and add all three users to it."),
  answerBox("Commands used:", 2),
  spacer(40),
  p("Task 4: Set the ownership of /home/rth_share to root:rth_team."),
  answerBox("Commands used:", 2),
  spacer(40),
  p("Task 5: As user_alice, create shared_notes.txt with some text. As user_bob, read it."),
  answerBox("Commands used:", 2),
  answerBox("Could user_bob read the file? Why or why not?", 2),
  spacer(40),
  p("Task 6: Write daily_report.sh — displays date, who is logged in (who), and disk space."),
  answerBox("Paste your complete script here:", 5),
  spacer(40),
  p("Task 7: Run the script and paste the output."),
  answerBox("Script output:", 4),
  spacer(),

  h1("End-of-Training Quiz"),
  infoBox("INSTRUCTIONS", "Answer all 10 questions. You may refer to your notes. Write complete answers — single words are not enough.", "E8F4FD"),
  spacer(60),
  ...["What command shows your current directory?",
    "What does chmod 755 mean for Owner, Group, and Others?",
    "Write the command to install a package called 'curl'.",
    "What is the difference between cp and mv?",
    "What does grep do? Give a practical example.",
    "What is sudo and when should you use it?",
    "What is the first line of every bash script? Why is it needed?",
    "What command shows RAM usage in human-readable format?",
    "How do you add a user called 'john' to a group called 'staff'?",
    "What is the purpose of /etc/passwd? What information does it contain?"
  ].flatMap((q, i) => [
    p(`${i+1}. ${q}`, { bold: true }),
    answerBox("Answer:", 3),
    spacer(40)
  ]),
  spacer(),
  new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [3360, 3360, 3360],
    rows: [new TableRow({ children: [
      { text: "Participant Name: _____________________________" },
      { text: "Score: _______ / 10" },
      { text: "Date: _______________" }
    ].map((c, i) => new TableCell({ borders, shading: { fill: "F8FBFE", type: ShadingType.CLEAR }, width: { size: 3360, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: c.text, font: "Arial", size: 22 })] })] })) })]
  }),
  spacer(40),
  new Table({
    width: { size: 10080, type: WidthType.DXA }, columnWidths: [5040, 5040],
    rows: [new TableRow({ children: [
      { text: "Trainer Signature: _____________________________" },
      { text: "Certificate Issued: Yes / No" }
    ].map((c, i) => new TableCell({ borders, shading: { fill: "F8FBFE", type: ShadingType.CLEAR }, width: { size: 5040, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: c.text, font: "Arial", size: 22 })] })] })) })]
  }),
  spacer(),
  footer("Day 3"),
]}]});

Packer.toBuffer(ex1).then(buf => { fs.writeFileSync('./Day1_Exercises.docx', buf); console.log('Done: Day1_Exercises.docx'); });
Packer.toBuffer(ex2).then(buf => { fs.writeFileSync('./Day2_Exercises.docx', buf); console.log('Done: Day2_Exercises.docx'); });
Packer.toBuffer(ex3).then(buf => { fs.writeFileSync('./Day3_Exercises.docx', buf); console.log('Done: Day3_Exercises.docx'); });
