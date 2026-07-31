// 🛠️ REPLACE THIS WITH YOUR LIVE KOYEB APP URL
const backendUrl = "https://your-app-name.koyeb.app/api/register"; 
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
        year: document.getElementById('year').value 
    };

    // 🔄 Changed fetch configuration to successfully hit your Koyeb Backend
    fetch(backendUrl, {
        method: 'POST',
        cache: 'no-store',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
    })
    .then(async (res) => {
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Server error');
        }
        return res.json();
    })
    .then(() => {
        showSuccessPopup(`🎉 Successfully Registered!\nA confirmation email has been sent to:\n${userEmail}`);
        document.getElementById('form').reset();
    })
    .catch(error => {
        console.error('Submission processing error:', error);
        showSuccessPopup("❌ System error or connection issue. Please try again.");
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
