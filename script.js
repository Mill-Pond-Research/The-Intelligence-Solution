const chapters = [
    { title: "Home", file: "docs/README.md" },
    { title: "1. Introduction: The AI revolution in business", file: "docs/chapter1.md" },
    { title: "2. The Rise of Artificial Intelligence", file: "docs/chapter2.md" },
    { title: "3. Understanding Intelligence as a Service (IaaS)", file: "docs/chapter3.md" },
    { title: "4. The Need for Model Agnostic Frameworks", file: "docs/ch-06-the-need-for-model-agnostic-frameworks.md" },
    { title: "5. Hybrid Capabilities", file: "docs/ch-07-hybrid-capabilties-testing-deployment-building.md" },
    { title: "6. Problem-Solution AI (PSAI) Framework", file: "docs/ch-08-psai-framework.md" },
    { title: "7. Realizing the Value of AI: ROI Analysis", file: "docs/ch-09-realizing-the-value-of-ai-roi-analysis.md" },
    { title: "8. Overcoming Ethical Challenges in AI", file: "docs/ch-10-overcoming-ethical-challenges-in-ai.md" },
    { title: "9. Navigating Regulatory Frameworks for AI", file: "docs/ch-11-navigating-regulatory-frameworks-for-ai.md" },
    { title: "10. Building an AI-Ready Organization", file: "docs/ch-12-building-an-ai-ready-organization.md" },
    { title: "11. Leveraging AI for Enhanced Customer Experiences", file: "docs/ch-04-leveraging-ai-for-advanced-customer-experience.md" },
    { title: "12. AI-Driven Decision Making", file: "docs/ch-05-ai-driven-decision-making-from-insights-to-action.md" },
    { title: "13. The Future of AI", file: "docs/ch-13-future-of-ai-emerging-technologies-and-trends.md" },
    { title: "14. AI Implementation: Best Practices", file: "docs/ch-14-implementing-ai-best-practices-and-lessons-learned.md" },
    { title: "15. Conclusion", file: "docs/ch-15-conclusion-empowering-business-success-with-intelligence-as-a-service.md" }
];

function loadChapter(file) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `docs/${file}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const content = marked.parse(xhr.responseText);
                document.getElementById('markdown-content').innerHTML = content;
                hljs.highlightAll();
            } else {
                console.error('Error loading chapter:', xhr.status);
                document.getElementById('markdown-content').innerHTML = '<p>Error loading chapter. Please try again.</p>';
            }
        }
    };
    xhr.send();
}

function populateChapterList() {
    const chapterList = document.getElementById('chapter-list');
    chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = chapter.title;
        a.onclick = (e) => {
            e.preventDefault();
            loadChapter(chapter.file);
        };
        li.appendChild(a);
        chapterList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateChapterList();
    loadChapter('README.md');
});