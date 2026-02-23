const chapters = [
    { title: "Home", file: "docs/home.md" },
    { title: "Authors' Forward", file: "docs/authors-forward.md" },
    { title: "Introduction", file: "docs/introduction.md" },
    { title: "The Rise of AI", file: "docs/the-rise-of-ai.md" },
    { title: "Cognitive Compression and Task Optimization", file: "docs/cognative-compression-and-task-optimization.md" },
    { title: "Understanding Intelligence as a Service", file: "docs/understanding-intelligence-as-a-service.md" },
    { title: "Leveraging AI for Advanced Customer Experience", file: "docs/leveraging-ai-for-advanced-customer-experience.md" },
    { title: "AI-Driven Decision Making: From Insights to Action", file: "docs/ai-driven-decision-making-from-insights-to-action.md" },
    { title: "The Need for Model Agnostic Frameworks", file: "docs/the-need-for-model-agnostic-frameworks.md" },
    { title: "Hybrid Capabilities: Testing + Deployment + Building", file: "docs/hybrid-capabilties-testing-deployment-building.md" },
    { title: "PSAI Framework", file: "docs/psai-framework.md" },
    { title: "Realizing the Value of AI: ROI Analysis", file: "docs/realizing-the-value-of-ai-roi-analysis.md" },
    { title: "Overcoming Ethical Challenges in AI", file: "docs/overcoming-ethical-challenges-in-ai.md" },
    { title: "Navigating Regulatory Frameworks for AI", file: "docs/navigating-regulatory-frameworks-for-ai.md" },
    { title: "Building an AI-Ready Organization", file: "docs/building-an-ai-ready-organization.md" },
    { title: "Future of AI: Emerging Technologies and Trends", file: "docs/future-of-ai-emerging-technologies-and-trends.md" },
    { title: "Implementing AI: Best Practices and Lessons Learned", file: "docs/implementing-ai-best-practices-and-lessons-learned.md" },
    { title: "Empowering Business Success with Intelligence as a Service", file: "docs/empowering-business-success-with-intelligence-as-a-service.md" }
];

const baseUrl = 'https://www.theintelligencesolution.com';

function loadChapter(file) {
    if (typeof marked === 'undefined') {
        console.error('Marked library is not loaded');
        return;
    }

    if (!file) {
        console.error('No file specified for loading');
        return;
    }

    const xhr = new XMLHttpRequest();
    const url = new URL(file, baseUrl).href;
    
    showLoading();
    
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
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
                } catch (error) {
                    console.error(`Error parsing or rendering content: ${error.message}`);
                    handleLoadError(file, 'parsing');
                }
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
        try {
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
        } catch (error) {
            console.error(`Error parsing cached content: ${error.message}`);
            showErrorMessage(file, 'parsing');
        }
    } else {
        showErrorMessage(file, status);
    }
}

function showErrorMessage(file, status) {
    let errorMessage = `<p>Error loading chapter "${file}". `;
    if (status === 404) {
        errorMessage += 'The requested chapter could not be found. ';
    } else if (status === 403) {
        errorMessage += 'Access to the chapter is forbidden. ';
    } else if (status === 500) {
        errorMessage += 'There was a server error. ';
    } else if (status === 'network') {
        errorMessage += 'A network error occurred. Please check your internet connection. ';
    } else if (status === 'parsing') {
        errorMessage += 'There was an error processing the content. ';
    } else {
        errorMessage += 'An unexpected error occurred. ';
    }
    errorMessage += 'Please try again later or contact support if the problem persists.</p>';
    document.getElementById('markdown-content').innerHTML = errorMessage;
}

function generateTableOfContents(content) {
    const headings = content.match(/<h([2-3]).*?>(.*?)<\/h[2-3]>/g);
    if (!headings) return '';

    let toc = '<h3>Chapter Contents</h3><ul>';
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
    setupChapterSidebar();
    setupMobileToC();
    handleResponsiveSidebars();
    setupThemeToggle();
});

window.addEventListener('resize', () => {
    handleResponsiveSidebars();
});

function addBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top hidden';
    document.body.appendChild(button);
  
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        button.classList.remove('hidden');
      } else {
        button.classList.add('hidden');
      }
    });
  
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  addBackToTopButton();

  function setupChapterSidebar() {
    const chapterSidebar = document.getElementById('chapter-sidebar');
    const chapterToggle = document.getElementById('chapter-toggle');
    
    chapterToggle.addEventListener('click', () => {
        chapterSidebar.classList.toggle('hidden');
        chapterToggle.textContent = chapterSidebar.classList.contains('hidden') ? 'Show Chapters' : 'Hide Chapters';
    });

    // Initially hide the chapter sidebar on mobile
    if (window.innerWidth < 1024) {
        chapterSidebar.classList.add('hidden');
    }
}

function handleResponsiveSidebars() {
    const chapterSidebar = document.getElementById('chapter-sidebar');
    const tocSidebar = document.getElementById('toc-sidebar');
    const chapterToggle = document.getElementById('chapter-toggle');
    const tocToggle = document.querySelector('.toc-toggle');

    if (window.innerWidth >= 1024) {
        chapterSidebar.classList.remove('hidden');
        tocSidebar.classList.remove('hidden');
        chapterToggle.classList.add('hidden');
        tocToggle.classList.add('hidden');
    } else {
        chapterSidebar.classList.add('hidden');
        tocSidebar.classList.add('hidden');
        chapterToggle.classList.remove('hidden');
        tocToggle.classList.remove('hidden');
        chapterToggle.textContent = 'Show Chapters';
        tocToggle.textContent = 'Show Table of Contents';
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to set the theme
    function setTheme(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.checked = isDark;
    }

    // Check for saved theme preference or use the system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        setTheme(true);
    }

    // Toggle theme when the switch is clicked
    themeToggle.addEventListener('change', (e) => {
        setTheme(e.target.checked);
    });

    // Listen for changes in system theme preference
    prefersDarkScheme.addEventListener('change', (e) => {
        setTheme(e.matches);
    });
}


