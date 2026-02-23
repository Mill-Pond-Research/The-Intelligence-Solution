const chapters = [
    { title: "Home", file: "./docs/home.md", slug: "home" },
    { title: "Authors' Forward", file: "./docs/authors-forward.md", slug: "authors-forward" },
    { title: "Introduction", file: "./docs/introduction.md", slug: "introduction" },
    { title: "The Rise of AI", file: "./docs/the-rise-of-ai.md", slug: "the-rise-of-ai" },
    { title: "What is the Intelligence Solution?", file: "./docs/the-intelligence-solution.md", slug: "what-is-the-intelligence-solution" },
    { title: "The Private AI Revolution", file: "./docs/private-ai-revolution.md", slug: "private-ai-revolution" },
    { title: "Leveraging AI for Advanced Customer Experience", file: "./docs/leveraging-ai-for-advanced-customer-experience.md", slug: "leveraging-ai-for-advanced-customer-experience" },
    { title: "AI-Driven Decision Making: From Insights to Action", file: "./docs/ai-driven-decision-making-from-insights-to-action.md", slug: "ai-driven-decision-making-from-insights-to-action" },
    { title: "The Need for Model Agnostic Frameworks", file: "./docs/the-need-for-model-agnostic-frameworks.md", slug: "the-need-for-model-agnostic-frameworks" },
    { title: "Hybrid Capabilities: Testing + Deployment + Building", file: "./docs/hybrid-capabilties-testing-deployment-building.md", slug: "hybrid-capabilties-testing-deployment-building" },
    { title: "Cognitive Compression", file: "./docs/cognative-compression.md", slug: "cognative-compression" },
    { title: "PSAI Framework", file: "./docs/psai-framework.md", slug: "psai-framework" },
    { title: "Realizing the Value of AI: ROI Analysis", file: "./docs/realizing-the-value-of-ai-roi-analysis.md", slug: "realizing-the-value-of-ai-roi-analysis" },
    { title: "Overcoming Ethical Challenges in AI", file: "./docs/overcoming-ethical-challenges-in-ai.md", slug: "overcoming-ethical-challenges-in-ai" },
    { title: "Navigating Regulatory Frameworks for AI", file: "./docs/navigating-regulatory-frameworks-for-ai.md", slug: "navigating-regulatory-frameworks-for-ai" },
    { title: "Building an AI-Ready Organization", file: "./docs/building-an-ai-ready-organization.md", slug: "building-an-ai-ready-organization" },
    { title: "Future of AI: Emerging Technologies and Trends", file: "./docs/future-of-ai-emerging-technologies-and-trends.md", slug: "future-of-ai-emerging-technologies-and-trends" },
    { title: "Implementing AI: Best Practices and Lessons Learned", file: "./docs/implementing-ai-best-practices-and-lessons-learned.md", slug: "implementing-ai-best-practices-and-lessons-learned" },
    { title: "Empowering Business Success with Intelligence", file: "./docs/empowering-business-success-with-intelligence.md", slug: "empowering-business-success-with-intelligence" }
];

// Application state
let currentChapterIndex = 0;
let isMobileMenuOpen = false;
let isLoading = false;

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Chapter management
const getChapterBySlug = (slug) => {
    return chapters.find(chapter => chapter.slug === slug);
};

const updateActiveChapter = (index) => {
    currentChapterIndex = index;
    
    // Update desktop chapter list
    const chapterLinks = document.querySelectorAll('.chapter-link');
    chapterLinks.forEach((link, i) => {
        link.classList.toggle('active', i === index);
    });
    
    // Update mobile chapter list
    const mobileChapterLinks = document.querySelectorAll('.mobile-chapter-link');
    mobileChapterLinks.forEach((link, i) => {
        link.classList.toggle('active', i === index);
    });
    
    updateChapterNavigation(index);
};

const updateChapterNavigation = (currentIndex) => {
    const prevButton = document.getElementById('prev-chapter');
    const nextButton = document.getElementById('next-chapter');
    
    // Previous chapter
    if (currentIndex > 0) {
        prevButton.classList.remove('hidden');
        prevButton.href = `/chapter/${chapters[currentIndex - 1].slug}`;
        prevButton.innerHTML = `<i class="fas fa-chevron-left"></i> ${chapters[currentIndex - 1].title}`;
        prevButton.onclick = (e) => {
            e.preventDefault();
            loadChapter(currentIndex - 1);
            return false;
        };
    } else {
        prevButton.classList.add('hidden');
    }
    
    // Next chapter
    if (currentIndex < chapters.length - 1) {
        nextButton.classList.remove('hidden');
        nextButton.href = `/chapter/${chapters[currentIndex + 1].slug}`;
        nextButton.innerHTML = `${chapters[currentIndex + 1].title} <i class="fas fa-chevron-right"></i>`;
        nextButton.onclick = (e) => {
            e.preventDefault();
            loadChapter(currentIndex + 1);
            return false;
        };
    } else {
        nextButton.classList.add('hidden');
    }
};

// URL and routing management
const updateURL = (slug) => {
    const newUrl = `${window.location.protocol}//${window.location.host}/chapter/${slug}`;
    history.pushState({ slug }, '', newUrl);
    updateCanonicalLink(slug);
    updateMetaTags(getChapterBySlug(slug));
};

const updateCanonicalLink = (slug) => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }
    link.href = `${window.location.protocol}//${window.location.host}/chapter/${slug}`;
};

const updateMetaTags = (chapter) => {
    if (!chapter) return;
    
    document.title = `${chapter.title} - The Intelligence Solution`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', 
            `The Intelligence Solution: ${chapter.title} - A Business Leader's AI Blueprint`);
    }
    
    // Update Open Graph tags
    updateOpenGraphTag('og:title', `${chapter.title} - The Intelligence Solution`);
    updateOpenGraphTag('og:description', 
        `The Intelligence Solution: ${chapter.title} - A Business Leader's AI Blueprint`);
    updateOpenGraphTag('og:url', 
        `${window.location.protocol}//${window.location.host}/chapter/${chapter.slug}`);
    
    // Update Twitter card tags
    updateTwitterTag('twitter:title', `${chapter.title} - The Intelligence Solution`);
    updateTwitterTag('twitter:description', 
        `The Intelligence Solution: ${chapter.title} - A Business Leader's AI Blueprint`);
};

const updateOpenGraphTag = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
};

const updateTwitterTag = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
};

// Content loading and rendering
const showLoading = () => {
    const contentArea = document.getElementById('main-content');
    contentArea.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <span class="loading-text">Loading chapter...</span>
        </div>
    `;
    isLoading = true;
};

const showError = (message) => {
    const contentArea = document.getElementById('main-content');
    contentArea.innerHTML = `
        <div class="error-message">
            <h2><i class="fas fa-exclamation-triangle"></i> Error Loading Content</h2>
            <p>${message}</p>
            <button onclick="location.reload()" class="search-button">
                <i class="fas fa-refresh"></i> Try Again
            </button>
        </div>
    `;
    isLoading = false;
};

const addIdsToHeadings = (content) => {
    return content.replace(/<h([2-6])>(.*?)<\/h[2-6]>/g, (match, level, text) => {
        const id = text.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `<h${level} id="${id}">${text}</h${level}>`;
    });
};

const generateTableOfContents = (content) => {
    const headings = content.match(/<h([2-3])\s+id="([^"]+)">([^<]+)<\/h\1>/g) || [];
    
    if (headings.length === 0) {
        return '<p class="text-muted">No headings found in this chapter.</p>';
    }
    
    let toc = '<ul class="toc-list">';
    headings.forEach(heading => {
        const level = heading.match(/<h([2-3])/)[1];
        const id = heading.match(/id="([^"]+)"/)[1];
        const title = heading.match(/>([^<]+)</)[1];
        toc += `
            <li class="toc-item toc-level-${level}">
                <a href="#${id}" class="toc-link" onclick="scrollToHeading('${id}'); return false;">
                    ${title}
                </a>
            </li>
        `;
    });
    toc += '</ul>';
    
    return toc;
};

const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
        
        // Update active TOC item
        document.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`a[href="#${id}"]`)?.classList.add('active');
    }
};

const loadMarkdownContent = async (file) => {
    try {
        showLoading();
        
        // Adjust file path for different URL structures
        let adjustedFile = file;
        if (window.location.pathname.startsWith('/chapter/')) {
            if (file.startsWith('./')) {
                adjustedFile = file.replace('./', '/');
            }
        }
        
        const response = await fetch(adjustedFile);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        
        if (!text || text.trim() === '') {
            throw new Error('Empty response received');
        }
        
        const content = marked.parse(text);
        const contentWithIds = addIdsToHeadings(content);
        
        document.getElementById('main-content').innerHTML = contentWithIds;
        
        // Generate and update table of contents
        const toc = generateTableOfContents(contentWithIds);
        document.getElementById('toc-sidebar').innerHTML = toc;
        
        // Highlight code blocks
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
        
        // Setup intersection observer for TOC
        setupIntersectionObserver();
        
        // Cache the content
        localStorage.setItem(file, text);
        
        isLoading = false;
        
    } catch (error) {
        console.error('Error loading markdown:', error);
        
        // Try to load from cache
        const cachedContent = localStorage.getItem(file);
        if (cachedContent) {
            try {
                const content = marked.parse(cachedContent);
                const contentWithIds = addIdsToHeadings(content);
                document.getElementById('main-content').innerHTML = contentWithIds;
                
                const toc = generateTableOfContents(contentWithIds);
                document.getElementById('toc-sidebar').innerHTML = toc;
                
                if (typeof hljs !== 'undefined') {
                    hljs.highlightAll();
                }
                
                setupIntersectionObserver();
                isLoading = false;
                return;
            } catch (cacheError) {
                console.error('Error parsing cached content:', cacheError);
            }
        }
        
        showError(`Failed to load chapter: ${error.message}`);
    }
};

const loadChapter = (index) => {
    if (index < 0 || index >= chapters.length || isLoading) return;
    
    const chapter = chapters[index];
    updateActiveChapter(index);
    updateURL(chapter.slug);
    loadMarkdownContent(chapter.file);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
        closeMobileMenu();
    }
};

const renderPreloadedChapter = (chapter) => {
    try {
        const content = marked.parse(chapter.content);
        const contentWithIds = addIdsToHeadings(content);
        
        document.getElementById('main-content').innerHTML = contentWithIds;
        
        const toc = generateTableOfContents(contentWithIds);
        document.getElementById('toc-sidebar').innerHTML = toc;
        
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
        
        setupIntersectionObserver();
        
        const chapterObj = getChapterBySlug(chapter.slug);
        if (chapterObj) {
            updateMetaTags(chapterObj);
        }
        
        isLoading = false;
        
    } catch (error) {
        console.error('Error rendering preloaded chapter:', error);
        showError('Error rendering preloaded content');
    }
};

// Search functionality
const searchContent = (query) => {
    if (!query.trim()) {
        alert('Please enter a search term.');
        return;
    }
    
    showLoading();
    
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
        
        results.sort((a, b) => b.matchCount - a.matchCount);
        displaySearchResults(results, query);
    }, 100);
};

const generateSearchPreview = (content, query) => {
    const searchRegex = new RegExp(escapeRegExp(query), 'gi');
    const match = searchRegex.exec(content);
    if (match) {
        const start = Math.max(0, match.index - 100);
        const end = Math.min(content.length, match.index + query.length + 100);
        let preview = content.slice(start, end);
        if (start > 0) preview = '...' + preview;
        if (end < content.length) preview += '...';
        return preview.replace(searchRegex, '<mark>$&</mark>')
                     .replace(/[#*`_\[\]]/g, '');
    }
    return '';
};

const displaySearchResults = (results, query) => {
    document.title = `Search Results: ${query} - The Intelligence Solution`;
    
    let searchResults = `
        <div class="search-results">
            <h1>Search Results for "${query}"</h1>
            <p class="text-muted">${results.length} result${results.length !== 1 ? 's' : ''} found</p>
        </div>
    `;

    if (results.length > 0) {
        results.forEach(result => {
            searchResults += `
                <div class="search-result-item">
                    <h2 class="search-result-title">
                        <a href="/chapter/${result.chapter.slug}" 
                           onclick="event.preventDefault(); loadChapter(${chapters.indexOf(result.chapter)}); return false;">
                           ${result.chapter.title}
                        </a>
                    </h2>
                    <p class="text-muted">${result.matchCount} match${result.matchCount !== 1 ? 'es' : ''}</p>
                    <p class="search-result-preview">${result.preview}</p>
                </div>
            `;
        });
    } else {
        searchResults += `
            <div class="error-message">
                <h2>No Results Found</h2>
                <p>No results found for "${query}". Please try different keywords.</p>
                <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <li>Check your spelling</li>
                    <li>Try more general keywords</li>
                    <li>Use different search terms</li>
                    <li>Browse the chapters list for relevant content</li>
                </ul>
            </div>
        `;
    }

    document.getElementById('main-content').innerHTML = searchResults;
    document.getElementById('toc-sidebar').innerHTML = '<p class="text-muted">No table of contents for search results.</p>';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    isLoading = false;
};

// Navigation and UI setup
const populateChapterList = () => {
    const chapterList = document.getElementById('chapter-list');
    const mobileChaptersList = document.getElementById('mobile-chapters-list');
    
    chapters.forEach((chapter, index) => {
        // Desktop chapter list
        const li = document.createElement('li');
        li.className = 'chapter-item';
        
        const a = document.createElement('a');
        a.href = `/chapter/${chapter.slug}`;
        a.textContent = chapter.title;
        a.className = 'chapter-link';
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadChapter(index);
            return false;
        });
        
        li.appendChild(a);
        chapterList.appendChild(li);
        
        // Mobile chapter list
        const mobileLi = document.createElement('li');
        mobileLi.className = 'mobile-chapter-item';
        
        const mobileA = document.createElement('a');
        mobileA.href = `/chapter/${chapter.slug}`;
        mobileA.textContent = chapter.title;
        mobileA.className = 'mobile-chapter-link';
        mobileA.addEventListener('click', (e) => {
            e.preventDefault();
            loadChapter(index);
            return false;
        });
        
        mobileLi.appendChild(mobileA);
        mobileChaptersList.appendChild(mobileLi);
    });
};

const setupMobileNavigation = () => {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    
    mobileNavToggle.addEventListener('click', toggleMobileMenu);
    mobileNavClose.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMobileMenuOpen && 
            !mobileNav.contains(e.target) && 
            !mobileNavToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
};

const toggleMobileMenu = () => {
    const mobileNav = document.getElementById('mobile-nav');
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        closeMobileMenu();
    }
};

const closeMobileMenu = () => {
    const mobileNav = document.getElementById('mobile-nav');
    isMobileMenuOpen = false;
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
};

const setupBackToTop = () => {
    const backToTopButton = document.getElementById('back-to-top');
    
    const toggleBackToTop = () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', debounce(toggleBackToTop, 100));
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

const setupIntersectionObserver = () => {
    const headings = document.querySelectorAll('#main-content h2, #main-content h3');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (headings.length === 0 || tocLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-100px 0px -66%',
        threshold: 0.1
    });
    
    headings.forEach(heading => {
        if (heading.id) {
            observer.observe(heading);
        }
    });
};

const setupSearchFunctionality = () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Search on button click
    searchButton.addEventListener('click', () => {
        searchContent(searchInput.value);
    });
    
    // Search on Enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchContent(searchInput.value);
        }
    });
    
    // Clear search on Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
        }
    });
};

// Routing and initialization
const handleRouting = () => {
    // Check for preloaded content first
    if (window.preloadedChapter) {
        const chapter = getChapterBySlug(window.preloadedChapter.slug);
        if (chapter) {
            renderPreloadedChapter(window.preloadedChapter);
            const index = chapters.findIndex(c => c.slug === window.preloadedChapter.slug);
            if (index !== -1) {
                updateActiveChapter(index);
            }
            return;
        }
    }
    
    // Check URL path for chapter slug
    const pathMatch = window.location.pathname.match(/\/chapter\/([^\/]+)/);
    if (pathMatch && pathMatch[1]) {
        const slug = pathMatch[1];
        const chapter = getChapterBySlug(slug);
        if (chapter) {
            const index = chapters.findIndex(c => c.slug === slug);
            if (index !== -1) {
                loadChapter(index);
                return;
            }
        }
    }
    
    // Check hash for chapter slug
    const hash = window.location.hash.substring(1);
    if (hash) {
        const chapter = getChapterBySlug(hash);
        if (chapter) {
            const index = chapters.findIndex(c => c.slug === hash);
            if (index !== -1) {
                loadChapter(index);
                return;
            }
        }
    }
    
    // Default to home
    loadChapter(0);
};

// Initialize application
const initializeApp = () => {
    // Check if required dependencies are loaded
    if (typeof marked === 'undefined') {
        setTimeout(initializeApp, 100);
        return;
    }
    
    try {
        // Configure marked.js
        if (typeof hljs !== 'undefined') {
            marked.setOptions({
                highlight: function(code, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        return hljs.highlight(code, { language: lang }).value;
                    } else {
                        return hljs.highlightAuto(code).value;
                    }
                },
                breaks: true,
                gfm: true
            });
        }
        
        // Setup UI components
        populateChapterList();
        setupMobileNavigation();
        setupBackToTop();
        setupSearchFunctionality();
        
        // Handle initial routing
        handleRouting();
        
        // Setup event listeners
        window.addEventListener('popstate', handleRouting);
        
        // Remove loading state
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 300);
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize application');
    }
};

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Global functions for onclick handlers
window.searchContent = searchContent;
window.scrollToHeading = scrollToHeading;
window.loadChapter = loadChapter;