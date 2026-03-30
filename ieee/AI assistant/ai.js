document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chips = document.querySelectorAll('.chip');
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.getElementById('navbar-sticky');
    const navLinks = document.querySelectorAll('.nav-links a'); 

    // Toggle the visibility of the menu when the button is clicked
    menuToggle.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });

    // Function to add a message to the chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // If it's a user message, generate an AI response
        if (isUser) {
            setTimeout(() => {
                generateResponse(text);
            }, 500);
        }
    }

    // Function to generate an AI response
    function generateResponse(userText) {
        let response;
        
        // Simple response logic based on user input
        if (userText.toLowerCase().includes('hello') || userText.toLowerCase().includes('hi')) {
            response = "Hello! How can I assist you today?";
        } else if (userText.toLowerCase().includes('home')) {
            response = "Our home page contains all the latest updates and information about our organization.";
        } else if (userText.toLowerCase().includes('committee')) {
            response = "We have several committees including Technical, Social, PR, and Academic committees. Each focuses on different aspects of our organization.";
        } else if (userText.toLowerCase().includes('event')) {
            response = "We host various events throughout the year including workshops, conferences, and social gatherings. Check our events calendar for upcoming activities.";
        } else if (userText.toLowerCase().includes('embs')) {
            response = "EMBS (Engineering in Medicine and Biology Society) is a society focused on the application of engineering concepts to medicine and biology.";
        } else if (userText.toLowerCase().includes('member')) {
            response = "To become a member, you need to fill out an application form and pay the membership fee. Members get access to exclusive events and resources.";
        } else if (userText.toLowerCase().includes('ieee')) {
            response = "IEEE MUST SB (Institute of Electrical and Electronics Engineers - Misr University for Science and Technology Student Branch) is a student branch that focuses on advancing technology for the benefit of humanity.";
        } else if (userText.toLowerCase().includes('join')) {
            response = "To join, visit our membership page, fill out the application form, and pay the membership fee. You'll then receive your membership card and access to all member benefits.";
        } else if (userText.toLowerCase().includes('benefit')) {
            response = "Benefits of joining include networking opportunities, access to workshops and events, learning resources, and the chance to work on exciting projects.";
        } else if (userText.toLowerCase().includes('activit')) {
            response = "Our activities include technical workshops, social events, community service, competitions, and conferences. Check our events page for more details.";
        } else {
            response = "Thank you for your question. Our team will get back to you with more information soon. Is there anything else I can help you with?";
        }
        
        addMessage(response, false);
    }

    // Send message when send button is clicked
    sendBtn.addEventListener('click', function() {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, true);
            userInput.value = '';
        }
    });

    // Send message when Enter key is pressed
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const text = userInput.value.trim();
            if (text) {
                addMessage(text, true);
                userInput.value = '';
            }
        }
    });

    // Handle suggestion chips
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            addMessage(question, true);
        });
    });

    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // e.preventDefault();
            // const question = this.getAttribute('data-question');
            // addMessage(question, true);
            
            // Close mobile menu if open
            navbarMenu.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Create a placeholder logo for the demo
    function createPlaceholderLogo() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#003366';
        ctx.fillRect(0, 0, 200, 80);
        
        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LOGO', 100, 40);
        
        return canvas.toDataURL();
    }

    // Set the logo
    const logoImg = document.getElementById('logoImg');
    logoImg.src = createPlaceholderLogo();
});
