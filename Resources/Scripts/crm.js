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
    console.log("Opening details for customer:", customerId);
    
    const customer = crmData.customers.find(c => c.id === customerId);
    if (!customer) return;

    const business = crmData.businesses.find(b => b.id === customer.businessId) || { name: "Private Client", address: "N/A" };
    
    const detailsContent = document.getElementById('details-content');
    const placeholder = document.getElementById('details-placeholder');
    
    if (placeholder) placeholder.classList.add('hidden');
    if (detailsContent) {
        detailsContent.classList.remove('hidden');
        detailsContent.innerHTML = `
            <div class="details-header">
                <h2>${customer.name}</h2>
                <span class="biz-badge">${business.name}</span>
            </div>
            
            <div class="details-grid">
                <div class="info-group">
                    <h4>Contact Info</h4>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone}</p>
                    <p><strong>Address:</strong> ${business.address}</p>
                </div>

                <div class="history-section">
                    <h4>Order History</h4>
                    <table class="nexus-table">
                        <thead>
                            <tr><th>ID</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${customer.orderHistory.map(o => `
                                <tr>
                                    <td>${o.orderId}</td>
                                    <td>${o.date}</td>
                                    <td>$${o.amount}</td>
                                    <td><span class="status-tag">${o.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
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