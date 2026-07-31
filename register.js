const webAppUrl = "https://script.google.com/macros/s/AKfycbzJe4H4kR_9svilR97ml5CdsPs-Ds5qt3U1uQfxEVmHsz03zj8N5T8p-X9gWIp3NkQh/exec";
const localJsonUrl = "faqs.json";

// Listen for Form Submissions
document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Registering...`;
    submitBtn.disabled = true;

    const userEmail = document.getElementById('email').value;
    const formData = {
        name: document.getElementById('name').value,
        email: userEmail,
        phone: document.getElementById('phone').value,
        college: document.getElementById('college').value,
        department: document.getElementById('department').value,
        year: document.getElementById('year').value // Captures the new dropdown choice smoothly
    };

    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(() => {
        showSuccessPopup(`🎉 Successfully Registered!\nA confirmation email has been sent to:\n${userEmail}`);
        document.getElementById('form').reset();
    })
    .catch(error => {
        console.error('Submission processing error:', error);
        showSuccessPopup("❌ Network connection issue. Try again.");
    })
    .finally(() => {
        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Register`;
        submitBtn.disabled = false;
    });
});

function showSuccessPopup(message) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.innerHTML = message.replace(/\n/g, "<br>");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4500);
    } else {
        alert(message);
    }
}

// Floating FAQ Accordion Logic
function toggleQAWidget() {
    const widget = document.getElementById('qaWidget');
    if (!widget) return;
    widget.classList.toggle('active');
    if (widget.classList.contains('active')) fetchAccordionData();
}

function fetchAccordionData() {
    const contentBox = document.getElementById('qaContent');
    if (!contentBox || contentBox.querySelectorAll('.qa-item').length > 0) return;

    fetch(localJsonUrl)
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(data => {
            contentBox.innerHTML = "";
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'qa-item';
                itemDiv.innerHTML = `
                    <button class="qa-question"><span>${item.question}</span> <i class="fa-solid fa-chevron-down"></i></button>
                    <div class="qa-answer">${item.answer}</div>
                `;
                itemDiv.querySelector('.qa-question').addEventListener('click', () => {
                    const isOpen = itemDiv.classList.contains('open');
                    document.querySelectorAll('.qa-item').forEach(el => el.classList.remove('open'));
                    if (!isOpen) itemDiv.classList.add('open');
                });
                contentBox.appendChild(itemDiv);
            });
        })
        .catch(() => {
            contentBox.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:12px; padding:15px;">❌ Failed to load Q&As.</div>`;
        });
}
