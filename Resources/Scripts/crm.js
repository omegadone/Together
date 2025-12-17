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

    container.innerHTML = crmData.customers.map(cust => {
        const biz = crmData.businesses.find(b => b.id === cust.businessId) || { name: "Individual" };
        return `
            <div class="card-3d crm-customer-card" onclick="viewCustomerDetails('${cust.id}')">
                <div>
                    <strong>${cust.name}</strong>
                    <br><small>${biz.name}</small>
                </div>
                <div style="text-align: right">
                    <small>${cust.email}</small>
                </div>
            </div>
        `;
    }).join('');
};

// Initialize
loadCRMData();