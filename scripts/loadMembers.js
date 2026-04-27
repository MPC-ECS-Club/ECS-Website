let showingRetired = false;

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();
        
        const container = document.getElementById('tree-container');
        if (!container) return; // Exit if container is not found

        // Clear existing content just in case
        container.innerHTML = '';

        // Define the tiers
        const tiers = {
            level1: [], // President, Vice President
            level2: [], // Secretary, Treasurer
            level3: [], // Other Officers
            level4: []  // Members
        };

        // Group members
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

        // Function to create a list of cards for a tier
        const createTierContainer = (tierMembers) => {
            if (tierMembers.length === 0) return null;
            const ul = document.createElement('ul');
            ul.className = 'tier';
            
            tierMembers.forEach(person => {
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

                ul.appendChild(li);
            });
            return ul;
        };

        // Append tiers to the tree container
        Object.keys(tiers).forEach(level => {
            const ul = createTierContainer(tiers[level]);
            if (ul) {
                container.appendChild(ul);
            }
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
        const response = await fetch('data/retired.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const retiredMembers = await response.json();
        
        const container = document.getElementById('tree-container');
        if (!container) return; 

        container.innerHTML = '';

        if (retiredMembers.length === 0) {
            container.innerHTML = '<p style="font-size: 1.5em; text-align: center; width: 100%;">No past members logged.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'cards-list'; // Use the original flat flex grid style
        
        // Remove the 'tree' class temporarily so the vertical alignment and pseudo-elements from .tree don't mess up the flat grid
        container.classList.remove('tree');

        retiredMembers.forEach(person => {
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

            ul.appendChild(li);
        });
        
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
    if (!btn) return;
    
    // Make sure we don't attach multiple listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', () => {
        showingRetired = !showingRetired;
        if (showingRetired) {
            newBtn.textContent = 'Current Members';
            loadRetiredMembers();
        } else {
            newBtn.textContent = 'Past Members';
            const container = document.getElementById('tree-container');
            if (container) container.classList.add('tree'); // Restore tree class
            loadMembers();
        }
    });
}
