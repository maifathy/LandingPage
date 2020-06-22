/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
*/

/**
 * Define Global Variables
 *
*/
let sectionsList;
let scrollTimer = 0;
let scrollNavMenuTimer = 0;
let liCount = 1;
let prevScrollpos;
let currentScrollPos;
let isPageLoad = 1;
/**
 * End Global Variables
 * Start Helper Functions
 *
*/
function getAllSections() {
    if (sectionsList == null || sectionsList === undefined)
        sectionsList = this.document.querySelectorAll('section');
    return sectionsList;
}

function isInViewport(el) {
    let top = el.getBoundingClientRect().top;
    let left = el.getBoundingClientRect().left;
    let width = el.getBoundingClientRect().width;
    let height = el.getBoundingClientRect().height;
    let viewport;
    let offsetLeft;
    let offsetTop;
    let innerHeight;
    let innerWidth;
    if (this.window.visualViewport != null) {
        viewport = this.window.visualViewport;
        offsetLeft = viewport.offsetLeft;
        offsetTop = viewport.height
            - height
            + viewport.offsetTop;
        innerHeight = viewport.height;
        innerWidth = viewport.width;
    }
    else {
        viewport = this.window;
        offsetLeft = viewport.pageXOffset;
        offsetTop = viewport.pageYOffset;
        innerHeight = viewport.innerHeight;
        innerWidth = viewport.innerWidth;
        top = el.offsetTop;
    }

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }
    return (
        top < (offsetTop + innerHeight) &&
        left < (offsetLeft + innerWidth) &&
        (top + height) > offsetTop + 100 &&
        (left + width) > offsetLeft
    );
}

function topFunction() {
    this.document.body.scrollTop = 0; // For Safari
    this.document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
*/


// build the nav
function BuildNavigationMenu() {
    let content = '';
    const sectionsList = getAllSections();
    sectionsList.forEach(function (section) {
        const newLi = this.document.createElement('li');
        newLi.id = `li${section.id}`;
        newLi.dataset.section = section.id;
        newLi.innerHTML = `<a id='aSection${liCount}' href='#${section.id}' data-section='${section.id}' class='menu__link'> ${section.dataset.nav} </a>`;
        liCount++;
        content += newLi.outerHTML;
    })
    this.document.querySelector('#navbar__list').innerHTML = content;
}
// Add class 'active' to section when near top of viewport
function SetAciveSectionOnViewport() {
    const sectionsList = getAllSections();
    let tops = [];
    let obj = {};
    for (let section of sectionsList) {
        section.classList.remove('active');
        document.querySelector(`#a${section.id.substring(0, 1).toUpperCase()}${section.id.substring(1, section.id.length)}`).classList.remove('menu__link__active');
        if (isInViewport(document.querySelector(`#${section.id}`))) {
            obj = { Id: section.id, top: document.querySelector(`#${section.id}`).offsetTop };
            tops.push(obj);
        }
    }
    if (tops.length == 0)
        return;
    let minTopObj = tops.reduce(function (prev, curr) {
        return prev.top < curr.top ? prev : curr;
    });
    document.querySelector(`#${minTopObj.Id}`).classList.add('active');
    document.querySelector(`#a${minTopObj.Id.substring(0, 1).toUpperCase()}${minTopObj.Id.substring(1, minTopObj.Id.length)}`).classList.add('menu__link__active');
}

// Scroll to anchor ID using scrollTO event
function SetActiveSection(e) {
    if (e.target.nodeName.toLowerCase() == 'li' || e.target.nodeName.toLowerCase() == 'a') {
        e.preventDefault();
        let element = document.querySelector(`#${e.target.dataset.section}`);
        if (element.scrollIntoView == undefined)
            element.scrollIntoViewIfNeeded(true);
        else
            element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        const sectionsList = getAllSections();
        for (let section of sectionsList) {
            section.classList.remove('active-section');
        }
        element.classList.add('active-section');
    }
}

// Scroll to top button
function ToggleScrollToTop(isShow) {
    const anchor = this.document.querySelector('#btnGoToTop');
    if (isShow) {
        if (anchor.style.display != "block")
            anchor.style.display = "block";
    }
    else {
        if (anchor.style.display != "none")
            anchor.style.display = "none";
    }
}

// Fix NavgMenu position
function FixNavMenu() {
    if (isPageLoad == 1) {
        prevScrollpos = this.window.pageYOffset;
        isPageLoad = 0;
        return;
    }
    currentScrollPos = this.window.pageYOffset;
    const nav = this.document.querySelector('nav')
    if (currentScrollPos <= 100) {
        nav.classList.remove('navbar__menu__scroll__stop');
        nav.classList.remove('navbar__menu__scroll');
        return;
    }

    if (currentScrollPos != prevScrollpos) {
        nav.classList.remove('navbar__menu__scroll__stop');
        nav.classList.add('navbar__menu', 'navbar__menu__scroll');

        scrollNavMenuTimer = this.setTimeout(FixNavMenu, 3000);
    }
    else {
        nav.classList.remove('navbar__menu__scroll');
        nav.classList.add('navbar__menu', 'navbar__menu__scroll__stop');
    }
    prevScrollpos = currentScrollPos;
}

// OnScroll
function OnScroll() {
    if (this.window.innerHeight <= this.window.scrollY)
        ToggleScrollToTop(1);
    else ToggleScrollToTop(0);
    if (scrollNavMenuTimer) {
        this.clearTimeout(scrollTimer);
        this.clearTimeout(scrollNavMenuTimer);
    }

    scrollTimer = this.setTimeout(SetAciveSectionOnViewport, 100);
    scrollNavMenuTimer = this.setTimeout(FixNavMenu, 300);
}

// Make collapsible
function MakeCollapsible() {
    const sectionsList = getAllSections();
    for (let section of sectionsList) {
        const coll = section.getElementsByTagName("h2");
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                let pTags = section.getElementsByTagName("p");
                for (let j = 0; j < pTags.length; j++) {
                    pTags[j].classList.toggle("hide");
                }
            });
        }
    }
}
/**
 * End Main Functions
 * Begin Events
 *
*/
// Set sections as active
this.window.addEventListener('scroll', OnScroll);
if (this.window.visualViewport != null) {
    this.window.visualViewport.addEventListener('scroll', SetAciveSectionOnViewport);
    this.window.visualViewport.addEventListener('resize', SetAciveSectionOnViewport);
}
