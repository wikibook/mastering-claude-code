// Portfolio data - Customize this section with your information
const portfolioData = {
    name: "홍길동",
    title: "Full Stack Developer",
    email: "developer@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    bio: "열정적인 개발자로서 사용자 경험을 최우선으로 하는 웹 애플리케이션을 만듭니다.",

    skills: {
        frontend: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Next.js"],
        backend: ["Node.js", "Python", "Express", "Django", "PostgreSQL"],
        tools: ["Git", "Docker", "AWS", "Figma", "Jest"]
    },

    projects: [
        {
            name: "E-Commerce Platform",
            description: "React와 Node.js를 활용한 풀스택 전자상거래 플랫폼. 실시간 재고 관리와 결제 시스템을 구현했습니다.",
            tech: ["React", "Node.js", "MongoDB", "Stripe"],
            link: "https://github.com/yourusername/project1"
        },
        {
            name: "AI Chatbot Service",
            description: "자연어 처리를 활용한 고객 서비스 챗봇. GPT API를 통합하여 지능형 대화를 구현했습니다.",
            tech: ["Python", "FastAPI", "OpenAI", "PostgreSQL"],
            link: "https://github.com/yourusername/project2"
        },
        {
            name: "Task Management App",
            description: "팀 협업을 위한 실시간 태스크 관리 애플리케이션. 드래그 앤 드롭과 실시간 동기화 기능을 제공합니다.",
            tech: ["Vue.js", "Firebase", "Vuex", "Tailwind"],
            link: "https://github.com/yourusername/project3"
        }
    ],

    experience: [
        {
            company: "테크 스타트업",
            position: "Senior Frontend Developer",
            period: "2022 - Present",
            description: "React 기반 SaaS 제품 개발 및 팀 리딩"
        },
        {
            company: "웹 에이전시",
            position: "Full Stack Developer",
            period: "2020 - 2022",
            description: "다양한 클라이언트 프로젝트의 풀스택 개발"
        }
    ]
};

// Command history
let commandHistory = [];
let historyIndex = -1;

// DOM elements
const commandInput = document.getElementById('commandInput');
const outputContainer = document.getElementById('outputContainer');
const terminalContent = document.getElementById('terminalContent');

// Available commands
const commands = {
    help: {
        description: "사용 가능한 모든 명령어를 표시합니다",
        execute: () => {
            return `
                <div class="card">
                    <h3>📚 Available Commands</h3>
                    <ul class="info-list">
                        <li><span class="label">help</span> - <span class="value">사용 가능한 모든 명령어 표시</span></li>
                        <li><span class="label">whoami</span> - <span class="value">개발자 정보 표시</span></li>
                        <li><span class="label">skills</span> - <span class="value">기술 스택 표시</span></li>
                        <li><span class="label">projects</span> - <span class="value">프로젝트 목록 표시</span></li>
                        <li><span class="label">experience</span> - <span class="value">경력 사항 표시</span></li>
                        <li><span class="label">contact</span> - <span class="value">연락처 정보 표시</span></li>
                        <li><span class="label">ls</span> - <span class="value">파일 시스템 탐색 (데모)</span></li>
                        <li><span class="label">clear</span> - <span class="value">터미널 화면 지우기</span></li>
                        <li><span class="label">banner</span> - <span class="value">환영 메시지 다시 표시</span></li>
                    </ul>
                    <p style="margin-top: 16px; color: var(--comment);">
                        <span class="keyword">Tip:</span> 화살표 키(↑↓)로 명령어 기록을 탐색할 수 있습니다.
                    </p>
                </div>
            `;
        }
    },

    whoami: {
        description: "개발자 정보를 표시합니다",
        execute: () => {
            return `
                <div class="card">
                    <h3>👨‍💻 About Me</h3>
                    <ul class="info-list">
                        <li><span class="label">Name:</span> <span class="value">${portfolioData.name}</span></li>
                        <li><span class="label">Title:</span> <span class="value">${portfolioData.title}</span></li>
                        <li><span class="label">Bio:</span> <span class="value">${portfolioData.bio}</span></li>
                    </ul>
                </div>
            `;
        }
    },

    skills: {
        description: "기술 스택을 표시합니다",
        execute: () => {
            const frontendSkills = portfolioData.skills.frontend.map(skill =>
                `<div class="skill-item">${skill}</div>`
            ).join('');

            const backendSkills = portfolioData.skills.backend.map(skill =>
                `<div class="skill-item">${skill}</div>`
            ).join('');

            const toolsSkills = portfolioData.skills.tools.map(skill =>
                `<div class="skill-item">${skill}</div>`
            ).join('');

            return `
                <div class="card">
                    <h3>💻 Frontend</h3>
                    <div class="skills-grid">${frontendSkills}</div>
                </div>
                <div class="card">
                    <h3>⚙️ Backend</h3>
                    <div class="skills-grid">${backendSkills}</div>
                </div>
                <div class="card">
                    <h3>🛠️ Tools & Others</h3>
                    <div class="skills-grid">${toolsSkills}</div>
                </div>
            `;
        }
    },

    projects: {
        description: "프로젝트 목록을 표시합니다",
        execute: () => {
            const projectCards = portfolioData.projects.map((project, index) => `
                <div class="card" style="animation-delay: ${index * 0.1}s;">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="card-meta">
                        ${project.tech.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <p style="margin-top: 12px;">
                        <a href="${project.link}" class="link" target="_blank">View on GitHub →</a>
                    </p>
                </div>
            `).join('');

            return projectCards;
        }
    },

    experience: {
        description: "경력 사항을 표시합니다",
        execute: () => {
            const experienceCards = portfolioData.experience.map((exp, index) => `
                <div class="card" style="animation-delay: ${index * 0.1}s;">
                    <h3>${exp.position}</h3>
                    <p>
                        <span class="variable">${exp.company}</span> |
                        <span class="comment">${exp.period}</span>
                    </p>
                    <p style="margin-top: 12px;">${exp.description}</p>
                </div>
            `).join('');

            return experienceCards;
        }
    },

    contact: {
        description: "연락처 정보를 표시합니다",
        execute: () => {
            return `
                <div class="card">
                    <h3>📬 Contact Me</h3>
                    <ul class="info-list">
                        <li><span class="label">Email:</span> <a href="mailto:${portfolioData.email}" class="link">${portfolioData.email}</a></li>
                        <li><span class="label">GitHub:</span> <a href="${portfolioData.github}" class="link" target="_blank">${portfolioData.github}</a></li>
                        <li><span class="label">LinkedIn:</span> <a href="${portfolioData.linkedin}" class="link" target="_blank">${portfolioData.linkedin}</a></li>
                    </ul>
                </div>
            `;
        }
    },

    ls: {
        description: "파일 시스템을 탐색합니다",
        execute: () => {
            return `
                <div class="card">
                    <pre style="color: var(--neon-blue);">
<span class="function">drwxr-xr-x</span>  <span class="number">4</span> user  staff   <span class="number">128</span> Nov 22 <span class="number">2025</span>  <span class="keyword">projects/</span>
<span class="function">drwxr-xr-x</span>  <span class="number">3</span> user  staff   <span class="number">96</span>  Nov 22 <span class="number">2025</span>  <span class="keyword">skills/</span>
<span class="function">-rw-r--r--</span>  <span class="number">1</span> user  staff   <span class="number">2048</span> Nov 22 <span class="number">2025</span>  <span class="string">about.txt</span>
<span class="function">-rw-r--r--</span>  <span class="number">1</span> user  staff   <span class="number">1024</span> Nov 22 <span class="number">2025</span>  <span class="string">contact.txt</span>
<span class="function">-rwxr-xr-x</span>  <span class="number">1</span> user  staff   <span class="number">4096</span> Nov 22 <span class="number">2025</span>  <span class="variable">portfolio.exe</span>
                    </pre>
                </div>
            `;
        }
    },

    clear: {
        description: "터미널 화면을 지웁니다",
        execute: () => {
            outputContainer.innerHTML = '';
            return '';
        }
    },

    banner: {
        description: "환영 메시지를 다시 표시합니다",
        execute: () => {
            return `
                <pre class="ascii-art">
 ██████╗ ███████╗██╗   ██╗    ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
 ██╔══██╗██╔════╝██║   ██║    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
 ██║  ██║█████╗  ██║   ██║    ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
 ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
 ██████╔╝███████╗ ╚████╔╝     ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
 ╚═════╝ ╚══════╝  ╚═══╝      ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝
                </pre>
                <p class="welcome-text">
                    <span class="keyword">Welcome to</span> <span class="string">Developer Portfolio v2.0.1</span><br>
                    <span class="comment">// Type 'help' to see available commands</span>
                </p>
            `;
        }
    }
};

// Typing animation
async function typeText(element, text, speed = 30) {
    element.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        element.innerHTML += text.charAt(i);
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

// Process command
function processCommand(input) {
    const cmd = input.trim().toLowerCase();

    // Add to history
    if (cmd && commandHistory[commandHistory.length - 1] !== cmd) {
        commandHistory.push(cmd);
    }
    historyIndex = commandHistory.length;

    // Create output element
    const outputDiv = document.createElement('div');
    outputDiv.className = 'command-output';

    // Echo the command
    const echoDiv = document.createElement('div');
    echoDiv.className = 'command-echo';
    echoDiv.innerHTML = `<span class="prompt">
        <span class="user">guest</span><span class="at">@</span><span class="host">portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span>
    </span> ${input}`;
    outputDiv.appendChild(echoDiv);

    // Execute command
    const resultDiv = document.createElement('div');

    if (cmd === '') {
        // Empty command, just show prompt
        outputContainer.appendChild(outputDiv);
    } else if (commands[cmd]) {
        const result = commands[cmd].execute();
        resultDiv.innerHTML = result;
        outputDiv.appendChild(resultDiv);
        outputContainer.appendChild(outputDiv);
    } else {
        // Unknown command
        resultDiv.innerHTML = `
            <p class="error">Command not found: ${cmd}</p>
            <p class="comment">Type 'help' to see available commands.</p>
        `;
        outputDiv.appendChild(resultDiv);
        outputContainer.appendChild(outputDiv);
    }

    // Scroll to bottom
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Event listeners
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = commandInput.value;
        processCommand(input);
        commandInput.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            commandInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            commandInput.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const input = commandInput.value.toLowerCase();
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            commandInput.value = matches[0];
        }
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        commands.clear.execute();
    }
});

// Keep input focused
document.addEventListener('click', () => {
    commandInput.focus();
});

// Window control buttons (just for show)
document.querySelector('.control.close').addEventListener('click', () => {
    if (confirm('정말로 포트폴리오를 닫으시겠습니까?')) {
        document.querySelector('.terminal-window').style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; color: var(--neon-pink); font-family: var(--font-main); font-size: 24px; text-shadow: 0 0 20px rgba(255, 42, 109, 0.8);">Connection closed. Refresh to reconnect.</div>';
        }, 300);
    }
});

document.querySelector('.control.minimize').addEventListener('click', () => {
    const terminal = document.querySelector('.terminal-window');
    terminal.style.transform = 'scale(0.1)';
    terminal.style.opacity = '0';
    setTimeout(() => {
        terminal.style.transform = 'scale(1)';
        terminal.style.opacity = '1';
    }, 300);
});

document.querySelector('.control.maximize').addEventListener('click', () => {
    const terminal = document.querySelector('.terminal-window');
    if (terminal.style.maxWidth === 'none') {
        terminal.style.maxWidth = '1200px';
        terminal.style.width = '90%';
    } else {
        terminal.style.maxWidth = 'none';
        terminal.style.width = '98%';
    }
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize
commandInput.focus();

// Easter egg - konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'command-output';
        outputDiv.innerHTML = `
            <div class="card" style="border-color: var(--neon-pink); box-shadow: 0 0 30px rgba(255, 42, 109, 0.5);">
                <h3>🎮 Easter Egg Unlocked!</h3>
                <p style="color: var(--neon-green);">축하합니다! 숨겨진 코나미 코드를 발견하셨습니다!</p>
                <p class="comment">// You're a true developer at heart 💖</p>
            </div>
        `;
        outputContainer.appendChild(outputDiv);
        terminalContent.scrollTop = terminalContent.scrollHeight;
        konamiCode = [];
    }
});
