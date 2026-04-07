const pptxgen = require("pptxgenjs");
const fs = require("fs");

// Color palette — deep navy + teal accent, professional for IT training
const C = {
  navy:    "0D1B2A",
  teal:    "028090",
  mint:    "02C39A",
  white:   "FFFFFF",
  silver:  "E8EDF2",
  muted:   "8EA8C3",
  code_bg: "1A2B3C",
  code_fg: "A8D8EA",
  accent:  "F4A261",  // warm amber for callouts
  dark:    "050F1A",
};

const makeShadow = () => ({ type: "outer", blur: 5, offset: 2, angle: 135, color: "000000", opacity: 0.18 });

function titleSlide(pres, title, subtitle, day) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  // Top accent bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });
  // Left accent stripe
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.12, w: 0.06, h: 5.505, fill: { color: C.teal }, line: { color: C.teal } });
  // Day badge
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 2.0, h: 0.55, fill: { color: C.teal }, line: { color: C.teal }, shadow: makeShadow() });
  s.addText(day, { x: 0.5, y: 1.0, w: 2.0, h: 0.55, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  // Title
  s.addText(title, { x: 0.5, y: 1.75, w: 9.0, h: 1.8, fontSize: 40, bold: true, color: C.white, fontFace: "Calibri", valign: "middle" });
  // Subtitle
  s.addText(subtitle, { x: 0.5, y: 3.6, w: 9.0, h: 0.6, fontSize: 18, color: C.muted, fontFace: "Calibri" });
  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Rwenzori Tech Hub  |  Fort Portal City  |  Linux for IT Professionals", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle" });
}

function sectionSlide(pres, dayLabel, topic) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.12, w: 0.06, h: 5.505, fill: { color: C.teal }, line: { color: C.teal } });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 1.8, w: 4.0, h: 0.06, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText(dayLabel, { x: 0, y: 1.2, w: 10, h: 0.7, fontSize: 15, color: C.teal, align: "center", bold: true, charSpacing: 8, fontFace: "Calibri" });
  s.addText(topic, { x: 0, y: 1.9, w: 10, h: 1.4, fontSize: 38, bold: true, color: C.white, align: "center", fontFace: "Calibri" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Rwenzori Tech Hub", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle" });
}

function contentSlide(pres, title, bullets, note = "") {
  const s = pres.addSlide();
  s.background = { color: C.silver };
  // Left accent bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.teal }, line: { color: C.teal } });
  // Title bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0.06, y: 0, w: 9.94, h: 0.85, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText(title, { x: 0.3, y: 0, w: 9.5, h: 0.85, fontSize: 24, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });
  // Content area
  const bulletItems = bullets.map(b => ({ text: b, options: { bullet: true, breakLine: true, fontSize: 16, color: C.navy, fontFace: "Calibri", paraSpaceAfter: 8 } }));
  if (bulletItems.length) bulletItems[bulletItems.length-1].options.breakLine = false;
  s.addText(bulletItems, { x: 0.4, y: 1.0, w: 9.2, h: 4.0 });
  // Callout box if note
  if (note) {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.6, w: 9.2, h: 0.7, fill: { color: C.teal, transparency: 85 }, line: { color: C.teal, width: 1 } });
    s.addText([{ text: "💡 ", options: { bold: true } }, { text: note }], { x: 0.55, y: 4.6, w: 9.0, h: 0.7, fontSize: 13, color: C.navy, fontFace: "Calibri", valign: "middle" });
  }
  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Rwenzori Tech Hub  |  Linux for IT Professionals", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle" });
  return s;
}

function cmdSlide(pres, title, commands) {
  // commands = array of {cmd, desc}
  const s = pres.addSlide();
  s.background = { color: C.silver };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.mint }, line: { color: C.mint } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.06, y: 0, w: 9.94, h: 0.85, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText(title, { x: 0.3, y: 0, w: 9.5, h: 0.85, fontSize: 24, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });

  const rowH = 4.4 / commands.length;
  commands.forEach((item, i) => {
    const y = 0.95 + i * rowH;
    const fill = i % 2 === 0 ? "DDEEF6" : "EDF4F9";
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: rowH - 0.05, fill: { color: fill }, line: { color: "CCDDEE", width: 0.5 } });
    // cmd in code font
    s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: y + 0.05, w: 3.6, h: rowH - 0.15, fill: { color: C.code_bg }, line: { color: C.code_bg } });
    s.addText(item.cmd, { x: 0.4, y: y + 0.05, w: 3.55, h: rowH - 0.15, fontSize: 14, bold: true, color: C.code_fg, fontFace: "Courier New", valign: "middle", margin: 4 });
    s.addText(item.desc, { x: 4.1, y: y + 0.05, w: 5.5, h: rowH - 0.15, fontSize: 13, color: C.navy, fontFace: "Calibri", valign: "middle" });
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Rwenzori Tech Hub  |  Linux for IT Professionals", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle" });
  return s;
}

function twoColSlide(pres, title, leftTitle, leftItems, rightTitle, rightItems) {
  const s = pres.addSlide();
  s.background = { color: C.silver };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.06, y: 0, w: 9.94, h: 0.85, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText(title, { x: 0.3, y: 0, w: 9.5, h: 0.85, fontSize: 24, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });
  // Left column
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.0, w: 4.5, h: 0.42, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText(leftTitle, { x: 0.35, y: 1.0, w: 4.4, h: 0.42, fontSize: 14, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });
  const li = leftItems.map(b => ({ text: b, options: { bullet: true, breakLine: true, fontSize: 14, color: C.navy, fontFace: "Calibri", paraSpaceAfter: 6 } }));
  if (li.length) li[li.length-1].options.breakLine = false;
  s.addText(li, { x: 0.35, y: 1.5, w: 4.4, h: 3.6 });
  // Right column
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.0, w: 4.5, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText(rightTitle, { x: 5.25, y: 1.0, w: 4.4, h: 0.42, fontSize: 14, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });
  const ri = rightItems.map(b => ({ text: b, options: { bullet: true, breakLine: true, fontSize: 14, color: C.navy, fontFace: "Calibri", paraSpaceAfter: 6 } }));
  if (ri.length) ri[ri.length-1].options.breakLine = false;
  s.addText(ri, { x: 5.25, y: 1.5, w: 4.4, h: 3.6 });
  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Rwenzori Tech Hub  |  Linux for IT Professionals", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle" });
}

function permSlide(pres) {
  const s = pres.addSlide();
  s.background = { color: C.silver };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.teal }, line: { color: C.teal } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.06, y: 0, w: 9.94, h: 0.85, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText("Understanding File Permissions", { x: 0.3, y: 0, w: 9.5, h: 0.85, fontSize: 24, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });

  // Permission string visualisation
  const chars = ["-", "r", "w", "-", "r", "-", "-", "r", "-", "-"];
  const labels = ["Type", "", "Owner", "", "", "Group", "", "", "Others", ""];
  const fills = [C.code_bg, "1B6B77", "1B6B77", "1B6B77", "2E5A88", "2E5A88", "2E5A88", "7A3B00", "7A3B00", "7A3B00"];
  chars.forEach((ch, i) => {
    const x = 0.5 + i * 0.92;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.0, w: 0.82, h: 0.82, fill: { color: fills[i] }, line: { color: C.code_bg } });
    s.addText(ch, { x, y: 1.0, w: 0.82, h: 0.82, fontSize: 28, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Courier New", margin: 0 });
  });
  // Group labels
  s.addText("File\nType", { x: 0.5, y: 1.85, w: 0.82, h: 0.55, fontSize: 10, color: C.navy, align: "center", fontFace: "Calibri" });
  s.addText("Owner (u)", { x: 1.42, y: 1.85, w: 2.46, h: 0.55, fontSize: 11, bold: true, color: "1B6B77", align: "center", fontFace: "Calibri" });
  s.addText("Group (g)", { x: 3.88, y: 1.85, w: 2.46, h: 0.55, fontSize: 11, bold: true, color: "2E5A88", align: "center", fontFace: "Calibri" });
  s.addText("Others (o)", { x: 6.34, y: 1.85, w: 2.46, h: 0.55, fontSize: 11, bold: true, color: "7A3B00", align: "center", fontFace: "Calibri" });

  // Values table
  const perms = [["r (read)", "4"], ["w (write)", "2"], ["x (execute)", "1"], ["rw-", "4+2 = 6"], ["rwx", "4+2+1 = 7"], ["r--", "4 only = 4"]];
  perms.forEach((row, i) => {
    const x = i < 3 ? 0.5 : 5.2;
    const y = 2.6 + (i % 3) * 0.6;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.0, h: 0.48, fill: { color: C.code_bg }, line: { color: C.code_bg } });
    s.addText(row[0], { x, y, w: 2.0, h: 0.48, fontSize: 14, bold: true, color: C.code_fg, fontFace: "Courier New", align: "center", valign: "middle", margin: 0 });
    s.addText(`= ${row[1]}`, { x: x + 2.05, y, w: 2.1, h: 0.48, fontSize: 14, color: C.navy, fontFace: "Calibri", valign: "middle" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Rwenzori Tech Hub  |  Linux for IT Professionals", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle" });
}

function closingSlide(pres, nextDay) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.12, w: 0.06, h: 5.505, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("✅", { x: 0.5, y: 1.0, w: 9, h: 1.0, fontSize: 50, align: "center" });
  s.addText("Session Complete!", { x: 0.5, y: 2.0, w: 9.0, h: 0.8, fontSize: 34, bold: true, color: C.white, align: "center", fontFace: "Calibri" });
  if (nextDay) {
    s.addText(`Up Next: ${nextDay}`, { x: 1, y: 2.9, w: 8.0, h: 0.55, fontSize: 18, color: C.teal, align: "center", fontFace: "Calibri" });
  }
  s.addText("Questions & Hands-on Lab Time", { x: 1, y: 3.55, w: 8.0, h: 0.5, fontSize: 16, color: C.muted, align: "center", fontFace: "Calibri", italics: true });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Rwenzori Tech Hub  |  Fort Portal City", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle", align: "center" });
}

// ============================
// DAY 1 DECK
// ============================
function makeDay1() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Linux for IT Professionals — Day 1";

  titleSlide(pres, "Introduction & Terminal Basics", "Getting comfortable with Linux and the command line", "DAY 1");

  // Agenda
  contentSlide(pres, "Day 1 Agenda", [
    "Welcome, introductions, and training overview",
    "What is Linux? History, distributions, and why it matters",
    "The Ubuntu desktop environment",
    "The Linux terminal — your most powerful tool",
    "Core navigation commands: pwd, ls, cd",
    "File operations: mkdir, touch, cp, mv, rm",
    "Getting help: man pages and --help",
    "Hands-on Lab: TechCorp directory setup",
  ], "Hands-on practice every session. Ask questions at any time.");

  // Why Linux
  twoColSlide(pres, "Why Linux?",
    "Linux is Everywhere",
    ["Powers 96% of web servers worldwide", "Core of cloud platforms: AWS, GCP, Azure", "Runs Android on billions of devices", "Used in routers, IoT, supercomputers", "Free and open-source since 1991"],
    "What You Will Gain",
    ["Confidence in the Linux terminal", "Ability to manage files and users", "Skills to troubleshoot system issues", "Foundation for DevOps and cloud work", "Competitive advantage in the IT job market"]
  );

  sectionSlide(pres, "DAY 1 — SESSION 1", "What is Linux?");

  contentSlide(pres, "What is Linux?", [
    "Linux is a free, open-source operating system kernel created by Linus Torvalds in 1991",
    "A distribution (distro) bundles Linux with software: Ubuntu, Fedora, CentOS, Debian",
    "Ubuntu 22.04 LTS — the most beginner-friendly distro — is what we use today",
    "Linux uses a multi-user, multi-tasking architecture — perfect for servers",
    "Unlike Windows, Linux gives you full control through the terminal",
    "Linux is not just for servers — it's on your phone, your router, and your TV",
  ], "Fun fact: Android, which runs on over 3 billion devices, is built on the Linux kernel!");

  sectionSlide(pres, "DAY 1 — SESSION 2", "The Terminal");

  contentSlide(pres, "The Terminal — Your Most Powerful Tool", [
    "The terminal lets you control Linux by typing commands",
    "It is faster, more powerful, and more scriptable than clicking through menus",
    "Every GUI action can be done in the terminal — and much more",
    "Basic structure:   command   [options]   [arguments]",
    "Example:   ls -la /home   →   list all files with details in /home",
    "Tab = auto-complete   |   Up/Down arrows = scroll through history",
    "Ctrl+C = cancel a running command   |   Ctrl+L = clear the screen",
  ], "Don't be afraid of the terminal — mistakes are easy to fix and part of learning!");

  sectionSlide(pres, "DAY 1 — SESSION 3", "Navigation Commands");

  cmdSlide(pres, "Navigation Commands — pwd, ls, cd", [
    { cmd: "pwd", desc: "Print Working Directory — shows exactly where you are in the file system" },
    { cmd: "ls", desc: "List files in the current directory" },
    { cmd: "ls -la", desc: "List ALL files (including hidden) with full details: permissions, size, date" },
    { cmd: "cd ~", desc: "Change to your home directory (~ is a shortcut for /home/yourname)" },
    { cmd: "cd /etc", desc: "Navigate to an absolute path (starting from root /)" },
    { cmd: "cd ..", desc: "Go up one level in the directory tree" },
    { cmd: "cd -", desc: "Return to the previous directory you were in" },
  ]);

  sectionSlide(pres, "DAY 1 — SESSION 4", "File Operations");

  cmdSlide(pres, "File Operations — mkdir, touch, cp, mv, rm", [
    { cmd: "mkdir [name]", desc: "Create a new directory. Use mkdir -p to create nested directories at once" },
    { cmd: "touch [file]", desc: "Create an empty file (or update the timestamp of an existing file)" },
    { cmd: "cp [src] [dst]", desc: "Copy a file or directory. Use cp -r for whole directories" },
    { cmd: "mv [src] [dst]", desc: "Move a file — or rename it if destination is in the same directory" },
    { cmd: "rm [file]", desc: "Delete a file permanently — there is no Recycle Bin in Linux!" },
    { cmd: "rm -r [dir]", desc: "Delete an entire directory and all its contents recursively" },
    { cmd: "rm -i [file]", desc: "Interactive delete — Linux asks for confirmation before each deletion" },
  ]);

  contentSlide(pres, "Key Differences: cp vs mv", [
    "cp = Photocopier — the original file STAYS in place, a copy is created at the destination",
    "mv = Scissors — the original file DISAPPEARS from its location and appears at the destination",
    "mv is also how you RENAME a file: mv old.txt new.txt",
    "rm is PERMANENT — no undo, no Recycle Bin",
    "Always double-check your path before running rm -r on a directory!",
    "Tip: use ls [path] first to verify what you are about to delete",
  ], "Mnemonic: cp = Copy & Paste (original stays). mv = Cut & Paste (original moves away).");

  sectionSlide(pres, "DAY 1 — SESSION 5", "Getting Help");

  cmdSlide(pres, "Getting Help — man, --help, apropos", [
    { cmd: "man ls", desc: "Open the full manual for any command. Navigate with arrows. Press q to quit" },
    { cmd: "ls --help", desc: "Get a quick summary of options for any command. Faster than man" },
    { cmd: "apropos copy", desc: "Search all man page titles and summaries for a keyword" },
    { cmd: "man -k network", desc: "Same as apropos — find commands related to a topic" },
    { cmd: "info ls", desc: "Alternative documentation system — sometimes more detailed than man" },
    { cmd: "whatis ls", desc: "One-line description of what a command does" },
  ]);

  closingSlide(pres, "Day 2: File System, Permissions & User Management");

  pres.writeFile({ fileName: "./Day1_Slides.pptx" }).then(() => console.log("Done: Day1_Slides.pptx"));
}

// ============================
// DAY 2 DECK
// ============================
function makeDay2() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Linux for IT Professionals — Day 2";

  titleSlide(pres, "File System, Permissions & User Management", "Controlling who can access what — and creating user accounts", "DAY 2");

  contentSlide(pres, "Day 2 Agenda", [
    "Day 1 quick recap — 5 command quiz",
    "The Linux file system hierarchy — where everything lives",
    "Viewing and searching file contents: cat, less, grep, head, tail",
    "Text editing with nano",
    "File permissions — reading and changing them with chmod",
    "File ownership with chown and chgrp",
    "Creating and managing user accounts",
    "Groups, group membership, and shared access",
    "Hands-on Lab: users, groups, and shared directory",
  ], "By end of Day 2: you will understand how Linux controls access to every file on the system.");

  sectionSlide(pres, "DAY 2 — SESSION 1", "The Linux File System");

  contentSlide(pres, "The Linux File System Hierarchy", [
    "/  (root) — The top of everything. Every file on the system lives under here",
    "/home — Personal directories for each user. Your files live here: /home/alice",
    "/etc — System configuration files: network settings, user database, services",
    "/var — Variable data that changes constantly: log files, databases, mail queues",
    "/bin — Essential command binaries: ls, cp, mv, and other core tools",
    "/tmp — Temporary files. This is wiped clean on every reboot",
    "/usr — Installed applications, libraries, and user programs",
  ], "Think of / like the C:\\ drive in Windows — but everything starts here, not on separate drives.");

  sectionSlide(pres, "DAY 2 — SESSION 2", "Viewing Files");

  cmdSlide(pres, "Viewing File Contents — cat, less, head, tail, grep", [
    { cmd: "cat [file]", desc: "Display the entire file contents at once. Best for short files" },
    { cmd: "less [file]", desc: "View file with scroll support. Arrow keys navigate. Press q to quit" },
    { cmd: "head -10 [file]", desc: "Show the first 10 lines of a file (default is 10 if no number given)" },
    { cmd: "tail -10 [file]", desc: "Show the last 10 lines. Essential for reading the end of log files" },
    { cmd: "tail -f [file]", desc: "Watch a file in real time — new lines appear as they are added (great for logs)" },
    { cmd: "grep 'text' [file]", desc: "Search inside a file for lines containing 'text'. Case-sensitive by default" },
    { cmd: "grep -i 'text'", desc: "Case-insensitive search. grep -c counts matches. grep -n shows line numbers" },
  ]);

  sectionSlide(pres, "DAY 2 — SESSION 3", "File Permissions");

  permSlide(pres);

  cmdSlide(pres, "Changing Permissions — chmod", [
    { cmd: "chmod 644 file.txt", desc: "Owner: rw-  |  Group: r--  |  Others: r--  (standard for documents)" },
    { cmd: "chmod 755 script.sh", desc: "Owner: rwx  |  Group: r-x  |  Others: r-x  (standard for executables)" },
    { cmd: "chmod 700 private.txt", desc: "Owner: rwx  |  Group: ---  |  Others: ---  (private files only)" },
    { cmd: "chmod +x script.sh", desc: "Add execute permission for everyone (symbolic mode)" },
    { cmd: "chmod u+w file.txt", desc: "Add write permission for owner only (u=user, g=group, o=others)" },
    { cmd: "chmod go-w file.txt", desc: "Remove write permission from group and others" },
    { cmd: "chown alice file.txt", desc: "Change the owner of file.txt to alice (requires sudo)" },
  ]);

  sectionSlide(pres, "DAY 2 — SESSION 4", "User Management");

  cmdSlide(pres, "User Account Management", [
    { cmd: "sudo adduser [name]", desc: "Create a new user account (interactive — prompts for password and details)" },
    { cmd: "passwd [user]", desc: "Set or change a user's password. sudo required for other users' passwords" },
    { cmd: "sudo deluser [name]", desc: "Delete a user account. Use --remove-home to also delete their home directory" },
    { cmd: "su [user]", desc: "Switch to another user account. Type exit to return to your original user" },
    { cmd: "whoami", desc: "Display the username of the currently logged-in user" },
    { cmd: "id [user]", desc: "Show user ID (UID), primary group ID, and all group memberships" },
    { cmd: "w / who", desc: "Show which users are currently logged into the system and what they are doing" },
  ]);

  cmdSlide(pres, "Group Management", [
    { cmd: "sudo addgroup [name]", desc: "Create a new group (e.g. sudo addgroup rthstaff)" },
    { cmd: "sudo usermod -aG [g] [u]", desc: "Add user to a group. -a = append (NEVER omit -a or user loses other groups!)" },
    { cmd: "groups [user]", desc: "List all groups that a user belongs to" },
    { cmd: "grep rthstaff /etc/group", desc: "View group details in the /etc/group file" },
    { cmd: "sudo chown u:g [file]", desc: "Change both owner AND group: chown alice:rthstaff report.txt" },
    { cmd: "sudo chmod 775 [dir]", desc: "Group can read and write; others can only read — ideal for shared folders" },
    { cmd: "cat /etc/group", desc: "View all groups on the system with their members" },
  ]);

  closingSlide(pres, "Day 3: Packages, Networking & Shell Scripting");

  pres.writeFile({ fileName: "./Day2_Slides.pptx" }).then(() => console.log("Done: Day2_Slides.pptx"));
}

// ============================
// DAY 3 DECK
// ============================
function makeDay3() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Linux for IT Professionals — Day 3";

  titleSlide(pres, "Packages, Networking & Shell Scripting", "Installing software, diagnosing networks, and automating tasks", "DAY 3");

  contentSlide(pres, "Day 3 Agenda", [
    "Days 1 & 2 recap — command quiz",
    "Package management with APT — installing and removing software",
    "Basic network diagnostics — ping, ip addr, /etc/hosts",
    "System monitoring — htop, df, free, ps",
    "Introduction to shell scripting — variables, echo, shebang",
    "Scripting with logic — if/else, loops, automation",
    "Capstone Lab — full real-world scenario",
    "Written assessment and practical demonstration",
    "Certificate ceremony and closing",
  ], "Today you bring it all together. By end of Day 3 you can automate real IT tasks.");

  sectionSlide(pres, "DAY 3 — SESSION 1", "Package Management");

  contentSlide(pres, "Package Management with APT", [
    "APT (Advanced Package Tool) is Ubuntu's package manager — like an app store for the terminal",
    "Packages are software programs plus all their dependencies",
    "APT downloads packages from 'repositories' — trusted online servers",
    "Always run apt update BEFORE installing — this refreshes the list of available packages",
    "Never run apt install without apt update first — you may get an outdated version",
    "Packages are free and digitally signed — APT verifies authenticity automatically",
  ], "The Ubuntu repository has over 60,000 packages — if software exists, apt can probably install it.");

  cmdSlide(pres, "APT Package Management Commands", [
    { cmd: "sudo apt update", desc: "Refresh the package list from repositories. ALWAYS run this first!" },
    { cmd: "sudo apt upgrade", desc: "Install all available updates for installed packages" },
    { cmd: "sudo apt install [pkg]", desc: "Download and install a package and all its dependencies" },
    { cmd: "sudo apt remove [pkg]", desc: "Uninstall a package (config files are kept)" },
    { cmd: "sudo apt purge [pkg]", desc: "Uninstall a package AND remove all its configuration files" },
    { cmd: "apt search [keyword]", desc: "Search available packages by name or description keyword" },
    { cmd: "apt show [package]", desc: "Show detailed information about a package before installing" },
  ]);

  sectionSlide(pres, "DAY 3 — SESSION 2", "Network Diagnostics");

  cmdSlide(pres, "Basic Network Diagnostics", [
    { cmd: "ping -c 4 google.com", desc: "Send 4 ICMP packets to test connectivity. -c sets count (without -c it runs forever)" },
    { cmd: "ip addr", desc: "Show all network interfaces and their IP addresses. Look for 'inet' under eth0/wlan0" },
    { cmd: "hostname", desc: "Display the machine's hostname. hostname -I shows the IP address" },
    { cmd: "cat /etc/hosts", desc: "View local hostname-to-IP mappings — checked before DNS" },
    { cmd: "ss -tulpn", desc: "Show open ports and services listening for connections (modern netstat)" },
    { cmd: "curl http://example.com", desc: "Fetch a web page or test an API endpoint from the terminal" },
    { cmd: "ping 127.0.0.1", desc: "Loopback test — confirms that networking is functioning at all" },
  ]);

  contentSlide(pres, "Network Diagnostic Flowchart", [
    "Step 1: ping 127.0.0.1 — Is the local network stack working at all?",
    "Step 2: ping [your router IP] — Can you reach the local network gateway?",
    "Step 3: ping 8.8.8.8 — Can you reach the internet by IP address?",
    "Step 4: ping google.com — Is DNS (name resolution) working correctly?",
    "Each step isolates a different layer: hardware → LAN → WAN → DNS",
    "If Step 3 works but Step 4 fails → the problem is DNS, not connectivity",
    "If Step 2 fails → check your cable, Wi-Fi connection, or router",
  ], "This 4-step diagnostic resolves the majority of network support calls. Learn it and use it every time.");

  sectionSlide(pres, "DAY 3 — SESSION 3", "System Monitoring");

  cmdSlide(pres, "System Monitoring Commands", [
    { cmd: "htop", desc: "Coloured, interactive process viewer. F9=kill process, F10=quit. Better than top" },
    { cmd: "top", desc: "Built-in process monitor. Press k to kill a process by PID, q to quit" },
    { cmd: "df -h", desc: "Disk Free — shows used/available space on all mounted filesystems" },
    { cmd: "du -sh [dir]", desc: "Disk Usage — shows how much space a specific directory is consuming" },
    { cmd: "free -h", desc: "Show RAM (total, used, free, available) and swap usage. -h = human readable" },
    { cmd: "uptime", desc: "How long the system has been running + load averages (1, 5, 15 minutes)" },
    { cmd: "ps aux | grep [name]", desc: "List all processes, filter by name. Useful for finding a specific program's PID" },
  ]);

  sectionSlide(pres, "DAY 3 — SESSION 4", "Shell Scripting");

  contentSlide(pres, "Shell Scripting — Automate Everything", [
    "A shell script is a text file containing terminal commands that run in sequence",
    "The first line must be the shebang:  #!/bin/bash  (tells the OS which interpreter to use)",
    "Make the script executable before running:  chmod +x script.sh",
    "Run it:  ./script.sh   or   bash script.sh",
    "Variables: NAME=\"Alice\"  →  no spaces around =. Use with $NAME or ${NAME}",
    "Command substitution: DATE=$(date)  →  runs date and stores the output",
    "echo prints text to the terminal. echo \"Hello $NAME\" prints Hello Alice",
  ], "A 10-line script can save hours of manual work every week. Scripting is a superpower!");

  cmdSlide(pres, "Shell Scripting Logic — if/else and Loops", [
    { cmd: "#!/bin/bash", desc: "Always the first line of every bash script — no exceptions" },
    { cmd: "VAR=\"value\"", desc: "Assign a variable. No spaces around =. Reference with $VAR" },
    { cmd: "if [ $X -gt 5 ]", desc: "Conditional: if X is greater than 5. -gt=greater, -lt=less, -eq=equal" },
    { cmd: "then / else / fi", desc: "if blocks start with then, alternate with else, and close with fi" },
    { cmd: "for X in a b c; do", desc: "Loop through a list of values. Each iteration runs the block below" },
    { cmd: "done", desc: "Closes a for or while loop block" },
    { cmd: "echo \"$(date)\"", desc: "Command substitution — runs date and embeds the result in the output string" },
  ]);

  // Capstone slide
  const s = pres.addSlide();
  s.background = { color: C.silver };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.06, y: 0, w: 9.94, h: 0.85, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText("Capstone Lab — RTH File Server Setup", { x: 0.3, y: 0, w: 9.5, h: 0.85, fontSize: 22, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });
  s.addText("Scenario: You are setting up a shared file server for Rwenzori Tech Hub.", { x: 0.4, y: 0.95, w: 9.2, h: 0.45, fontSize: 15, color: C.navy, fontFace: "Calibri", italics: true });
  const tasks = [
    "Create /home/rth_share with permissions 775",
    "Create user accounts: user_alice, user_bob, user_carol",
    "Create group rth_team — add all three users",
    "Set /home/rth_share ownership to root:rth_team",
    "As user_alice: create shared_notes.txt with content",
    "As user_bob: read the file created by user_alice",
    "Write daily_report.sh — shows date, who, disk space",
    "Run the script — paste output in your workbook",
  ];
  tasks.forEach((task, i) => {
    const x = i < 4 ? 0.4 : 5.1;
    const y = 1.5 + (i % 4) * 0.78;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.5, h: 0.65, fill: { color: i < 4 ? "DDF0F5" : "FFF0DC" }, line: { color: i < 4 ? C.teal : C.accent, width: 1 }, shadow: makeShadow() });
    s.addText([{ text: `${i+1}. `, options: { bold: true, color: i < 4 ? C.teal : C.accent } }, { text: task, options: { color: C.navy } }],
      { x, y, w: 4.5, h: 0.65, fontSize: 12, fontFace: "Calibri", valign: "middle", margin: 8 });
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("Work independently. Ask for help only if stuck for more than 5 minutes.", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle", align: "center" });

  // Final closing
  const sc = pres.addSlide();
  sc.background = { color: C.navy };
  sc.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });
  sc.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.12, w: 0.06, h: 5.505, fill: { color: C.teal }, line: { color: C.teal } });
  sc.addText("🐧", { x: 0, y: 0.9, w: 10, h: 1.0, fontSize: 60, align: "center" });
  sc.addText("You're Ready to Linux!", { x: 0.5, y: 1.9, w: 9.0, h: 0.9, fontSize: 36, bold: true, color: C.white, align: "center", fontFace: "Calibri" });
  sc.addText("Keep practising. The terminal is your friend.", { x: 1, y: 2.85, w: 8.0, h: 0.55, fontSize: 18, color: C.muted, align: "center", fontFace: "Calibri" });
  sc.addText([
    { text: "linuxjourney.com", options: { color: C.teal } }, { text: "   |   ", options: { color: C.muted } },
    { text: "linuxcommand.org", options: { color: C.teal } }, { text: "   |   ", options: { color: C.muted } },
    { text: "help.ubuntu.com", options: { color: C.teal } }
  ], { x: 0.5, y: 3.5, w: 9.0, h: 0.5, fontSize: 15, align: "center", fontFace: "Calibri" });
  sc.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.33, w: 10, h: 0.295, fill: { color: C.dark }, line: { color: C.dark } });
  sc.addText("Rwenzori Tech Hub  |  Fort Portal City  |  rwenzoritechhub.com", { x: 0.3, y: 5.33, w: 9.4, h: 0.295, fontSize: 10, color: C.muted, valign: "middle", align: "center" });

  pres.writeFile({ fileName: "./Day3_Slides.pptx" }).then(() => console.log("Done: Day3_Slides.pptx"));
}

makeDay1();
makeDay2();
makeDay3();
