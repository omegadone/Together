// Ensure CRM data is accessible
let crmData = { businesses: [], customers: [] };

// 1. Load CRM Data
async function loadCRMData() {
    try {
        const response = await fetch('./Resources/Scripts/crm.json');
        crmData = await response.json();
        console.log("CRM Data Loaded:", crmData);
        
        // Only render if we are currently on the CRM view
        renderCustomerList();
    } catch (error) {
        console.error("Error loading CRM data:", error);
    }
}

// 2. The Detail View Function (Attached to Window for Global Access)
window.viewCustomerDetails = function(customerId) {
    console.log("!!! Force-loading details for:", customerId);
    
    const customer = crmData.customers.find(c => c.id === customerId);
    const business = crmData.businesses.find(b => b.id === customer.businessId) || { name: "Private Client", address: "N/A" };
    
    const detailsContent = document.getElementById('details-content');
    const placeholder = document.getElementById('details-placeholder');
    
    // 1. Force the layout visibility
    if (placeholder) placeholder.style.display = 'none';
    if (detailsContent) {
        detailsContent.style.display = 'block'; // Direct style override
        detailsContent.classList.remove('hidden');
        
        // 2. Inject the HTML
        detailsContent.innerHTML = `
            <div class="details-header" style="border-bottom: 2px solid var(--accent); padding-bottom: 10px;">
                <h2 style="margin:0;">${customer.name}</h2>
                <span class="biz-badge">${business.name}</span>
            </div>
            
            <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                <div class="info-group">
                    <h4>Contact Information</h4>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone}</p>
                    <p><strong>Business Address:</strong><br>${business.address}</p>
                </div>

                <div class="history-section">
                    <h4>Order History</h4>
                    <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                        ${customer.orderHistory.map(o => `
                            <div style="border-bottom: 1px solid #ddd; padding: 5px 0;">
                                <strong>${o.orderId}</strong> - ${o.date} - $${o.amount} 
                                <span style="font-size: 0.8rem; color: var(--accent);">(${o.status})</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        console.log("HTML Injection Complete.");
    } else {
        console.error("CRITICAL: The element #details-content was not found in the DOM.");
    }
};

// 3. Render the List
window.renderCustomerList = function() {
    const container = document.getElementById('crm-content');
    if (!container) return;

    container.innerHTML = crmData.customers.map(cust => `
        <div class="name-card" onclick="viewCustomerDetails('${cust.id}')">
            ${cust.name}
        </div>
    `).join('');
};


window.viewCustomerDetails = function(customerId) {
    const customer = crmData.customers.find(c => c.id === customerId);
    const business = crmData.businesses.find(b => b.id === customer.businessId) || { name: "Private Client", address: "N/A" };
    
    const modal = document.getElementById('nexus-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 style="color: var(--primary); margin-bottom: 5px;">${customer.name}</h2>
            <span class="biz-badge">${business.name}</span>
        </div>
        <hr>
        <div class="modal-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px;">
            <div>
                <h4>Contact Info</h4>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Business Address:</strong><br>${business.address}</p>
            </div>
            <div>
                <h4>Recent Orders</h4>
                <ul style="list-style: none; padding: 0;">
                    ${customer.orderHistory.map(o => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                            <strong>${o.orderId}</strong> - $${o.amount} (${o.status})
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
};

window.closeNexusModal = function() {
    document.getElementById('nexus-modal').classList.add('hidden');
};

// Initialize
loadCRMData();