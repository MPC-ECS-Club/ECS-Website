let showingRetired = false;

//also used by loadProjects.js to resolve referenceTags; fetchJSON memoizes it
function getAllMembers() {
    return fetchJSON('data/members.json');
}

function createMemberCard(person, { includeRedirect = false } = {}) {
    const li = document.createElement('li');
    li.className = person.type === 'officer' ? 'officer' : 'member';

    const img = document.createElement('img');
    img.src = person.image;
    img.alt = person.alt || `${person.name} photo`;

    const h3 = document.createElement('h3');
    h3.className = person.type === 'officer' ? 'officer-name' : 'member-name';
    h3.textContent = person.name;

    const pRole = document.createElement('p');
    pRole.className = person.type === 'officer' ? 'officer-position' : 'member-position';
    pRole.textContent = person.role;

    const pMajor = document.createElement('p');
    pMajor.className = person.type === 'officer' ? 'officer-major' : 'member-major';
    pMajor.textContent = person.major;

    li.appendChild(img);
    li.appendChild(h3);
    li.appendChild(pRole);
    li.appendChild(pMajor);

    if (person.hoverMessage) {
        const tooltip = document.createElement('div');
        tooltip.className = 'member-tooltip';
        tooltip.textContent = person.hoverMessage;
        li.appendChild(tooltip);
    }

    if (includeRedirect && person.redirect) {
        li.addEventListener('click', () => {
            window.open(person.redirect, '_blank');
        });
    }

    return li;
}

async function loadMembers() {
    try {
        const allMembers = await getAllMembers();
        const members = allMembers.filter(person => !person.retired);

        const container = document.getElementById('tree-container');
        if (!container) return;

        container.innerHTML = '';

        const tiers = {
            level1: [], // President, Vice President
            level2: [], // Secretary, Treasurer
            level3: [], // Other Officers
            level4: []  // Members
        };

        members.forEach(person => {
            const role = person.role.toLowerCase();
            if (role === 'president' || role === 'vice president') {
                tiers.level1.push(person);
            } else if (role === 'secretary' || role === 'treasurer') {
                tiers.level2.push(person);
            } else if (person.type === 'officer') {
                tiers.level3.push(person);
            } else {
                tiers.level4.push(person);
            }
        });

        Object.values(tiers).forEach(tierMembers => {
            if (tierMembers.length === 0) return;
            const ul = document.createElement('ul');
            ul.className = 'tier';
            tierMembers.forEach(person => ul.appendChild(createMemberCard(person, { includeRedirect: true })));
            container.appendChild(ul);
        });

        setupToggleButton();
    } catch (error) {
        console.error("Failed to load members:", error);
        const container = document.getElementById('tree-container');
        if (container) {
            container.innerHTML = '<p>Error loading members. Please try again later.</p>';
        }
    }
}

async function loadRetiredMembers() {
    try {
        const allMembers = await getAllMembers();
        const retiredMembers = allMembers.filter(person => person.retired);

        const container = document.getElementById('tree-container');
        if (!container) return;

        container.innerHTML = '';

        if (retiredMembers.length === 0) {
            container.innerHTML = '<p style="font-size: 1.5em; text-align: center; width: 100%;">No past members logged.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'cards-list';

        container.classList.remove('tree');

        retiredMembers.forEach(person => ul.appendChild(createMemberCard(person)));
        container.appendChild(ul);

    } catch (error) {
        console.error("Failed to load retired members:", error);
        const container = document.getElementById('tree-container');
        if (container) {
            container.innerHTML = '<p>Error loading past members. Please try again later.</p>';
        }
    }
}

function setupToggleButton() {
    const btn = document.getElementById('toggle-past-members');
    if (!btn || btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = 'true';

    btn.addEventListener('click', () => {
        showingRetired = !showingRetired;
        if (showingRetired) {
            btn.textContent = 'Current Members';
            loadRetiredMembers();
        } else {
            btn.textContent = 'Past Members';
            const container = document.getElementById('tree-container');
            if (container) container.classList.add('tree');
            loadMembers();
        }
    });
}
