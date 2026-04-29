let cachedMembersData = null;

async function getMembersData() {
    if (cachedMembersData) return cachedMembersData;
    try {
        const response = await fetch('data/members.json');
        if (response.ok) {
            cachedMembersData = await response.json();
            return cachedMembersData;
        }
    } catch (e) {
        console.error("Could not load members data", e);
    }
    return null;
}

function resolveContributor(ref, members) {
    const tag = typeof ref === 'string' ? ref : ref.referenceTag;
    const member = members ? members.find(m => m.referenceTag === tag) : null;
    
    return {
        name: member ? member.name : (ref.name || "Unknown"),
        role: ref.role || (member ? member.role : "Contributor"),
        image: member ? member.image : null
    };
}

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();

        const container = document.getElementById('projects-container');
        if (!container) return; // Exit if container is not found

        container.innerHTML = '';

        projects.forEach(project => {
            const li = document.createElement('li');

            const h3 = document.createElement('h3');
            h3.textContent = project.title;
            li.appendChild(h3);

            if (project.images && project.images.length > 0) {
                project.images.forEach((imgData, index) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'project-image-container';

                    const img = document.createElement('img');
                    img.className = 'exImg';
                    img.src = imgData.src;
                    if (imgData.alt) {
                        img.alt = imgData.alt;
                    }
                    imgContainer.appendChild(img);

                    if (index === 0 && project.moreInfo) {
                        const btn = document.createElement('button');
                        btn.className = 'btn see-more-btn';
                        btn.textContent = 'See More';
                        btn.onclick = () => openProjectModal(project.moreInfo);
                        imgContainer.appendChild(btn);
                    }

                    li.appendChild(imgContainer);
                });
            } else if (project.moreInfo) {
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.textContent = 'See More';
                btn.onclick = () => openProjectModal(project.moreInfo);
                li.appendChild(btn);
            }

            const p = document.createElement('p');
            p.innerHTML = project.description;
            li.appendChild(p);

            container.appendChild(li);
        });

        setupModalClose();

    } catch (error) {
        console.error("Failed to load projects:", error);
        const container = document.getElementById('projects-container');
        if (container) {
            container.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        }
    }
}

async function openProjectModal(infoFile) {
    try {
        const response = await fetch(`data/projects/${infoFile}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projectData = await response.json();
        
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = '';
        
        // Create Tabs header
        const tabsHeader = document.createElement('div');
        tabsHeader.className = 'modal-tabs';
        
        const tabsViewport = document.createElement('div');
        tabsViewport.className = 'modal-tabs-viewport';

        const tabsContent = document.createElement('div');
        tabsContent.className = 'modal-tabs-content';
        
        const blogContainer = document.createElement('div');
        blogContainer.className = 'modal-tab-pane';
        blogContainer.id = 'tab-blog';

        const contributorsContainer = document.createElement('div');
        contributorsContainer.className = 'modal-tab-pane';
        contributorsContainer.id = 'tab-contributors';

        const blogBtn = document.createElement('button');
        blogBtn.className = 'tab-btn active';
        blogBtn.textContent = 'Blog';
        
        const contribBtn = document.createElement('button');
        contribBtn.className = 'tab-btn';
        contribBtn.textContent = 'Contributors';
        
        const switchTab = (tabId) => {
            if (tabId === 'blog') {
                tabsContent.style.transform = 'translateX(0%)';
            } else if (tabId === 'contributors') {
                tabsContent.style.transform = 'translateX(-100%)';
            }
            blogBtn.classList.toggle('active', tabId === 'blog');
            contribBtn.classList.toggle('active', tabId === 'contributors');
        };

        blogBtn.onclick = () => switchTab('blog');
        contribBtn.onclick = () => switchTab('contributors');
        
        tabsHeader.appendChild(blogBtn);
        tabsHeader.appendChild(contribBtn);
        
        // Load members data for references
        const membersData = await getMembersData();
        
        // Populate Blog
        if (projectData.posts && projectData.posts.length > 0) {
            projectData.posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'modal-blog-post';
                
                const headerDiv = document.createElement('div');
                headerDiv.className = 'modal-blog-post-header';
                
                const titleGroup = document.createElement('div');
                titleGroup.className = 'modal-blog-post-title-group';
                
                const h4 = document.createElement('h4');
                h4.textContent = post.title;
                titleGroup.appendChild(h4);
                
                if (post.contributors && post.contributors.length > 0) {
                    const iconsGroup = document.createElement('div');
                    iconsGroup.className = 'post-contributors-list';
                    post.contributors.forEach(tag => {
                        const person = resolveContributor(tag, membersData);
                        if (person.image) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'post-contributor-wrapper';
                            
                            const img = document.createElement('img');
                            img.src = person.image;
                            img.className = 'post-contributor-icon';
                            img.alt = `${person.name} photo`;
                            
                            const tooltip = document.createElement('div');
                            tooltip.className = 'post-contributor-tooltip';
                            tooltip.textContent = person.name;
                            
                            wrapper.appendChild(img);
                            wrapper.appendChild(tooltip);
                            iconsGroup.appendChild(wrapper);
                        }
                    });
                    titleGroup.appendChild(iconsGroup);
                }
                
                headerDiv.appendChild(titleGroup);
                
                if (post.date) {
                    const dateSpan = document.createElement('span');
                    dateSpan.className = 'modal-blog-post-date';
                    dateSpan.textContent = post.date;
                    headerDiv.appendChild(dateSpan);
                }
                
                postDiv.appendChild(headerDiv);
                
                if (post.images && post.images.length > 0) {
                    post.images.forEach(imgData => {
                        const img = document.createElement('img');
                        img.className = 'exImg';
                        img.style.maxHeight = '30vh'; // smaller images in modal
                        img.src = imgData.src;
                        if (imgData.alt) {
                            img.alt = imgData.alt;
                        }
                        postDiv.appendChild(img);
                    });
                }
                
                const p = document.createElement('p');
                p.innerHTML = post.description;
                postDiv.appendChild(p);
                
                blogContainer.appendChild(postDiv);
            });
        } else {
            blogContainer.innerHTML = '<p>No blog posts available.</p>';
        }

        // Populate Contributors
        if (projectData.contributors && projectData.contributors.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'contributors-list';
            projectData.contributors.forEach(c => {
                const person = resolveContributor(c, membersData);
                
                const li = document.createElement('li');
                li.className = 'contributor-bubble';
                
                const headerDiv = document.createElement('div');
                headerDiv.className = 'contributor-header';

                const textDiv = document.createElement('div');
                textDiv.className = 'contributor-text';

                const nameDiv = document.createElement('div');
                nameDiv.className = 'contributor-name';
                nameDiv.textContent = person.name;
                
                const roleDiv = document.createElement('div');
                roleDiv.className = 'contributor-role';
                roleDiv.textContent = person.role;
                
                textDiv.appendChild(nameDiv);
                textDiv.appendChild(roleDiv);
                headerDiv.appendChild(textDiv);
                
                if (person.image) {
                    const img = document.createElement('img');
                    img.src = person.image;
                    img.className = 'contributor-image';
                    img.alt = `${person.name} photo`;
                    headerDiv.appendChild(img);
                }
                
                li.appendChild(headerDiv);
                ul.appendChild(li);
            });
            contributorsContainer.appendChild(ul);
        } else {
            contributorsContainer.innerHTML = '<p>No contributors listed.</p>';
        }
        
        tabsContent.appendChild(blogContainer);
        tabsContent.appendChild(contributorsContainer);
        tabsViewport.appendChild(tabsContent);
        
        modalBody.appendChild(tabsHeader);
        modalBody.appendChild(tabsViewport);

        // Initial state
        switchTab('blog');
        
        modal.classList.add('show');
        
    } catch (error) {
        console.error("Failed to load project details:", error);
    }
}

function setupModalClose() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            if (modal) modal.classList.remove('show');
        }
    }
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    }
}
