async function loadMeetingTimes() {
    const list = document.querySelector('.meeting-list');
    if (!list) return;

    try {
        const response = await fetch('data/meeting_times.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const card = list.closest('.info-card');
        if (card && data.semester) {
            let subtitle = card.querySelector('.meeting-semester');
            if (!subtitle) {
                subtitle = document.createElement('p');
                subtitle.className = 'meeting-semester';
                card.querySelector('h3').after(subtitle);
            }
            subtitle.textContent = data.semester;
        }

        list.innerHTML = data.times.map(m =>
            `<li><strong>${m.day}:</strong> ${m.time} in ${m.location}</li>`
        ).join('');
    } catch (error) {
        console.error("Failed to load meeting times:", error);
    }
}
