async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();
        
        const container = document.getElementById('members-container');
        if (!container) return; // Exit if container is not found

        // Clear existing content just in case
        container.innerHTML = '';

        members.forEach(person => {
            const li = document.createElement('li');
            // If the person is an officer, they get the 'officer' class, otherwise 'member'
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

            container.appendChild(li);
        });
    } catch (error) {
        console.error("Failed to load members:", error);
        const container = document.getElementById('members-container');
        if (container) {
            container.innerHTML = '<p>Error loading members. Please try again later.</p>';
        }
    }
}
