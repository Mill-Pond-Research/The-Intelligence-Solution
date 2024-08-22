const chapters = [
    { title: "Home", file: "docs/home.md" },
    { title: "Authors' Forward", file: "docs/authors-forward.md" },
    { title: "1. Introduction", file: "docs/ch-01-introduction.md" },
    { title: "2. The Rise of AI", file: "docs/ch-02-the-rise-of-ai.md" },
    { title: "3. Understanding Intelligence as a Service", file: "docs/ch-03-understanding-intelligence-as-a-service.md" },
    { title: "4. Leveraging AI for Advanced Customer Experience", file: "docs/ch-04-leveraging-ai-for-advanced-customer-experience.md" },
    { title: "5. AI-Driven Decision Making: From Insights to Action", file: "docs/ch-05-ai-driven-decision-making-from-insights-to-action.md" },
    { title: "6. The Need for Model Agnostic Frameworks", file: "docs/ch-06-the-need-for-model-agnostic-frameworks.md" },
    { title: "7. Hybrid Capabilities: Testing + Deployment + Building", file: "docs/ch-07-hybrid-capabilties-testing-deployment-building.md" },
    { title: "8. PSAI Framework", file: "docs/ch-08-psai-framework.md" },
    { title: "9. Realizing the Value of AI: ROI Analysis", file: "docs/ch-09-realizing-the-value-of-ai-roi-analysis.md" },
    { title: "10. Overcoming Ethical Challenges in AI", file: "docs/ch-10-overcoming-ethical-challenges-in-ai.md" },
    { title: "11. Navigating Regulatory Frameworks for AI", file: "docs/ch-11-navigating-regulatory-frameworks-for-ai.md" },
    { title: "12. Building an AI-Ready Organization", file: "docs/ch-12-building-an-ai-ready-organization.md" },
    { title: "13. Future of AI: Emerging Technologies and Trends", file: "docs/ch-13-future-of-ai-emerging-technologies-and-trends.md" },
    { title: "14. Implementing AI: Best Practices and Lessons Learned", file: "docs/ch-14-implementing-ai-best-practices-and-lessons-learned.md" },
    { title: "15. Conclusion: Empowering Business Success with Intelligence as a Service", file: "docs/ch-15-conclusion-empowering-business-success-with-intelligence-as-a-service.md" }
];

const baseUrl = 'https://millpondresearch.com/the-intelligence-solution/';

function loadChapter(file) {
    const xhr = new XMLHttpRequest();
    const url = `${baseUrl}${file}`;
    
    showLoading();
    
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const content = marked.parse(xhr.responseText);
                document.getElementById('markdown-content').innerHTML = addIdsToHeadings(content);
                
                requestAnimationFrame(() => {
                    const toc = generateTableOfContents(content);
                    document.getElementById('toc-sidebar').innerHTML = toc;
                    hljs.highlightAll();
                    setupIntersectionObserver();
                    setupMobileToC();
                });

                localStorage.setItem(file, xhr.responseText);
                console.log(`Successfully loaded and rendered: ${file}`);
            } else {
                console.error(`Error loading chapter: ${xhr.status} ${xhr.statusText}, File: ${file}, URL: ${url}`);
                handleLoadError(file, xhr.status);
            }
        }
    };
    xhr.onerror = function() {
        console.error(`Network error occurred while fetching ${file}`);
        handleLoadError(file, 'network');
    };
    xhr.send();
}

function showLoading() {
    document.getElementById('markdown-content').innerHTML = '<div class="loading">Loading chapter...</div>';
}

function handleLoadError(file, status) {
    const cachedContent = localStorage.getItem(file);
    if (cachedContent) {
        const content = marked.parse(cachedContent);
        document.getElementById('markdown-content').innerHTML = addIdsToHeadings(content);
        requestAnimationFrame(() => {
            const toc = generateTableOfContents(content);
            document.getElementById('toc-sidebar').innerHTML = toc;
            hljs.highlightAll();
            setupIntersectionObserver();
            setupMobileToC();
        });
        console.log(`Loaded chapter from cache: ${file}`);
    } else {
        let errorMessage = `<p>Error loading chapter "${file}". `;
        if (status === 404) {
            errorMessage += 'The requested chapter could not be found. ';
        } else if (status === 403) {
            errorMessage += 'Access to the chapter is forbidden. ';
        } else if (status === 500) {
            errorMessage += 'There was a server error. ';
        } else if (status === 'network') {
            errorMessage += 'A network error occurred. Please check your internet connection. ';
        } else {
            errorMessage += 'An unexpected error occurred. ';
        }
        errorMessage += 'Please try again later or contact support if the problem persists.</p>';
        document.getElementById('markdown-content').innerHTML = errorMessage;
    }
}

function generateTableOfContents(content) {
    const headings = content.match(/<h([2-3]).*?>(.*?)<\/h[2-3]>/g);
    if (!headings) return '';

    let toc = '<h2>Chapter Contents</h2><ul>';
    const idMap = new Map();

    headings.forEach(heading => {
        const level = heading.match(/<h([2-3])/)[1];
        const text = heading.match(/<h[2-3].*?>(.*?)<\/h[2-3]>/)[1];
        let id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Ensure unique IDs
        if (idMap.has(id)) {
            idMap.set(id, idMap.get(id) + 1);
            id = `${id}-${idMap.get(id)}`;
        } else {
            idMap.set(id, 1);
        }

        toc += `<li class="toc-level-${level}"><a href="#${id}">${text}</a></li>`;
    });
    toc += '</ul>';
    return toc;
}

function addIdsToHeadings(content) {
    return content.replace(/<h([2-3])>(.*?)<\/h[2-3]>/g, (match, level, text) => {
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `<h${level} id="${id}">${text}</h${level}>`;
    });
}

function setupIntersectionObserver() {
    const headings = document.querySelectorAll('#markdown-content h2, #markdown-content h3');
    const tocLinks = document.querySelectorAll('#toc-sidebar a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tocLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { rootMargin: '-100px 0px -66%' });

    headings.forEach(heading => observer.observe(heading));
}

function setupMobileToC() {
    const tocSidebar = document.getElementById('toc-sidebar');
    const existingToggle = document.querySelector('.toc-toggle');
    
    if (existingToggle) {
        existingToggle.remove();
    }

    const tocToggle = document.createElement('button');
    tocToggle.textContent = 'Table of Contents';
    tocToggle.classList.add('toc-toggle', 'lg:hidden', 'mb-4', 'w-full', 'bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded');
    
    tocSidebar.parentNode.insertBefore(tocToggle, tocSidebar);
    
    tocToggle.addEventListener('click', () => {
        tocSidebar.classList.toggle('hidden');
        tocToggle.textContent = tocSidebar.classList.contains('hidden') ? 'Show Table of Contents' : 'Hide Table of Contents';
    });

    // Initially hide the ToC on mobile
    if (window.innerWidth < 1024) {
        tocSidebar.classList.add('hidden');
    }
}

function populateChapterList() {
    const chapterList = document.getElementById('chapter-list');
    chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = chapter.title;
        a.classList.add('text-blue-600', 'hover:text-blue-800', 'hover:underline');
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadChapter(chapter.file);
            updateActiveChapter(index);
        });
        li.appendChild(a);
        chapterList.appendChild(li);
    });
}

function updateActiveChapter(index) {
    const chapterLinks = document.querySelectorAll('#chapter-list a');
    chapterLinks.forEach((link, i) => {
        if (i === index) {
            link.classList.add('font-bold', 'text-gray-800');
        } else {
            link.classList.remove('font-bold', 'text-gray-800');
        }
    });
}

function preloadAdjacentChapters(currentIndex) {
    const preloadIndexes = [currentIndex - 1, currentIndex + 1];
    preloadIndexes.forEach(index => {
        if (index >= 0 && index < chapters.length) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${baseUrl}${chapters[index].file}`, true);
            xhr.send();
        }
    });
}

function searchContent(query) {
    if (!query.trim()) {
        alert("Please enter a search term.");
        return;
    }

    showLoading();

    // Perform the search asynchronously
    setTimeout(() => {
        const results = [];
        const searchRegex = new RegExp(escapeRegExp(query), 'gi');

        chapters.forEach(chapter => {
            const content = localStorage.getItem(chapter.file);
            if (content) {
                const matches = content.match(searchRegex);
                if (matches) {
                    results.push({
                        chapter: chapter,
                        matchCount: matches.length,
                        preview: generateSearchPreview(content, query)
                    });
                }
            }
        });

        // Sort results by relevance (match count)
        results.sort((a, b) => b.matchCount - a.matchCount);

        displaySearchResults(results, query);
    }, 0);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateSearchPreview(content, query) {
    const searchRegex = new RegExp(escapeRegExp(query), 'gi');
    const match = searchRegex.exec(content);
    if (match) {
        const start = Math.max(0, match.index - 50);
        const end = Math.min(content.length, match.index + query.length + 50);
        let preview = content.slice(start, end);
        if (start > 0) preview = '...' + preview;
        if (end < content.length) preview += '...';
        return preview.replace(searchRegex, '<strong>$&</strong>');
    }
    return '';
}

function displaySearchResults(results, query) {
    let searchResults = `
        <h2 class="text-2xl font-semibold mb-4">Search Results for "${query}"</h2>
        <p class="mb-4">${results.length} result${results.length !== 1 ? 's' : ''} found</p>
    `;

    if (results.length > 0) {
        searchResults += '<ul class="space-y-4">';
        results.forEach(result => {
            searchResults += `
                <li class="border-b pb-4">
                    <a href="#" class="text-xl font-semibold text-blue-600 hover:text-blue-800 hover:underline" onclick="loadChapter('${result.chapter.file}')">${result.chapter.title}</a>
                    <p class="text-sm text-gray-600 mt-1">${result.matchCount} match${result.matchCount !== 1 ? 'es' : ''}</p>
                    <p class="text-gray-800 mt-2">${result.preview}</p>
                </li>
            `;
        });
        searchResults += '</ul>';
    } else {
        searchResults += '<p>No results found. Please try a different search term.</p>';
    }

    document.getElementById('markdown-content').innerHTML = searchResults;
}

function showLoading() {
    document.getElementById('markdown-content').innerHTML = '<div class="loading">Searching...</div>';
}


window.addEventListener('load', () => {
    populateChapterList();
    loadChapter(chapters[0].file);
    updateActiveChapter(0);
});

window.addEventListener('resize', () => {
    const tocSidebar = document.getElementById('toc-sidebar');
    if (window.innerWidth >= 1024) {
        tocSidebar.classList.remove('hidden');
    } else {
        tocSidebar.classList.add('hidden');
    }
});