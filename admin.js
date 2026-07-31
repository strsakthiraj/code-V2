const webAppUrl = "https://script.google.com/macros/s/AKfycbzJe4H4kR_9svilR97ml5CdsPs-Ds5qt3U1uQfxEVmHsz03zj8N5T8p-X9gWIp3NkQh/exec";

// Fetch Live Data Rows from Google Sheets API
function fetchLiveData() {
    const tableBody = document.getElementById('table');
    const totalElement = document.getElementById('total');
    
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Syncing records...</td></tr>`;

    fetch(webAppUrl)
        .then(response => response.json())
        .then(data => {
            if (totalElement) totalElement.textContent = data.length;
            tableBody.innerHTML = "";
            
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b;">No registrations found yet.</td></tr>`;
                return;
            }

            data.forEach(row => {
                const tr = document.createElement('tr');
                
                // Formats Google Sheets timestamps into human-readable local times
                let formattedDate = row.timestamp;
                if(formattedDate) {
                    const dateObj = new Date(row.timestamp);
                    if(!isNaN(dateObj)) {
                        formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    }
                }

                tr.innerHTML = `
                    <td style="font-family:monospace; color:#64748b;">${escapeHtml(formattedDate)}</td>
                    <td style="font-weight:600; color:#0f172a;">${escapeHtml(row.name)}</td>
                    <td><a href="mailto:${escapeHtml(row.email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(row.email)}</a></td>
                    <td>${escapeHtml(row.college)}</td>
                    <td>${escapeHtml(row.department)} (${escapeHtml(row.year)})</td>
                    <td><span class="status-badge">Sent</span></td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error("Dashboard Sync Error: ", err);
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ef4444;">❌ Failed to load data records. Double-check your webAppUrl deployment configurations.</td></tr>`;
        });
}

function escapeHtml(text) {
    if (!text) return "";
    return text.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Client-side Realtime Table Live Filtering Engine
document.getElementById('search').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#table tr');
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
});

// Run live data fetch once UI loads completely
window.addEventListener('DOMContentLoaded', fetchLiveData);
